# GitLab Pages Deployment Guide

This guide explains how to deploy VIM.io to GitLab Pages with a fully self-contained build that requires NO internet access for users.

## 🎯 Overview

This deployment method:
- Builds the application locally on your machine
- Commits the built files directly to git
- GitLab serves these files without any build process
- Perfect for offline environments or restricted networks

## 🔒 Air-Gapped Environment Support

This setup is specifically designed for completely isolated environments:
- **No internet access required** at any stage
- **No Docker Hub access needed** - uses minimal images
- **No npm registry access** - all files pre-built
- **No external CDNs** - all assets bundled locally
- Transfer via USB stick from GitHub to internal GitLab

## 📋 Prerequisites

Before deployment, ensure you have:
- Node.js and npm installed locally
- Git configured with GitLab access
- A GitLab account and project

## 🚀 Quick Deploy

1. **Run the build script:**
   ```bash
   ./build-for-gitlab.sh
   ```

2. **Commit and push:**
   ```bash
   git add gitlab-public
   git commit -m "Update GitLab Pages build"
   git push origin gitlab
   ```

3. **Access your site:**
   - URL: `https://[your-username].gitlab.io/VIM.io/`
   - First deployment may take 30-60 minutes to activate

## 🔐 Air-Gapped Deployment Workflow

For environments with **ZERO internet access**:

### Step 1: On Internet-Connected Machine
```bash
# Clone the gitlab branch
git clone -b gitlab https://github.com/[username]/VIM.io.git
cd VIM.io

# The gitlab-public folder already contains the built files
# No npm install or build needed!
```

### Step 2: Transfer via USB
1. Copy the entire project folder to USB stick
2. Transfer to air-gapped environment
3. Copy to your air-gapped workstation

### Step 3: On Air-Gapped GitLab
```bash
# Create new project on internal GitLab
cd VIM.io

# Add internal GitLab remote
git remote add internal http://your-internal-gitlab/username/VIM.io.git

# Push to internal GitLab
git push internal gitlab:main
```

### Step 4: GitLab CI Configuration
The `.gitlab-ci.yml` is designed for air-gapped environments:
- Uses only basic shell commands (`cp`)
- No Docker images from internet required
- Works with `busybox` or any minimal image

If your GitLab has NO Docker images at all, rename `.gitlab-ci-minimal.yml` to `.gitlab-ci.yml`

### Step 5: Enable GitLab Pages
1. Go to Settings → Pages in your GitLab project
2. GitLab will run the pipeline automatically
3. Your site is ready at `http://your-internal-gitlab-pages/username/VIM.io/`

## 📝 Manual Build Process

If you prefer to build manually:

1. **Build the application:**
   ```bash
   npm install
   npm run build
   ```

2. **Copy to GitLab directory:**
   ```bash
   rm -rf gitlab-public
   cp -r dist gitlab-public
   ```

3. **Commit the built files:**
   ```bash
   git add gitlab-public
   git commit -m "Update GitLab Pages build"
   git push origin gitlab
   ```

## 🔧 Configuration Details

### Project Structure
```
VIM.io/
├── src/              # Source code (not deployed)
├── public/           # Source assets (not deployed)  
├── dist/             # Build output (git ignored)
├── gitlab-public/    # GitLab deployment files (committed)
└── .gitlab-ci.yml    # GitLab CI configuration
```

### GitLab CI Configuration
The `.gitlab-ci.yml` file is minimal - it just copies pre-built files:
- No npm install required
- No build step needed
- Works on any GitLab runner
- Deploys in seconds

### Base Path Configuration
The application is configured with base path `/VIM.io/` in `vite.config.ts`.
Update this if your GitLab project has a different name.

## 🔒 Offline Deployment Benefits

1. **No External Dependencies:**
   - All JavaScript, CSS, and WASM files are bundled
   - No CDN requests
   - No font downloads
   - Works completely offline once loaded

2. **Security:**
   - You control exactly what gets deployed
   - Can audit the build before pushing
   - No build-time vulnerabilities on GitLab

3. **Reliability:**
   - No build failures on GitLab
   - Consistent deployments
   - Fast deployment (just file copying)

## 🆘 Troubleshooting

### Site not appearing?
- Check GitLab Pages is enabled: Settings → Pages
- Verify the pipeline ran: CI/CD → Pipelines
- First deployment can take up to 60 minutes

### 404 errors on assets?
- Ensure base path matches your project name in `vite.config.ts`
- Rebuild and redeploy after changes

### Build errors locally?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Additional Notes

- The `gitlab-public/` directory contains ~7-8MB of files
- Each deployment is a complete replacement (no incremental updates)
- Users can download and run the entire site offline
- Perfect for training environments or restricted networks