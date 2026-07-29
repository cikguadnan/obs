const SHEET_NAME = 'Responses';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  if (action === 'list') {
    return jsonOutput({ success: true, data: getResponses() });
  }
  return jsonOutput({ success: false, message: 'Unknown action' });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');

    if (payload.action === 'submit') {
      const id = Utilities.getUuid();
      appendResponse({ ...payload, id, status: 'approved', favourite: false });
      return jsonOutput({ success: true, id });
    }

    if (payload.action === 'moderate') {
      updateModeration(payload.id, payload);
      return jsonOutput({ success: true });
    }

    return jsonOutput({ success: false, message: 'Unknown action' });
  } catch (err) {
    return jsonOutput({ success: false, message: err.message });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  const headers = [
    'id','timestamp','name','className','groupName','momentType',
    'experience','feelings','learning','doBetter','strength','feedback',
    'selfPerception','commitmentArea','commitment','iAm','iCan','iHave',
    'nextAction','consent','status','favourite'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,headers.length).setFontWeight('bold');
  }
  return sheet;
}

function appendResponse(data) {
  const sheet = getSheet();
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => data[h] === undefined ? '' : data[h]);
  sheet.appendRow(row);
}

function getResponses() {
  const sheet = getSheet();
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map(row => {
    const obj = {};
    headers.forEach((h,i) => obj[h] = row[i]);
    obj.favourite = String(obj.favourite).toLowerCase() === 'true';
    return obj;
  });
}

function updateModeration(id, changes) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf('id');
  if (idCol === -1) throw new Error('ID column missing');

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(id)) {
      ['status','favourite'].forEach(key => {
        if (changes[key] !== undefined) {
          const col = headers.indexOf(key);
          if (col !== -1) sheet.getRange(r+1,col+1).setValue(changes[key]);
        }
      });
      return;
    }
  }
  throw new Error('Response not found');
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
