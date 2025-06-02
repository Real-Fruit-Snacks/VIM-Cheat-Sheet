#!/bin/bash

# Create GitHub release for GitLab offline edition
echo "🚀 Creating GitHub release for VIM.io GitLab Edition..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install it from: https://cli.github.com/"
    echo "   Or create the release manually on GitHub.com"
    exit 1
fi

# Create the release
gh release create v1.0.0-gitlab \
  --target gitlab \
  --title "VIM.io v1.0.0 - GitLab Offline Edition" \
  --notes "## 🚀 VIM.io GitLab Offline Edition

This release includes pre-built files for deployment to GitLab Pages in completely offline environments.

### ✨ Features
- 100% self-contained - no internet access required
- Pre-built application files (7.8MB total)
- Minimal GitLab CI configuration
- Works in offline environments
- No npm, Docker Hub, or external dependencies needed

### 📥 Installation
1. Download this release
2. Transfer to offline environment via USB
3. Push to internal GitLab
4. GitLab Pages will automatically deploy

### 📚 Documentation
See \`GITLAB_DEPLOYMENT.md\` for detailed instructions.

### 🔒 Perfect for:
- Classified networks
- Training environments
- Offline deployments
- Restricted corporate networks"

echo "✅ Release created successfully!"
echo "   View at: https://github.com/Real-Fruit-Snacks/VIM.io/releases"