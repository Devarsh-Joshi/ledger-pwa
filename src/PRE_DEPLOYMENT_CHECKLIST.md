# Pre-Deployment Checklist for Smart Ledger PWA

Use this checklist before deploying your PWA to ensure everything is ready.

## 📱 PWA Assets

### Icons
- [ ] Created `icon-192.png` (192x192 pixels) in `/public` folder
- [ ] Created `icon-512.png` (512x512 pixels) in `/public` folder
- [ ] Verified icons look good on white and colored backgrounds
- [ ] Icons have transparent background (if desired)

### Manifest
- [x] `manifest.json` exists in `/public` folder
- [x] App name is set correctly
- [x] Theme color matches your app design
- [x] Background color is set
- [x] Icons paths are correct in manifest

### Service Worker
- [x] `service-worker.js` exists in `/public` folder
- [x] Service worker registration code is in `App.tsx`
- [x] Cache strategy is appropriate (network-first)
- [x] Supabase API calls are excluded from cache

### HTML
- [x] `index.html` exists in project root
- [x] Manifest link is present
- [x] Meta tags for PWA are included
- [x] Apple-specific meta tags are included for iOS

## 🔧 Configuration Files

### Build Configuration
- [ ] Choose your deployment platform (Vercel/Netlify/Firebase)
- [x] Platform-specific config file exists:
  - `vercel.json` for Vercel
  - `netlify.toml` for Netlify
  - `firebase.json` for Firebase

### Package.json
- [ ] All dependencies are listed
- [ ] Build script is present
- [ ] Preview/dev scripts work locally

## 🔐 Supabase Setup

### Database
- [ ] Supabase project is created
- [ ] Database tables are set up:
  - [ ] entries table
  - [ ] sites table
  - [ ] user_settings table
- [ ] Row Level Security (RLS) is enabled
- [ ] RLS policies are configured

### Authentication
- [ ] Supabase Auth is enabled
- [ ] Email/Password provider is enabled
- [ ] Auth settings are configured

### Environment Variables
- [ ] Supabase URL is set in your hosting platform
- [ ] Supabase Anon Key is set in your hosting platform
- [ ] Test that auth works with these credentials

## 🧪 Testing

### Local Testing
- [ ] App builds successfully (`npm run build`)
- [ ] App runs in production mode locally (`npm run preview` or `serve -s dist`)
- [ ] Service worker registers correctly (check DevTools → Application)
- [ ] Manifest loads correctly (check DevTools → Application → Manifest)
- [ ] Icons display correctly in manifest

### PWA Audit
- [ ] Run Lighthouse audit in Chrome DevTools
- [ ] PWA score is 90+ (green)
- [ ] All PWA criteria are met
- [ ] No critical warnings

### Functionality Testing
- [ ] User can sign up
- [ ] User can sign in
- [ ] User can add entries
- [ ] User can delete entries
- [ ] User can add sites
- [ ] User can view different tabs (Home, Workers, Suppliers, Sites, Reports, Settings)
- [ ] User can change language
- [ ] Transactions are associated with correct sites
- [ ] Balance calculations are accurate

### Offline Testing
- [ ] Service worker caches app shell
- [ ] App loads basic UI when offline
- [ ] Appropriate offline message shows for data operations
- [ ] App reconnects and syncs when back online

### Browser Testing
- [ ] Tested on Chrome (Android)
- [ ] Tested on Safari (iOS)
- [ ] Tested on desktop Chrome
- [ ] Tested on desktop Edge/Firefox

## 🚀 Deployment Preparation

### Pre-Deploy
- [ ] All code is committed to Git
- [ ] No console errors in production build
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Version number updated (if applicable)
- [ ] CHANGELOG or release notes updated

### Deploy Platform Setup
- [ ] Hosting account created (Vercel/Netlify/Firebase)
- [ ] CLI tool installed
- [ ] Logged into CLI
- [ ] Project connected to hosting platform

### Environment Variables on Hosting Platform
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] All other required env vars are set

## 📋 Post-Deployment

### Verify Deployment
- [ ] App is accessible at deployed URL
- [ ] HTTPS is working (should be automatic)
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Database connections work

### PWA Installation
- [ ] Install prompt appears on mobile (Android)
- [ ] Can install via browser menu
- [ ] App installs successfully
- [ ] Installed app opens in standalone mode
- [ ] App icon shows correctly on home screen
- [ ] iOS installation works (manual via Share → Add to Home Screen)

### Performance Check
- [ ] Run Lighthouse on deployed URL
- [ ] Performance score is 80+ (ideally 90+)
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 5s

### Final Functionality Check
- [ ] Sign up works on deployed app
- [ ] Sign in works on deployed app
- [ ] Can add/delete entries
- [ ] Can add/delete sites
- [ ] Data persists after reload
- [ ] Language switching works
- [ ] All calculations are accurate

## 🔒 Security Check

- [ ] HTTPS is enabled (automatic with hosting platforms)
- [ ] Supabase RLS policies protect data
- [ ] Users can only access their own data
- [ ] No API keys exposed in client code
- [ ] No sensitive data in localStorage (except token)

## 📱 User Testing

- [ ] Test installation flow with real users
- [ ] Get feedback on install experience
- [ ] Verify app works on various devices
- [ ] Check that offline behavior is clear to users

## 📚 Documentation

- [ ] Installation instructions for users created
- [ ] Support documentation ready
- [ ] Known issues documented
- [ ] Update plan documented

## 🎯 Launch Readiness

When all checkboxes are complete:
- [ ] **Ready to deploy to production!**
- [ ] Share URL with users
- [ ] Monitor error logs
- [ ] Collect user feedback
- [ ] Plan for updates and improvements

---

## Quick Checklist Summary

**Must Have Before Deploy:**
1. ✅ Icons created (PNG files)
2. ✅ Supabase configured and tested
3. ✅ Local build works
4. ✅ Lighthouse PWA score 90+
5. ✅ Tested on mobile device

**Nice to Have:**
- Custom domain
- App screenshots for manifest
- User onboarding flow
- Analytics setup

---

## Need Help?

If you're stuck on any item:
1. Check `PWA_DEPLOYMENT_GUIDE.md` for detailed instructions
2. Check `QUICK_START.md` for a fast deployment path
3. Review browser console for specific errors
4. Check DevTools → Application tab for PWA issues

Good luck with your deployment! 🚀
