const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();


// Importar modelos para que Sequelize los registre

const Producto = require('./models/Producto');
const app = express();

// --- MIDDLEWARES ---

// Habilitar CORS para permitir peticiones desde el frontend (React)

app.use(cors());
// Parsear el body de las peticiones a JSON

app.use(express.json());
app.use('/productos', require('./routes/productoRoutes'));



// --- RUTAS BÁSICAS DE PRUEBA ---

app.get('/', (req, res) => {
  res.send('¡API Backend funcionando exitosamente!');

});



// --- SINCRONIZACIÓN Y ARRANQUE ---

const PORT = process.env.PORT || 3006;

// force: false evita que se borren los datos cada vez que se reinicia el servidor

// PUT: Actualizar un producto existente

app.put('/productos/:id', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    await Producto.update(
      { nombre, descripcion, precio, stock },
      { where: { id: req.params.id } }
    );

    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


// DELETE: Eliminar un producto

app.delete('/productos/:id', async (req, res) => {
  try {
    await Producto.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos conectada y sincronizada.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  })
  .catch(error => {
    console.error('Error al conectar con la base de datos:', error);
  });

