# Build & Development Guide

Complete guide for building VIM.io from source and customizing deployments.

## 📋 Prerequisites

### Required Software
- **Node.js**: 18.x or 20.x (LTS versions recommended)
- **npm**: 8.x or higher
- **Git**: 2.x or higher

### Verify Installation
```bash
node --version  # Should show v18.x.x or v20.x.x
npm --version   # Should show 8.x.x or higher
git --version   # Should show 2.x.x or higher
```

## 🏗️ Building from Source

### 1. Clone Repository
```bash
# For development
git clone https://github.com/Real-Fruit-Snacks/VIM.io.git
cd VIM.io

# For offline deployment
git clone -b gitlab https://github.com/Real-Fruit-Snacks/VIM.io.git
cd VIM.io
```

### 2. Install Dependencies
```bash
# Standard install
npm install

# For offline environments (create local cache first)
npm install --prefer-offline --no-audit
```

### 3. Development Build
```bash
# Start development server
npm run dev

# Access at http://localhost:5173
# Hot reload enabled for instant updates
```

### 4. Production Build
```bash
# Standard build
npm run build

# GitLab-specific build
npm run build:gitlab

# Build with custom base path
VITE_BASE_PATH=/custom-path/ npm run build
```

## 🎨 Customization Options

### Change Base Path
Edit `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-project-name/',  // Change this
  // ... rest of config
})
```

### Modify Branding
1. Replace favicons in `public/`:
   - `favicon-simple.svg`
   - `favicon-detailed.svg`

2. Update title in `index.html`:
   ```html
   <title>Your Custom Title</title>
   ```

### Configure Headers
Edit `public/_headers` for security policies:
```
/*
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

## 🔧 Build Options

### Environment Variables
```bash
# Development
NODE_ENV=development npm run build

# Production (default)
NODE_ENV=production npm run build

# Custom VIM configuration
VITE_VIM_CONFIG="set number" npm run build
```

### Build Output
- `dist/` - Standard web deployment
- `gitlab-public/` - Pre-built for GitLab Pages

### Optimization Flags
```bash
# Minimize bundle size
npm run build -- --minify

# Source maps for debugging
npm run build -- --sourcemap

# Analyze bundle
npm run build -- --analyze
```

## 🚀 Deployment Variants

### 1. GitHub Pages
```bash
npm run build
npm run deploy
```

### 2. GitLab Pages (Online)
```bash
# Use standard GitLab CI/CD
git push origin main
```

### 3. GitLab Pages (Offline)
```bash
./build-for-gitlab.sh
git add gitlab-public
git commit -m "Update build"
git push
```

### 4. Static Server
```bash
npm run build
# Serve dist/ folder with any static server
npx serve dist
```

### 5. Docker Container
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY public/_headers /etc/nginx/conf.d/headers.conf
```

## 📦 Creating Offline Bundle

### For Complete Offline Development
```bash
# 1. Create npm cache
npm config set cache ./npm-cache
npm install

# 2. Bundle with dependencies
tar -czf vim-io-offline-bundle.tar.gz \
  src \
  public \
  package*.json \
  npm-cache \
  *.config.* \
  *.md

# 3. On offline machine
tar -xzf vim-io-offline-bundle.tar.gz
npm install --cache ./npm-cache --offline
npm run build
```

## 🐛 Build Troubleshooting

### TypeScript Errors
```bash
# Check types without building
npx tsc --noEmit

# Ignore type errors (not recommended)
npm run build -- --force
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Clean Build
```bash
# Remove all generated files
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

## 🧪 Testing Builds

### Local Preview
```bash
# After building
npm run preview
# Opens at http://localhost:4173
```

### Network Isolation Test
```bash
# Build and serve locally
npm run build
npx serve dist

# In another terminal, block network
# (Linux) sudo iptables -A OUTPUT -j DROP
# Visit http://localhost:5000
# App should work completely offline
```

### Cross-Browser Testing
Test your build in:
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari 15.2+

## 📚 Advanced Topics

### Custom VIM Build
To use a different VIM version:
1. Replace files in `public/vim-wasm/`
2. Update types in `src/types/vim-wasm.d.ts`
3. Test thoroughly

### Performance Profiling
```bash
# Build with profiling
npm run build -- --profile

# Analyze results
npx vite-bundle-visualizer
```

### Security Hardening
1. Review and update CSP in `_headers`
2. Run security audit: `npm audit`
3. Generate checksums: `./generate-checksums.sh`
4. Document any changes in SECURITY.md