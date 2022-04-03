const mongoose = require("mongoose");
const dbUri = atob(
  "bW9uZ29kYitzcnY6Ly9mYXNoaW9uaHVudGVyX25vY291bnRyeTp1b1EyWWJrWndOb2pQQWRtQGNsdXN0ZXIwLnU2Nmd6Lm1vbmdvZGIubmV0L2RvdGVudj9yZXRyeVdyaXRlcz10cnVlJnc9bWFqb3JpdHk="
);
const fs = require("fs");
const path = "./.config.env";

console.log('\n¿Errores?\nRecuerde usar siempre los siguientes comandos antes de iniciar el servidor:\n- git pull origin backend-prod\n- npm install\n')


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
    fs.writeFile(path, decoded, function (err) {
      if (err) throw err;
      console.log(`El archivo ${path} ha sido creado o actualizado!`);
    });
    await mongoose.connection.close();
  };

  getSecrets();
} catch (err) {
  console.log("Consultar con James Noria");
}
