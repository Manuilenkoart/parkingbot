const fetch = require("node-fetch");
const FormData = require("form-data");
const { token } = require("../../config");

const userRegistrationControllerPost = async (req, res) => {
  const blob = req.file.buffer;
  const form = new FormData();
  form.append("chat_id", `${req.body.userid}`);
  form.append("document", blob, "квитанцiя.pdf");
  return await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
    method: "POST",
    body: form,
  })
    .then((data) => {
      if (data.status === 200) {
        res.status(200).send("ok");
      }
    })
    .catch((err) => res.send(err));
};

module.exports = {
  userRegistrationControllerPost,
};
