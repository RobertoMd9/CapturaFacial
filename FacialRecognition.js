//Express: para manejar las solicitudes HTTP.
//pg: para conectar con PostgreSQL.
//multer: para manejar la subida de imágenes.

const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuración de PostgreSQL
const pool = new Pool({
    user: 'project_AII',
    host: 'localhost',
    database: 'database_assistant',
    password: '12345',
    port: 5432,
});

// Configuración de multer para almacenar imágenes temporalmente
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html'); //ruta del archivo principal
});

// Ruta para subir la imagen y guardar en la base de datos
app.post('/upload', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const image = req.file.buffer; // Obtener los bytes de la imagen

    try {
        const query = 'INSERT INTO facial_data (name, encoding) VALUES ($1, $2)';
        await pool.query(query, [name, image]);

        res.status(200).send('Imagen y datos faciales guardados correctamente en la base de datos.');
    } catch (err) {
        console.error('Error al guardar en la base de datos', err);
        res.status(500).send('Error al guardar los datos faciales.');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
