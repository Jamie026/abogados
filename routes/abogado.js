const express = require("express")
const abogados = express.Router()
const connection = require("../config/db");

abogados.get("/abogados/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Abogado");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener abogados:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

abogados.post("/abogados/login", async (req, res) => {
    const { email } = req.body;
    try {
        const [abogados, fields] = await connection.query("SELECT * FROM Abogado");
        const validation = abogados.filter(user => user.email === email);
        if (validation.length === 0)
            res.status(401).json({ message: "Email no registrado" })
        else
            res.status(200).json({ message: "Login correcto" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

abogados.post("/abogados/register", async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const [existingabogados, fields] = await connection.query("SELECT * FROM Abogado WHERE email = ?", [email]);
        if (existingabogados.length > 0)
            return res.status(409).json({ message: "Email ya registrado" });
        await connection.query("INSERT INTO Abogado (id, nombre, email) VALUES (?, ?)", [id, nombre, email]);
        res.status(201).json({ message: "Abogado registrado correctamente" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


abogados.delete("/abogados/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM Abogado WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Abogado no encontrado" });
        res.status(200).json({ message: "Abogado eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = abogados;