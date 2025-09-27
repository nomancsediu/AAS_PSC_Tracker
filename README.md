# Problem Solving Tracker

A comprehensive web application for tracking coding progress, contests, and problem-solving leaderboards.

## Features

- **Profile Section**: Track Codeforces profile data and statistics
- **Club Leaderboard**: View rankings of club members
- **Contests**: Track upcoming and past SPSC contests
- **Problem Solve Leaderboard**: New feature with Google Sheets integration

## Problem Solve Leaderboard Setup

The Problem Solve Leaderboard allows members to submit their problem-solving progress through a Google Form, with data automatically stored in Google Sheets and displayed on the website.

### Step 1: Create Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form with these fields:
   - **Name** (Short answer text)
   - **Problems Solved** (Number)
   - **Date** (Date - can be auto-filled)

### Step 2: Link Form to Google Sheets

1. In your Google Form, click on "Responses" tab
2. Click the Google Sheets icon to create a linked spreadsheet
3. This will automatically create a spreadsheet with your form responses

### Step 3: Get Google Sheets API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### Step 4: Get Spreadsheet ID

1. Open your linked Google Spreadsheet
2. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### Step 5: Get Form Field IDs

1. Open your Google Form
2. Right-click and "View Page Source"
3. Search for "entry." to find field IDs like:
   - `entry.123456789` (for name field)
   - `entry.987654321` (for problems field)

### Step 6: Configure the Application

1. Open `google-sheets-api.js`
2. Update the `GOOGLE_SHEETS_CONFIG` object:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'your_actual_api_key_here',
    SPREADSHEET_ID: 'your_spreadsheet_id_here',
    RANGE: 'Sheet1!A:E',
    FORM_URL: 'https://docs.google.com/forms/d/YOUR_FORM_ID/formResponse'
};
```

3. Update the form submission function with your field IDs:

```javascript
formData.append('entry.YOUR_NAME_FIELD_ID', name);
formData.append('entry.YOUR_PROBLEMS_FIELD_ID', problems);
```

### Step 7: Make Spreadsheet Public (Optional)

For public access without authentication:
1. Open your Google Spreadsheet
2. Click "Share" button
3. Change access to "Anyone with the link can view"

## Features of Problem Solve Leaderboard

### 🏆 Rank Badges
- **🥇 Gold**: Top solver
- **🥈 Silver**: Second place
- **🥉 Bronze**: Third place

### 🔥 Streak Recognition
- **Streak Solver Badge**: Awarded to anyone who solves problems for 3+ consecutive days
- Streak counter displayed for each participant

### 📊 Real-time Updates
- Data automatically synced with Google Sheets
- Refresh button to get latest data
- Top 3 winners displayed prominently

## File Structure

```
Problem Solving Tracker/
├── index.html              # Main application file
├── google-sheets-api.js     # Google Sheets integration
├── README.md               # This file
└── pictures/               # Images and icons
    └── Codeforces.colored.svg
```

## Usage

1. Open `index.html` in a web browser
2. Navigate to "Problem Board" section
3. Submit your name and number of problems solved
4. View the leaderboard with rankings and badges
5. Data is automatically stored in Google Sheets

## Troubleshooting

### Common Issues

1. **CORS Error**: Google Forms submissions use `no-cors` mode
2. **API Key Issues**: Ensure the API key has proper permissions
3. **Spreadsheet Access**: Make sure the spreadsheet is publicly readable

### Testing

- Use the sample data that loads by default
- Test form submission with the browser's developer console
- Verify Google Sheets API responses

## Contributing

Feel free to contribute by:
- Adding new features
- Improving the UI/UX
- Fixing bugs
- Enhancing Google Sheets integration

## License

This project is open source and available under the MIT License.