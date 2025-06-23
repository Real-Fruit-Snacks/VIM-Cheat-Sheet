import re

# Read the file
with open('/home/user/Projects/VIM/src/data/vim-demos.ts', 'r') as f:
    content = f.read()

# Find all demos
demos = re.findall(r"id: '([^']+)'.*?steps: \[(.*?)\n  \]", content, re.DOTALL)

results = []

for demo_id, steps_content in demos:
    # Find all afterState mode values in this demo
    after_modes = re.findall(r"after: \{[^}]*?mode: '([^']+)'", steps_content)
    
    if after_modes:
        last_mode = after_modes[-1]
        
        # Check if the last step contains <Esc> command
        steps = re.findall(r"command: '([^']+)'", steps_content)
        last_command = steps[-1] if steps else ""
        
        results.append({
            'demo_id': demo_id,
            'last_mode': last_mode,
            'last_command': last_command,
            'needs_update': last_mode \!= 'normal' and last_command \!= '<Esc>'
        })

# Print results
print(f"Total demos analyzed: {len(results)}")
print("\nDemos that DON'T end in normal mode:")
print("=" * 60)

for result in results:
    if result['needs_update']:
        print(f"Demo: {result['demo_id']}")
        print(f"  Last mode: {result['last_mode']}")
        print(f"  Last command: {result['last_command']}")
        print()

print("\nSummary of all demos:")
print("=" * 60)
for result in results:
    status = "✓ OK" if result['last_mode'] == 'normal' else "✗ Needs ESC"
    print(f"{result['demo_id']:30}  < /dev/null |  Mode: {result['last_mode']:10} | {status}")

