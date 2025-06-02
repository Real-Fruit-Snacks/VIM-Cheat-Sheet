#!/bin/bash

# Build script for GitLab Pages deployment
# This creates a fully self-contained build that can be pushed to GitLab

echo "🔨 Building VIM.io for GitLab Pages deployment..."

# Clean previous builds
echo "📦 Cleaning previous builds..."
rm -rf dist gitlab-public

# Build the application
echo "🚀 Building application..."
npm run build

# Copy to gitlab-public directory
echo "📁 Preparing GitLab deployment directory..."
cp -r dist gitlab-public

# Verify the build
if [ -f "gitlab-public/index.html" ] && [ -d "gitlab-public/vim-wasm" ]; then
    echo "✅ Build successful! Files ready in gitlab-public/"
    echo ""
    echo "📤 To deploy to GitLab Pages:"
    echo "   1. git add gitlab-public"
    echo "   2. git commit -m 'Update GitLab Pages build'"
    echo "   3. git push origin gitlab"
    echo ""
    echo "🌐 Your site will be available at:"
    echo "   https://[your-username].gitlab.io/VIM.io/"
else
    echo "❌ Build failed! Please check for errors above."
    exit 1
fi