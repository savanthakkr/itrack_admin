import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { post } from '../../../lib/request.js'
import { Spinner } from "react-bootstrap"
import Navbar from '../../../components/landing/Navbar.js'
import Footer from '../../../components/landing/Footer.js'
import { useDispatch } from 'react-redux'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()

  const handleLogin = () => {
    setError('')
    setLoading(true)
    if (username === '' || password === '') {
      setError('Username and password are required')
      setLoading(false)
      return
    }
    post('/admin/login', { username, password }).then((res) => {
      if (res.status === 200) {
        localStorage.setItem('admintoken', res.data.token)
        localStorage.setItem('email', res.data.data.email)
        localStorage.setItem('role', res.data.data.role)
        localStorage.setItem('firstname', res.data.data.firstname)
        localStorage.setItem('lastname', res.data.data.lastname)
        dispatch({
          type: 'setRole',
          payload: res.data.data.role,
        });
        dispatch({
          type: 'setUserInfo',
          payload: {
            firstName: res.data.data.firstname,
            lastName: res.data.data.lastname,
            email: res.data.data.email,
          },
        });
        if (res.data.data.role === 'Admin') {
          navigate('/dashboard')
        } else if (res.data.data.role === 'Super Admin') {
          navigate('/dashboard');
        } else if (res.data.data.role === 'Accountant') {
          navigate('/job/all');
        }
      } else if (res.status === 400) {
        setError('Invalid username or password')
      } else {
        setError('An error occurred')
      }
      setLoading(false)
    }).catch((error) => {
      console.log(error)
      setLoading(false)
      setError('An error occurred')
    })
  }

  useEffect(() => {
    if (localStorage.getItem('admintoken')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onKeyDown={handleKeyDown}>
                      <h1>Admin Login</h1>
                      <p className="text-body-secondary">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          onChange={(e) => setUsername(e.target.value)}
                          autoComplete="username"
                          value={username}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                      </CInputGroup>
                      {error && <p className="text-danger">{error}</p>}
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" onClick={handleLogin}>
                            {loading ? <Spinner animation="border" variant="light" /> : 'Login'}
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>JD Airtrans</h2>
                      {/* <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </p> */}
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
      <Footer />
    </>
  )
}

export default Login
