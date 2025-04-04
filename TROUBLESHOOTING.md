# GeoGuessr Clone - Troubleshooting Guide

## Common Issues and Solutions

### Port 1234 is Already in Use

**Problem:** When running `start.bat`, you get an error that port 1234 is already in use.

**Solutions:**
1. Try using an alternative port by selecting options 3 or 4 in the start.bat menu
2. Use option 6 in start.bat to run diagnostics and check which ports are available
3. Use option 5 in start.bat to clear the cache and restart the application
4. If you know which application is using the port, close it before starting again
5. Use option 2 in the port conflict menu to automatically terminate the process using the port

### Street View Not Loading

**Problem:** The game shows "Loading street view..." but never actually displays the street view.

**Solutions:**
1. Click the "Retry Loading" button that appears on the loading screen
2. Open the test-mapillary.html file directly in your browser to check if Mapillary works
3. Check the console for errors (press F12 in your browser and go to the Console tab)
4. Make sure you have a stable internet connection
5. Try a different port using options 3 or 4 in the start.bat menu
6. Clear your browser cache and try again
7. Make sure you're using a modern browser (Chrome works best with Mapillary)
8. If you see any CORS errors, try using Chrome with Web Security disabled (advanced users only)
9. Check if your network blocks access to Mapillary APIs (common in some corporate or school networks)

### Mapillary Specific Issues

**Problem:** Issues related specifically to the Mapillary viewer or API.

**Solutions:**
1. Check if Mapillary.js script is loading correctly in the Network tab of developer tools
2. Try opening test-mapillary.html to test Mapillary independently of the main application
3. If the test page works but the main app doesn't, clear cache using option 5 in start.bat
4. If you see "Mapillary viewer error" in the console, the API token might be invalid or expired
5. Some ad blockers or privacy tools can block Mapillary - try disabling them temporarily
6. If the Mapillary container has zero height/width in the console, refresh the page

### Map is Not Positioned Correctly

**Problem:** The guessing map is not in the bottom-right corner.

**Solution:**
1. Make sure your browser window is wide enough
2. Try zooming out (Ctrl + -) if the map overlaps other elements
3. Clear your browser cache and reload
4. Check if responsive mode is enabled in your browser's developer tools

### Blank Screen

**Problem:** The page is completely blank.

**Solutions:**
1. Check if your browser has JavaScript enabled
2. Try a different browser
3. Check the browser console for errors (F12)
4. Make sure all dependencies are installed (select option 1 in start.bat)
5. Run the diagnostics (option 6 in start.bat) to check for missing files
6. Check if your browser is up to date

### No Markers on the Map

**Problem:** You can't see the marker when you click on the map.

**Solutions:**
1. Make sure you've clicked on the map to place a marker
2. Try a different browser
3. Clear your browser cache
4. Check if any browser extensions might be blocking content
5. Look for errors about marker icons in the console

## Advanced Troubleshooting

### Running Diagnostics

1. Select option 6 in the start.bat menu
2. The diagnostics will check:
   - Node.js and npm installation
   - Required files
   - Network connectivity to CDN and Mapillary
   - Available ports
3. You can also test Mapillary directly with the test-mapillary.html page

### Clearing Cache

If you experience issues after updating:

1. Select option 5 in the start.bat menu
2. This will clear the Parcel cache and dist directories
3. You can also choose to remove node_modules and reinstall dependencies

### Check for Parcel Issues

If you're familiar with command line tools, you can try:

```
npx parcel serve index.html --port 8080 --no-cache
```

### Check JavaScript Console

1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Look for red error messages
4. Common errors to look for:
   - "Failed to load resource: net::ERR_CONNECTION_REFUSED" - indicates port or server issues
   - "Access to fetch at 'https://graph.mapillary.com/..." - indicates CORS issues
   - "Uncaught TypeError: Cannot read properties of undefined" - usually relates to Mapillary initialization

### Check Network Requests

1. Open your browser's developer tools (F12)
2. Go to the Network tab
3. Reload the page and look for failed requests (in red)
4. Pay attention to:
   - mapillary.min.js and mapillary.min.css - should load successfully
   - Requests to graph.mapillary.com - should return 200 OK status
   - Look for 401 Unauthorized errors which indicate API token issues

### Testing with Web Security Disabled (Chrome)

**Warning: Only do this temporarily for testing purposes!**

If you suspect CORS issues, you can launch Chrome with web security disabled:

**Windows:**
1. Close all Chrome windows
2. Open Command Prompt 
3. Run: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="%TEMP%\chrome_dev_session"`

**Mac:**
1. Close all Chrome windows
2. Open Terminal
3. Run: `open -a "Google Chrome" --args --disable-web-security --user-data-dir=/tmp/chrome_dev_session`

### Using Developer Mode in the App

1. Open the browser console (F12)
2. Type `window.debugMode = true` and press Enter
3. Refresh the page
4. This will enable additional logging that may help diagnose issues

## Alternative Solutions

If you continue to have issues with the Mapillary integration:

1. Try the test-mapillary.html page to isolate whether the issue is with Mapillary or the main application
2. Consider using the static-version.html which works without external API dependencies
3. Check our GitHub Issues page to see if others have reported similar problems 