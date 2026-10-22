/**
 * Google Apps Script for Clash of Techies 2026
 * Organized by Polytechnic Coders x CPI Timeline
 * 
 * SETUP INSTRUCTIONS (সেটআপ নির্দেশিকা):
 * 1. আপনার Google Drive-এ যান এবং নতুন একটি Google Sheet তৈরি করুন।
 * 2. শিটটির নাম দিন "Clash of Techies 2026 Responses"
 * 3. উপরে মেনু থেকে Extensions > Apps Script-এ ক্লিক করুন।
 * 4. আগের কোড মুছে দিয়ে নিচের পুরো কোডটি পেস্ট করুন।
 * 5. Ctrl+S বা Save বাটনে ক্লিক করুন।
 * 6. উপরে নীল Deploy বাটনে ক্লিক করুন > "New deployment" সিলেক্ট করুন।
 * 7. বাঁদিকের গিয়ার আইকন থেকে সিলেক্ট করুন "Web app"।
 * 8. "Description": দিন "Clash of Techies API"
 * 9. "Execute as": "Me (<your-email>)"
 * 10. "Who has access": অবশ্যই "Anyone" সিলেক্ট করবেন!
 * 11. "Deploy" বাটনে ক্লিক করুন এবং পারমিশন চাইলে "Authorize access" দিয়ে "Allow" করুন।
 * 12. ডিপ্লয় শেষে যে Web App URL পাবেন (যা https://script.google.com/macros/s/.../exec দিয়ে শেষ হয়) সেটি কপি করে আপনার প্রজেক্টের `lib/quiz-data.ts` ফাইলে `googleScriptUrl`-এ বসিয়ে দিন।
 */

const SHEET_NAME = 'Responses';

/**
 * Handles POST requests from the quiz application
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet and header row if not exists
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      const headers = [
        'Timestamp',
        'Name',
        'Roll',
        'Department / Institute',
        'Score',
        'Total Questions',
        'Percentage',
        'Answers'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#7c3aed'); // Purple
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Duplicate Check: একজন প্রতিযোগী কেবল একবারই সাবমিট করতে পারবেন
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Column 3 (C) contains the participant Roll number
      const existingRolls = sheet.getRange(2, 3, lastRow - 1, 1).getValues().flat().map(function(r) {
        return String(r).trim().toLowerCase();
      });
      const incomingRoll = String(data.roll || '').trim().toLowerCase();
      
      if (incomingRoll && existingRolls.indexOf(incomingRoll) !== -1) {
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: false, 
            duplicate: true, 
            message: 'Duplicate submission rejected: This roll has already submitted.' 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Calculate percentage
    const percentage = ((data.score / data.totalQuestions) * 100).toFixed(1) + '%';
    
    // Prepare row data
    const rowData = [
      data.submittedAt || new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
      data.name,
      data.roll,
      data.dept || 'N/A',
      data.score,
      data.totalQuestions,
      percentage,
      data.answers
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Clash of Techies response recorded successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests (for testing browser ping)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok',
      message: 'Clash of Techies 2026 Quiz API is active',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * টেস্ট ফাংশন: Apps Script এডিটরে এটি রান করে সরাসরি গুগল শিটে ডাটা আসছে কিনা দেখতে পারেন
 */
function testSaveData() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: 'রাফসান আহমেদ',
        roll: '589124',
        dept: 'CPI - Computer',
        answers: '{"1":2,"2":0}',
        score: 28,
        totalQuestions: 30,
        submittedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
      })
    }
  };
  const result = doPost(testData);
  Logger.log(result.getContent());
}
