const express = require("express")
const documentos = express.Router()
const connection = require("../config/db");

documentos.get("", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Documento");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener documentos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


// REGISTRAR UN CASO COMO ABOGADO
documentos.post("/register", async (req, res) => {
    const { original_nombre, caso_id } = req.body;
    const hash_nombre = encriptar(original_nombre);
    const creado = new Date();

    try {
        await connection.query(
            "INSERT INTO Documento (hash_nombre, original_nombre, caso_id, creado) VALUES (?, ?, ?, ?)",
            [hash_nombre, original_nombre, caso_id, creado]
        );
        res.status(201).json({ message: "Documento registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar documento:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// MODIFICACION DE LOS CASOS
documentos.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { evidencia } = req.body;
    try {
        const [existingDocumento] = await connection.query("SELECT * FROM Documento WHERE id = ?", [id]);
        if (existingDocumento.length === 0)
            return res.status(404).json({ message: "Documento no encontrado" });

        await connection.query(
            "UPDATE Documento SET evidencia = ? WHERE id = ?",
            [evidencia]
        );
        res.status(200).json({ message: "Documento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar documento:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


documentos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM Documento WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Documento no encontrado" });
        res.status(200).json({ message: "Documento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = documentos;