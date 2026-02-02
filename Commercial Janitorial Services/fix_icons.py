import os
import re

# Directory containing HTML files
base_dir = r"C:\Users\91879\OneDrive\Desktop\Website_Templates\Commercial Janitorial Services"

# Pattern to find and replace the theme toggle button
old_pattern = r'<button id="theme-toggle"[^>]*>\s*<i class="fa-solid fa-moon dark:hidden[^"]*"></i>\s*<i class="fa-solid fa-sun hidden dark:block[^"]*"></i>\s*</button>'

new_button = '''<button id="theme-toggle"
                    class="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white transition-all hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm text-xl">
                    <span id="theme-icon">🌙</span>
                </button>'''

# JavaScript to add at the end before </body>
js_code = '''    <script>
        // Update theme icon based on current theme  
        function updateThemeIcon() {
            const themeIcon = document.getElementById('theme-icon');
            const isDark = document.documentElement.classList.contains('dark');
            if (themeIcon) {
                themeIcon.textContent = isDark ? '☀️' : '🌙';
            }
        }
        // Update icon on page load
        if (document.getElementById('theme-icon')) {
            updateThemeIcon();
            // Update icon when theme changes
            const themeToggleBtn = document.getElementById('theme-toggle');
            if (themeToggleBtn) {
                const originalListener = themeToggleBtn.onclick;
                themeToggleBtn.addEventListener('click', () => {
                    setTimeout(updateThemeIcon, 50);
                });
            }
        }
    </script>
</body>'''

def fix_html_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has theme toggle
        if 'id="theme-toggle"' not in content:
            return False
            
        # Replace the theme toggle button
        content_modified = re.sub(old_pattern, new_button, content, flags=re.DOTALL)
        
        # Add JS if not already present and </body> exists
        if 'updateThemeIcon' not in content_modified and '</body>' in content_modified:
            content_modified = content_modified.replace('</body>', js_code)
        
        # Only write if changes were made
        if content_modified != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content_modified)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

# Process all HTML files in the directory and subdirectories
modified_files = []
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            if fix_html_file(filepath):
                modified_files.append(filepath)
                print(f"✓ Modified: {file}")

print(f"\n✅ Total files modified: {len(modified_files)}")
