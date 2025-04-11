const express = require("express")
const users = express.Router()
const connection = require("../config/db");

users.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Cliente");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

users.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users, fields] = await connection.query("SELECT * FROM usuario");
        const validation = users.filter(user => user.username === username && user.password === password);
        if (validation.length === 0)
            res.status(401).json({ message: "Usuario o contraseña invalida" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

users.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [existingUsers, fields] = await connection.query("SELECT * FROM usuario WHERE username = ?", [username]);
        if (existingUsers.length > 0)
            return res.status(409).json({ message: "El nombre de usuario ya existe" });
        await connection.query("INSERT INTO usuario (username, password) VALUES (?, ?)", [username, password]);
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

users.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM usuario WHERE id = ?", [id]);
        if (result.affectedRows === 0) 
            return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = users;