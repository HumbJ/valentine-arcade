# Valentine Arcade - Deployment Guide

## PWA Setup Complete ✅

Your app is now configured as a Progressive Web App (PWA) that can be installed on phones like a native app!

## Quick Deploy to Vercel (Recommended - Free & Easy)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account (it's free!)

### Step 2: Deploy
1. Click "Add New Project" in Vercel dashboard
2. Import your `valentine-arcade` repository from GitHub
3. Vercel will auto-detect it's a Vite project
4. Click "Deploy" - that's it!

### Step 3: Get Your URL
- Vercel will give you a URL like: `valentine-arcade.vercel.app`
- You can add a custom domain later if you want

## Installing on iPhone 📱

Once deployed, she can install it on her iPhone:

1. Open Safari and go to your Vercel URL
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Give it a name (like "Valentine Arcade" or something personal!)
5. Tap "Add"

Now it appears as an app icon on her home screen!

## Note About Icons

You'll need to create proper app icons. See `PWA_ICONS_TODO.md` for instructions.
Quick option: Go to https://www.pwabuilder.com/imageGenerator and upload a heart emoji screenshot.

## Testing the PWA

Before sharing with her:

1. Deploy to Vercel
2. Open the URL on your phone
3. Try installing it
4. Test that games work with touch controls
5. Check that it looks good

## Alternative Deployment Options

### Netlify (Also Free)
1. Go to https://netlify.com
2. Drag and drop your `dist` folder after running `npm run build`

### GitHub Pages (Free)
1. Install: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Update `vite.config.ts` to add:
   ```ts
   base: '/valentine-arcade/'
   ```
4. Run: `npm run build && npm run deploy`

## Features Now Available

- ✅ Installable on iPhone/Android
- ✅ Works offline (after first visit)
- ✅ Touch controls for all games
- ✅ Mobile-responsive design
- ✅ Full-screen mode without browser UI

## Next Steps

1. Deploy to Vercel
2. Create proper app icons
3. Test on mobile
4. Share the URL with her!

## Troubleshooting

**"Add to Home Screen" doesn't appear:**
- Make sure you're using Safari (iOS)
- Some features require HTTPS (Vercel provides this automatically)

**Service Worker not working:**
- Check browser console for errors
- Make sure you're on HTTPS
- Clear cache and reload

**Touch controls not working:**
- Check that all games have the touch buttons
- Test on actual device (touch simulation in DevTools isn't perfect)

Good luck! 💝
