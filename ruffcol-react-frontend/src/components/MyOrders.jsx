import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:3000'

const ESTADOS = {
  'PENDIENTE': { texto: 'Pendiente', clase: 'bg-warning text-dark' },
  'EN_CONFECCION': { texto: 'En Confección', clase: 'bg-info text-dark' },
  'ENVIADO': { texto: 'Enviado', clase: 'bg-primary' },
  'ENTREGADO': { texto: 'Entregado', clase: 'bg-success' }
}

function MyOrders() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarPedidos()
  }, [])

  const cargarPedidos = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/pedidos/mis-pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPedidos(response.data)
      setError('')
    } catch (err) {
      setError('Error al cargar pedidos')
    }
    setLoading(false)
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0"><i className="bi bi-bag-check"></i> Mis Pedidos</h3>
          <Button variant="light" size="sm" onClick={cargarPedidos}>
            <i className="bi bi-arrow-clockwise"></i> Actualizar
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          )}

          {!loading && !error && pedidos.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <p className="mt-3 fs-4 text-muted">Aún no has realizado pedidos</p>
            </div>
          )}

          {!loading && !error && pedidos.length > 0 && (
            <div>
              {pedidos.map(pedido => {
                const estado = ESTADOS[pedido.estado] || { texto: pedido.estado, clase: 'bg-secondary' }
                const fecha = pedido.fecha_pedido
                  ? new Date(pedido.fecha_pedido).toLocaleString('es-CO')
                  : 'Sin fecha'

                return (
                  <Card key={pedido.id} className="mb-3 pedido-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                          <h5 className="mb-1">Pedido #{pedido.id}</h5>
                          <small className="text-muted"><i className="bi bi-calendar3"></i> {fecha}</small>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className={`badge ${estado.clase}`}>{estado.texto}</span>
                          <h4 className="mb-0 text-primary">${Number(pedido.total).toFixed(2)}</h4>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )
              })}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default MyOrders
