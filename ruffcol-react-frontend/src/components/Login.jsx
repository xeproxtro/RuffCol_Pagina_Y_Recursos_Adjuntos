import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Card>
            <Card.Header className="text-center">
              <h4 className="mb-0">Ruffcol</h4>
              <p className="mb-0">Iniciar Sesión</p>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Ingresa tu usuario"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Ingresa tu contraseña"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                </p>
              </div>

              <div className="text-center mt-3">
                <Button variant="outline-secondary" size="sm" onClick={() => navigate('/')}>
                  <i className="bi bi-house"></i> Volver al Inicio
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default Login
