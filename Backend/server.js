const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: `${__dirname}/.config.env` });

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log("✓ DB Connected");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
