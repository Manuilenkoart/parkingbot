const { findPaymentAndUpdate } = require("../../bot/mongodb/mongoAction");
const FormData = require("form-data");
const { token } = require("../../config");
const fetch = require("node-fetch");

let ChatidAndUserId = {};
const getChatidAndUserId = (
  chatId,
  messageId,
  beneficiaryName,
  fine,
  bill,
  OKPO,
  fineAmount
) => {
  ChatidAndUserId = {
    chat: chatId,
    message: messageId,
    beneficiary: beneficiaryName,
    userFine: fine,
    userBill: bill,
    userOKPO: OKPO,
    userFineAmount: fineAmount,
  };
};
const getstatusbillController = async (req, res) => {
  let orderStatus;

  switch (req.body.transactionStatus) {
    case "Approved":
      orderStatus = `<b>Платiж сплачено </b> ✅\n
Отримувач: <b>${ChatidAndUserId.beneficiary} </b>
IBAN: <b>${ChatidAndUserId.userBill} </b>
Серія та номер протоколу: <b>${ChatidAndUserId.userFine}</b>
Сума: <b>${ChatidAndUserId.userFineAmount} грн </b>`;
      break;
    case "Expired":
      orderStatus = `<b>Вичерпано час дії платежу, повторіть знову </b> 🔄\n`;
      break;
    case "Declined":
      orderStatus = `<b>Платiж відхилено </b> ❌\n`;
      break;
  }

  const form = new FormData();
  form.append("chat_id", `${ChatidAndUserId.chat}`);
  form.append("message_id", `${ChatidAndUserId.message}`);
  form.append("text", `${orderStatus}`);
  form.append("parse_mode", "HTML");

  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: "POST",
    body: form,
  })
    .then((data) => {
      if (data.status === 200) {
        res.status(200).send("ok");
      }
    })
    .catch((err) => res.send(err));

  await findPaymentAndUpdate(
    { countId: req.body.orderReference },
    { transactionStatus: req.body.transactionStatus }
  );
  res.status(200);
};

module.exports = {
  getstatusbillController,
  getChatidAndUserId,
};
