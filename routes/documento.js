const express = require("express")
const documentos = express.Router()
const connection = require("../config/db");
const { v4: uuidv4 } = require('uuid');
const { encriptar } = require("./../auth/bcrypt")

documentos.get("/", async (req, res) => {
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
    let { original_nombre, caso_id, evidencia } = req.body;
    const id = uuidv4();
    const hash_nombre = encriptar(original_nombre);
    const creado = new Date();
    try {
        const [casos] = await connection.query("SELECT * FROM Caso WHERE id = ?", [caso_id]);
        if (casos.length === 0) {
            return res.status(400).json({ message: "El caso asociado no existe" });
        }
        // Simulacion del guardado de la evidencia
        evidencia = "https://file_server/" + hash_nombre + ".txt";
        await connection.query(
            "INSERT INTO Documento (id, hash_nombre, original_nombre, caso_id, evidencia, creado) VALUES (?, ?, ?, ?, ?, ?)",
            [id, hash_nombre, original_nombre, caso_id, evidencia, creado]
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
    try {
        const [existingDocumento] = await connection.query("SELECT * FROM Documento WHERE id = ?", [id]);
        if (existingDocumento.length === 0)
            return res.status(404).json({ message: "Documento no encontrado" });

        // Simulacion del guardado de la nueva evidencia
        const hash_nombre = existingDocumento[0].hash_nombre;
        const nuevaEvidencia = "https://nuevo_file_server/" + hash_nombre + ".txt";

        await connection.query(
            "UPDATE Documento SET evidencia = ? WHERE id = ?",
            [nuevaEvidencia, id]
        );
        res.status(200).json({ message: "Evidencia actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar evidencia:", error);
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