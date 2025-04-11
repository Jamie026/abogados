const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3000;

const cliente = require("./routes/cliente");

app.use(cors());
app.use(express.json());
app.use("/clientes", cliente);
app.use("/abogados", cliente);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);  
});