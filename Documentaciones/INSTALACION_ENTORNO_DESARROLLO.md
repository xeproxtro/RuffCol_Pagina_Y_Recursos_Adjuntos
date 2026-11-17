# Instalación del Entorno de Desarrollo

Este documento describe cómo configurar el entorno de desarrollo para ejecutar el proyecto Ruffcol con sus diferentes opciones de backend y frontend.

---

## 📋 Requisitos Previos

### Opcionales (para Java/Spring Boot)
- Java Development Kit (JDK) 17 o superior
- Apache Maven 3.6+
- MySQL 8.0+

### Necesarios (para Node.js/React)
- Node.js 18+ o superior
- npm (incluido con Node.js)

---

## 🚀 Opción 1: Backend Node.js + Frontend React (Recomendado)

### Backend Node.js

1. **Navegar al directorio del backend Node.js:**
```bash
cd ruffcol-nodejs-backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor:**
```bash
npm start
```

El servidor Node.js estará disponible en: `http://localhost:3000`

**Credenciales por defecto:**
- Usuario: `superadmin`
- Contraseña: `admin123`

### Frontend React

1. **Navegar al directorio del frontend React:**
```bash
cd ruffcol-react-frontend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

La aplicación React estará disponible en: `http://localhost:5173`

---

## 🚀 Opción 2: Backend Java/Spring Boot + Frontend HTML/JS (Original)

### Backend Spring Boot

1. **Navegar al directorio del backend:**
```bash
cd ruffcol-backend
```

2. **Compilar el proyecto con Maven:**
```bash
mvn clean install
```

3. **Ejecutar la aplicación:**
```bash
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8094`

### Frontend HTML/JS

El frontend estático ya está incluido en el backend en la carpeta `src/main/resources/static/`. Simplemente accede a:

- Tienda: `http://localhost:8094/index.html`
- Login: `http://localhost:8094/login.html`
- Registro: `http://localhost:8094/registro.html`

---

## 🛠️ Estructura del Proyecto

```
RUFCo Pagina/
├── ruffcol-backend/              # Backend Java/Spring Boot (opcional)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/             # Código Java
│   │   │   └── resources/
│   │   │       └── static/       # Frontend HTML/JS
│   └── pom.xml
├── ruffcol-nodejs-backend/       # Backend Node.js/Express (nuevo)
│   ├── server.js                 # Servidor Express
│   ├── package.json
│   └── ruffcol.db               # Base de datos SQLite (se crea automáticamente)
├── ruffcol-react-frontend/       # Frontend React (nuevo)
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── context/             # Context API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── Documentaciones/
│   ├── INSTALACION_ENTORNO_DESARROLLO.md
│   └── README_INICIO_RAPIDO.md
├── MODELO_MER.md
└── README.md
```

---

## 🔧 Configuración Adicional

### Base de Datos

#### Node.js (SQLite)
La base de datos SQLite se crea automáticamente en el archivo `ruffcol.db` al iniciar el servidor por primera vez. No requiere configuración adicional.

#### Java (MySQL)
1. Crear la base de datos en MySQL:
```sql
CREATE DATABASE ruffcol_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Configurar credenciales en `ruffcol-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ruffcol_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

---

## 📦 Tecnologías Utilizadas

### Backend Node.js
- **Express** - Framework web
- **SQLite3** - Base de datos
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Habilita CORS
- **multer** - Subida de archivos

### Frontend React
- **React 18** - Framework de UI
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Bootstrap** - Componentes UI
- **Vite** - Build tool

---

## 🧪 Pruebas

### Backend Node.js
Puedes probar los endpoints usando herramientas como Postman o cURL:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"admin123"}'

# Obtener productos
curl http://localhost:3000/api/productos

# Obtener categorías
curl http://localhost:3000/api/categorias
```

### Frontend React
Abre el navegador en `http://localhost:5173` y navega por la aplicación.

---

## ❌ Solución de Problemas

### Backend Node.js no inicia
- Verifica que el puerto 3000 esté disponible
- Asegúrate de haber ejecutado `npm install`
- Revisa los logs de la consola

### Frontend React no carga
- Verifica que el puerto 5173 esté disponible
- Asegúrate de que el backend Node.js esté corriendo en el puerto 3000
- Revisa la consola del navegador para errores

### Error de conexión entre frontend y backend
- Verifica que ambos servicios estén corriendo
- Revisa la configuración de proxy en `vite.config.js`
- Verifica que el backend tenga CORS habilitado

---

## 📝 Notas Importantes

1. **Base de datos SQLite**: Se crea automáticamente al iniciar el backend Node.js por primera vez
2. **Usuario por defecto**: Se crea un super admin automáticamente con usuario `superadmin` y contraseña `admin123`
3. **Categorías de prueba**: Se insertan 3 categorías por defecto si la base de datos está vacía
4. **Imágenes**: Las imágenes se almacenan como BLOB en la base de datos SQLite
5. **Tokens JWT**: Los tokens expiran en 24 horas

---

## 🎓 Recursos de Aprendizaje

- [Documentación de Express](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de SQLite3](https://github.com/TryGhost/node-sqlite3)
- [Documentación de Vite](https://vitejs.dev/)

---

**Última actualización:** Noviembre 2026
