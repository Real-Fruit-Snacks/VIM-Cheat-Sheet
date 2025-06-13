#!/bin/bash

echo "🔍 Checking VIM application for offline safety..."
echo

# Check for actual fetch() or XMLHttpRequest calls that make network requests
echo "📡 Checking for network API usage..."
NETWORK_CALLS=$(grep -r "fetch(" --include="*.js" gitlab-public/ | grep -v "modulepreload" | grep -v "vim.js" | wc -l)
if [ "$NETWORK_CALLS" -eq 0 ]; then
    echo "   ✓ No fetch() calls found in application code"
else
    echo "   ⚠️  Found $NETWORK_CALLS fetch() calls"
fi

XHR_CALLS=$(grep -r "XMLHttpRequest" --include="*.js" gitlab-public/ | grep -v "vim.js" | wc -l)
if [ "$XHR_CALLS" -eq 0 ]; then
    echo "   ✓ No XMLHttpRequest usage found"
else
    echo "   ⚠️  Found $XHR_CALLS XMLHttpRequest references"
fi

# Check for WebSocket usage
WS_CALLS=$(grep -r "WebSocket" --include="*.js" gitlab-public/ | wc -l)
if [ "$WS_CALLS" -eq 0 ]; then
    echo "   ✓ No WebSocket usage found"
else
    echo "   ⚠️  Found $WS_CALLS WebSocket references"
fi

# Check for external CDN references
echo
echo "🌐 Checking for CDN references..."
CDN_REFS=$(grep -r "cdn\." --include="*.js" --include="*.html" --include="*.css" gitlab-public/ | wc -l)
if [ "$CDN_REFS" -eq 0 ]; then
    echo "   ✓ No CDN references found"
else
    echo "   ⚠️  Found $CDN_REFS CDN references"
fi

# Check for font loading
echo
echo "🔤 Checking for external font loading..."
FONT_REFS=$(grep -r "@import\|@font-face" --include="*.css" gitlab-public/ | grep -i "http" | wc -l)
if [ "$FONT_REFS" -eq 0 ]; then
    echo "   ✓ No external font references found"
else
    echo "   ⚠️  Found $FONT_REFS external font references"
fi

# Check service worker for caching
echo
echo "⚙️  Checking service worker configuration..."
if [ -f "gitlab-public/coi-serviceworker.js" ]; then
    echo "   ✓ COI service worker present (enables SharedArrayBuffer)"
    SW_CACHE=$(grep -i "cache" gitlab-public/coi-serviceworker.js | wc -l)
    if [ "$SW_CACHE" -gt 0 ]; then
        echo "   ℹ️  Service worker has caching logic"
    fi
fi

# Check all assets are local
echo
echo "📦 Verifying all assets are bundled..."
TOTAL_JS=$(find gitlab-public -name "*.js" | wc -l)
TOTAL_CSS=$(find gitlab-public -name "*.css" | wc -l)
TOTAL_WASM=$(find gitlab-public -name "*.wasm" | wc -l)
echo "   JavaScript files: $TOTAL_JS"
echo "   CSS files: $TOTAL_CSS"
echo "   WASM files: $TOTAL_WASM"

# Final verdict
echo
echo "═══════════════════════════════════════════════════"
if [ "$NETWORK_CALLS" -eq 0 ] && [ "$XHR_CALLS" -eq 0 ] && [ "$WS_CALLS" -eq 0 ] && [ "$CDN_REFS" -eq 0 ] && [ "$FONT_REFS" -eq 0 ]; then
    echo "✅ VERDICT: Application is SAFE for offline use!"
    echo "   No external dependencies detected."
else
    echo "⚠️  VERDICT: Review needed for complete offline safety"
fi
echo "═══════════════════════════════════════════════════"