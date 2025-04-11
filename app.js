const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3000;

const cliente = require("./routes/cliente");
const abogados = require("./routes/abogados");
const casos = require("./routes/casos");
const documentos = require("./routes/documentos");
const pagos = require("./routes/pagos");

app.use(cors());
app.use(express.json());
app.use("/clientes", cliente);
app.use("/abogados", abogados);
app.use("/casos", casos);
app.use("/documentos", documentos);
app.use("/pagos", pagos);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});