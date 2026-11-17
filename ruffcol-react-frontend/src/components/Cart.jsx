import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:3000'

function Cart() {
  const [carrito, setCarrito] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { isAuthenticated, getToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    cargarCarrito()
  }, [isAuthenticated, navigate])

  const cargarCarrito = () => {
    const carritoData = JSON.parse(localStorage.getItem('carrito') || '[]')
    setCarrito(carritoData)
  }

  const cambiarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(productoId)
      return
    }

    const nuevoCarrito = carrito.map(item =>
      item.productoId === productoId ? { ...item, cantidad: nuevaCantidad } : item
    )
    setCarrito(nuevoCarrito)
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito))
  }

  const eliminarItem = (productoId) => {
    const nuevoCarrito = carrito.filter(item => item.productoId !== productoId)
    setCarrito(nuevoCarrito)
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito))
  }

  const vaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      setCarrito([])
      localStorage.removeItem('carrito')
    }
  }

  const realizarPedido = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const items = carrito.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad
      }))

      await axios.post(`${API_URL}/api/pedidos`, { items }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setCarrito([])
      localStorage.removeItem('carrito')
      setSuccess('¡Pedido realizado exitosamente!')

      setTimeout(() => {
        navigate('/my-orders')
      }, 2000)
    } catch (err) {
      setError('Error al realizar pedido: ' + (err.response?.data?.error || err.message))
    }
  }

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h3 className="mb-0">Carrito de Compras</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {carrito.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x display-1 text-muted"></i>
              <p className="mt-3 fs-4 text-muted">Tu carrito está vacío</p>
              <Button variant="primary" onClick={() => navigate('/')}>Ir al Catálogo</Button>
            </div>
          ) : (
            <>
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => {
                    const subtotal = item.precio * item.cantidad
                    return (
                      <tr key={item.productoId}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.imagen ? `data:image/jpeg;base64,${item.imagen}` : 'https://via.placeholder.com/50'}
                              className="rounded me-2"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              alt={item.nombre}
                            />
                            <span>{item.nombre}</span>
                          </div>
                        </td>
                        <td>${item.precio}</td>
                        <td>
                          <div className="input-group" style={{ width: '120px' }}>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
                            >-</Button>
                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.cantidad}
                              readOnly
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
                            >+</Button>
                          </div>
                        </td>
                        <td>${subtotal.toFixed(2)}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => eliminarItem(item.productoId)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>

              <div className="text-end mt-4">
                <h4>Total: ${total.toFixed(2)}</h4>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={vaciarCarrito}>
                  <i className="bi bi-trash"></i> Vaciar Carrito
                </Button>
                <Button variant="success" onClick={realizarPedido}>
                  <i className="bi bi-check-circle"></i> Realizar Pedido
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Cart
