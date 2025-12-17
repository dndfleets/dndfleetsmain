# GitHub Repository Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `dnd-fleets-luxury-drive`)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/dnd-fleets-luxury-drive.git`)

## Step 2: Link Your Local Repository to GitHub

Run these commands in the project directory:

```bash
cd dnd-fleets-luxury-drive-main

# Add the remote repository (replace with your GitHub URL)
git remote add origin https://github.com/yourusername/dnd-fleets-luxury-drive.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: If you already have a GitHub repository

If you already created a GitHub repository, just replace the URL in the `git remote add origin` command above with your repository URL.

## Troubleshooting

If you get authentication errors:
- Use a Personal Access Token instead of password
- Or use SSH: `git remote add origin git@github.com:yourusername/dnd-fleets-luxury-drive.git`

