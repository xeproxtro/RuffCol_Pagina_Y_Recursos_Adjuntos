# Modelo MER - Ruffcol Tienda

## Descripción General
Sistema de e-commerce para tienda de ropa y accesorios para mascotas.

---

## Entidades

### 1. USUARIO
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| nombre | VARCHAR(100) | Nombre completo del usuario | NOT NULL, MAX 100 |
| username | VARCHAR(50) | Nombre de usuario para login | NOT NULL, UNIQUE, MAX 50 |
| email | VARCHAR(100) | Correo electrónico | UNIQUE, MAX 100 |
| password | VARCHAR(255) | Contraseña encriptada | NOT NULL |
| rol | ENUM | Rol del usuario | NOT NULL |
| estado_cuenta | ENUM | Estado de la cuenta | NOT NULL |
| fecha_registro | DATETIME | Fecha de registro del usuario | DEFAULT NOW() |

**Valores ENUM:**
- rol: CLIENTE, ADMIN, SUPER_ADMIN
- estado_cuenta: PENDIENTE, ACTIVO, INACTIVO

---

### 2. CATEGORIA
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| nombre | VARCHAR(50) | Nombre de la categoría | NOT NULL, UNIQUE, MAX 50 |
| descripcion | TEXT | Descripción de la categoría | |

---

### 3. PRODUCTO
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| nombre | VARCHAR(100) | Nombre del producto | NOT NULL, MAX 100 |
| descripcion | TEXT | Descripción del producto | |
| precio | DECIMAL(10,2) | Precio del producto | NOT NULL, > 0 |
| stock | INT | Cantidad disponible | NOT NULL, >= 0 |
| imagen | BLOB | Imagen del producto en bytes | |
| id_categoria | INT | FK a CATEGORIA | NOT NULL, FK |

---

### 4. PEDIDO
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| fecha_pedido | DATETIME | Fecha del pedido | NOT NULL |
| estado | ENUM | Estado del pedido | NOT NULL |
| total | DECIMAL(10,2) | Total del pedido | NOT NULL |
| id_usuario | INT | FK a USUARIO | NOT NULL, FK |

**Valores ENUM:**
- estado: PENDIENTE, EN_CONFECCION, ENVIADO, ENTREGADO

---

### 5. DETALLE_PEDIDO
| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | INT | Identificador único | PK, AUTO_INCREMENT |
| cantidad | INT | Cantidad del producto | NOT NULL, >= 1 |
| precio_unitario | DECIMAL(10,2) | Precio al momento del pedido | NOT NULL |
| id_pedido | INT | FK a PEDIDO | NOT NULL, FK |
| id_producto | INT | FK a PRODUCTO | NOT NULL, FK |

---

## Relaciones

### Relación 1: CATEGORIA - PRODUCTO
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Una categoría puede tener muchos productos, pero un producto pertenece a una sola categoría.
- **Cardinalidad:**
  - CATEGORIA (1) ---- (N) PRODUCTO
- **FK:** producto.id_categoria → categoria.id

### Relación 2: USUARIO - PEDIDO
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Un usuario puede tener muchos pedidos, pero un pedido pertenece a un solo usuario.
- **Cardinalidad:**
  - USUARIO (1) ---- (N) PEDIDO
- **FK:** pedido.id_usuario → usuario.id

### Relación 3: PEDIDO - DETALLE_PEDIDO
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Un pedido puede tener muchos detalles, pero un detalle pertenece a un solo pedido.
- **Cardinalidad:**
  - PEDIDO (1) ---- (N) DETALLE_PEDIDO
- **FK:** detalle_pedido.id_pedido → pedido.id

### Relación 4: PRODUCTO - DETALLE_PEDIDO
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Un producto puede aparecer en muchos detalles de pedido, pero un detalle pertenece a un solo producto.
- **Cardinalidad:**
  - PRODUCTO (1) ---- (N) DETALLE_PEDIDO
- **FK:** detalle_pedido.id_producto → producto.id

---

## Diagrama de Relaciones (ASCII)

```
┌─────────────┐         ┌─────────────┐
│  CATEGORIA  │         │  USUARIO    │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ nombre      │         │ nombre      │
│ descripcion │         │ username    │
└──────┬──────┘         │ email       │
       │                │ password    │
       │1               │ rol        │
       │                │ estado_cuenta│
       │N               │ fecha_registro│
       │                └──────┬──────┘
       │                       │1
       │                       │
       │                       │N
       │                       │
┌──────▼──────┐         ┌──────▼──────┐
│  PRODUCTO   │         │   PEDIDO    │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ nombre      │         │ fecha_pedido│
│ descripcion │         │ estado      │
│ precio      │         │ total       │
│ stock       │         │ id_usuario  │
│ imagen      │         └──────┬──────┘
│ id_categoria│                │1
└──────┬──────┘                │
       │1                      │N
       │                       │
       │N              ┌───────▼────────┐
       │              │ DETALLE_PEDIDO │
       │              ├────────────────┤
       │              │ id (PK)        │
       │              │ cantidad       │
       │              │ precio_unitario│
       │              │ id_pedido      │
       │              │ id_producto    │
       │              └────────────────┘
       │
       │N
       │
┌──────▼────────┐
│ DETALLE_PEDIDO│
└───────────────┘
```

---

## Reglas de Negocio

1. **Roles de Usuario:**
   - CLIENTE: Puede comprar productos y ver sus pedidos
   - ADMIN: Puede gestionar productos, categorías y ver pedidos
   - SUPER_ADMIN: Puede gestionar usuarios y toda la administración

2. **Estados de Cuenta:**
   - PENDIENTE: Usuario recién registrado, espera aprobación
   - ACTIVO: Usuario aprobado y con acceso completo
   - INACTIVO: Usuario desactivado o bloqueado

3. **Estados de Pedido:**
   - PENDIENTE: Pedido realizado, espera procesamiento
   - EN_CONFECCION: Pedido en preparación
   - ENVIADO: Pedido enviado al cliente
   - ENTREGADO: Pedido entregado al cliente

4. **Stock:**
   - El stock de un producto no puede ser negativo
   - Al realizar un pedido, se debe verificar stock disponible

5. **Relaciones:**
   - No pueden existir productos sin categoría
   - No pueden existir pedidos sin usuario
   - No pueden existir detalles de pedido sin pedido y sin producto
