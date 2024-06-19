const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, 'public')));

// Cargar conversación desde archivo
let conversationHistory = [];

function saveConversation() {
    fs.writeFileSync('conversation_history.json', JSON.stringify(conversationHistory, null, 2));
}

function loadConversation() {
    if (fs.existsSync('conversation_history.json')) {
        conversationHistory = JSON.parse(fs.readFileSync('conversation_history.json'));
    }
}

loadConversation();

// Configurar la API Key de OpenAI
const API_KEY = process.env.OPEN_AI_KEY;
// console.log(process.env.OPEN_AI_KEY);
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
};

async function getChatGptResponse(msgs) {
    console.log(msgs);
    try {
        const response = await axios.post(apiEndpoint, {
            model: 'gpt-3.5-turbo', // or another model
            messages: msgs,
            max_tokens: 150,
            temperature: 0.7,
        }, { headers: headers });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.log("primero");
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

// Ruta POST para procesar datos del frontend y obtener respuesta de ChatGPT
app.post('/api/message', async (req, res) => {
    const { message } = req.body;

    conversationHistory.push({ role: 'user', content: message });

    const assistantResponse = await getChatGptResponse(conversationHistory);

    conversationHistory.push({ role: 'assistant', content: assistantResponse });

    saveConversation();

    res.json({ response: assistantResponse });
});


const bodyParser = require('body-parser');
const mysql = require('mysql');

// Middleware para parsear bodies JSON
app.use(bodyParser.json());

// Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const connection = mysql.createConnection({
  host: '10.50.122.133',
  user: 'anoar',
  password: 'test',
  database: 'hack2024'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Ruta para manejar las solicitudes de login
app.post('/login', (req, res) => {
  const {email, pass} = req.body;

  // Query para verificar si el email y la contraseña coinciden en la base de datos
  const query = 'SELECT * FROM users WHERE email = ? AND pass = ?';
  connection.query(query, [email, pass], (err, results) => {
    const fullQuery = mysql.format(query, [email, pass]);
    console.log('Full Query:', email);    
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ success: false });
      return;
    }

    if (results.length > 0) {
      // Usuario autenticado correctamente
      const idusuario = results[0].user_id;
      res.status(200).json({ success: true, idusuario: idusuario });
    } else {
      // Falló la autenticación del usuario
      res.status(200).json({ success: false });
    }
  });
});


// Ruta para obtener los cursos de un usuario específico
app.get('/cursos', (req, res) => {
    const idusuario = req.query.id;
  console.log(idusuario);
    if (!idusuario) {
      res.status(400).json({ error: 'ID de usuario no proporcionado.' });
      return;
    }
  
    // Consulta SQL para obtener los cursos del usuario
    const query = `SELECT * FROM inscriptions
                   INNER JOIN courses
                   ON inscriptions.course_id = courses.course_id
                   WHERE user_id = ?`;
  
    connection.query(query, [idusuario], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error al obtener cursos.' });
        return;
      }
  
      res.json(results); // Enviar los resultados como JSON al cliente
    });
  });


  // Ruta para obtener los cursos de un usuario específico
app.get('/tareas', (req, res) => {
    const idusuario = req.query.person;
    const idCurso = req.query.course;
  console.log(idusuario);
  console.log(idCurso);
    if (!idusuario) {
      res.status(400).json({ error: 'ID de usuario no proporcionado.' });
      return;
    }
  
    // Consulta SQL para obtener los cursos del usuario
    const sql = `SELECT * 
    FROM tareas
    INNER JOIN user_tasks ON tareas.assignment_id = user_tasks.assignment_id
    WHERE course_id = ? AND user_id = ?`;

// Ejecutar la consulta SQL
connection.query(sql, [idCurso, idusuario], (err, results) => {
  
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error al obtener tareas.' });
        return;
      }
  
      res.json(results); // Enviar los resultados como JSON al cliente
    });
  });
  // Ruta para obtener los cursos de un usuario específico
app.get('/perfil', (req, res) => {
    const idusuario = req.query.id;
    console.log(idusuario);
    if (!idusuario) {
      res.status(400).json({ error: 'ID de usuario no proporcionado.' });
      return;
    }
  
    // Consulta SQL para obtener los cursos del usuario
    const query = `SELECT * FROM users WHERE user_id = ?`;
  
    connection.query(query, [idusuario], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error al obtener el perfil.' });
        return;
      }
  
      res.json(results); // Enviar los resultados como JSON al cliente
    });
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



