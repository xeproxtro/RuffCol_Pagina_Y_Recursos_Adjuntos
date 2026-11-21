const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'ruffcol_secret_key_2024';

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de SQLite
const db = new sqlite3.Database('./ruffcol.db', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
        inicializarBaseDeDatos();
    }
});

// Configuración de Multer para subida de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Inicializar tablas de la base de datos
function inicializarBaseDeDatos() {
    db.serialize(() => {
        // Tabla de usuarios
        db.run(`CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT,
            password TEXT NOT NULL,
            rol TEXT NOT NULL,
            estado_cuenta TEXT NOT NULL,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabla de categorías
        db.run(`CREATE TABLE IF NOT EXISTS categoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            descripcion TEXT
        )`);

        // Tabla de productos
        db.run(`CREATE TABLE IF NOT EXISTS producto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL NOT NULL,
            stock INTEGER NOT NULL,
            imagen BLOB,
            id_categoria INTEGER NOT NULL,
            FOREIGN KEY (id_categoria) REFERENCES categoria(id)
        )`);

        // Tabla de pedidos
        db.run(`CREATE TABLE IF NOT EXISTS pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha_pedido DATETIME NOT NULL,
            estado TEXT NOT NULL,
            total REAL NOT NULL,
            id_usuario INTEGER NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        )`);

        // Tabla de detalle_pedido
        db.run(`CREATE TABLE IF NOT EXISTS detalle_pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cantidad INTEGER NOT NULL,
            precio_unitario REAL NOT NULL,
            id_pedido INTEGER NOT NULL,
            id_producto INTEGER NOT NULL,
            FOREIGN KEY (id_pedido) REFERENCES pedido(id),
            FOREIGN KEY (id_producto) REFERENCES producto(id)
        )`);

        // Insertar datos de prueba si están vacías
        db.get("SELECT COUNT(*) as count FROM categoria", (err, row) => {
            if (row.count === 0) {
                const categorias = [
                    { nombre: 'Collares', descripcion: 'Collares para perros y gatos' },
                    { nombre: 'Ropa', descripcion: 'Ropa de temporada para mascotas' },
                    { nombre: 'Accesorios', descripcion: 'Accesorios varios' }
                ];
                categorias.forEach(cat => {
                    db.run("INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)",
                        [cat.nombre, cat.descripcion]);
                });
                console.log('Categorías de prueba insertadas');
            }
        });

        // Crear super admin por defecto
        db.get("SELECT COUNT(*) as count FROM usuario WHERE rol = 'SUPER_ADMIN'", (err, row) => {
            if (err) {
                console.error('Error verificando super admin:', err);
            } else if (row.count === 0) {
                const passwordHash = bcrypt.hashSync('admin123', 10);
                db.run(`INSERT INTO usuario (nombre, username, email, password, rol, estado_cuenta)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    ['Super Admin', 'superadmin', 'superadmin@ruffcol.com', passwordHash, 'SUPER_ADMIN', 'ACTIVO'],
                    function(err) {
                        if (err) {
                            console.error('Error creando super admin:', err);
                        } else {
                            console.log('✅ Super Admin creado: usuario=superadmin, password=admin123, ID:', this.lastID);
                        }
                    });
            } else {
                console.log('✅ Super Admin ya existe');
            }
        });
    });
}

// Middleware de autenticación
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// Middleware de autorización por rol
function autorizarRol(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'No tienes permisos' });
        }
        next();
    };
}

// RUTAS DE AUTENTICACIÓN

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    console.log('🔐 Intento de login:', { username, passwordLength: password?.length, body: req.body });

    db.get("SELECT * FROM usuario WHERE username = ?", [username], (err, user) => {
        if (err) {
            console.error('❌ Error en consulta:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        if (!user) {
            console.log('❌ Usuario no encontrado:', username);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        console.log('✅ Usuario encontrado:', { id: user.id, username: user.username, rol: user.rol, estado: user.estado_cuenta, hasPassword: !!user.password });

        const passwordValida = bcrypt.compareSync(password, user.password);
        console.log('🔍 Validación de contraseña:', { passwordValida, inputLength: password?.length, storedHashLength: user.password?.length });

        if (!passwordValida) {
            console.log('❌ Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (user.estado_cuenta !== 'ACTIVO') {
            console.log('❌ Cuenta no activa:', user.estado_cuenta);
            return res.status(403).json({ error: 'Cuenta no activa' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username, rol: user.rol },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('✅ Login exitoso para:', username);

        res.json({
            token,
            userId: user.id,
            username: user.username,
            nombre: user.nombre,
            rol: user.rol,
            email: user.email
        });
    });
});

// Registro de cliente
app.post('/api/auth/register-cliente', (req, res) => {
    const { nombre, username, email, password } = req.body;

    if (!nombre || !username || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO usuario (nombre, username, email, password, rol, estado_cuenta)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, username, email, passwordHash, 'CLIENTE', 'ACTIVO'],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: 'El usuario ya existe' });
                }
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.json({ message: 'Usuario registrado exitosamente', userId: this.lastID });
        }
    );
});

// RUTAS DE CATEGORÍAS

app.get('/api/categorias', (req, res) => {
    db.all("SELECT * FROM categoria", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/categorias', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), (req, res) => {
    const { nombre, descripcion } = req.body;
    db.run("INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)",
        [nombre, descripcion],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, nombre, descripcion });
        }
    );
});

app.put('/api/categorias/:id', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), (req, res) => {
    const { nombre, descripcion } = req.body;
    db.run("UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?",
        [nombre, descripcion, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Categoría actualizada' });
        }
    );
});

app.delete('/api/categorias/:id', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), (req, res) => {
    db.run("DELETE FROM categoria WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Categoría eliminada' });
    });
});

// RUTAS DE PRODUCTOS

app.get('/api/productos', (req, res) => {
    const query = `
        SELECT p.*, c.nombre as categoria_nombre
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Convertir BLOB a base64
        const productos = rows.map(p => ({
            ...p,
            imagen: p.imagen ? p.imagen.toString('base64') : null
        }));
        res.json(productos);
    });
});

app.get('/api/productos/:id', (req, res) => {
    const query = `
        SELECT p.*, c.nombre as categoria_nombre
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id
        WHERE p.id = ?
    `;
    db.get(query, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Producto no encontrado' });
        const producto = {
            ...row,
            imagen: row.imagen ? row.imagen.toString('base64') : null
        };
        res.json(producto);
    });
});

app.get('/api/productos/categoria/:id', (req, res) => {
    const query = `
        SELECT p.*, c.nombre as categoria_nombre
        FROM producto p
        LEFT JOIN categoria c ON p.id_categoria = c.id
        WHERE p.id_categoria = ?
    `;
    db.all(query, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const productos = rows.map(p => ({
            ...p,
            imagen: p.imagen ? p.imagen.toString('base64') : null
        }));
        res.json(productos);
    });
});

app.post('/api/productos', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, stock, categoriaId } = req.body;
    const imagen = req.file ? req.file.buffer : null;

    db.run(`INSERT INTO producto (nombre, descripcion, precio, stock, imagen, id_categoria)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion, precio, stock, imagen, categoriaId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto creado', id: this.lastID });
        }
    );
});

app.put('/api/productos/:id', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, stock, categoriaId } = req.body;
    const imagen = req.file ? req.file.buffer : null;

    let query = "UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?";
    let params = [nombre, descripcion, precio, stock, categoriaId, req.params.id];

    if (imagen) {
        query = "UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, id_categoria = ?";
        params = [nombre, descripcion, precio, stock, imagen, categoriaId, req.params.id];
    }

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto actualizado' });
    });
});

app.delete('/api/productos/:id', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), (req, res) => {
    db.run("DELETE FROM producto WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto eliminado' });
    });
});

// RUTAS DE PEDIDOS

app.get('/api/pedidos', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), (req, res) => {
    const query = `
        SELECT p.*, u.nombre as usuario_nombre
        FROM pedido p
        LEFT JOIN usuario u ON p.id_usuario = u.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/pedidos/mis-pedidos', autenticarToken, (req, res) => {
    const query = `
        SELECT p.*, u.nombre as usuario_nombre
        FROM pedido p
        LEFT JOIN usuario u ON p.id_usuario = u.id
        WHERE p.id_usuario = ?
    `;
    db.all(query, [req.user.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/pedidos', autenticarToken, (req, res) => {
    const { items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'El pedido debe tener items' });
    }

    // Calcular total
    let total = 0;
    const itemsPromises = items.map(item => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM producto WHERE id = ?", [item.productoId], (err, producto) => {
                if (err) reject(err);
                else resolve({ ...item, producto, subtotal: producto.precio * item.cantidad });
            });
        });
    });

    Promise.all(itemsPromises)
        .then(itemsConProducto => {
            total = itemsConProducto.reduce((sum, item) => sum + item.subtotal, 0);

            // Crear pedido
            db.run(`INSERT INTO pedido (fecha_pedido, estado, total, id_usuario)
                VALUES (DATETIME('now'), 'PENDIENTE', ?, ?)`,
                [total, req.user.userId],
                function(err) {
                    if (err) return res.status(500).json({ error: err.message });

                    const pedidoId = this.lastID;

                    // Crear detalles
                    itemsConProducto.forEach(item => {
                        db.run(`INSERT INTO detalle_pedido (cantidad, precio_unitario, id_pedido, id_producto)
                            VALUES (?, ?, ?, ?)`,
                            [item.cantidad, item.producto.precio, pedidoId, item.productoId]);
                    });

                    res.json({ message: 'Pedido creado', pedidoId, total });
                }
            );
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/pedidos/:id/estado', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), (req, res) => {
    const { estado } = req.query;
    db.run("UPDATE pedido SET estado = ? WHERE id = ?", [estado, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Estado actualizado' });
    });
});

app.delete('/api/pedidos/:id', autenticarToken, autorizarRol('ADMIN', 'SUPER_ADMIN'), (req, res) => {
    db.run("DELETE FROM detalle_pedido WHERE id_pedido = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        db.run("DELETE FROM pedido WHERE id = ?", [req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Pedido eliminado' });
        });
    });
});

// RUTAS DE SUPER ADMIN

app.get('/api/superadmin/administradores', autenticarToken, autorizarRol('SUPER_ADMIN'), (req, res) => {
    db.all("SELECT * FROM usuario WHERE rol IN ('ADMIN', 'SUPER_ADMIN')", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/superadmin/crear-admin', autenticarToken, autorizarRol('SUPER_ADMIN'), (req, res) => {
    const { nombre, username, email, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);

    db.run(`INSERT INTO usuario (nombre, username, email, password, rol, estado_cuenta)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, username, email, passwordHash, 'ADMIN', 'ACTIVO'],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Administrador creado', userId: this.lastID });
        }
    );
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});
