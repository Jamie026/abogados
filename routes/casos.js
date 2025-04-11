const express = require("express")
const casos = express.Router()
const connection = require("../config/db");
const { encriptar } = require("../auth/bcrypt");

casos.get("/casos", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Caso");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener casos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// REGISTRAR UN CASO COMO ABOGADO
casos.post("/casos/register", async (req, res) => {
    let { nombre, resumen, abogado_id, cliente_id } = req.body;
    const id = uuidv4();
    nombre = encriptar(nombre);
    try {
        await connection.query(
            "INSERT INTO Caso (id, nombre, resumen, abogado_id, cliente_id) VALUES (?, ?, ?, ?, ?)",
            [id, nombre, resumen, abogado_id, cliente_id]
        );
        res.status(201).json({ message: "Caso registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// MODIFICACION DE LOS CASOS
casos.put("/casos/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, resumen } = req.body;
    try {
        const [existingCaso] = await connection.query("SELECT * FROM Caso WHERE id = ?", [id]);
        if (existingCaso.length === 0)
            return res.status(404).json({ message: "Caso no encontrado" });
        await connection.query(
            "UPDATE Caso SET nombre = ?, resumen = ? WHERE id = ?",
            [nombre, resumen, id]
        );
        res.status(200).json({ message: "Caso actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

casos.delete("/casos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM Caso WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Caso no encontrado" });
        res.status(200).json({ message: "Caso eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar caso:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = casos;