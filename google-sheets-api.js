// Google Sheets API Configuration
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'AIzaSyDlx6gjlP4oHxrbt0Km0vI9xhh5QMWAgcM', // Your API key
    SPREADSHEET_ID: '1M9CvQzKSGqni0inJz6YiqQ0G2CrM4tNO7_hDz207upg', // Your spreadsheet ID
    RANGE: 'Form Responses 1!A:E' // Timestamp, Name, Problems, Streak, LastSubmission
};

// Google Sheets API Helper Functions
class GoogleSheetsAPI {

    // Fetch data from Google Sheets
    static async fetchFromSheets() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return this.processSheetData(data.values);
        } catch (error) {
            console.error('Error fetching from Google Sheets:', error);
            throw error;
        }
    }
    
    // Process raw sheet data into usable format
    static processSheetData(values) {
        if (!values || values.length <= 1) return [];

        const rows = values.slice(1); // Skip header row
        const userSubmissions = new Map();

        // Collect all submissions for each user
        rows.forEach(row => {
            if (row.length < 3) return;
            
            const timestamp = row[0] || '';
            const name = row[1] || '';
            const problems = parseInt(row[2]) || 0;
            
            if (!name) return;

            if (!userSubmissions.has(name)) {
                userSubmissions.set(name, []);
            }
            userSubmissions.get(name).push({ timestamp, problems });
        });

        // Process each user's submissions
        const result = [];
        userSubmissions.forEach((submissions, name) => {
            // Get maximum problems count (since Google Apps Script updates all rows with cumulative total)
            const maxProblems = Math.max(...submissions.map(s => s.problems));
            
            // Sort by timestamp (latest first)
            submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const latest = submissions[0];
            const streak = this.calculateUserStreak(submissions);
            
            result.push({
                name: name,
                problems: maxProblems, // Use maximum cumulative total
                timestamp: latest.timestamp,
                lastSubmission: latest.timestamp.split(' ')[0],
                streak: streak
            });
        });

        return result;
    }

    // Calculate streak for a user based on their submission timestamps
    static calculateUserStreak(submissions) {
        if (!submissions || submissions.length === 0) return 0;

        // Get unique dates from timestamps
        const dates = [...new Set(submissions.map(s => s.timestamp.split(' ')[0]))]
            .sort((a, b) => new Date(b) - new Date(a));

        if (dates.length === 0) return 0;

        let streak = 1;
        const today = new Date();
        const latestDate = new Date(dates[0]);
        
        // Check if latest submission is within last 2 days
        const daysSinceLatest = Math.floor((today - latestDate) / (1000 * 60 * 60 * 24));
        if (daysSinceLatest > 2) return 0;

        // Count consecutive days
        for (let i = 1; i < dates.length; i++) {
            const currentDate = new Date(dates[i-1]);
            const prevDate = new Date(dates[i]);
            const dayDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (dayDiff === 1) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    // Update a user's problems directly in the Sheet (optional)
    // Note: Sheets API v4 requires OAuth for write operations. API key is read-only.
}

// Setup Instructions
const SETUP_INSTRUCTIONS = `
To set up Google Sheets integration (Read-only leaderboard):

1. Use your existing Google Sheet that collects submissions.

2. Get your Google Sheets API key:
   - Go to Google Cloud Console
   - Enable Google Sheets API
   - Create credentials (API key)

3. Get your Spreadsheet ID from the URL:
   - https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit

4. Update the GOOGLE_SHEETS_CONFIG object with your API key, Spreadsheet ID, and Sheet Range

5. Make the spreadsheet publicly readable ("Anyone with link can view") for read-only access

6. Use GoogleSheetsAPI.fetchFromSheets() to get leaderboard data
`;

console.log(SETUP_INSTRUCTIONS);
