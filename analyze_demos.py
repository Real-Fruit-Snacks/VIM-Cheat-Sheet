import re

with open('/home/user/Projects/VIM/src/data/vim-demos.ts', 'r') as f:
    content = f.read()

# All demo IDs
all_demos = [
    'refactor-function', 'comment-block', 'markdown-formatting', 'csv-cleanup',
    'code-navigation', 'text-objects', 'basic-line-editing', 'word-operations',
    'quick-navigation', 'email-composition', 'log-analysis', 'table-formatting',
    'config-editing', 'macro-automation', 'multi-buffer-workflow', 'regex-mastery',
    'search-and-count', 'json-formatting', 'git-conflict-resolution', 'column-editing',
    'file-comparison', 'quick-fixes', 'paragraph-manipulation', 'number-manipulation',
    'advanced-regex-substitution', 'spell-check-workflow', 'buffer-navigation',
    'quick-macro-recording', 'session-management', 'smart-abbreviations'
]

demos_needing_update = []

print("Analyzing all 30 demos...")
print("=" * 70)

for demo_id in all_demos:
    # Find the demo section - look for this demo ID and capture until the next demo ID or end
    pattern = r"id: '" + demo_id + r"'.*?(?=\n  \{[\s]*id: ' < /dev/null | $)"
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        demo_content = match.group(0)
        
        # Find all command/mode pairs
        commands = re.findall(r"command: '([^']+)'", demo_content)
        after_modes = re.findall(r"after: \{[^}]*?mode: '([^']+)'", demo_content)
        
        if commands and after_modes:
            last_command = commands[-1]
            last_mode = after_modes[-1]
            needs_esc = last_mode \!= 'normal'
            
            if needs_esc:
                demos_needing_update.append({
                    'id': demo_id,
                    'last_command': last_command,
                    'last_mode': last_mode
                })
            
            status = "✗ NEEDS ESC" if needs_esc else "✓ OK"
            print(f"{demo_id:30} | Mode: {last_mode:10} | Cmd: {last_command:30} | {status}")

print("\n" + "=" * 70)
print(f"\nTotal demos: 30")
print(f"Demos ending in normal mode: {30 - len(demos_needing_update)}")
print(f"Demos needing ESC: {len(demos_needing_update)}")

if demos_needing_update:
    print("\nDemos that need to be updated to end with ESC:")
    print("-" * 50)
    for demo in demos_needing_update:
        print(f"  - {demo['id']}")
        print(f"    Last command: {demo['last_command']}")
        print(f"    Last mode: {demo['last_mode']}")
        print()
