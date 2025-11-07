import { Entry, Site } from '../App';
import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c039cbdf`;
const ANON_KEY = publicAnonKey;

export class APIClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API error at ${endpoint}:`, data);
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  async getEntries(): Promise<Entry[]> {
    const data = await this.request('/entries');
    return data.entries || [];
  }

  async addEntry(entry: Omit<Entry, 'id'>): Promise<Entry> {
    const data = await this.request('/entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    return data.entry;
  }

  async deleteEntry(id: string): Promise<void> {
    await this.request(`/entries/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserSettings(): Promise<{ language: string; darkMode: boolean }> {
    const data = await this.request('/user/settings');
    return data.settings || { language: 'en', darkMode: false };
  }

  async updateLanguage(language: string): Promise<void> {
    await this.request('/user/language', {
      method: 'POST',
      body: JSON.stringify({ language }),
    });
  }

  async getUserProfile() {
    const data = await this.request('/auth/profile');
    return data.user;
  }

  async getSites(): Promise<Site[]> {
    const data = await this.request('/sites');
    return data.sites || [];
  }

  async addSite(site: Omit<Site, 'id' | 'spent'>): Promise<Site> {
    const data = await this.request('/sites', {
      method: 'POST',
      body: JSON.stringify(site),
    });
    return data.site;
  }

  async updateSite(id: string, updates: Partial<Site>): Promise<Site> {
    const data = await this.request(`/sites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.site;
  }

  async deleteSite(id: string): Promise<void> {
    await this.request(`/sites/${id}`, {
      method: 'DELETE',
    });
  }
}

// Auth functions (don't require token)
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
}
