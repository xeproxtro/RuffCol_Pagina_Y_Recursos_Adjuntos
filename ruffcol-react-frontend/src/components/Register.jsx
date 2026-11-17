import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

function Register() {
  const [nombre, setNombre] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const result = await register(nombre, username, email, password)

    if (result.success) {
      alert('¡Registro exitoso! Ahora puedes iniciar sesión')
      navigate('/login')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Card>
            <Card.Header className="text-center">
              <h4 className="mb-0">Registro de Cliente</h4>
              <small>Únete a Ruffcol</small>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Tu nombre completo"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Tu nombre de usuario"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email (opcional)</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña (mínimo 6 caracteres)</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="Tu contraseña"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirma tu contraseña"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Registrarse como Cliente'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
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

export default Register
