const {
  spreadsheetId,
  clientEmail,
  googleSheetPrivateKey,
} = require("../config");
const { GoogleSpreadsheet } = require("google-spreadsheet");

async function writeData({ _id, user, userName, city, price, date, countId }) {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  await doc.useServiceAccountAuth({
    client_email: clientEmail,
    private_key: googleSheetPrivateKey,
  });
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0]; // номер листа
  const moreRows = await sheet.addRows([
    {
      user: user,
      userName: userName,
      city: city,
      price: price,
      date: date,
      countId: countId,
    },
  ]);
}
module.exports = { writeData };
