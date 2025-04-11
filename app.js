const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3000;

const users = require("./routes/user");

app.use(cors());
app.use(express.json());
app.use("/users", users);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);  
});