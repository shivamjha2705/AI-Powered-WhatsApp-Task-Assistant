const axios = require('axios');

class SheetService {
    async fetchData() {
        try {
            const sheetId = process.env.GOOGLE_SHEET_ID;
            if (!sheetId || sheetId === 'your_spreadsheet_id_here') {
                console.warn("⚠️ GOOGLE_SHEET_ID is not configured in .env");
                return [];
            }

            // Using Google Visualization API to get the sheet as JSON (Free, no API key needed)
            // Note: The Google Sheet MUST be shared as "Anyone with the link can view"
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

            console.log("Fetching data from Google Sheet...");
            const response = await axios.get(url);

            // The response is a plain text file containing a JS callback wrapper.
            // We extract the valid JSON part text between the first '{' and last '}'
            const text = response.data;
            const startPoint = text.indexOf('{');
            const endPoint = text.lastIndexOf('}');

            if (startPoint === -1 || endPoint === -1) {
                throw new Error("Invalid response format from Google Sheets");
            }

            const jsonString = text.slice(startPoint, endPoint + 1);
            const data = JSON.parse(jsonString);

            return this.formatSheetData(data.table);
        } catch (error) {
            console.error("❌ Error fetching Google Sheet data:", error.message);
            return [];
        }
    }

    formatSheetData(table) {
        // Map headers to consistent keys based on their string labels
        const headers = table.cols.map(col => {
            if (!col || !col.label) return 'unknown';
            const label = col.label.toLowerCase().trim();
            if (label.includes('task name') || label === 'task') return 'task';
            if (label.includes('assigned to') || label === 'assignee') return 'assignedTo';
            if (label.includes('status')) return 'status';
            if (label.includes('priority')) return 'priority';
            if (label.includes('given by')) return 'givenBy';
            if (label.includes('date')) return 'date';
            return label.replace(/\s+/g, ''); // Fallback
        });

        // Map the rows to objects using the headers
        return table.rows.map(row => {
            const rowData = {};
            row.c.forEach((cell, index) => {
                // If cell is not null, get the formatted value ('f') or raw value ('v')
                rowData[headers[index]] = cell ? (cell.f || cell.v || null) : null;
            });
            return rowData;
        });
    }
}

module.exports = new SheetService();
