const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
const moment = require("moment");
// // установка схемы

const Schema = mongoose.Schema;
const userScheme = new Schema(
  {
    idUser: Number,
    name: String,
    surname: String,
    patronymic: String,
    time: String,
  },
  { versionKey: false }
);
const User = mongoose.model("User", userScheme);

// actions
const createUser = (userId, userName) => {
  const user = new User({
    idUser: userId,
    name: null,
    time: moment().format("YYYY-MM-DD HH:mm:ss"),
  });

  user.save(function (err) {
    // mongoose.disconnect(); // отключение от базы данных

    if (err) return console.log(err);
    console.log("Сохранен объект", user);
  });
};
function findUser(userId) {
  return User.findOne({ idUser: userId }, function (err, docs) {
    // mongoose.disconnect();

    if (err) return console.log(err);
    return docs;
  });
}
const findUserAndUpdate = (userId, parametr) => {
  return User.updateOne(userId, parametr, function (err, result) {
    // mongoose.disconnect();
    if (err) return console.log(err);

    return result;
  });
};

//////// схема PAYMENT

const paymentScheme = new Schema(
  {
    user: { type: Number },
    userName: { type: String },
    city: { type: String },
    price: { type: Number },
    fine: { type: String },
    date: { type: String },
    transactionStatus: { type: String },
    countId: { type: Number },
  },
  { versionKey: false }
);
paymentScheme.plugin(autoIncrement.plugin, {
  model: "Payment",
  field: "countId",
});

const Payment = mongoose.model("Payment", paymentScheme);

const findLastBill = (userId) => {
  return Payment.find({ user: userId })
    .find({ transactionStatus: "Approved" })
    .sort({ countId: -1 });
};
const findPaymentAndUpdate = (countId, parametr) => {
  return Payment.updateOne(countId, parametr, function (err, result) {
    // mongoose.disconnect();
    if (err) return console.log(err);

    return result;
  });
};
module.exports = {
  createUser,
  findUser,
  findUserAndUpdate,
  findPaymentAndUpdate,
  findLastBill,
  Payment,
};
