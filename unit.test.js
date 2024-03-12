const request = require('supertest');
const app = require('./app');

describe('Pruebas unitarias', () => {
    it('POST /users debería devolver un error 500 si hay un error al crear el usuario', async () => {
      const incompleteUser = {
        // Enviamos un usuario sin todos los campos necesarios
        name: 'John Doe',
      };
      const response = await request(app)
        .post('/users')
        .send(incompleteUser);
      expect(response.status).toBe(500);
    });
  
    it('GET /users/:id debería devolver un usuario específico si existe', async () => {
      // Crear un usuario nuevo para probar la búsqueda por ID
      const newUser = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };
      // Crear el usuario
      const createUserResponse = await request(app)
        .post('/users')
        .send(newUser);
      expect(createUserResponse.status).toBe(201);
  
      // Obtener el ID del usuario creado
      const userId = createUserResponse.body.id;
  
      // Hacer una solicitud GET para obtener el usuario por ID
      const getUserResponse = await request(app).get(`/users/${userId}`);
      expect(getUserResponse.status).toBe(200);
      expect(getUserResponse.body.name).toBe(newUser.name);
      expect(getUserResponse.body.email).toBe(newUser.email);
    });
  
    it('GET /users/:id debería devolver un error 404 si el usuario no existe', async () => {
      // Aquí puedes hacer una solicitud GET a una ruta con un ID que no existe
      // y luego verificar si la respuesta es un error 404.
      const nonExistentUserId = 'non-existent-id';
      const response = await request(app).get(`/users/${nonExistentUserId}`);
      expect(response.status).toBe(404);
    });
  
    
  });
  