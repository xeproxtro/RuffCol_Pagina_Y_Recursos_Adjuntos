# Documentación Completa - Ruffcol E-commerce Backend

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Explicación por Paquetes](#explicación-por-paquetes)
6. [Flujo de Autenticación JWT](#flujo-de-autenticación-jwt)
7. [Endpoints de la API](#endpoints-de-la-api)
8. [Base de Datos](#base-de-datos)
9. [Frontend](#frontend)
10. [Configuración](#configuración)
11. [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
12. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

---

## 📖 Descripción General

**Ruffcol** es un sistema de e-commerce para tienda de ropa y accesorios para mascotas. Es una aplicación web completa con:

- **Backend**: Spring Boot (Java)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Base de Datos**: H2 (archivo persistente para desarrollo)
- **Autenticación**: JWT (JSON Web Tokens)
- **Roles de Usuario**: CLIENTE, ADMIN, SUPER_ADMIN

### Características Principales
- Catálogo de productos con imágenes
- Carrito de compras
- Sistema de pedidos (en construcción)
- Panel de administración
- Panel de super administrador
- Gestión de categorías
- Gestión de productos con subida de imágenes

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue el patrón **MVC (Model-View-Controller)** ampliado con Spring Boot:

```
Frontend (HTML/JS/CSS) → Controller → Service → Repository → Database
                                    ↓
                                  DTO
```

### Capas de la Arquitectura

1. **Controller (Controlador)**: Recibe las peticiones HTTP, valida los datos y delega al servicio
2. **Service (Servicio)**: Contiene la lógica de negocio, validaciones complejas y transacciones
3. **Repository (Repositorio)**: Acceso a datos usando Spring Data JPA
4. **Model (Modelo)**: Entidades JPA que representan tablas de la base de datos
5. **DTO (Data Transfer Object)**: Objetos para transferir datos entre capas y con el frontend

---

## 📁 Estructura de Carpetas

```
ruffcol-backend/
├── src/
│   ├── main/
│   │   ├── java/com/ruffcol/tienda/
│   │   │   ├── config/              # Configuraciones de la aplicación
│   │   │   ├── controlador/         # Controladores REST (Endpoints API)
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── exception/           # Manejo de excepciones personalizadas
│   │   │   ├── modelo/              # Entidades JPA (Modelos de datos)
│   │   │   ├── repositorio/         # Interfaces Spring Data JPA
│   │   │   ├── servicio/            # Lógica de negocio
│   │   │   └── RuffcolApplication.java # Clase principal
│   │   └── resources/
│   │       ├── static/              # Archivos estáticos (HTML, CSS, JS, imágenes)
│   │       │   ├── css/
│   │       │   ├── images/
│   │       │   ├── js/
│   │       │   ├── admin-dashboard.html
│   │       │   ├── carrito.html
│   │       │   ├── index.html
│   │       │   ├── login.html
│   │       │   ├── pedidos-en-construccion.html
│   │       │   ├── registro.html
│   │       │   └── superadmin-dashboard.html
│   │       ├── application.properties # Configuración de la aplicación
│   │       └── data.sql            # Datos iniciales de la base de datos
│   └── test/                       # Pruebas unitarias
├── pom.xml                         # Configuración Maven
└── data/                           # Archivo de base de datos H2 (persistente)
```

---

## 🔧 Tecnologías Utilizadas

### Backend
- **Java 17**: Lenguaje de programación
- **Spring Boot 3.2.0**: Framework para aplicaciones Java
- **Spring Data JPA**: ORM para acceso a datos
- **Spring Security**: Seguridad y autenticación
- **H2 Database**: Base de datos relacional ligera
- **JWT (jjwt)**: Tokens de autenticación
- **SpringDoc OpenAPI**: Documentación Swagger UI
- **Lombok**: Reducción de código boilerplate
- **Maven**: Gestión de dependencias

### Frontend
- **HTML5**: Estructura de las páginas
- **CSS3**: Estilos (custom, no framework)
- **JavaScript (Vanilla)**: Lógica del frontend
- **Fetch API**: Peticiones HTTP al backend

---

## 📚 Explicación por Paquetes

### 1. `config/` - Configuraciones

#### `SecurityConfig.java`
**Propósito**: Configura la seguridad de Spring Security.

**Funciones principales**:
- Define qué endpoints son públicos y cuáles requieren autenticación
- Configura CORS para permitir peticiones desde el frontend
- Desactiva CSRF (no necesario para API REST)
- Configura el filtro JWT para autenticación
- Define permisos por roles (ADMIN, SUPER_ADMIN, CLIENTE)

**Configuración de endpoints**:
- **Públicos**: `/`, `/*.html`, `/css/**`, `/js/**`, `/images/**`, `/api/auth/**`, `/api/categorias`, `/api/productos`
- **Autenticados**: `/api/pedidos` (crear pedidos), `/api/pedidos/mis-pedidos`
- **Solo ADMIN/SUPER_ADMIN**: `/api/categorias/**` (CRUD), `/api/productos/**` (CRUD), `/api/pedidos/**` (gestión)
- **Solo SUPER_ADMIN**: `/api/superadmin/**`

#### `JWTUtil.java`
**Propósito**: Genera y valida tokens JWT.

**Métodos principales**:
- `generateToken()`: Crea un token JWT con userId, username y rol
- `extractClaims()`: Extrae los claims (datos) del token
- `extractUsername()`: Obtiene el username del token
- `extractUserId()`: Obtiene el ID del usuario del token
- `extractRol()`: Obtiene el rol del usuario del token
- `isTokenExpired()`: Verifica si el token ha expirado
- `validateToken()`: Valida que el token sea correcto y no esté expirado

**Configuración actual**:
- **Tiempo de expiración**: 7 días (604800000 ms)
- **Algoritmo**: HS256
- **Secret**: Configurado en `application.properties`

#### `JWTAuthenticationFilter.java`
**Propósito**: Filtro que intercepta cada petición HTTP para validar el token JWT.

**Flujo**:
1. Extrae el header `Authorization` de la petición
2. Verifica que empieza con "Bearer "
3. Extrae el token JWT
4. Valida el token con `JWTUtil`
5. Si es válido, establece la autenticación en el contexto de Spring Security
6. Agrega el `userId` al request para usarlo en los controladores

#### `FileUploadConfig.java`
**Propósito**: Configura la subida de archivos (imágenes de productos).

**Funciones**:
- Define el directorio donde se guardan las imágenes
- Configura el tamaño máximo de archivos (10MB)
- Configura el tamaño máximo de requests (10MB)

#### `OpenApiConfig.java`
**Propósito**: Configura la documentación Swagger/OpenAPI.

**Funciones**:
- Configura información general de la API (título, versión, descripción)
- Define la URL base del servidor
- Permite explorar los endpoints en `/swagger-ui.html`

---

### 2. `controlador/` - Controladores REST

#### `AuthController.java`
**Propósito**: Maneja autenticación y registro de usuarios.

**Endpoints**:
- `POST /api/auth/register-cliente`: Registra un nuevo cliente
  - Crea usuario con rol CLIENTE y estado ACTIVO
  - Encripta la contraseña con BCrypt
  - Retorna datos del usuario creado

- `POST /api/auth/login`: Inicia sesión
  - Valida username y contraseña
  - Genera token JWT válido por 7 días
  - Retorna token y datos del usuario

#### `CategoriaController.java`
**Propósito**: Gestión de categorías de productos.

**Endpoints**:
- `GET /api/categorias`: Obtiene todas las categorías (público)
- `GET /api/categorias/{id}`: Obtiene una categoría por ID (público)
- `POST /api/categorias`: Crea nueva categoría (ADMIN/SUPER_ADMIN)
- `PUT /api/categorias/{id}`: Actualiza categoría (ADMIN/SUPER_ADMIN)
- `DELETE /api/categorias/{id}`: Elimina categoría (ADMIN/SUPER_ADMIN)
  - Valida que no tenga productos asociados
  - Retorna JSON con mensaje de éxito

#### `ProductoController.java`
**Propósito**: Gestión de productos.

**Endpoints**:
- `GET /api/productos`: Obtiene todos los productos (público)
- `GET /api/productos/{id}`: Obtiene un producto por ID (público)
- `GET /api/productos/categoria/{idCategoria}`: Obtiene productos por categoría (público)
- `POST /api/productos`: Crea nuevo producto con imagen (ADMIN/SUPER_ADMIN)
- `PUT /api/productos/{id}`: Actualiza producto con imagen (ADMIN/SUPER_ADMIN)
- `DELETE /api/productos/{id}`: Elimina producto (ADMIN/SUPER_ADMIN)

#### `PedidoController.java`
**Propósito**: Gestión de pedidos.

**Endpoints**:
- `POST /api/pedidos`: Crea nuevo pedido (cualquier usuario autenticado)
  - Recibe items del carrito
  - Crea pedido y detalles
  - Actualiza stock de productos
- `GET /api/pedidos/mis-pedidos`: Obtiene pedidos del usuario autenticado
- `GET /api/pedidos`: Obtiene todos los pedidos (ADMIN/SUPER_ADMIN)
- `GET /api/pedidos/{id}`: Obtiene pedido por ID
- `PUT /api/pedidos/{id}/estado`: Actualiza estado del pedido (ADMIN/SUPER_ADMIN)
- `DELETE /api/pedidos/{id}`: Elimina pedido (ADMIN/SUPER_ADMIN)

#### `SuperAdminController.java`
**Propósito**: Funciones exclusivas del Super Administrador.

**Endpoints**:
- `POST /api/superadmin/crear-admin`: Crea nuevo administrador directamente
- `GET /api/superadmin/administradores`: Lista todos los administradores

---

### 3. `dto/` - Data Transfer Objects

Los DTOs son objetos que transfieren datos entre el frontend y el backend, exponiendo solo los datos necesarios y ocultando información sensible.

#### `AuthDTO.java`
- Campos: `username`, `password`
- Uso: Login de usuarios

#### `LoginResponseDTO.java`
- Campos: `token`, `userId`, `nombre`, `username`, `rol`
- Uso: Respuesta del login con token JWT

#### `RegistroClienteDTO.java`
- Campos: `nombre`, `username`, `email`, `password`
- Uso: Registro de nuevos clientes

#### `UsuarioDTO.java`
- Campos: `id`, `nombre`, `username`, `email`, `rol`, `estadoCuenta`, `fechaRegistro`
- Uso: Datos de usuario para mostrar en frontend (sin contraseña)

#### `CategoriaDTO.java`
- Campos: `id`, `nombre`, `descripcion`
- Uso: Datos de categoría

#### `ProductoDTO.java`
- Campos: `id`, `nombre`, `descripcion`, `precio`, `stock`, `categoriaId`, `categoriaNombre`
- Uso: Datos de producto (sin imagen en base64)

#### `ProductoConImagenDTO.java`
- Campos: Todos los de ProductoDTO + `imagen` (base64)
- Uso: Datos de producto con imagen

#### `PedidoDTO.java`
- Campos: `id`, `fechaPedido`, `total`, `estado`, `usuarioNombre`, `detalles`
- Uso: Datos de pedido

#### `CrearPedidoDTO.java`
- Campos: `items` (lista de ItemPedidoDTO)
- Uso: Crear nuevo pedido

#### `ItemPedidoDTO.java`
- Campos: `productoId`, `cantidad`
- Uso: Item de pedido

---

### 4. `exception/` - Manejo de Excepciones

#### `GlobalExceptionHandler.java`
**Propósito**: Captura excepciones globales y retorna respuestas HTTP estandarizadas.

**Funciones**:
- Captura `ResourceNotFoundException` → 404 Not Found
- Captura `BadRequestException` → 400 Bad Request
- Captura `UnauthorizedException` → 401 Unauthorized
- Captura cualquier excepción → 500 Internal Server Error

#### `ResourceNotFoundException.java`
- Se lanza cuando no se encuentra un recurso (usuario, producto, categoría, etc.)

#### `BadRequestException.java`
- Se lanza cuando hay errores de validación o lógica de negocio

#### `UnauthorizedException.java`
- Se lanza cuando el usuario no tiene permisos

---

### 5. `modelo/` - Entidades JPA

Las entidades representan tablas de la base de datos.

#### `Usuario.java`
**Tabla**: `usuario`

**Campos**:
- `id`: Identificador único (auto-incremental)
- `nombre`: Nombre completo del usuario
- `username`: Nombre de usuario (único)
- `email`: Email del usuario
- `password`: Contraseña encriptada con BCrypt
- `rol`: Rol del usuario (CLIENTE, ADMIN, SUPER_ADMIN)
- `estadoCuenta`: Estado de cuenta (ACTIVO, INACTIVO, BLOQUEADO)
- `fechaRegistro`: Fecha de registro

**Relaciones**:
- Un usuario puede tener muchos pedidos

#### `Producto.java`
**Tabla**: `producto`

**Campos**:
- `id`: Identificador único
- `nombre`: Nombre del producto
- `descripcion`: Descripción del producto
- `precio`: Precio del producto
- `stock`: Cantidad disponible
- `imagen`: Imagen en base64
- `categoria`: Categoría a la que pertenece

**Relaciones**:
- Muchos productos pueden pertenecer a una categoría
- Un producto puede estar en muchos detalles de pedido

#### `Categoria.java`
**Tabla**: `categoria`

**Campos**:
- `id`: Identificador único
- `nombre`: Nombre de la categoría
- `descripcion`: Descripción de la categoría

**Relaciones**:
- Una categoría puede tener muchos productos

#### `Pedido.java`
**Tabla**: `pedido`

**Campos**:
- `id`: Identificador único
- `fechaPedido`: Fecha del pedido
- `total`: Total del pedido
- `estado`: Estado del pedido (PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO, CANCELADO)
- `usuario`: Usuario que realizó el pedido

**Relaciones**:
- Un usuario puede tener muchos pedidos
- Un pedido puede tener muchos detalles

#### `DetallePedido.java`
**Tabla**: `detalle_pedido`

**Campos**:
- `id`: Identificador único
- `cantidad`: Cantidad del producto
- `precioUnitario`: Precio unitario al momento del pedido
- `pedido`: Pedido al que pertenece
- `producto`: Producto del detalle

**Relaciones**:
- Un pedido puede tener muchos detalles
- Un producto puede estar en muchos detalles

#### `Rol.java` (Enum)
- `CLIENTE`: Usuario normal que compra productos
- `ADMIN`: Administrador que gestiona productos y categorías
- `SUPER_ADMIN`: Super administrador que gestiona administradores

#### `EstadoCuenta.java` (Enum)
- `ACTIVO`: Cuenta activa
- `INACTIVO`: Cuenta inactiva
- `BLOQUEADO`: Cuenta bloqueada

#### `EstadoPedido.java` (Enum)
- `PENDIENTE`: Pedido pendiente de procesamiento
- `PROCESANDO`: Pedido en proceso
- `ENVIADO`: Pedido enviado
- `ENTREGADO`: Pedido entregado
- `CANCELADO`: Pedido cancelado

---

### 6. `repositorio/` - Repositorios Spring Data JPA

Los repositorios son interfaces que extienden de `JpaRepository` y proporcionan métodos CRUD automáticos.

#### `UsuarioRepository.java`
- Extiende: `JpaRepository<Usuario, Integer>`
- Métodos personalizados:
  - `findByUsername()`: Busca usuario por username
  - `existsByUsername()`: Verifica si existe username

#### `ProductoRepository.java`
- Extiende: `JpaRepository<Producto, Integer>`
- Métodos personalizados:
  - `findByCategoriaId()`: Busca productos por categoría

#### `CategoriaRepository.java`
- Extiende: `JpaRepository<Categoria, Integer>`
- Métodos personalizados:
  - `existsByNombre()`: Verifica si existe categoría por nombre

#### `PedidoRepository.java`
- Extiende: `JpaRepository<Pedido, Integer>`
- Métodos personalizados:
  - `findByUsuarioId()`: Busca pedidos por usuario

#### `DetallePedidoRepository.java`
- Extiende: `JpaRepository<DetallePedido, Integer>`
- Métodos personalizados:
  - `findByPedidoId()`: Busca detalles por pedido

---

### 7. `servicio/` - Lógica de Negocio

#### `UsuarioService.java` y `UsuarioServiceImpl.java`
**Funciones**:
- `registrarCliente()`: Registra nuevo cliente con validaciones
- `autenticar()`: Valida credenciales y retorna usuario
- `crearAdministrador()`: Crea administrador (solo super admin)

#### `ProductoService.java` y `ProductoServiceImpl.java`
**Funciones**:
- `crear()`: Crea producto con validaciones
- `actualizar()`: Actualiza producto
- `eliminar()`: Elimina producto
- `obtenerPorId()`: Obtiene producto por ID
- `obtenerTodos()`: Obtiene todos los productos
- `obtenerPorCategoria()`: Obtiene productos por categoría

#### `CategoriaService.java` y `CategoriaServiceImpl.java`
**Funciones**:
- `crear()`: Crea categoría (valida nombre único)
- `actualizar()`: Actualiza categoría
- `eliminar()`: Elimina categoría (valida que no tenga productos)
- `obtenerPorId()`: Obtiene categoría por ID
- `obtenerTodos()`: Obtiene todas las categorías

#### `PedidoService.java` y `PedidoServiceImpl.java`
**Funciones**:
- `crearPedido()`: Crea pedido con items del carrito
  - Valida stock disponible
  - Crea pedido y detalles
  - Actualiza stock de productos
- `obtenerPorUsuario()`: Obtiene pedidos de un usuario
- `obtenerTodos()`: Obtiene todos los pedidos
- `actualizarEstado()`: Actualiza estado de pedido
- `eliminar()`: Elimina pedido

#### `FileStorageService.java`
**Funciones**:
- `saveFile()`: Guarda archivo en disco
- `deleteFile()`: Elimina archivo del disco

---

## 🔐 Flujo de Autenticación JWT

### 1. Registro de Cliente
```
Frontend → POST /api/auth/register-cliente
         → UsuarioService.registrarCliente()
         → Encripta contraseña con BCrypt
         → UsuarioRepository.save()
         → Retorna UsuarioDTO
```

### 2. Login
```
Frontend → POST /api/auth/login (username, password)
         → UsuarioService.autenticar()
         → Valida contraseña con BCrypt
         → JWTUtil.generateToken()
         → Retorna LoginResponseDTO (con token JWT)
         → Frontend guarda token en localStorage
```

### 3. Petición Autenticada
```
Frontend → Petición con header: Authorization: Bearer {token}
         → JWTAuthenticationFilter intercepta
         → JWTUtil.extractClaims() y valida token
         → Establece autenticación en SecurityContext
         → Controller procesa petición
         → Retorna respuesta
```

### 4. Validación de Roles
```
SecurityConfig verifica roles:
- @requestMatchers(...).hasRole("ADMIN")
- @requestMatchers(...).hasAnyRole("ADMIN", "SUPER_ADMIN")
- @requestMatchers(...).authenticated()
```

---

## 🌐 Endpoints de la API

### Autenticación
- `POST /api/auth/register-cliente` - Registrar cliente
- `POST /api/auth/login` - Iniciar sesión

### Categorías (Públicas para lectura)
- `GET /api/categorias` - Listar todas
- `GET /api/categorias/{id}` - Obtener por ID
- `POST /api/categorias` - Crear (ADMIN/SUPER_ADMIN)
- `PUT /api/categorias/{id}` - Actualizar (ADMIN/SUPER_ADMIN)
- `DELETE /api/categorias/{id}` - Eliminar (ADMIN/SUPER_ADMIN)

### Productos (Públicos para lectura)
- `GET /api/productos` - Listar todos
- `GET /api/productos/{id}` - Obtener por ID
- `GET /api/productos/categoria/{idCategoria}` - Por categoría
- `POST /api/productos` - Crear (ADMIN/SUPER_ADMIN)
- `PUT /api/productos/{id}` - Actualizar (ADMIN/SUPER_ADMIN)
- `DELETE /api/productos/{id}` - Eliminar (ADMIN/SUPER_ADMIN)

### Pedidos
- `POST /api/pedidos` - Crear pedido (autenticado)
- `GET /api/pedidos/mis-pedidos` - Mis pedidos (autenticado)
- `GET /api/pedidos` - Todos los pedidos (ADMIN/SUPER_ADMIN)
- `GET /api/pedidos/{id}` - Por ID
- `PUT /api/pedidos/{id}/estado` - Actualizar estado (ADMIN/SUPER_ADMIN)
- `DELETE /api/pedidos/{id}` - Eliminar (ADMIN/SUPER_ADMIN)

### Super Admin
- `POST /api/superadmin/crear-admin` - Crear administrador
- `GET /api/superadmin/administradores` - Listar administradores

---

## 🗄️ Base de Datos

### Configuración Actual
- **Motor**: H2 Database
- **Modo**: Archivo persistente (no en memoria)
- **URL**: `jdbc:h2:file:./data/ruffcol_db`
- **Usuario**: `sa`
- **Contraseña**: (vacía)
- **Consola H2**: http://localhost:8080/h2-console

### Tablas
1. **usuario**: Usuarios del sistema
2. **categoria**: Categorías de productos
3. **producto**: Productos
4. **pedido**: Pedidos
5. **detalle_pedido**: Detalles de pedidos

### Datos Iniciales (data.sql)
- Super Administrador (username: `superadmin`, password: `admin123`)
- Cliente de prueba (username: `Cliente_Prueba`, password: `Waos123_cliente`)
- Admin Principal (username: `Admin_Principal`, password: `D4Clt//waos//tf2?`)
- Categorías: "Ropa y Vestidos", "Arneses y Correas"

---

## 🎨 Frontend

### Archivos HTML
- **index.html**: Página principal con catálogo de productos
- **login.html**: Formulario de login
- **registro.html**: Formulario de registro de clientes
- **carrito.html**: Carrito de compras
- **admin-dashboard.html**: Panel de administración
- **superadmin-dashboard.html**: Panel de super administrador
- **pedidos-en-construccion.html**: Página informativa (sistema de pedidos en desarrollo)

### Archivos JavaScript
- **js/api.js**: Funciones para comunicación con la API
  - Funciones de autenticación (login, logout, register)
  - Funciones de productos, categorías, pedidos
  - Funciones del carrito (localStorage)
  - Funciones auxiliares (fetch, validación)

### Funcionalidades del Frontend
- Navegación dinámica según rol
- Carrito persistente en localStorage
- Contador de items en carrito
- Validación de autenticación
- Filtros de productos por categoría y búsqueda
- CRUD de productos con subida de imágenes
- CRUD de categorías
- Gestión de pedidos (vista para admin)

---

## ⚙️ Configuración

### application.properties

```properties
# Servidor
server.port=8080
spring.application.name=ruffcol-backend

# Base de Datos H2 (persistente)
spring.datasource.url=jdbc:h2:file:./data/ruffcol_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Consola H2
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect

# Inicialización SQL
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true

# CORS
cors.allowed.origins=http://localhost:8080,http://localhost:3000
cors.allowed.methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed.headers=*
cors.allow.credentials=true

# JWT
jwt.secret=ruffcol-secret-key-2024-super-secreto-para-tokens-jwt
jwt.expiration=604800000  # 7 días

# Subida de archivos
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Directorio de uploads
upload.dir=uploads
upload.path=/uploads/

# Swagger/OpenAPI
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos
- Java 17 o superior
- Maven 3.6+
- Navegador web moderno

### Pasos

1. **Clonar el repositorio** (si aplica)
   ```bash
   git clone <url-del-repositorio>
   cd RUFCo\ Pagina/ruffcol-backend
   ```

2. **Compilar el proyecto**
   ```bash
   mvn clean install
   ```

3. **Ejecutar la aplicación**
   ```bash
   mvn spring-boot:run
   ```

4. **Acceder a la aplicación**
   - **Tienda**: http://localhost:8080
   - **Swagger UI**: http://localhost:8080/swagger-ui.html
   - **H2 Console**: http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:file:./data/ruffcol_db`
     - User: `sa`
     - Password: (vacío)

### Usuarios de Prueba

**Super Administrador**
- Username: `superadmin`
- Password: `admin123`
- Rol: SUPER_ADMIN

**Cliente de Prueba**
- Username: `Cliente_Prueba`
- Password: `Waos123_cliente`
- Rol: CLIENTE

**Admin Principal**
- Username: `Admin_Principal`
- Password: `D4Clt//waos//tf2?`
- Rol: ADMIN

---

## 🔧 Solución de Problemas Comunes

### 1. El proyecto no inicia

**Posibles causas**:
- Puerto 8080 ya en uso
- Java no instalado o versión incorrecta
- Maven no configurado

**Soluciones**:
- Cambiar el puerto en `application.properties`: `server.port=8081`
- Verificar instalación: `java -version` y `mvn -version`
- Limpiar y rebuild: `mvn clean install`

### 2. Error de autenticación "Sesión expirada"

**Causa**: Token JWT expirado

**Solución**:
- El token ahora dura 7 días
- Si expira, cerrar sesión y volver a iniciar sesión

### 3. Error "Forbidden" al crear pedido

**Causa**: Configuración de seguridad incorrecta

**Solución**:
- Verificar que en `SecurityConfig.java` la línea `/api/pedidos` use `.authenticated()` en lugar de `.hasAnyRole("ADMIN", "SUPER_ADMIN")`

### 4. Datos se borran al reiniciar

**Causa**: Base de datos en memoria

**Solución**:
- Verificar que en `application.properties` use `jdbc:h2:file:./data/ruffcol_db` en lugar de `jdbc:h2:mem:ruffcol_db`

### 5. Error al eliminar categoría

**Causa**: Categoría tiene productos asociados

**Solución**:
- Eliminar o reasignar los productos primero
- El sistema muestra mensaje de error indicando esto

### 6. Imágenes no se muestran

**Causa**: Directorio de uploads no existe o permisos

**Solución**:
- Crear directorio `uploads/` en la raíz del proyecto
- Verificar permisos de escritura

---

## 📝 Notas Adicionales

### Seguridad en Producción
- Cambiar el secret de JWT
- Usar base de datos MySQL/PostgreSQL en lugar de H2
- Implementar HTTPS
- Configurar firewall
- Usar variables de entorno para credenciales

### Mejoras Futuras
- Implementar pasarela de pagos
- Sistema de notificaciones por email
- Búsqueda avanzada de productos
- Sistema de calificaciones y reseñas
- Panel de cliente para ver historial de pedidos
- Gestión de inventario con alertas de stock bajo

### Contacto
Para soporte o preguntas, revisar la documentación de Spring Boot:
- https://spring.io/projects/spring-boot
- https://spring.io/guides/gs/rest-service/

---

**Última actualización**: Octubre 2026
**Versión**: 1.0.0
