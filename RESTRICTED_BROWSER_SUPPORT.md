# Restricted Browser Environment Support

This VIM Cheatsheet is designed to work 100% in restricted corporate and enterprise browser environments with strict security policies.

## 🔒 Supported Restrictions

### Security Policy Restrictions
- ✅ **Content Security Policy (CSP)** - No inline scripts, eval, or unsafe operations
- ✅ **Strict CORS policies** - All resources served from same origin
- ✅ **Script restrictions** - External scripts loaded safely with fallbacks

### Storage Restrictions
- ✅ **localStorage blocked** - Automatic fallback to in-memory storage
- ✅ **sessionStorage blocked** - Memory-based session handling
- ✅ **Cookies disabled** - State management without cookies
- ✅ **IndexedDB blocked** - No dependency on client-side databases

### API Restrictions
- ✅ **Clipboard API blocked** - Multiple fallback copy methods
- ✅ **Service Workers blocked** - Graceful degradation without offline features
- ✅ **Web Workers blocked** - All processing on main thread
- ✅ **WebGL disabled** - CSS-only animations and effects

### Network Restrictions
- ✅ **No external CDNs** - All dependencies bundled locally
- ✅ **Proxy/Firewall restrictions** - Self-contained deployment
- ✅ **HTTPS-only environments** - Secure context compatibility

### JavaScript Restrictions
- ✅ **JavaScript disabled** - HTML fallback page with essential commands
- ✅ **eval() blocked** - No dynamic code execution
- ✅ **Function constructor blocked** - Safe code patterns only

## 🛡️ Safety Features

### Automatic Detection
The app automatically detects restricted environments and adapts accordingly:

```javascript
// Environment detection runs on startup
const restrictions = detectRestrictedEnvironment()
// Automatically enables appropriate fallbacks
```

### Graceful Degradation
- **Storage**: localStorage → sessionStorage → memory storage
- **Clipboard**: Clipboard API → execCommand → manual copy UI
- **Offline**: Service Worker → cached assets → online-only
- **JavaScript**: Full app → reduced features → HTML fallback

### Error Handling
- **Global error handlers** prevent CSP violations
- **Safe execution wrappers** for all potentially restricted operations
- **Fallback UI elements** when automation fails
- **User guidance** for manual operations when needed

## 📋 Testing Compatibility

### Automatic Testing
Add `?test-restricted` to the URL to run comprehensive compatibility tests:
```
https://your-domain.com/VIM-Cheat-Sheet/?test-restricted
```

### Manual Testing
1. Open browser developer tools
2. Check console for environment detection results
3. Test core features: search, navigation, favorites
4. Verify copy functionality works with your security settings

### Test Results Interpretation
- ✅ **PASS** - Feature works normally
- ⚠️ **FALLBACK** - Feature works with reduced functionality
- ❌ **BLOCKED** - Feature unavailable, alternative provided

## 🔧 Deployment for Restricted Environments

### Corporate Networks
1. **Download offline package**: Use GitHub releases for complete offline deployment
2. **Host internally**: Deploy to internal web servers
3. **Configure CSP**: App works with strict CSP headers
4. **Test thoroughly**: Verify all features in your specific environment

### Recommended CSP Headers
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
```

### Nginx Configuration Example
```nginx
server {
    listen 443 ssl;
    server_name vim-cheatsheet.internal;
    
    location / {
        root /var/www/vim-cheatsheet;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
    }
}
```

## 🎯 Feature Availability Matrix

| Feature | Normal Browser | Restricted Browser | No JavaScript |
|---------|---------------|-------------------|---------------|
| Command Search | ✅ Full | ✅ Full | ❌ HTML only |
| Interactive Examples | ✅ Animated | ✅ Animated | ❌ Text only |
| Workflow Demos | ✅ Auto-play | ✅ Manual | ❌ Not available |
| Favorites | ✅ Persistent | ⚠️ Session only | ❌ Not available |
| Copy Commands | ✅ One-click | ⚠️ Manual fallback | ❌ Manual only |
| Offline Support | ✅ Full | ⚠️ Limited | ❌ Online only |
| VIM Help | ✅ Integrated | ✅ Integrated | ✅ Basic reference |

## 🚨 Troubleshooting

### Common Issues

**"Commands not copying"**
- Clipboard API blocked by security policy
- Solution: Use manual copy fallback UI that appears

**"Favorites not saving"**
- localStorage blocked by IT policy  
- Solution: Favorites saved in memory for current session

**"Offline not working"**
- Service Workers blocked
- Solution: App still works online, bookmark for quick access

**"App not loading"**
- JavaScript blocked entirely
- Solution: Visit `/noscript.html` for basic HTML version

### Getting Help
1. Run compatibility test: `?test-restricted`
2. Check browser console for specific error messages
3. Contact IT department with specific VIM Cheatsheet requirements
4. Use HTML fallback version if needed

## 📞 IT Department Information

### Resource Requirements
- **No external dependencies** - fully self-contained
- **No user data collection** - operates entirely client-side  
- **No network requests** - after initial page load
- **Standard web technologies** - HTML, CSS, JavaScript only
- **No plugins required** - works in any modern browser

### Security Benefits
- **No data transmission** - all processing client-side
- **No cookies** - no tracking or session persistence required
- **No third-party resources** - eliminates external security risks
- **CSP compliant** - works with strictest security policies
- **Audit-friendly** - open source, transparent codebase

### Business Justification
- **Productivity tool** - improves developer efficiency
- **Educational resource** - reduces training time
- **Offline capable** - works without internet access
- **No maintenance** - static deployment, no updates required
- **Cost effective** - one-time deployment, no ongoing costs

---

**Need help with deployment in your restricted environment?**  
Open an issue: https://github.com/Real-Fruit-Snacks/VIM-Cheat-Sheet/issues