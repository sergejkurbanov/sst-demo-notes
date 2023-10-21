import { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import Routes from './Routes.tsx'
import { AppContext, AppContextType } from './lib/contextLib'
import { onError } from './lib/errorLib'
import './App.css'

function App() {
  const nav = useNavigate()
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    try {
      await Auth.currentSession()
      setIsAuthenticated(true)
    } catch (error) {
      if (error !== 'No current user') {
        onError(error)
      }
    }

    setIsAuthenticating(false)
  }

  async function handleLogout() {
    await Auth.signOut()

    setIsAuthenticated(false)

    nav('/login')
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/settings">
                    <Nav.Link>Settings</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, setIsAuthenticated } as AppContextType}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  )
}

export default App
