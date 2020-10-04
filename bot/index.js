"use strict";
require("./mongodb/mongodb");
const Telegraf = require("telegraf");

const { bot } = require("./initBot");
const SceneGenerator = require("./Scenes");
const { findLastBill } = require("./mongodb/mongoAction");
const { Stage, session } = Telegraf;

const { writeData } = require("./google-sheets");

const curScene = new SceneGenerator();
const authScene = curScene.isAuthScene();
const authNameScene = curScene.addAuthName();
const authCityScene = curScene.addAuthCity();
const CurAddFineScene = curScene.addFineScene();
const CuraddFineAmountScene = curScene.addFineAmountScene();
const CurchechAllScene = curScene.chechAllScene();
const stage = new Stage([
  authScene,
  authNameScene,
  authCityScene,
  CurAddFineScene,
  CuraddFineAmountScene,
  CurchechAllScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.scene.enter("isAuth");
});
bot.command("payfine", (ctx) => ctx.scene.enter("authCity"));
bot.command("changename", (ctx) => {
  ctx.scene.enter("authName");
});

bot.command("paymentarchive", (ctx) => {
  findLastBill(ctx.from.id).then((billArry) => {
    if (billArry.length === 0) {
      ctx.reply("Успiшних платежiв немає");
      return;
    }

    const html = billArry
      .map((el) => {
        return `<b>Отримувач:</b> ${el.city} 
<b>Сума:</b> ${el.price} 
<b>Дата платежу:</b> ${el.date}
<b>Протокол:</b> ${el.fine}
<i>Замовити квитанцiю:</i> /download${el.countId}`;
      })
      .join("\n \n");
    ctx.replyWithHTML(html);

    for (let bill of billArry) {
      bot.hears(`/download${bill.countId}`, async (ctx) => {
        console.log("/download", bill.countId);
        writeData(bill);
        ctx.reply("Квитанцiя в обробцi");
      });
    }
  });
});

bot.launch();
