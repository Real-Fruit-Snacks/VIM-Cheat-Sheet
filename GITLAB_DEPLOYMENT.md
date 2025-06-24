# GitLab Pages Deployment Guide

This guide explains how to deploy the VIM Cheat Sheet application to GitLab Pages for offline hosting.

## Quick Start

### Option 1: Automatic CI/CD Deployment (Recommended)

1. **Create a new GitLab repository:**
   ```bash
   # Create new repo on GitLab: https://gitlab.com/projects/new
   # Example: https://gitlab.com/your-username/vim-cheat-sheet
   ```

2. **Clone this repository and push to GitLab:**
   ```bash
   git clone https://github.com/Real-Fruit-Snacks/VIM-Cheat-Sheet.git
   cd VIM-Cheat-Sheet
   git remote add gitlab https://gitlab.com/your-username/vim-cheat-sheet.git
   git push gitlab main
   ```

3. **Automatic deployment:**
   - GitLab CI/CD will automatically build and deploy
   - Your site will be available at: `https://your-username.gitlab.io/vim-cheat-sheet`
   - No additional configuration needed\!

### Option 2: Manual Deployment

1. **Download the pre-built release:**
   - Download `vim-cheat-sheet-v4.2.0-gitlab-pages.zip` from the GitHub release
   - Extract the contents

2. **Create GitLab repository:**
   - Create a new repository on GitLab
   - Clone it locally

3. **Deploy manually:**
   ```bash
   # Copy extracted files to your GitLab repo
   cp -r extracted-files/* your-gitlab-repo/
   cd your-gitlab-repo
   
   # Create public directory (GitLab Pages requirement)
   mkdir -p public
   cp -r * public/ 2>/dev/null || true
   
   # Commit and push
   git add .
   git commit -m "Deploy VIM Cheat Sheet to GitLab Pages"
   git push origin main
   ```

## Configuration Details

### GitLab CI/CD Pipeline

The included `.gitlab-ci.yml` provides:

- **Automated building** with Node.js 18
- **Quality checks** (linting, type checking)
- **Optimized caching** for faster builds
- **Artifact management** with 1-week retention
- **Deployment to Pages** on main branch pushes

### Build Specifications

- **Bundle Size:** ~1.9MB total
- **Files:** 31 files including all assets
- **Offline Support:** Complete offline functionality
- **PWA Ready:** Installable as desktop/mobile app

### Included Assets

✅ **Core Application:**
- React application bundle (216KB main)
- CSS styles and themes
- Service Worker for offline support

✅ **VIM Documentation:**
- 16 official VIM help files
- Complete offline documentation

✅ **PWA Assets:**
- Web App Manifest
- Favicon sets (SVG + ICO)
- Touch icons for mobile

✅ **Performance Features:**
- Code splitting for optimal loading
- Virtual scrolling for large lists
- Debounced search (300ms)

## Customization

### Changing Base Path

If deploying to a subpath, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-custom-path/',
  // ... rest of config
});
```

### Corporate/Enterprise Deployment

For restricted environments:

1. **No External Dependencies:** All assets are bundled locally
2. **CORS Compatible:** Removed restrictive headers for corporate networks
3. **Self-Contained:** No CDN dependencies
4. **Offline First:** Complete functionality without internet

### Custom Branding

To customize for your organization:

1. Replace favicon files in `public/`
2. Update `manifest.json` with your branding
3. Modify colors in `tailwind.config.js`
4. Update titles in `index.html`

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Pages Not Loading

1. Ensure `public/` directory contains all files
2. Check GitLab Pages is enabled in project settings
3. Verify domain configuration if using custom domain

### Service Worker Issues

1. Clear browser cache and storage
2. Check browser console for SW registration errors
3. Ensure HTTPS is used (required for Service Workers)

## Support

- **GitHub Issues:** [Report problems](https://github.com/Real-Fruit-Snacks/VIM-Cheat-Sheet/issues)
- **Documentation:** [Full project docs](https://github.com/Real-Fruit-Snacks/VIM-Cheat-Sheet#readme)
- **VIM Help:** Use the built-in help viewer in the application

## Performance Metrics

 < /dev/null |  Metric | Value |
|--------|-------|
| Main Bundle | 216KB |
| Total Size | 1.9MB |
| Files | 31 |
| Commands | 315+ |
| Demos | 64 |
| Load Time | <1s |

---

**Ready to start using VIM Cheat Sheet offline? Deploy now and master VIM anywhere!**
