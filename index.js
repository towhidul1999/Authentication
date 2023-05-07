require("dotenv").config();
const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log("Port listening: " + process.env.PORT);
});
