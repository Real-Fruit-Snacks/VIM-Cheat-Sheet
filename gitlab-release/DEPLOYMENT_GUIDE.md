# VIM GitLab Pages Deployment Guide

## 🚀 Quick Start (3 Steps)

1. **Upload to GitLab**: Upload all files from this package to your GitLab repository
2. **Push to main branch**: GitLab will automatically deploy
3. **Access your site**: Visit `https://yourusername.gitlab.io/your-repo-name/`

## 📦 What's Included

This package contains everything needed for a complete offline VIM installation:

- ✅ **Pre-built application** - No build process required
- ✅ **All dependencies included** - vim.wasm, fonts, icons, etc.
- ✅ **GitLab CI configuration** - Automatic deployment setup
- ✅ **Security headers** - Cross-origin isolation configured
- ✅ **Offline capability** - Works without internet after initial load

## 📁 File Structure

```
your-gitlab-repo/
├── .gitlab-ci.yml          # GitLab CI/CD configuration
├── public/                 # Application files (GitLab requirement)
│   ├── index.html         # Main entry point
│   ├── assets/            # CSS, JS, and fonts
│   ├── vim-wasm/          # VIM WebAssembly files
│   │   ├── vim.wasm       # VIM binary
│   │   ├── vim.js         # VIM JavaScript wrapper
│   │   └── vim.data       # VIM data files
│   ├── _headers           # Security headers
│   └── *.svg              # Favicon files
└── DEPLOYMENT_GUIDE.md    # This file
```

## 🔧 Deployment Methods

### Method 1: GitLab Web Interface (Easiest)

1. Create a new GitLab repository
2. Go to **Project** → **Repository** → **Files**
3. Click **"+"** → **"Upload file"**
4. Select and upload ALL files from this package
5. Commit to main branch
6. GitLab Pages will automatically deploy

### Method 2: Git Command Line

```bash
# Clone your GitLab repository
git clone https://gitlab.com/yourusername/your-repo.git
cd your-repo

# Copy all files from this package
cp -r /path/to/extracted/vimora-files/* .

# Add, commit, and push
git add .
git commit -m "Deploy VIM - Browser-based VIM with keystroke visualization"
git push origin main
```

### Method 3: Direct Push

```bash
# In the extracted package directory
git init
git add .
git commit -m "Initial VIM deployment"
git remote add origin https://gitlab.com/yourusername/your-repo.git
git push -u origin main
```

## 🌐 Accessing Your Site

After deployment, your VIM instance will be available at:

```
https://yourusername.gitlab.io/your-repo-name/
```

Replace `yourusername` and `your-repo-name` with your actual values.

### First Deployment
- GitLab Pages may take 10-30 minutes to activate on first deployment
- Check **Settings** → **Pages** for deployment status

## ⚙️ Configuration Options

### Custom Domain

1. Go to **Settings** → **Pages**
2. Click **"New Domain"**
3. Enter your custom domain
4. Configure DNS as instructed
5. GitLab provides free SSL certificates

### Access Control (GitLab Premium)

Make your VIM instance private:
1. Go to **Settings** → **Pages**
2. Toggle **"Access Control"**
3. Only project members can access

## 🛡️ Security Features

This deployment includes:
- **Cross-Origin Isolation**: Required for vim.wasm SharedArrayBuffer
- **Content Security Policy**: Secure default configuration
- **HTTPS Only**: Enforced by GitLab Pages

## 🚨 Troubleshooting

### Site Not Loading
- Ensure ALL files are in the `public/` directory
- Check GitLab CI/CD pipelines for errors
- Verify `.gitlab-ci.yml` is in repository root

### VIM Not Working
- Check browser console for errors
- Ensure `_headers` file was uploaded
- Verify all files in `vim-wasm/` directory exist
- Try a different browser (Chrome/Edge recommended)

### 404 Error
- Wait 10-30 minutes after first deployment
- Check repository name matches URL
- Ensure `index.html` is in `public/` directory

### Slow Loading
- GitLab Pages uses global CDN - initial load may vary
- After first load, app works offline
- All assets are optimized and compressed

## 🌟 Features Available Offline

Once loaded, VIM works completely offline with:
- 🎹 Full VIM editor (via WebAssembly)
- 🎥 Keystroke visualizer for teaching
- 🎯 Which-Key command helper
- 📝 Live vimrc configuration
- 📚 Comprehensive cheat sheet
- 💾 Local storage persistence

## 🤝 Support

- **Source Code**: https://github.com/Real-Fruit-Snacks/VIM
- **Live Demo**: https://real-fruit-snacks.github.io/VIM/
- **Issues**: https://github.com/Real-Fruit-Snacks/VIM/issues

## 📄 License

VIM is open source software licensed under the MIT License.

---

**Note**: This is a pre-built package. No development environment or build process is required. Just upload and deploy!
