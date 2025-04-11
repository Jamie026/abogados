const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3000;

const cliente = require("./routes/cliente");
const abogados = require("./routes/abogados");
const casos = require("./routes/casos");

app.use(cors());
app.use(express.json());
app.use("/clientes", cliente);
app.use("/abogados", abogados);
app.use("/casos", casos);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);
});