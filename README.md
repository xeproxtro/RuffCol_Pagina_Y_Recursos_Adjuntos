# Ruffcol — Tienda de Ropa y Accesorios para Mascotas

Sistema de comercio electrónico para la gestión de una tienda de ropa y accesorios para mascotas. Incluye dos implementaciones:

| Implementación | Estado | Stack | Puerto |
|---|---|---|---|
| **Node.js + React** | ✅ Activa (recomendada) | Express + SQLite + React 18 + Vite | Backend `3000` · Frontend `5173` |
| Java / Spring Boot | 🗄️ Original (legado) | Spring Boot 3 + JPA + H2/MySQL + HTML/JS | `8094` |

---

## 📚 Documentación

- [Guía del Contenido del Proyecto](Documentaciones/GUIA_CONTENIDO_PROYECTO.md) — inventario completo, arquitectura, flujos y mantenimiento.
- [DER y diccionario de datos](Documentaciones/BaseDatos/DER.md) — diagrama entidad-relación (Mermaid).
- [Scripts de base de datos](Documentaciones/BaseDatos/) — esquema, datos iniciales, consultas y equivalente MySQL.
- [Instalación del entorno](Documentaciones/INSTALACION_ENTORNO_DESARROLLO.md).
- [Inicio rápido](Documentaciones/README_INICIO_RAPIDO.md).
- [Ciclo Scrum del proyecto](Documentaciones/Ciclo_Scrum_Ruffcol.pdf).
- [Modelo MER](MODELO_MER.md).

---

## 🚀 Inicio rápido (implementación activa)

Requisitos: **Node.js 18+** (probado con Node 24).

### 1. Backend (puerto 3000)

```bash
cd ruffcol-nodejs-backend
npm install        # solo la primera vez
npm start          # o: npm run dev  (nodemon, recarga automática)
```

Al arrancar crea `ruffcol.db` (SQLite) si no existe, con tablas, categorías de prueba y el super administrador.

### 2. Frontend (puerto 5173)

```bash
cd ruffcol-react-frontend
npm install        # solo la primera vez
npm run dev
```

Abre **http://localhost:5173**. El frontend consume la API en `http://localhost:3000` (también hay proxy `/api` configurado en Vite).

### Credenciales por defecto

| Usuario | Contraseña | Rol |
|---|---|---|
| `superadmin` | `admin123` | SUPER_ADMIN |

Los clientes se registran desde `/register`. El super administrador crea cuentas de administrador desde su panel.

---

## 🧱 Arquitectura

```
React (Vite, :5173)  ──HTTP/JSON + JWT──▶  Express (:3000)  ──▶  SQLite (ruffcol.db)
```

- **Autenticación:** JWT firmado con HS256, expiración de 24 h. El token viaja en `Authorization: Bearer <token>`.
- **Autorización:** middleware `autenticarToken` + `autorizarRol(...)` sobre los roles `CLIENTE`, `ADMIN` y `SUPER_ADMIN`.
- **Imágenes de productos:** se almacenan como `BLOB` en SQLite y se devuelven en Base64.

### Estructura del repositorio

```
RUFCo Pagina/
├── ruffcol-nodejs-backend/       # API REST: Express + SQLite (activo)
│   ├── server.js                 # Servidor, rutas, JWT y creación del esquema
│   ├── ruffcol.db                # BD local (generada, no se versiona)
│   └── check-db.js               # Utilidad de inspección de la BD
├── ruffcol-react-frontend/       # SPA React + Vite (activo)
│   └── src/
│       ├── components/           # Home, Login, Register, Cart, MyOrders, AdminDashboard, SuperAdminDashboard, Navbar
│       ├── context/AuthContext.jsx
│       ├── App.jsx               # Rutas y rutas protegidas por rol
│       └── main.jsx
├── ruffcol-backend/              # Implementación original Spring Boot (legado)
├── Documentaciones/
│   ├── GUIA_CONTENIDO_PROYECTO.md
│   ├── BaseDatos/                # Scripts SQL + DER
│   ├── INSTALACION_ENTORNO_DESARROLLO.md
│   ├── README_INICIO_RAPIDO.md
│   └── Ciclo_Scrum_Ruffcol.pdf
├── MODELO_MER.md
└── README.md
```

---

## 👥 Roles y permisos

| Funcionalidad | CLIENTE | ADMIN | SUPER_ADMIN |
|---|:---:|:---:|:---:|
| Ver catálogo, categorías y buscar | ✅ | ✅ | ✅ |
| Registrarse / iniciar sesión | ✅ | ✅ | ✅ |
| Carrito y crear pedidos | ✅ | ✅ | ✅ |
| Ver sus propios pedidos | ✅ | ✅ | ✅ |
| CRUD categorías y productos | — | ✅ | ✅ |
| Ver todos los pedidos y cambiar estado | — | ✅ | ✅ |
| Eliminar pedidos | — | ✅ | ✅ |
| Listar y crear administradores | — | — | ✅ |

Estados de pedido: `PENDIENTE`, `EN_CONFECCION`, `ENVIADO`, `ENTREGADO`.

---

## 🔌 API REST

Base: `http://localhost:3000`

### Autenticación
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Devuelve JWT y datos del usuario |
| POST | `/api/auth/register-cliente` | Público | Registra un cliente |

### Categorías
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/categorias` | Público |
| POST | `/api/categorias` | ADMIN, SUPER_ADMIN |
| PUT | `/api/categorias/:id` | ADMIN, SUPER_ADMIN |
| DELETE | `/api/categorias/:id` | ADMIN, SUPER_ADMIN |

### Productos
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/productos` | Público |
| GET | `/api/productos/:id` | Público |
| GET | `/api/productos/categoria/:id` | Público |
| POST | `/api/productos` | ADMIN, SUPER_ADMIN (multipart, campo `imagen`) |
| PUT | `/api/productos/:id` | ADMIN, SUPER_ADMIN (multipart) |
| DELETE | `/api/productos/:id` | ADMIN, SUPER_ADMIN |

### Pedidos
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/pedidos` | ADMIN, SUPER_ADMIN |
| GET | `/api/pedidos/mis-pedidos` | Autenticado |
| POST | `/api/pedidos` | Autenticado (body `{ items: [{ productoId, cantidad }] }`) |
| PUT | `/api/pedidos/:id/estado?estado=ENVIADO` | ADMIN, SUPER_ADMIN |
| DELETE | `/api/pedidos/:id` | ADMIN, SUPER_ADMIN |

### Super Admin
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/superadmin/administradores` | SUPER_ADMIN |
| POST | `/api/superadmin/crear-admin` | SUPER_ADMIN |

---

## 🗄️ Base de datos

SQLite, 5 entidades: `usuario`, `categoria`, `producto`, `pedido`, `detalle_pedido`.

- Diagrama y diccionario: [Documentaciones/BaseDatos/DER.md](Documentaciones/BaseDatos/DER.md)
- Script de esquema: [01_esquema_sqlite.sql](Documentaciones/BaseDatos/01_esquema_sqlite.sql)
- Datos iniciales: [02_datos_iniciales.sql](Documentaciones/BaseDatos/02_datos_iniciales.sql)
- Consultas útiles: [03_consultas_utiles.sql](Documentaciones/BaseDatos/03_consultas_utiles.sql)
- Equivalente MySQL (legado): [04_esquema_mysql.sql](Documentaciones/BaseDatos/04_esquema_mysql.sql)

---

## 🧪 Utilidades

```bash
# Inspeccionar la base de datos local
cd ruffcol-nodejs-backend
node check-db.js
```

---

## ⚠️ Notas técnicas

- El secreto JWT y la ruta de la BD están **hardcodeados** en `server.js` (aceptable para el alcance académico; en producción usar variables de entorno).
- La creación de pedidos **no descuenta stock** ni envuelve la operación en una transacción.
- `ruffcol.db` y `node_modules/` están excluidos del repositorio; la BD se regenera al iniciar el backend.
- La implementación Java/Spring Boot se conserva como referencia y no es necesaria para ejecutar la aplicación actual.

---

## 👨‍💻 Equipo

| Nombre | Responsabilidades |
|---|---|
| Emmanuel Moreno Rueda | Categorías y Productos (backend y frontend) |
| Andres Rodriguez | Pedidos, Usuarios y Carrito (backend y frontend) |

**Licencia:** MIT.
