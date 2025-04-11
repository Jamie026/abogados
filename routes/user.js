const express = require("express")
const clientes = express.Router()
const connection = require("../config/db");

clientes.get("/client/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Cliente");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

clientes.post("/client/login", async (req, res) => {
    const { email } = req.body;
    try {
        const [clientes, fields] = await connection.query("SELECT * FROM Cliente");
        const validation = clientes.filter(user => user.email === email);
        if (validation.length === 0)
            res.status(401).json({ message: "Email no registrado" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

clientes.post("/client/register", async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const [existingclientes, fields] = await connection.query("SELECT * FROM Cliente WHERE email = ?", [email]);
        if (existingclientes.length > 0)
            return res.status(409).json({ message: "Email ya registrado" });
        await connection.query("INSERT INTO Cliente (id, nombre, email) VALUES (?, ?)", [id, nombre, email]);
        res.status(201).json({ message: "Cliente registrado correctamente" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

clientes.delete("/client/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM Cliente WHERE id = ?", [id]);
        if (result.affectedRows === 0) 
            return res.status(404).json({ message: "Cliente no encontrado" });
        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = clientes;