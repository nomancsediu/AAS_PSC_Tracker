// Contest Leaderboard Google Sheets API Configuration
const CONTEST_SHEETS_CONFIG = {
    API_KEY: 'AIzaSyCmNj76aPStTOApX_7eozOmtPlyv9wChck', // Your API key
    SPREADSHEET_ID: '1NV6qHGb3RwXOsHRusi6AeFcqWA95CNnqyVvYYP5npHE', // Your spreadsheet ID
    RANGE: 'Form Responses 1!A:D' // Timestamp, Username, Solved, Points
};

// ContestSheetsAPI Helper
class ContestSheetsAPI {

    // Fetch data from Google Sheets
    static async fetchFromSheets() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONTEST_SHEETS_CONFIG.SPREADSHEET_ID}/values/${CONTEST_SHEETS_CONFIG.RANGE}?key=${CONTEST_SHEETS_CONFIG.API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return this.processSheetData(data.values);
        } catch (error) {
            console.error('Error fetching contest data:', error);
            return [];
        }
    }

    // Process raw sheet data
    static processSheetData(values) {
        if (!values || values.length <= 1) return [];
        const rows = values.slice(1); // skip header
        const userMap = new Map();

        rows.forEach(row => {
            if (row.length < 3) return;
            const timestamp = row[0] || '';
            const username = row[1] || '';
            const solved = parseInt(row[2], 10) || 0;
            const points = row[3] ? parseInt(row[3], 10) : solved * 10; // Use provided points or calculate

            if (!username) return;

            // Keep only the latest submission per user
            if (!userMap.has(username) || new Date(timestamp) > new Date(userMap.get(username).timestamp)) {
                userMap.set(username, { username, solved, points, timestamp });
            }
        });

        return Array.from(userMap.values());
    }
}


