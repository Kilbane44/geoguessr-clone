# GeoGuessr Clone - Installation Guide

## Prerequisites
To run this application, you need:
- Node.js installed on your computer (download from [nodejs.org](https://nodejs.org/))

## Option 1: Using the start.bat file (Recommended)

1. Make sure Node.js is installed on your computer
2. Double-click on the `start.bat` file in this directory
3. Select option 1 to install dependencies
4. After dependencies are installed, select option 2 to start the application
5. The application should open in your default browser at http://localhost:1234

## Option 2: Manual installation and startup

If the `start.bat` file doesn't work for you, follow these steps:

1. Open Command Prompt (or PowerShell)
2. Navigate to this directory:
   ```
   cd "path\to\GeoGuessr"
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npx parcel index.html
   ```
5. Open http://localhost:1234 in your browser

## Troubleshooting

### "npm is not recognized as an internal or external command"

This error means Node.js is not installed or not properly added to your PATH.

1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. During installation, check the option to add Node.js to your PATH
3. Close and reopen Command Prompt
4. Try running the commands again

### "Library targets are not supported in serve mode"

This error has been fixed in the latest version by removing the "main" field from package.json. If you're still seeing it:

1. Open package.json in a text editor
2. Remove the line that contains `"main": "index.js",`
3. Save the file and try again

### Browser shows a blank page

1. Check the console in your browser's developer tools (F12)
2. If you see CORS errors, make sure you're not opening the HTML file directly
3. Always use a server (like Parcel) to serve the application

### If all else fails

If you're still having trouble, you can:

1. Open the `simple-version.html` file directly in your browser
2. Follow the instructions on that page
3. Try using the Web Server for Chrome extension as described

## Contact

If you're still having issues, please contact the developer for assistance. 