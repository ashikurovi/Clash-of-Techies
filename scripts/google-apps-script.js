/**
 * Google Apps Script for CPI Timeline Ramadan Quiz 2026
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Google Sheets and create a new spreadsheet
 * 2. Name it "CPI Timeline Quiz 2026 Responses"
 * 3. Add headers in Row 1: Timestamp | Name | Roll | Answers | Score | Total Questions | Percentage
 * 4. Go to Extensions > Apps Script
 * 5. Delete any existing code and paste this entire script
 * 6. Save the project (give it a name like "Quiz Backend")
 * 7. Click "Deploy" > "New deployment"
 * 8. Select type: "Web app"
 * 9. Set "Execute as": "Me"
 * 10. Set "Who has access": "Anyone"
 * 11. Click "Deploy" and authorize the script
 * 12. Copy the Web App URL and add it to your .env.local file as NEXT_PUBLIC_GOOGLE_SCRIPT_URL
 */

// Replace this with your actual spreadsheet ID (found in the URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Responses';

/**
 * Handles POST requests from the quiz application
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Timestamp',
        'Name',
        'Roll',
        'Answers',
        'Score',
        'Total Questions',
        'Percentage'
      ]]);
      // Format headers
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    // Calculate percentage
    const percentage = ((data.score / data.totalQuestions) * 100).toFixed(2);
    
    // Prepare the row data
    const rowData = [
      data.submittedAt || new Date().toISOString(),
      data.name,
      data.roll,
      data.answers,
      data.score,
      data.totalQuestions,
      percentage + '%'
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Data saved successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok',
      message: 'CPI Timeline Quiz API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify the script works
 */
function testSaveData() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        roll: '12345',
        answers: '{"1":0,"2":1,"3":2}',
        score: 2,
        totalQuestions: 3,
        submittedAt: new Date().toISOString()
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}

/**
 * Setup function - run this once to create the initial sheet structure
 */
function setupSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  
  // Set up headers
  const headers = [
    'Timestamp',
    'Name', 
    'Roll',
    'Answers',
    'Score',
    'Total Questions',
    'Percentage'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#1a5f4a');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 200); // Timestamp
  sheet.setColumnWidth(2, 200); // Name
  sheet.setColumnWidth(3, 120); // Roll
  sheet.setColumnWidth(4, 300); // Answers
  sheet.setColumnWidth(5, 80);  // Score
  sheet.setColumnWidth(6, 120); // Total Questions
  sheet.setColumnWidth(7, 100); // Percentage
  
  Logger.log('Sheet setup complete!');
}
