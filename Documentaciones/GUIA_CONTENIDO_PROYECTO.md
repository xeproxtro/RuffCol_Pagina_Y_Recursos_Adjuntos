# Guía del Contenido del Proyecto — Ruffcol

> Documento base para la elaboración del informe/guía oficial del proyecto.
> Última actualización: 21 de noviembre de 2026.

---

## 1. Ficha del proyecto

| Campo | Valor |
|---|---|
| **Nombre** | Ruffcol — Tienda de ropa y accesorios para mascotas |
| **Tipo** | Aplicación web de comercio electrónico (proyecto académico) |
| **Repositorio** | https://github.com/xeproxtro/RuffCol_Pagina_Y_Recursos_Adjuntos |
| **Rama principal** | `main` |
| **Integrantes** | Emmanuel Moreno Rueda, Andres Rodriguez |
| **Implementación activa** | Node.js + Express + SQLite (backend) y React 18 + Vite (frontend) |
| **Implementación de referencia** | Java 17 + Spring Boot + JPA (conservada como legado) |
| **Licencia** | MIT |

### Resumen ejecutivo

Ruffcol es una tienda en línea de productos para mascotas. Los clientes se registran, navegan el catálogo por categorías, arman un carrito y crean pedidos. Los administradores gestionan categorías, productos y pedidos; el super administrador además crea cuentas de administrador. La aplicación activa se compone de una SPA en React que consume una API REST en Express con autenticación JWT y persistencia en SQLite. El repositorio conserva además la primera implementación en Spring Boot con páginas HTML/JS, útil como antecedente y evidencia de la evolución del proyecto.

---

## 2. Objetivos y alcance

### Objetivos
- Ofrecer una experiencia de compra sencilla: catálogo, búsqueda, filtro por categoría, carrito y pedidos.
- Permitir la administración del catálogo (categorías y productos) desde un panel.
- Gestionar pedidos y su ciclo de vida mediante estados.
- Diferenciar tres roles con permisos crecientes: `CLIENTE`, `ADMIN`, `SUPER_ADMIN`.
- Demostrar un CRUD completo en dos capas (backend y frontend) para cada área del sistema.

### Alcance incluido
- Registro e inicio de sesión con contraseñas cifradas (bcrypt) y sesión por JWT.
- Catálogo con búsqueda por nombre y filtro por categoría.
- Carrito persistido en el navegador (`localStorage`).
- Creación de pedidos y consulta de pedidos propios.
- Paneles de administración y super administración.
- CRUD de categorías, productos y pedidos.

### Fuera de alcance (no implementado)
- Pasarela de pago real.
- Descuento automático de stock al comprar.
- Recuperación de contraseña / verificación por correo.
- Edición o inhabilitación de usuarios desde el panel.
- Gestión de imágenes más allá del almacenamiento como BLOB.

---

## 3. Tecnologías utilizadas

### Backend activo (`ruffcol-nodejs-backend`)
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18+ (probado en 24) | Entorno de ejecución |
| Express | ^4.18.2 | Framework HTTP y ruteo |
| SQLite3 | ^5.1.6 | Base de datos embebida |
| bcryptjs | ^2.4.3 | Hash de contraseñas (10 rondas) |
| jsonwebtoken | ^9.0.2 | Emisión y verificación de JWT (24 h) |
| cors | ^2.8.5 | Permite origen `http://localhost:5173` |
| multer | ^1.4.5-lts.1 | Subida de imágenes en memoria |
| nodemon | ^3.0.1 (dev) | Recarga automática |

### Frontend activo (`ruffcol-react-frontend`)
| Tecnología | Versión | Uso |
|---|---|---|
| React | ^18.2.0 | Interfaz de usuario |
| React Router DOM | ^6.20.0 | Enrutamiento SPA |
| Axios | ^1.6.2 | Cliente HTTP |
| Bootstrap / React Bootstrap | ^5.3.2 / ^2.9.1 | Estilos y componentes |
| Vite | ^5.0.0 | Servidor de desarrollo y build |

### Implementación original (`ruffcol-backend`, legado)
Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT, H2 (por defecto) o MySQL, Lombok, Swagger/OpenAPI. Sirve páginas HTML/CSS/JS con XMLHttpRequest en `src/main/resources/static`. Puerto `8094`.

---

## 4. Arquitectura

```
┌─────────────────────────────┐        HTTP/JSON + JWT        ┌──────────────────────────┐
│  React 18 + Vite (:5173)    │ ────────────────────────────▶ │  Express (:3000)         │
│  SPA con rutas protegidas   │ ◀──────────────────────────── │  API REST + middlewares  │
└─────────────────────────────┘                               └────────────┬─────────────┘
                                                                           │ sqlite3
                                                                           ▼
                                                                  ┌──────────────────┐
                                                                  │ ruffcol.db       │
                                                                  │ (SQLite, 5 tablas)│
                                                                  └──────────────────┘
```

**Capas y responsabilidades**
- **Presentación (React):** componentes por página, contexto de autenticación y protección de rutas por rol.
- **Aplicación/API (Express):** validación básica, autenticación, autorización y lógica del pedido.
- **Persistencia (SQLite):** tablas relacionales con claves foráneas; el esquema se crea al iniciar el servidor si no existe.

**Comunicación**
- El frontend usa `axios` contra `http://localhost:3000` (constante `API_URL` en cada componente).
- Vite tiene además un proxy `/api → http://localhost:3000` por si se prefiere usar rutas relativas.
- El token JWT se guarda en `localStorage` (`token`) junto con los datos del usuario (`user`).

---

## 5. Inventario del repositorio

| Ruta | Contenido | Estado |
|---|---|---|
| `ruffcol-nodejs-backend/server.js` | Servidor Express completo: configuración, esquema SQLite, middlewares y todas las rutas REST | ✅ Activo |
| `ruffcol-nodejs-backend/check-db.js` | Script de inspección rápida de la base de datos (tablas y conteos) | ✅ Utilidad |
| `ruffcol-nodejs-backend/package.json` | Dependencias y scripts (`start`, `dev`) | ✅ Activo |
| `ruffcol-nodejs-backend/ruffcol.db` | Base de datos SQLite local generada en ejecución | ⚠️ No versionada |
| `ruffcol-react-frontend/src/App.jsx` | Definición de rutas y `ProtectedRoute` por rol | ✅ Activo |
| `ruffcol-react-frontend/src/main.jsx` | Punto de entrada; monta `AuthProvider` y Bootstrap | ✅ Activo |
| `ruffcol-react-frontend/src/context/AuthContext.jsx` | Estado de sesión, `login`, `register`, `logout`, restauración desde `localStorage` | ✅ Activo |
| `ruffcol-react-frontend/src/components/Navbar.jsx` | Navegación condicionada por rol y cierre de sesión | ✅ Activo |
| `ruffcol-react-frontend/src/components/Home.jsx` | Catálogo, búsqueda por nombre y filtro por categoría | ✅ Activo |
| `ruffcol-react-frontend/src/components/Login.jsx` | Formulario de inicio de sesión | ✅ Activo |
| `ruffcol-react-frontend/src/components/Register.jsx` | Registro de clientes | ✅ Activo |
| `ruffcol-react-frontend/src/components/Cart.jsx` | Carrito en `localStorage`, cantidades y creación del pedido | ✅ Activo |
| `ruffcol-react-frontend/src/components/MyOrders.jsx` | Consulta de pedidos propios con su estado | ✅ Activo |
| `ruffcol-react-frontend/src/components/AdminDashboard.jsx` | Panel con pestañas Productos / Categorías / Pedidos | ✅ Activo |
| `ruffcol-react-frontend/src/components/SuperAdminDashboard.jsx` | Listado y creación de administradores | ✅ Activo |
| `ruffcol-react-frontend/src/index.css` | Estilos propios | ✅ Activo |
| `ruffcol-react-frontend/vite.config.js` | Puerto 5173 y proxy `/api` | ✅ Activo |
| `ruffcol-backend/` | API original Spring Boot + frontend HTML/JS | 🗄️ Legado |
| `Documentaciones/` | Guías, PDF del ciclo Scrum y scripts de BD | 📚 Documentación |
| `Documentaciones/BaseDatos/` | Esquema, datos iniciales, consultas, equivalente MySQL y DER | 🆕 Documentación |
| `MODELO_MER.md` | Descripción del modelo entidad-relación | 📚 Documentación |
| `README.md` | Portada del repositorio | 📚 Documentación |

> `TiendaWeb_ejemplo` fue eliminado del repositorio (era un backend de referencia, no forma parte del frontend actual).

---

## 6. Frontend en detalle

### Rutas de la SPA
| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Home` | Público |
| `/login` | `Login` | Público |
| `/register` | `Register` | Público |
| `/cart` | `Cart` | Público (crear pedido requiere sesión) |
| `/my-orders` | `MyOrders` | CLIENTE, ADMIN, SUPER_ADMIN |
| `/admin` | `AdminDashboard` | ADMIN, SUPER_ADMIN |
| `/superadmin` | `SuperAdminDashboard` | SUPER_ADMIN |

`ProtectedRoute` consulta el contexto de autenticación: mientras carga muestra un spinner; si no hay sesión redirige a `/login`; si el rol no está permitido redirige a `/`.

### Comportamiento clave
- **Sesión:** al recargar, `AuthContext` restaura `token` y `user` desde `localStorage` y configura el encabezado `Authorization` global de Axios.
- **Carrito:** se guarda en `localStorage` bajo la clave `carrito` como arreglo de `{ productoId, nombre, precio, cantidad, ... }`; al confirmar el pedido se envía `{ items: [{ productoId, cantidad }] }` y se vacía el carrito.
- **Paneles:** `AdminDashboard` usa pestañas de React Bootstrap (`productos`, `categorias`, `pedidos`) con formularios modales para crear/editar y botones para eliminar; permite cambiar el estado de un pedido con un selector.
- **Super admin:** lista administradores (incluye al propio super admin) y crea cuentas `ADMIN`.

---

## 7. Backend en detalle

### Estructura de `server.js`
1. **Configuración:** `PORT = 3000`, `JWT_SECRET` hardcodeado, CORS restringido a `http://localhost:5173`.
2. **Base de datos:** abre `./ruffcol.db` (relativo al directorio de ejecución) y ejecuta `inicializarBaseDeDatos()`.
3. **Esquema:** `CREATE TABLE IF NOT EXISTS` para las cinco tablas; inserción de 3 categorías de prueba y del super admin si no existen.
4. **Middlewares:** `autenticarToken` (valida `Bearer` con JWT) y `autorizarRol(...roles)`.
5. **Rutas:** autenticación, categorías, productos, pedidos y super admin.
6. **Arranque:** `app.listen(3000)`.

### Reglas de negocio relevantes
- **Registro:** `nombre`, `username` y `password` son obligatorios; el email es opcional; rol `CLIENTE` y estado `ACTIVO`.
- **Login:** valida hash con bcrypt y exige `estado_cuenta = ACTIVO`; devuelve token de 24 h y datos del usuario.
- **Productos:** al listar se hace `LEFT JOIN` con categoría y se convierte la imagen BLOB a Base64. En creación/edición la imagen llega por `multipart/form-data` (campo `imagen`) y se guarda como BLOB.
- **Pedidos:** el total se calcula en el servidor con los precios actuales de los productos; el pedido nace en estado `PENDIENTE`; los detalles guardan `precio_unitario`.
- **Eliminar pedido:** primero elimina sus detalles y luego el pedido.
- **Estados:** el cambio de estado se envía por query string (`?estado=...`) y no valida contra una lista cerrada.
- **Super admin:** crea usuarios con rol `ADMIN` directamente (hash bcrypt).

### Códigos de respuesta frecuentes
| Código | Situación |
|---|---|
| 200 | Operación exitosa |
| 400 | Datos faltantes, usuario duplicado o pedido sin items |
| 401 | Credenciales inválidas o token ausente |
| 403 | Token inválido, cuenta no activa o rol sin permisos |
| 404 | Producto no encontrado |
| 500 | Error de base de datos o del servidor |

> Nota: el endpoint de login imprime en consola el usuario y la longitud de la contraseña con fines de depuración; debe eliminarse en producción.

---

## 8. Modelo de datos

Cinco entidades: `usuario`, `categoria`, `producto`, `pedido`, `detalle_pedido`.

| Relación | Cardinalidad |
|---|---|
| `categoria` → `producto` | 1 : N (un producto pertenece a una categoría) |
| `usuario` → `pedido` | 1 : N (un pedido pertenece a un usuario) |
| `pedido` → `detalle_pedido` | 1 : N (un pedido tiene varios ítems) |
| `producto` → `detalle_pedido` | 1 : N (un producto puede aparecer en muchos ítems) |

- Diccionario de datos y diagrama: [BaseDatos/DER.md](BaseDatos/DER.md)
- DDL SQLite: [BaseDatos/01_esquema_sqlite.sql](BaseDatos/01_esquema_sqlite.sql)
- Datos iniciales: [BaseDatos/02_datos_iniciales.sql](BaseDatos/02_datos_iniciales.sql)

### Enumeraciones
- **Rol:** `CLIENTE`, `ADMIN`, `SUPER_ADMIN`.
- **Estado de cuenta:** `ACTIVO` (también previstos `PENDIENTE`, `INACTIVO` en el modelo Java).
- **Estado de pedido:** `PENDIENTE`, `EN_CONFECCION`, `ENVIADO`, `ENTREGADO`. Coincide en el modelo Java, la API y la UI.

---

## 9. Flujos funcionales

### 9.1 Cliente
1. Se registra en `/register` o inicia sesión en `/login`.
2. En `/` explora el catálogo, busca por nombre y filtra por categoría.
3. Agrega productos al carrito (se guarda en `localStorage`).
4. En `/cart` ajusta cantidades y confirma el pedido (requiere sesión).
5. En `/my-orders` consulta sus pedidos y el estado de cada uno.

### 9.2 Administrador
1. Inicia sesión con una cuenta `ADMIN` creada por el super admin.
2. Accede a `/admin`:
   - **Productos:** listar, crear, editar y eliminar (con imagen).
   - **Categorías:** listar, crear, editar y eliminar.
   - **Pedidos:** ver todos, cambiar estado y eliminar.

### 9.3 Super administrador
1. Inicia sesión (`superadmin`).
2. Accede a `/admin` con todos los permisos anteriores.
3. En `/superadmin` lista administradores y crea nuevas cuentas `ADMIN`.

---

## 10. Puesta en marcha

### Requisitos
- Node.js 18 o superior.
- Puertos 3000 y 5173 libres.

### Backend
```bash
cd ruffcol-nodejs-backend
npm install          # primera vez
npm start            # producción local
npm run dev          # desarrollo con nodemon
```
Salida esperada: `Conectado a la base de datos SQLite` y `Servidor Node.js corriendo en http://localhost:3000`.

### Frontend
```bash
cd ruffcol-react-frontend
npm install          # primera vez
npm run dev
```
Abrir **http://localhost:5173**.

### Credenciales semilla
| Usuario | Contraseña | Rol |
|---|---|---|
| `superadmin` | `admin123` | SUPER_ADMIN |

### Verificación rápida
```bash
curl http://localhost:3000/api/productos
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"admin123"}'
```

### Implementación legado (opcional)
```bash
cd ruffcol-backend
mvn spring-boot:run
# http://localhost:8094/index.html
```

---

## 11. Estado actual de la base de datos (entorno local)

Datos observados al momento de elaborar esta guía:

| Tabla | Registros | Detalle |
|---|---|---|
| `usuario` | 2 | `superadmin` (SUPER_ADMIN, ACTIVO) y `cliente` (CLIENTE, ACTIVO) |
| `categoria` | 3 | Collares, Ropa, Accesorios |
| `producto` | 1 | "Vestidode floresamarillo" — $100.000 — stock 30 — categoría Ropa |
| `pedido` | 1 | Estado `PENDIENTE`, total $100.000, usuario `cliente` |
| `detalle_pedido` | 1 | 1 unidad del producto 1 |

> Estos datos son de prueba y no se versionan (`ruffcol.db` está en `.gitignore`). Los scripts en `Documentaciones/BaseDatos/` permiten recrear el esquema y los datos mínimos.

---

## 12. Pruebas y verificaciones realizadas

| Verificación | Resultado |
|---|---|
| Backend responde `GET /api/productos` | ✅ HTTP 200 |
| Frontend responde en `:5173` | ✅ HTTP 200 |
| Login `superadmin` / `admin123` | ✅ HTTP 200 con token |
| Login con contraseña incorrecta | ✅ HTTP 401 |
| Creación del esquema al arrancar | ✅ Tablas creadas automáticamente |
| Persistencia del carrito tras recargar | ✅ Vía `localStorage` |

---

## 13. Limitaciones y deuda técnica

1. **Seguridad:** `JWT_SECRET` y credenciales semilla están en el código; mover a variables de entorno.
2. **Logs sensibles:** el login imprime datos del intento en consola.
3. **Integridad de pedidos:** no se descuenta stock y la creación de pedido + detalles no es transaccional (podría quedar un pedido sin detalles si falla una inserción).
4. **Estados de pedido:** no hay validación del lado del servidor contra la lista permitida (`PUT /api/pedidos/:id/estado` acepta cualquier valor).
5. **Imágenes:** almacenadas como BLOB dentro de SQLite (aumenta el tamaño de la BD; no hay límite de tamaño configurado en multer).
6. **Gestión de usuarios:** no existe CRUD de clientes ni cambio de estado de cuenta desde la UI.
7. **API duplicada:** la implementación Java/Spring Boot mantiene su propia lógica; no está integrada con la versión Node.
8. **Frontend:** `API_URL` está repetido y hardcodeado en varios componentes; conviene centralizarlo en una constante o usar el proxy de Vite.
9. **Sin pruebas automatizadas** (unitarias o e2e).

---

## 14. Glosario

| Término | Definición |
|---|---|
| **SPA** | Single Page Application; la navegación ocurre sin recargar la página. |
| **JWT** | JSON Web Token; credencial firmada que identifica al usuario. |
| **BLOB** | Objeto binario grande; se usa para guardar la imagen del producto. |
| **bcrypt** | Algoritmo de hash con sal para almacenar contraseñas. |
| **DER** | Diagrama Entidad-Relación del modelo de datos. |
| **CRUD** | Crear, Leer, Actualizar y Eliminar. |
| **Rol** | Perfil de permisos: CLIENTE, ADMIN o SUPER_ADMIN. |

---

## 15. Anexos

- Repositorio: https://github.com/xeproxtro/RuffCol_Pagina_Y_Recursos_Adjuntos
- DER y diccionario: [BaseDatos/DER.md](BaseDatos/DER.md)
- Scripts SQL: [BaseDatos/](BaseDatos/)
- Modelo MER: [../MODELO_MER.md](../MODELO_MER.md)
- Ciclo Scrum: [Ciclo_Scrum_Ruffcol.pdf](Ciclo_Scrum_Ruffcol.pdf)
- Instalación del entorno: [INSTALACION_ENTORNO_DESARROLLO.md](INSTALACION_ENTORNO_DESARROLLO.md)
- Inicio rápido: [README_INICIO_RAPIDO.md](README_INICIO_RAPIDO.md)
