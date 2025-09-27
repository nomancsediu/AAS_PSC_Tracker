// Contest Links Google Sheets API Configuration
const CONTESTS_SHEETS_CONFIG = {
    API_KEY: 'AIzaSyC3PTpXmL6mJk2QVIu-4zfQJhhBPRHmIws', // Your API key
    SPREADSHEET_ID: '12YPZRPdx2ex9nva5TTWqhMZaEq_amkycpl3nNC2sWB4', // Your spreadsheet ID
    RANGE: 'Form Responses 1!A:F' // Timestamp, Name, Date, StartTime, EndTime, Link
};

// Contest Links Google Sheets API Helper Functions
class ContestsSheetsAPI {

    // Fetch data from Google Sheets
    static async fetchFromSheets() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONTESTS_SHEETS_CONFIG.SPREADSHEET_ID}/values/${CONTESTS_SHEETS_CONFIG.RANGE}?key=${CONTESTS_SHEETS_CONFIG.API_KEY}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            return this.processSheetData(data.values);
        } catch (error) {
            console.error('Error fetching Contests data from Google Sheets:', error);
            throw error;
        }
    }
    
    // Process raw sheet data into usable format
    static processSheetData(values) {
        if (!values || values.length <= 1) return { upcoming: [], past: [] };

        const rows = values.slice(1); // Skip header row
        const upcoming = [];
        const past = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today for date-only comparison

        rows.forEach(row => {
            if (row.length < 3) return;
            
            const timestamp = row[0] || '';
            const name = row[1] || '';
            const date = row[2] || '';
            const startTime = row[3] || '';
            const endTime = row[4] || '';
            const link = row[5] || '';
            
            if (!name || !date) return;

            const contest = {
                name: name,
                date: date,
                startTime: startTime,
                endTime: endTime,
                link: link
            };

            // Parse contest date from the date field
            let contestDate;
            
            // Handle DD/MM/YYYY format first
            if (date.includes('/')) {
                const parts = date.split('/');
                if (parts.length === 3) {
                    // DD/MM/YYYY format
                    contestDate = new Date(parts[2], parts[1] - 1, parts[0]);
                }
            } else {
                // Try other formats
                contestDate = new Date(date);
                if (isNaN(contestDate.getTime())) {
                    const dateStr = date.replace(/,/g, '').replace(/\s+/g, ' ');
                    contestDate = new Date(dateStr);
                }
            }
            
            // Set contest date to start of day for comparison
            if (!isNaN(contestDate.getTime())) {
                contestDate.setHours(0, 0, 0, 0);
            }

            // Compare dates only (if contest date is before today, it's past)
            if (!isNaN(contestDate.getTime()) && contestDate < today) {
                past.push(contest);
            } else {
                upcoming.push(contest);
            }
        });

        return { upcoming, past };
    }
}

// Setup Instructions for Contest Links
const CONTESTS_SETUP_INSTRUCTIONS = `
To set up Contest Links Google Sheets integration:

1. Create a Google Form with fields:
   - Contest Name (Short answer)
   - Date (Short answer - e.g., "18/09/2025", "Thursday, 18 Sep 2025" or "2025-09-18")
   - Start Time (Short answer - e.g., "9:00 PM")
   - End Time (Short answer - e.g., "11:00 PM")
   - Link (URL)
   - Timestamp (auto-filled)

2. Link the form to a Google Spreadsheet

3. Get your Google Sheets API key:
   - Go to Google Cloud Console
   - Enable Google Sheets API
   - Create credentials (API key)

4. Get your Spreadsheet ID from the URL:
   - https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit

5. Update the CONTESTS_SHEETS_CONFIG object with your values

6. Make the spreadsheet publicly readable ("Anyone with link can view")
`;

console.log(CONTESTS_SETUP_INSTRUCTIONS);