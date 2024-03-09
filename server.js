const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base de datos de usuarios (temporal)
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Endpoints
// Obtener todos los usuarios
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// Obtener detalle de usuario por ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);

    if (!user) {
        res.status(404).send('User not found');
    } else {
        res.status(200).json(user);
    }
});

// Variable para mantener un contador de usuarios y generar IDs únicos
let userIdCounter = 1;

// Crear usuario
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Validar campos requeridos
  if (!name || !email) {
    res.status(400).send({error:'All fields are required'});
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).send({error:'Invalid email format'});
    return;
  }

  // Verificar si el email ya está en uso
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    res.status(400).json({ error: 'User with the same email already exists' });
    return;
  }

  // Generar un nuevo ID único incremental
  const id = userIdCounter++;
  const newUser = { id, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});


// Eliminar usuario por ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        res.status(404).send('User not found');
    } else {
        users.splice(userIndex, 1);
        res.status(200).send('User deleted successfully');
    }
});

// Actualizar usuario por ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        res.status(404).send({error:'User not found'});
    } else {
        // Validar campos requeridos
        if (!name || !email) {
            res.status(400).send({error:'All fields are required'});
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).send({error:'Invalid email format'});
            return;
        }

        users[userIndex] = { id: userId, name, email };
        res.status(200).json(users[userIndex]);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});