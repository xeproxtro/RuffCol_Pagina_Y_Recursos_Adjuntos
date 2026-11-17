import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { useAuth } from '../context/AuthContext'

function CustomNavbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-heart-fill"></i> Ruffcol
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {isAuthenticated && user?.rol === 'CLIENTE' && (
              <>
                <Nav.Link as={Link} to="/cart">
                  <i className="bi bi-cart3"></i> Carrito
                </Nav.Link>
                <Nav.Link as={Link} to="/my-orders">Mis Pedidos</Nav.Link>
              </>
            )}
            {isAuthenticated && (user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN') && (
              <Nav.Link as={Link} to="/admin">Panel Admin</Nav.Link>
            )}
            {isAuthenticated && user?.rol === 'SUPER_ADMIN' && (
              <Nav.Link as={Link} to="/superadmin">Panel Super Admin</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Item>
                  <Nav.Link disabled>Hola, {user?.nombre}</Nav.Link>
                </Nav.Item>
                <Nav.Link onClick={logout}>Cerrar Sesión</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar
