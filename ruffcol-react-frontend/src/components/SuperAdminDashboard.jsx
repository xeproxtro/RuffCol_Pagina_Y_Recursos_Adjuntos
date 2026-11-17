import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:3000'

function SuperAdminDashboard() {
  const [administradores, setAdministradores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    cargarAdministradores()
  }, [])

  const cargarAdministradores = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/superadmin/administradores`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAdministradores(response.data)
      setError('')
    } catch (err) {
      setError('Error al cargar administradores')
    }
    setLoading(false)
  }

  const mostrarMensaje = (msg, tipo = 'success') => {
    if (tipo === 'success') {
      setSuccess(msg)
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(msg)
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      mostrarMensaje('Las contraseñas no coinciden', 'error')
      return
    }

    if (form.password.length < 6) {
      mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/superadmin/crear-admin`, {
        nombre: form.nombre,
        username: form.username,
        email: form.email,
        password: form.password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      mostrarMensaje('¡Administrador creado exitosamente!')
      setForm({ nombre: '', username: '', email: '', password: '', confirmPassword: '' })
      cargarAdministradores()
    } catch (err) {
      mostrarMensaje('Error al crear administrador: ' + (err.response?.data?.error || err.message), 'error')
    }
  }

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row>
        {/* Formulario crear administrador */}
        <Col lg={5}>
          <Card className="h-100">
            <Card.Header>
              <h4 className="mb-0"><i className="bi bi-person-plus"></i> Crear Administrador</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted">Crea una cuenta de administrador activa de forma directa.</p>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo *</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({...form, nombre: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre de usuario *</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="admin@ruffcol.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña (mínimo 6 caracteres) *</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    required
                    minLength="6"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar contraseña *</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  <i className="bi bi-person-plus"></i> Crear Administrador
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Lista de administradores */}
        <Col lg={7}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0"><i className="bi bi-people"></i> Administradores Activos</h4>
              <Button variant="light" size="sm" onClick={cargarAdministradores}>
                <i className="bi bi-arrow-clockwise"></i> Actualizar
              </Button>
            </Card.Header>
            <Card.Body>
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {administradores.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.nombre}</td>
                      <td>{a.username || ''}</td>
                      <td>{a.email || ''}</td>
                      <td>
                        <span className={`badge ${a.estado_cuenta === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`}>
                          {a.estado_cuenta || ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {administradores.length === 0 && (
                <Alert variant="info">No hay administradores activos.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SuperAdminDashboard
