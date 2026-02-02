import os

# Base path
base_path = r"c:\Users\91879\OneDrive\Desktop\Website_Templates\Commercial Janitorial Services"

# Admin files
admin_dir = os.path.join(base_path, "admin")
admin_files = [
    "index.html", "inventory.html", "orders.html", 
    "reports.html", "schedule.html", "settings.html"
]

# Client files
client_dir = os.path.join(base_path, "client")
client_files = [
    "index.html", "billing.html", "profile.html", 
    "services.html", "support.html"
]

# Replacements for Admin (target: absolute paths)
admin_replacements = {
    'href="index.html"': 'href="/admin/index.html"',
    'href="orders.html"': 'href="/admin/orders.html"',
    'href="schedule.html"': 'href="/admin/schedule.html"',
    'href="inventory.html"': 'href="/admin/inventory.html"',
    'href="reports.html"': 'href="/admin/reports.html"',
    'href="settings.html"': 'href="/admin/settings.html"',
    'href="../index.html"': 'href="/index.html"',
    'href="../login.html"': 'href="/login.html"',
    'href="../assets/': 'href="/assets/',  # Fix asset links too if they are strictly relative
    'src="../assets/': 'src="/assets/'     # Fix scripts/images
}
# Note: ../assets works from /admin/x.html to /assets. 
# But if we use root relative /admin/x.html, ../assets might imply we are looking from the FILE location.
# Browsers resolve relative to the URL.
# If URL is localhost:3000/admin/index.html, ../assets resolves to localhost:3000/assets.
# If URL is localhost:3000/admin (no slash), ../assets resolves to localhost:3000/../assets -> localhost:3000/assets (Wait. localhost:3000 IS root. ../ goes nowhere higher).
# Actually localhost:3000/admin -> parent is localhost:3000/.
# So ../assets works for both cases usually?
# No. localhost:3000/admin (no slash). Browser thinks we are at "admin" file in root.
# So "admin" is a sibling of "assets".
# So ../assets would go to parent of root -> impossible/root.
# So ../assets FAILS if URL is localhost:3000/admin.
# It MUST be /assets/ to be safe.
# So I will replace ../assets/ with /assets/ as well.

# Replacements for Client
client_replacements = {
    'href="index.html"': 'href="/client/index.html"',
    'href="services.html"': 'href="/client/services.html"',
    'href="billing.html"': 'href="/client/billing.html"',
    'href="support.html"': 'href="/client/support.html"',
    'href="profile.html"': 'href="/client/profile.html"',
    'href="../index.html"': 'href="/index.html"',
    'href="../login.html"': 'href="/login.html"',
    'href="../assets/': 'href="/assets/',
    'src="../assets/': 'src="/assets/'
}

def process_files(directory, files, replacements):
    for filename in files:
        filepath = os.path.join(directory, filename)
        if not os.path.exists(filepath):
            print(f"Skipping {filepath} (Not found)")
            continue
            
        print(f"Processing {filepath}...")
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
            else:
                print(f"No changes for {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    print("Starting Admin updates...")
    process_files(admin_dir, admin_files, admin_replacements)
    print("Starting Client updates...")
    process_files(client_dir, client_files, client_replacements)
