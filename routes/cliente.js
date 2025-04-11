const express = require("express")
const clientes = express.Router()
const { v4: uuidv4 } = require('uuid');
const connection = require("../config/db");
const { compare, encriptar } = require("./../auth/bcrypt")

//OBTENER CLIENTES
clientes.get("/", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Cliente");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//LOGUEO CLIENTE
clientes.post("/login", async (req, res) => {
    const { email } = req.body;
    try {
        const [clientes] = await connection.query("SELECT * FROM Cliente");
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

//REGISTRO CLIENTE
clientes.post("/register", async (req, res) => {
    const { nombre, email } = req.body;
    const no_hash_id = uuidv4();
    const id = encriptar(no_hash_id);
    try {
        const [existingclientes] = await connection.query("SELECT * FROM Cliente WHERE email = ?", [email]);
        if (existingclientes.length > 0)
            return res.status(409).json({ message: "Email ya registrado" });
        await connection.query("INSERT INTO Cliente (id, nombre, email) VALUES (?, ?, ?)", [id, nombre, email]);
        res.status(201).json({ message: "Cliente registrado correctamente. Guarde su ID para futuras operaciones.", ID: no_hash_id });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

//ELIMINAR CLIENTE
clientes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [clientes] = await connection.query("SELECT * FROM Cliente");
        const user = clientes.filter(user => compare(id, user.id));
        if (user.length === 0)
            res.status(401).json({ message: "ID no registrado" })
        else{
            const [result] = await connection.query("DELETE FROM Cliente WHERE id = ?", [user[0].id]);
            if (result.affectedRows === 0) 
                return res.status(404).json({ message: "Cliente no encontrado" });
            res.status(200).json({ message: "Cliente eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = clientes;