const express = require("express")
const pagos = express.Router()
const connection = require("../config/db");
const fs = require("fs");
const path = require("path");

pagos.get("", async (req, res) => {
    try {
        const [results] = await connection.query("SELECT * FROM Pago");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});


// REGISTRAR UN CASO COMO ABOGADO
pagos.post("/register", async (req, res) => {
    const { metodo_pago, caso_id } = req.body;

    try {
        await connection.query(
            "INSERT INTO Pago (metodo_pago, caso_id) VALUES (?, ?, ?)",
            [metodo_pago, caso_id]
        );
        res.status(201).json({ message: "Pago registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar pago:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});




pagos.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query("DELETE FROM Pago WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Pago no encontrado" });
        res.status(200).json({ message: "Pago eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = pagos;