import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Helper to verify user authentication
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    return { error: 'No authorization header', user: null };
  }

  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) {
    return { error: 'Invalid authorization header', user: null };
  }

  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return { error: 'Unauthorized', user: null };
  }

  return { error: null, user };
}

// Routes

// Health check
app.get('/make-server-c039cbdf/health', (c) => {
  return c.json({ status: 'ok', message: 'Smart Ledger API is running' });
});

// Sign up new user
app.post('/make-server-c039cbdf/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'User' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: data.user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.log('Signup exception:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Sign in user
app.post('/make-server-c039cbdf/auth/signin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Sign in error:', error);
      return c.json({ error: error.message }, 401);
    }

    return c.json({
      access_token: data.session?.access_token,
      user: data.user,
    });
  } catch (error) {
    console.log('Sign in exception:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Get all entries for authenticated user
app.get('/make-server-c039cbdf/entries', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    // Get all entries for this user
    const userEntriesKey = `user:${user.id}:entries`;
    const entries = await kv.get(userEntriesKey);

    return c.json({ entries: entries || [] });
  } catch (error) {
    console.log('Error fetching entries:', error);
    return c.json({ error: 'Failed to fetch entries' }, 500);
  }
});

// Add a new entry
app.post('/make-server-c039cbdf/entries', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name, amount, type, category, date, notes, personType, siteId } = body;

    if (!name || !amount || !type || !date) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get current entries
    const userEntriesKey = `user:${user.id}:entries`;
    const entries = (await kv.get(userEntriesKey)) || [];

    // Create new entry
    const newEntry = {
      id: Date.now().toString(),
      name,
      amount,
      type,
      category: category || '',
      date,
      notes: notes || '',
      personType: personType || 'worker',
      siteId: siteId || null,
    };

    // Add to beginning of array
    const updatedEntries = [newEntry, ...entries];

    // Save back to database
    await kv.set(userEntriesKey, updatedEntries);

    return c.json({ entry: newEntry, message: 'Entry added successfully' });
  } catch (error) {
    console.log('Error adding entry:', error);
    return c.json({ error: 'Failed to add entry' }, 500);
  }
});

// Delete an entry
app.delete('/make-server-c039cbdf/entries/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const entryId = c.req.param('id');

    // Get current entries
    const userEntriesKey = `user:${user.id}:entries`;
    const entries = (await kv.get(userEntriesKey)) || [];

    // Filter out the entry to delete
    const updatedEntries = entries.filter((e: any) => e.id !== entryId);

    // Save back to database
    await kv.set(userEntriesKey, updatedEntries);

    return c.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.log('Error deleting entry:', error);
    return c.json({ error: 'Failed to delete entry' }, 500);
  }
});

// Get user profile
app.get('/make-server-c039cbdf/auth/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    return c.json({ user });
  } catch (error) {
    console.log('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user language preference
app.post('/make-server-c039cbdf/user/language', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { language } = body;

    const userSettingsKey = `user:${user.id}:settings`;
    const settings = (await kv.get(userSettingsKey)) || {};
    
    settings.language = language;
    await kv.set(userSettingsKey, settings);

    return c.json({ message: 'Language updated successfully', settings });
  } catch (error) {
    console.log('Error updating language:', error);
    return c.json({ error: 'Failed to update language' }, 500);
  }
});

// Get user settings
app.get('/make-server-c039cbdf/user/settings', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const userSettingsKey = `user:${user.id}:settings`;
    const settings = (await kv.get(userSettingsKey)) || { language: 'en', darkMode: false };

    return c.json({ settings });
  } catch (error) {
    console.log('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Get all sites for authenticated user
app.get('/make-server-c039cbdf/sites', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const userSitesKey = `user:${user.id}:sites`;
    const sites = await kv.get(userSitesKey);

    return c.json({ sites: sites || [] });
  } catch (error) {
    console.log('Error fetching sites:', error);
    return c.json({ error: 'Failed to fetch sites' }, 500);
  }
});

// Add a new site
app.post('/make-server-c039cbdf/sites', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { name, budget } = body;

    if (!name || budget === undefined) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const userSitesKey = `user:${user.id}:sites`;
    const sites = (await kv.get(userSitesKey)) || [];

    const newSite = {
      id: Date.now().toString(),
      name,
      budget: parseFloat(budget),
      spent: 0,
    };

    const updatedSites = [newSite, ...sites];
    await kv.set(userSitesKey, updatedSites);

    return c.json({ site: newSite, message: 'Site added successfully' });
  } catch (error) {
    console.log('Error adding site:', error);
    return c.json({ error: 'Failed to add site' }, 500);
  }
});

// Update a site
app.put('/make-server-c039cbdf/sites/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const siteId = c.req.param('id');
    const body = await c.req.json();

    const userSitesKey = `user:${user.id}:sites`;
    const sites = (await kv.get(userSitesKey)) || [];

    const updatedSites = sites.map((site: any) => {
      if (site.id === siteId) {
        return { ...site, ...body };
      }
      return site;
    });

    await kv.set(userSitesKey, updatedSites);

    const updatedSite = updatedSites.find((s: any) => s.id === siteId);
    return c.json({ site: updatedSite, message: 'Site updated successfully' });
  } catch (error) {
    console.log('Error updating site:', error);
    return c.json({ error: 'Failed to update site' }, 500);
  }
});

// Delete a site
app.delete('/make-server-c039cbdf/sites/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyUser(authHeader);

    if (authError || !user) {
      return c.json({ error: authError || 'Unauthorized' }, 401);
    }

    const siteId = c.req.param('id');

    const userSitesKey = `user:${user.id}:sites`;
    const sites = (await kv.get(userSitesKey)) || [];

    const updatedSites = sites.filter((s: any) => s.id !== siteId);
    await kv.set(userSitesKey, updatedSites);

    return c.json({ message: 'Site deleted successfully' });
  } catch (error) {
    console.log('Error deleting site:', error);
    return c.json({ error: 'Failed to delete site' }, 500);
  }
});

Deno.serve(app.fetch);
