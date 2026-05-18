const SPREADSHEET_ID = "1-4KAuUss3xglZeXEJxMI84cRPLAuTLnnx5OHNEMj3Bc";
const LOG_SHEET_NAME = "click_logs";
const HEADERS = [
  "timestamp",
  "school_id",
  "school_name",
  "official_url",
  "page_url",
  "user_agent",
  "received_at"
];

function doPost(e) {
  const data = parseRequestData(e);
  const sheet = getLogSheet();

  sheet.appendRow([
    data.timestamp || "",
    data.id || "",
    data.name || "",
    data.url || "",
    data.pageUrl || "",
    data.userAgent || "",
    new Date()
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "click logger is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseRequestData(e) {
  if (!e) return {};

  const body = e.postData && e.postData.contents ? e.postData.contents : "";
  if (body) {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }

  return e.parameter || {};
}

function getLogSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(LOG_SHEET_NAME) || spreadsheet.insertSheet(LOG_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}
