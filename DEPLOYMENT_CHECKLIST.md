# Deployment Checklist

Complete checklist for deploying VIM.io in production environments.

## 📋 Pre-Deployment Verification

### Build Verification
- [ ] Run `./verify-offline-build.sh` - all checks pass
- [ ] Run `./generate-checksums.sh` - checksums generated
- [ ] Verify gitlab-public/ contains all necessary files (~14 files)
- [ ] Confirm total size is approximately 7-8MB
- [ ] Check no node_modules or source files in gitlab-public/

### Security Review
- [ ] Review SECURITY.md and complete all checks
- [ ] Verify no hardcoded URLs or API endpoints
- [ ] Confirm no external resource requests
- [ ] Check Content Security Policy headers in _headers
- [ ] Ensure no sensitive information in built files

### Browser Testing
- [ ] Test in Chrome/Edge - full functionality
- [ ] Test in Firefox - with proper headers
- [ ] Test in Safari - if supported in environment
- [ ] Verify all VIM commands work correctly
- [ ] Test copy/paste functionality

## 🚀 Deployment Steps

### For GitLab Pages
- [ ] Push to GitLab repository
- [ ] Verify .gitlab-ci.yml is appropriate for environment
- [ ] Check pipeline runs successfully
- [ ] Wait for Pages to activate (first time: 30-60 min)
- [ ] Verify site loads at GitLab Pages URL

### For Offline Deployment
- [ ] Create offline bundle: `./create-offline-bundle.sh`
- [ ] Transfer bundle via approved method (USB, etc)
- [ ] Extract bundle in target environment
- [ ] Verify checksum integrity
- [ ] Deploy according to environment requirements

## ✅ Post-Deployment Testing

### Functionality Tests
- [ ] Page loads without errors
- [ ] VIM editor initializes properly
- [ ] Can type and edit text
- [ ] VIM commands work (i, esc, :w, :q, etc)
- [ ] Which-key helper displays correctly
- [ ] Keystroke visualizer works (if enabled)

### Performance Tests
- [ ] Initial load time is acceptable
- [ ] No memory leaks after extended use
- [ ] WebAssembly loads correctly
- [ ] No console errors or warnings

### Network Isolation Test
- [ ] Open browser DevTools Network tab
- [ ] Clear and reload page
- [ ] Verify ZERO external requests
- [ ] All resources load from same origin

## 🔒 Security Validation

### Headers Verification
- [ ] Cross-Origin-Embedder-Policy: require-corp
- [ ] Cross-Origin-Opener-Policy: same-origin
- [ ] Appropriate cache headers set

### Offline Verification
- [ ] Disconnect from network
- [ ] Application continues to function
- [ ] No error messages about network
- [ ] Can reload page while offline

## 📊 Monitoring Setup

### Error Tracking
- [ ] Browser console monitored for errors
- [ ] User feedback channel established
- [ ] Known issues documented

### Performance Monitoring
- [ ] Load time baseline established
- [ ] Memory usage baseline noted
- [ ] Response time acceptable

## 🚨 Rollback Plan

### If Issues Occur
- [ ] Previous version backup available
- [ ] Rollback procedure documented
- [ ] Team knows how to rollback
- [ ] Communication plan ready

## 📝 Documentation

### Deployment Documentation
- [ ] Deployment steps documented
- [ ] Environment-specific configs noted
- [ ] Access credentials secured
- [ ] Support contacts listed

### User Documentation  
- [ ] Link to VIM.io docs available
- [ ] Local help documentation accessible
- [ ] Training materials prepared
- [ ] Support process defined

## ✍️ Sign-Off

- [ ] Technical review completed by: _______________ Date: _______
- [ ] Security review completed by: _______________ Date: _______
- [ ] Deployment approved by: ____________________ Date: _______
- [ ] Go-live authorized by: _____________________ Date: _______

---

**Notes:**
- Keep this checklist for audit purposes
- Update for environment-specific requirements
- Review and improve after each deployment