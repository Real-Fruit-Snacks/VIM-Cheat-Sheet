#!/bin/bash

# Generate SHA256 checksums for all files in gitlab-public
echo "🔒 Generating checksums for file integrity verification..."

# Change to script directory
cd "$(dirname "$0")"

# Generate checksums for gitlab-public
if [ -d "gitlab-public" ]; then
    echo "# SHA256 checksums for VIM.io gitlab-public files" > checksums.txt
    echo "# Generated on $(date)" >> checksums.txt
    echo "" >> checksums.txt
    
    # Find all files and generate checksums
    cd gitlab-public
    find . -type f | sort | while read -r file; do
        # Skip the checksums file itself
        if [ "$file" != "./checksums.txt" ]; then
            sha256sum "$file" >> ../checksums.txt
        fi
    done
    cd ..
    
    echo "✅ Checksums generated in checksums.txt"
    echo "   Total files: $(grep -c "^[^#]" checksums.txt)"
    echo ""
    echo "To verify integrity later:"
    echo "   cd gitlab-public && sha256sum -c ../checksums.txt"
else
    echo "❌ Error: gitlab-public directory not found!"
    echo "   Run ./build-for-gitlab.sh first"
    exit 1
fi