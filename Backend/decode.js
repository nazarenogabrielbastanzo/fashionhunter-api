const mongoose = require("mongoose");
const dbUri = atob(
  "bW9uZ29kYitzcnY6Ly9mYXNoaW9uaHVudGVyX25vY291bnRyeTp1b1EyWWJrWndOb2pQQWRtQGNsdXN0ZXIwLnU2Nmd6Lm1vbmdvZGIubmV0L2RvdGVudj9yZXRyeVdyaXRlcz10cnVlJnc9bWFqb3JpdHk="
);
const fs = require("fs");

const path = "./.config.env";

try {
  mongoose.connect(dbUri).then(() => {
    console.log("Importando variables de entorno...");
  });

  const dotenv = new mongoose.Schema({
    secrets: {
      type: String
    }
  });

  const dotEnvs = mongoose.model("dotenv", dotenv);

  const getSecrets = async () => {
    const secrets = await dotEnvs.findOne();
    const decoded = atob(secrets.secrets);
    fs.appendFile(path, decoded, function (err) {
      if (err) throw err;
      console.log(`El archivo ${path} ha sido creado o actualizado!`);
    });
    await mongoose.connection.close();
  };

  getSecrets();
} catch (err) {
  console.log("Consultar con James Noria");
}
