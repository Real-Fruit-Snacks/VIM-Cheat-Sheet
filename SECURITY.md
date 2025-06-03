# Security & Integrity Guide

This document helps security-conscious users verify and audit VIM.io before deployment.

## 🔒 Security Overview

VIM.io is designed with security in mind:
- **No external dependencies** at runtime
- **No data collection** or analytics
- **No network requests** after initial load
- **All assets served locally**

## 📋 Pre-Deployment Checklist

Before deploying in sensitive environments:

- [ ] Verify file checksums match (see below)
- [ ] Review Content Security Policy headers in `_headers`
- [ ] Audit all JavaScript files in `gitlab-public/assets/`
- [ ] Check no hardcoded URLs or API endpoints exist
- [ ] Verify CORS headers are appropriate for your environment
- [ ] Review all third-party dependencies (see below)

## 🔍 File Integrity Verification

Run `./generate-checksums.sh` to create current checksums, then compare with:

```bash
# Verify all files
sha256sum -c checksums.txt
```

## 📦 Third-Party Dependencies

### Runtime Dependencies (Included in Build)
- **React** (v19.1.0) - MIT License
- **vim-wasm** (v0.0.13) - MIT License  
- **Tailwind CSS** (v3.4.17) - MIT License
- **Lucide React Icons** (v0.511.0) - ISC License

### Build-Only Dependencies
- TypeScript, Vite, ESLint - Development only, not in production build

## 🛡️ Content Security Policy

The application enforces strict CSP headers:
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

These enable SharedArrayBuffer for WebAssembly performance while maintaining security.

## 🔐 Offline Verification

To verify no external calls:
1. Deploy the application
2. Open browser DevTools Network tab
3. Clear network log and reload page
4. Verify NO external requests (only local files)

## 🚨 Security Reporting

Found a security issue? Please report privately to:
- Create a private security advisory on GitHub
- Or contact the maintainers directly

## ✅ Security Audit Results

Last audit: Build included in this release
- No known vulnerabilities in dependencies
- No external resource loading
- No data transmission capabilities
- No local storage of sensitive data