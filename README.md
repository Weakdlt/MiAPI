# MiAPI

API REST para administrar productos de un inventario. Está construida con Node.js, Express, Sequelize y MySQL. Este repositorio contiene el backend; la ruta raíz responde texto y no es una interfaz web.

## Tecnologías

- Node.js y npm
- Express 5
- Sequelize 6
- MySQL mediante `mysql2`
- `dotenv` para leer la configuración local
- `nodemon` para reiniciar el servidor durante el desarrollo

## Estructura

```text
MiAPI/
├── config/
│   └── db.js                       # Configuración de Sequelize y MySQL
├── controllers/
│   └── productoController.js       # Operaciones CRUD y respuestas HTTP
├── models/
│   └── Producto.js                 # Modelo de producto
├── routes/
│   └── productoRoutes.js           # Rutas bajo /productos
├── index.js                        # Middleware, ruta raíz y arranque
├── package.json                    # Dependencias y comandos npm
└── .env                            # Configuración local (no publicar)
```

### Flujo de una petición

1. `index.js` configura CORS y el middleware JSON de Express.
2. Express delega `/productos` a `routes/productoRoutes.js`.
3. Las rutas llaman las funciones de `controllers/productoController.js`.
4. El controlador consulta o modifica el modelo `Producto`.
5. Sequelize usa `config/db.js` para conectarse a MySQL.

## Requisitos

- Node.js y npm instalados.
- Un servidor MySQL iniciado y accesible.
- Una base de datos MySQL existente y credenciales con permisos sobre ella.

## Configuración

En la raíz del proyecto, configura las variables en `.env`:

```env
# Puerto HTTP de esta API
PORT=3006

# Conexión MySQL
DB_HOST=localhost
DB_PORT=3211
DB_NAME=nombre_de_tu_base
DB_USER=tu_usuario
DB_PASS=tu_contraseña
```

`PORT` es el puerto donde escucha Express. `DB_PORT` es el puerto del servidor MySQL; son servicios distintos y pueden usar puertos diferentes. Los valores de arriba son ejemplos: usa los que correspondan a tu equipo. No subas el archivo `.env` ni compartas contraseñas.

## Instalación y ejecución

Desde la carpeta del proyecto:

```bash
npm install
npm run dev
```

Para iniciar sin Nodemon:

```bash
npm start
```

Al arrancar, la aplicación sincroniza el modelo con Sequelize y, si puede conectarse, inicia el servidor HTTP. Los mensajes esperados incluyen:

```text
Base de datos conectada y sincronizada.
Servidor corriendo en http://localhost:3006
```

El número del URL depende de `PORT`. La ruta `GET /` es una comprobación sencilla y responde:

```text
¡API Backend funcionando exitosamente!
```

## API de productos

URL base local: `http://localhost:3006/productos` (reemplaza el puerto si cambiaste `PORT`).

Todas las peticiones que envían datos deben usar `Content-Type: application/json`.

| Método | Ruta | Descripción | Respuesta esperada |
|---|---|---|---|
| `GET` | `/productos` | Lista todos los productos. | `200` y un arreglo JSON. |
| `POST` | `/productos` | Crea un producto. | `201` y el producto creado. |
| `PUT` | `/productos/:id` | Actualiza los campos enviados para el ID indicado. | `200`; `404` si no existe. |
| `DELETE` | `/productos/:id` | Elimina el producto indicado. | `200`; `404` si no existe. |

### Campos del producto

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | entero | No | Identificador generado por la base de datos. |
| `nombre` | texto | Sí | Nombre del producto. |
| `descripcion` | texto | No | Descripción opcional; puede ser `null`. |
| `precio` | decimal | Sí | Precio, con hasta dos posiciones decimales. |
| `stock` | entero | No | Existencias; el modelo define `0` como valor predeterminado. |
| `createdAt` | fecha/hora | Automático | Fecha de creación gestionada por Sequelize. |
| `updatedAt` | fecha/hora | Automático | Fecha de actualización gestionada por Sequelize. |

Los nombres de propiedades son sensibles a la implementación actual. En particular, el campo se llama `descripcion` (no `description`).

### Ejemplos

Crear:

```bash
curl -X POST http://localhost:3006/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mouse","descripcion":"Mouse inalámbrico","precio":85.00,"stock":10}'
```

Listar:

```bash
curl http://localhost:3006/productos
```

Actualizar solo el stock:

```bash
curl -X PUT http://localhost:3006/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"stock":12}'
```

Eliminar:

```bash
curl -X DELETE http://localhost:3006/productos/1
```

Una respuesta de producto incluye el `id`, los campos del modelo y las fechas automáticas. Los precios pueden llegar como cadenas decimales en JSON, por ejemplo `"85.00"`.

## Base de datos y persistencia

La conexión MySQL está definida en `config/db.js` mediante variables de entorno. El modelo está en `models/Producto.js` y habilita `createdAt` y `updatedAt`.

Al iniciar se ejecuta `sequelize.sync({ force: false })`. Esto no ordena borrar y recrear las tablas al reiniciar. La base de datos indicada en `DB_NAME` debe existir y el usuario configurado necesita permisos para usarla y crear tablas cuando corresponda.

## Notas para desarrollo y asistentes de IA

- Este repositorio documenta una API backend; no contiene una aplicación frontend.
- El frontend debe enviar solicitudes a la API usando `PORT` y las rutas descritas arriba. En desarrollo, CORS está habilitado para todos los orígenes.
- El contrato actual usa `nombre`, `descripcion`, `precio` y `stock`; conservar la coincidencia entre propiedades del modelo, columnas MySQL y payloads del frontend.
- La ruta `GET /` devuelve texto plano, no una página CRUD.
- No hay autenticación ni autorización implementadas.
- Los controladores devuelven errores de base de datos como HTTP `500` con un objeto JSON `{ "error": "..." }`.
- No se incluye una suite de pruebas automatizadas en `package.json`.
- No guardar credenciales reales, datos sensibles ni secretos en documentación o código. Usar `.env` local para la configuración.
