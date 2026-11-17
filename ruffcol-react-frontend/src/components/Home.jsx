import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:3000'

function Home() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    cargarCategorias()
    cargarProductos()
  }, [])

  useEffect(() => {
    cargarProductos()
  }, [filtroCategoria])

  const cargarCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categorias`)
      setCategorias(response.data)
    } catch (err) {
      console.error('Error al cargar categorías:', err)
    }
  }

  const cargarProductos = async () => {
    setLoading(true)
    try {
      let url = `${API_URL}/api/productos`
      if (filtroCategoria) {
        url = `${API_URL}/api/productos/categoria/${filtroCategoria}`
      }

      const response = await axios.get(url)
      let productosFiltrados = response.data

      if (busqueda) {
        productosFiltrados = productosFiltrados.filter(p =>
          p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
      }

      setProductos(productosFiltrados)
      setError('')
    } catch (err) {
      setError('Error al cargar productos')
    }
    setLoading(false)
  }

  const agregarAlCarrito = (producto) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito')
      return
    }

    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]')
    const itemExistente = carrito.find(item => item.productoId === producto.id)

    if (itemExistente) {
      itemExistente.cantidad += 1
    } else {
      carrito.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen
      })
    }

    localStorage.setItem('carrito', JSON.stringify(carrito))
    alert('Producto agregado al carrito')
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h3 className="mb-0">Catálogo de Productos</h3>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button onClick={cargarProductos}>Buscar</Button>
            </Col>
          </Row>

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <Row>
              {productos.map(producto => (
                <Col key={producto.id} md={4} className="mb-4">
                  <Card className="h-100">
                    <Card.Img
                      variant="top"
                      src={producto.imagen ? `data:image/jpeg;base64,${producto.imagen}` : 'https://via.placeholder.com/300x200?text=Producto'}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                      <Card.Title>{producto.nombre}</Card.Title>
                      <Card.Text className="text-muted">{producto.descripcion || ''}</Card.Text>
                      <Card.Text><strong>${producto.precio}</strong></Card.Text>
                      <Card.Text>Stock: {producto.stock}</Card.Text>
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock <= 0}
                      >
                        {producto.stock <= 0 ? 'Sin stock' : 'Agregar al Carrito'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {!loading && !error && productos.length === 0 && (
            <Alert variant="info">No hay productos disponibles.</Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Home
