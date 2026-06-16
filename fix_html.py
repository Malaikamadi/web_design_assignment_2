import glob

files = glob.glob('*.html')
for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace the exact inline style string
    target = 'class="nav-actions" style="display: flex; gap: 1rem; align-items: center;"'
    replacement = 'class="nav-actions"'
    content = content.replace(target, replacement)
    
    with open(file, 'w') as f:
        f.write(content)
print("HTML files updated")
