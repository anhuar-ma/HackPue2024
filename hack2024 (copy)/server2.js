const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // Import cors

const app = express();
const port = 4000;

// Use cors middleware
app.use(cors());

// Configuración de Multer para guardar archivos en el directorio 'uploads'
const upload = multer({
    dest: 'uploads/' // Directorio donde se guardarán los archivos
});

// Ruta POST para manejar la subida de archivos
app.post('/upload', upload.single('audio'), (req, res) => {
    // Aquí req.file contiene la información del archivo subido
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    // Ruta completa del nuevo archivo subido
    const newFilePath = path.join(__dirname, 'uploads', req.file.originalname);

    // Eliminar archivo existente, si lo hay
    deleteExistingFile(newFilePath)
        .then(() => {
            // Mover el archivo subido al directorio deseado
            const oldPath = path.join(__dirname, req.file.path);

            fs.rename(oldPath, newFilePath, async err => {
                if (err) {
                    console.error('Error al mover el archivo:', err);
                    return res.status(500).send('Error al mover el archivo.');
                }

                try {
                    // Dynamically import node-fetch
                    const fetch = (await import('node-fetch')).default;

                    // Call the Flask API to transcribe the audio
                    const response = await fetch('http://localhost:5001/transcribe');
                    const data = await response.json();
                    console.log('Transcription:', data.transcription);
                    res.send('Archivo subido y transcrito correctamente.');
                } catch (error) {
                    console.error('Error al transcribir el audio:', error);
                    res.status(500).send('Error al transcribir el audio.');
                }
            });
        })
        .catch(err => {
            console.error('Error al eliminar archivo existente:', err);
            res.status(500).send('Error al eliminar archivo existente.');
        });
});

// Función para eliminar archivo existente
function deleteExistingFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) {
                // Archivo existe, proceder a eliminarlo
                fs.unlink(filePath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                // Archivo no existe, continuar sin error
                resolve();
            }
        });
    });
}

// Middleware para manejar errores
app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
