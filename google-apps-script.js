/**
 * Cypress Pup Co. lead capture endpoint for Google Sheets.
 *
 * Setup:
 * 1. Create a Google Sheet named "Cypress Pup Co Leads".
 * 2. In the Sheet: Extensions → Apps Script.
 * 3. Paste this file into Code.gs.
 * 4. Update NOTIFICATION_EMAIL and CALENDLY_URL if needed.
 * 5. Deploy → New deployment → Type: Web app.
 * 6. Execute as: Me. Who has access: Anyone.
 * 7. Copy the Web App URL and paste it into index.html as CONFIG.googleScriptUrl.
 */

const NOTIFICATION_EMAIL = 'mjmorrisonusa@gmail.com';
const CALENDLY_URL = 'https://calendly.com/mjmorrisonusa/free-meet-greet';
const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    const sheet = getOrCreateLeadSheet_();
    const data = parsePayload_(e);
    const receivedAt = new Date();

    sheet.appendRow([
      receivedAt,
      data.submittedAt || '',
      data.source || 'Cypress Pup Co. website',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.city || '',
      data.service || '',
      data.pets || '',
      'New',
      ''
    ]);

    sendOwnerNotification_(data);
    sendClientAutoReply_(data);

    return json_({ ok: true, message: 'Lead saved' });
  } catch (error) {
    return json_({ ok: false, message: error.toString() });
  }
}

function doGet() {
  return json_({ ok: true, message: 'Cypress Pup Co. lead endpoint is live' });
}

function getOrCreateLeadSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Received At',
      'Submitted At',
      'Source',
      'Name',
      'Phone',
      'Email',
      'City / Neighborhood',
      'Service',
      'Pet Details',
      'Status',
      'Notes'
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function parsePayload_(e) {
  if (!e) return {};

  // Website sends application/x-www-form-urlencoded, so e.parameter is easiest.
  if (e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }

  // Optional JSON support if you later post JSON from Make/Zapier/custom code.
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return {};
    }
  }

  return {};
}

function sendOwnerNotification_(data) {
  const subject = `New Cypress Pup Co. lead: ${data.name || 'Website inquiry'}`;
  const body = [
    'New meet-and-greet request from CypressPupCo.com',
    '',
    `Name: ${data.name || ''}`,
    `Phone: ${data.phone || ''}`,
    `Email: ${data.email || ''}`,
    `City / Neighborhood: ${data.city || ''}`,
    `Service: ${data.service || ''}`,
    '',
    'Pet details:',
    data.pets || '',
    '',
    `Calendly: ${CALENDLY_URL}`
  ].join('\n');

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function sendClientAutoReply_(data) {
  if (!data.email) return;

  const subject = 'Thanks for contacting Cypress Pup Co.';
  const body = [
    `Hi ${data.name || 'there'},`,
    '',
    'Thanks for reaching out to Cypress Pup Co. I received your meet-and-greet request and will review your pet care details shortly.',
    '',
    'If you have not already picked a time, you can use this link:',
    CALENDLY_URL,
    '',
    'You can also call or text me directly at 714-576-0150.',
    '',
    'Talk soon,',
    'Michael Morrison',
    'Cypress Pup Co.'
  ].join('\n');

  MailApp.sendEmail(data.email, subject, body, {
    replyTo: NOTIFICATION_EMAIL,
    name: 'Cypress Pup Co.'
  });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
