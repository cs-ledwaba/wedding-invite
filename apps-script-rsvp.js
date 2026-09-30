// =============================================================
// Google Apps Script — RSVP Data Collector
// 
// SETUP:
// 1. Create a Google Sheet called "RSVP Responses"
// 2. Go to Extensions > Apps Script
// 3. Paste this entire file, replacing any existing code
// 4. Click Deploy > New Deployment > Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Click Deploy, copy the URL
// 6. Paste the URL into rsvp-fikile.html as SCRIPT_URL
// =============================================================

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If the sheet is empty, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Phone Number',
        'Attendance',
        'Number of Guests',
        'Dietary Requirements',
        'Message',
        'Submitted At'
      ]);
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4a2a1e');
      headerRange.setFontColor('#f9e2d4');
      sheet.setFrozenRows(1);
    }
    
    // Append the RSVP data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.attendance || '',
      data.guests || '',
      data.dietary || '',
      data.message || '',
      new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })
    ]);
    
    // Auto-resize columns
    for (let i = 1; i <= 8; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'RSVP recorded' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Allow GET requests too (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP endpoint is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}