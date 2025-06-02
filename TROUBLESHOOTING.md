# Troubleshooting Guide

Common issues and solutions for VIM.io deployment and usage.

## 🌐 Browser Compatibility

### Supported Browsers
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 80+ | ✅ Full Support | Recommended |
| Edge | 80+ | ✅ Full Support | Chromium-based |
| Firefox | 79+ | ✅ Full Support | Requires headers |
| Safari | 15.2+ | ⚠️ Limited | Requires config |
| Opera | 67+ | ✅ Full Support | Chromium-based |

### Browser-Specific Issues

#### Firefox: "SharedArrayBuffer not defined"
**Solution:** Ensure CORS headers are properly set:
```bash
# Check _headers file includes:
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

#### Safari: Cross-Origin Restrictions
**Solution:** Enable developer mode:
1. Safari → Preferences → Advanced → Show Develop menu
2. Develop → Disable Cross-Origin Restrictions

## 🚀 GitLab Pages Issues

### Deployment Takes Too Long
**Problem:** First deployment can take 30-60 minutes
**Solution:** This is normal for initial GitLab Pages activation. Subsequent deployments are faster.

### 404 Error on Assets
**Problem:** CSS/JS files return 404
**Solutions:**
1. Verify base path in `vite.config.ts` matches your project name
2. Check GitLab project visibility (must be public for Pages)
3. Ensure pipeline completed successfully

### Pipeline Fails with "Command not found"
**Problem:** GitLab runner missing basic commands
**Solution:** Use `.gitlab-ci-minimal.yml` instead:
```bash
mv .gitlab-ci-minimal.yml .gitlab-ci.yml
git add .gitlab-ci.yml
git commit -m "Use minimal CI config"
git push
```

## 💻 Local Development Issues

### npm install Fails
**Requirements:**
- Node.js 18.x or 20.x (LTS versions)
- npm 8.x or higher

**Solution:**
```bash
# Check versions
node --version
npm --version

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build Fails with Memory Error
**Problem:** Large WebAssembly files exhaust Node memory
**Solution:**
```bash
# Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Vite Dev Server Not Working
**Problem:** Port conflicts or permission issues
**Solution:**
```bash
# Try different port
npm run dev -- --port 3001

# Or check what's using port 5173
lsof -i :5173
```

## 🔧 VIM-Specific Issues

### VIM Commands Not Working
**Problem:** Keyboard input not reaching VIM
**Solutions:**
1. Click inside the VIM terminal area
2. Check no modal dialogs are open
3. Disable browser extensions that capture keystrokes

### VIM Loads But Shows Black Screen
**Problem:** WebAssembly initialization failed
**Solutions:**
1. Check browser console for errors
2. Clear browser cache and reload
3. Verify all vim-wasm files are present in gitlab-public

### Copy/Paste Not Working
**Problem:** Browser security restrictions
**Solution:** Use VIM's visual mode and browser's context menu:
- Visual select: `v` + motion
- Right-click → Copy/Paste

## 🔍 Debugging

### Enable Debug Mode
Add to your browser console:
```javascript
localStorage.setItem('vim-debug', 'true');
location.reload();
```

### Check File Loading
Open DevTools Network tab and verify:
1. All files load with status 200
2. No external requests are made
3. WASM files have correct content-type

### Verify Headers
```bash
# Check deployed headers
curl -I https://your-gitlab-pages-url/

# Should include:
# cross-origin-embedder-policy: require-corp
# cross-origin-opener-policy: same-origin
```

## 🆘 Getting Help

1. Check existing [GitHub Issues](https://github.com/Real-Fruit-Snacks/VIM.io/issues)
2. Review browser console for specific errors
3. Include these details when reporting issues:
   - Browser name and version
   - Operating system
   - Error messages from console
   - Steps to reproduce

## 📊 Performance Optimization

### Slow Initial Load
**Normal:** First load downloads ~7-8MB of files
**Optimizations:**
- Enable browser caching
- Use HTTP/2 if available
- Consider CDN for gitlab-public files

### High Memory Usage
**Normal:** VIM WASM uses ~50-100MB RAM
**Solutions:**
- Close unnecessary browser tabs
- Restart browser if memory leak suspected
- Use Chrome's Task Manager to monitor