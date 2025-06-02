#!/bin/bash

# Verification script to ensure build is fully self-contained
echo "🔍 Verifying VIM.io build for offline deployment..."
echo

# Check if gitlab-public exists
if [ ! -d "gitlab-public" ]; then
    echo "❌ ERROR: gitlab-public directory not found!"
    echo "   Run ./build-for-gitlab.sh first"
    exit 1
fi

# Check for external references
echo "📡 Checking for external URLs..."
EXTERNAL_REFS=$(grep -r "https://" gitlab-public/ 2>/dev/null | grep -v "github.com/anthropics/claude-code" | grep -v "claude.ai/code" || true)

if [ -n "$EXTERNAL_REFS" ]; then
    echo "⚠️  WARNING: Found external references:"
    echo "$EXTERNAL_REFS" | head -5
    echo
fi

# Check file sizes
echo "📦 Build size information:"
TOTAL_SIZE=$(du -sh gitlab-public/ | cut -f1)
echo "   Total size: $TOTAL_SIZE"
echo

# Check critical files
echo "✅ Checking critical files..."
CRITICAL_FILES=(
    "gitlab-public/index.html"
    "gitlab-public/vim-wasm/vim.wasm"
    "gitlab-public/vim-wasm/vim.data"
    "gitlab-public/vim-wasm/vim.js"
    "gitlab-public/vim-wasm/vimwasm.js"
    "gitlab-public/_headers"
)

ALL_GOOD=true
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ✗ MISSING: $file"
        ALL_GOOD=false
    fi
done

echo
if [ "$ALL_GOOD" = true ]; then
    echo "✅ Build verification PASSED!"
    echo "   Your build is ready for offline deployment."
    echo
    echo "📤 Next steps:"
    echo "   1. Copy this entire folder to USB stick"
    echo "   2. Transfer to air-gapped environment"
    echo "   3. Push to internal GitLab"
else
    echo "❌ Build verification FAILED!"
    echo "   Please run ./build-for-gitlab.sh again"
    exit 1
fi