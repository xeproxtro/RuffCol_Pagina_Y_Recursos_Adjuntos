# Ruffcol - Tienda de Ropa y Accesorios para Mascotas

![Ruffcol Logo](https://via.placeholder.com/150?text=Ruffcol)

Sistema de e-commerce para la gestión de una tienda de ropa y accesorios para mascotas, desarrollado con Spring Boot (backend) y JavaScript genérico con Bootstrap 5 (frontend).

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelo de Base de Datos](#modelo-de-base-de-datos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [API Endpoints](#api-endpoints)
- [CRUDs por Miembro del Equipo](#cruds-por-miembro-del-equipo)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## 📖 Descripción del Proyecto

Ruffcol es una plataforma de comercio electrónico diseñada para la venta de ropa y accesorios para mascotas. El sistema permite a los clientes navegar por el catálogo de productos, agregar items al carrito de compras y realizar pedidos. Los administradores pueden gestionar productos, categorías y pedidos, mientras que el super administrador tiene control total sobre los usuarios del sistema.

### Objetivos Principales

- Proporcionar una interfaz intuitiva para la compra de productos para mascotas
- Facilitar la gestión de inventario y categorías
- Permitir el seguimiento de pedidos en tiempo real
- Mantener un control de usuarios con roles diferenciados

---

## ✨ Características

### Para Clientes
- 🛒 Catálogo de productos con filtrado por categoría y búsqueda
- 📦 Carrito de compras con gestión de cantidades
- 📋 Historial de pedidos con seguimiento de estado
- 👤 Registro de usuarios y autenticación

### Para Administradores
- 📦 Gestión completa de productos (CRUD)
- 🏷️ Gestión de categorías (CRUD)
- 📊 Gestión de pedidos con cambio de estado
- 👁️ Vista de todos los pedidos del sistema

### Para Super Administradores
- 👥 Gestión de usuarios administradores
- 🛡️ Control total del sistema
- 🔐 Creación directa de cuentas de administrador

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.x** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Spring Security** - Seguridad y autenticación
- **MySQL** - Base de datos relacional
- **JWT (JSON Web Token)** - Autenticación basada en tokens
- **Lombok** - Reducción de código boilerplate
- **Swagger/OpenAPI** - Documentación de API

### Frontend
- **HTML5** - Estructura de las páginas
- **CSS3** - Estilos personalizados
- **Bootstrap 5** - Framework CSS para diseño responsivo
- **Bootstrap Icons** - Iconos del sistema
- **JavaScript Genérico (ES6+)** - Lógica del frontend
- **XMLHttpRequest** - Peticiones HTTP al backend

---

## 📁 Estructura del Proyecto

```
RUFCo Pagina/
├── ruffcol-backend/                 # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ruffcol/tienda/
│   │   │   │   ├── controlador/     # Controladores REST
│   │   │   │   ├── modelo/          # Entidades JPA
│   │   │   │   ├── repositorio/     # Repositorios JPA
│   │   │   │   ├── servicio/        # Lógica de negocio
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── config/          # Configuraciones
│   │   │   │   └── exception/       # Manejo de excepciones
│   │   │   └── resources/
│   │   │       ├── static/          # Archivos estáticos (HTML, CSS, JS)
│   │   │       │   ├── index.html
│   │   │       │   ├── login.html
│   │   │       │   ├── registro.html
│   │   │       │   ├── carrito.html
│   │   │       │   ├── mis-pedidos.html
│   │   │       │   ├── admin-dashboard.html
│   │   │       │   ├── superadmin-dashboard.html
│   │   │       │   └── js/
│   │   │       │       ├── request.js
│   │   │       │       └── carrito.js
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml                       # Dependencias Maven
├── MODELO_MER.md                    # Documentación del modelo de datos
└── README.md                        # Este archivo
```

---

## 🗄️ Modelo de Base de Datos

El sistema cuenta con 5 entidades principales:

### Entidades
1. **USUARIO** - Gestión de usuarios del sistema
2. **CATEGORIA** - Clasificación de productos
3. **PRODUCTO** - Catálogo de productos
4. **PEDIDO** - Pedidos de los clientes
5. **DETALLE_PEDIDO** - Items dentro de cada pedido

### Relaciones
- CATEGORIA 1:N PRODUCTO
- USUARIO 1:N PEDIDO
- PEDIDO 1:N DETALLE_PEDIDO
- PRODUCTO 1:N DETALLE_PEDIDO

Para más detalles, consulta el documento [MODELO_MER.md](MODELO_MER.md).

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- Java Development Kit (JDK) 17 o superior
- Apache Maven 3.6+
- MySQL 8.0+
- Navegador web moderno (Chrome, Firefox, Edge)

### Configuración de la Base de Datos

1. Crear la base de datos en MySQL:
```sql
CREATE DATABASE ruffcol_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Configurar las credenciales en `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ruffcol_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Ejecución del Backend

1. Navegar al directorio del backend:
```bash
cd ruffcol-backend
```

2. Compilar el proyecto con Maven:
```bash
mvn clean install
```

3. Ejecutar la aplicación:
```bash
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8094`

### Acceso a la Aplicación

Una vez iniciado el backend, accede a través del navegador:
- **Tienda:** `http://localhost:8094/index.html`
- **Login:** `http://localhost:8094/login.html`
- **Registro:** `http://localhost:8094/registro.html`
- **Panel Admin:** `http://localhost:8094/admin-dashboard.html`
- **Panel Super Admin:** `http://localhost:8094/superadmin-dashboard.html`

### Credenciales Iniciales

**⚠️ IMPORTANTE:** Antes de usar el sistema, debes crear el primer usuario SUPER_ADMIN a través de un endpoint directo o modificar la base de datos manualmente:

```sql
INSERT INTO usuario (nombre, username, email, password, rol, estado_cuenta, fecha_registro)
VALUES ('Super Admin', 'superadmin', 'superadmin@ruffcol.com', '$2a$10$...hash...', 'SUPER_ADMIN', 'ACTIVO', NOW());
```

Para generar el hash de la contraseña, puedes usar el endpoint de registro o herramientas online de BCrypt.

---

## 📱 Uso de la Aplicación

### Flujo de Cliente

1. **Registro:** El cliente se registra en el sistema
2. **Exploración:** Navega por el catálogo de productos
3. **Selección:** Agrega productos al carrito
4. **Compra:** Realiza el pedido desde el carrito
5. **Seguimiento:** Monitorea el estado de sus pedidos

### Flujo de Administrador

1. **Login:** Accede con credenciales de administrador
2. **Gestión de Productos:** Crea, edita y elimina productos
3. **Gestión de Categorías:** Organiza el catálogo
4. **Gestión de Pedidos:** Actualiza estados de pedidos

### Flujo de Super Administrador

1. **Login:** Accede con credenciales de super administrador
2. **Creación de Admins:** Genera cuentas de administrador
3. **Gestión Total:** Control completo del sistema

---

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register-cliente` - Registrar cliente

### Categorías
- `GET /api/categorias` - Listar todas las categorías
- `POST /api/categorias` - Crear categoría (Admin)
- `PUT /api/categorias/{id}` - Actualizar categoría (Admin)
- `DELETE /api/categorias/{id}` - Eliminar categoría (Admin)

### Productos
- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/categoria/{id}` - Listar productos por categoría
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/{id}` - Actualizar producto (Admin)
- `DELETE /api/productos/{id}` - Eliminar producto (Admin)

### Pedidos
- `GET /api/pedidos` - Listar todos los pedidos (Admin)
- `GET /api/pedidos/mis-pedidos` - Listar pedidos del usuario actual
- `POST /api/pedidos` - Crear pedido
- `PUT /api/pedidos/{id}/estado` - Actualizar estado del pedido (Admin)
- `DELETE /api/pedidos/{id}` - Eliminar pedido (Admin)

### Super Admin
- `GET /api/superadmin/administradores` - Listar administradores
- `POST /api/superadmin/crear-admin` - Crear administrador

---

## 👥 CRUDs por Miembro del Equipo

| Miembro del Equipo | CRUD Asignado | Archivos Relacionados |
|--------------------|---------------|----------------------|
| Emmanuel Moreno Rueda | Categorías, Productos | `CategoriaController.java`, `CategoriaService.java`, `ProductoController.java`, `ProductoService.java`, `admin-dashboard.html` |
| Andres Rodriguez | Pedidos, Usuarios, Carrito | `PedidoController.java`, `PedidoService.java`, `AuthController.java`, `UsuarioService.java`, `carrito.js`, `carrito.html`, `mis-pedidos.html`, `login.html`, `registro.html` |

### Evidencias de Funcionalidad

Cada CRUD incluye:
- ✅ Página HTML con interfaz de usuario
- ✅ Controlador REST con endpoints correspondientes
- ✅ Servicio con lógica de negocio
- ✅ Repositorio JPA para acceso a datos
- ✅ Validaciones y manejo de errores

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Equipo de Desarrollo

| Nombre | Rol | Responsabilidades |
|-------|-----|-------------------|
| Emmanuel Moreno Rueda | Backend/Frontend | Categorías, Productos |
| Andres Rodriguez | Backend/Frontend | Pedidos, Usuarios, Carrito |

---

## 📞 Contacto

Para preguntas o soporte, contacta a:
- Email: contacto@ruffcol.com
- Repositorio: [GitHub](https://github.com/tu-usuario/ruffcol-pagina)

---

## 🙏 Agradecimientos

- A Spring Boot por proporcionar un framework robusto
- A Bootstrap por el framework CSS
- A todos los contribuyentes de librerías open source utilizadas

---

**Última actualización:** Octubre 2026
