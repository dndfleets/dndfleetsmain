# Troubleshooting "Error Loading Webview"

## Quick Fixes

### 1. Restart the Dev Server
```powershell
# Stop the server (Ctrl+C) and restart
cd dnd-fleets-luxury-drive-main
npm run dev
```

### 2. Clear Browser Cache
- **Chrome/Edge**: Press `Ctrl + Shift + Delete`, select "Cached images and files", click "Clear data"
- **Or**: Hard refresh with `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### 3. Check if Port 8080 is Available
```powershell
# Check if port 8080 is in use
netstat -ano | findstr :8080
```

If port is in use, either:
- Stop the process using that port
- Or change the port in `vite.config.ts`:
  ```typescript
  server: {
    host: "::",
    port: 3000, // Change to another port
  },
  ```

### 4. Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Share the error message if you see one

### 5. Verify Node Modules
```powershell
cd dnd-fleets-luxury-drive-main
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### 6. Check .env File
Make sure `.env` file exists in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 7. Try Different Browser
Sometimes browser extensions or settings can cause issues. Try:
- Incognito/Private mode
- Different browser (Chrome, Firefox, Edge)

### 8. Check for JavaScript Errors
Open browser console (F12) and look for:
- Import errors
- Module not found errors
- Syntax errors

## Common Issues

### Issue: "Cannot find module"
**Solution**: Run `npm install` to ensure all dependencies are installed

### Issue: "Port already in use"
**Solution**: Change port in `vite.config.ts` or kill the process using port 8080

### Issue: "Failed to fetch"
**Solution**: 
- Check if dev server is running
- Verify the URL is correct (should be `http://localhost:8080`)
- Check firewall/antivirus settings

### Issue: Blank page
**Solution**:
- Check browser console for errors
- Verify `.env` file exists and has correct values
- Check if Supabase client is properly configured

## Still Having Issues?

1. Check the terminal where `npm run dev` is running for error messages
2. Share the exact error message from:
   - Browser console (F12 → Console tab)
   - Terminal output
   - Network tab (F12 → Network tab)



