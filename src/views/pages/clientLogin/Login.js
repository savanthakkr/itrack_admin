import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Spinner } from 'react-bootstrap'
import Navbar from '../../../components/landing/Navbar.js'
import Footer from '../../../components/landing/Footer.js'
import axios from '../../../lib/axiosInstance.js'

const Login = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fault, setFault] = useState({ isErr: false, msg: '' })
  const [loading, setLoading] = useState(false)

  async function handleLogin({ username, password }) {
    setLoading(true)
    try {
      const res = await axios.put('/client/login', { username, password })
      const { status, message, data } = res?.data
      if (status) {
        localStorage.setItem('jdAirTrans-client-token', data.token)
        localStorage.setItem('clientDriverAssign', data.data.isDriverPermission)
        localStorage.setItem('clientTrackPermission', data.data.isTrackPermission)
        
        navigate('/client/dashboards')
      } else {
        setFault({ isErr: true, msg: message })
      }
    } catch (error) {
      console.error(error)
      setFault({ isErr: true, msg: 'An error occurred' })
      setLoading(false)
    }
  }

  const handSubmit = (e) => {
    e.preventDefault()
    handleLogin({ username, password })
      .then(() => console.log('done'))
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    if (localStorage.getItem('jdAirTrans-client-token')) {
      navigate('/client/dashboards')
    }
  }, [navigate])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handSubmit(e)
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
                    <CForm onSubmit={handSubmit} onKeyDown={handleKeyDown}>
                      <h1>Client Login</h1>
                      <p className="text-body-secondary">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          autoComplete="username"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
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
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </CInputGroup>
                      {fault.isErr ? <p className="text-danger">{fault.msg}</p> : null}

                      <CRow>
                        <CCol xs={6}>
                          <CButton type="submit" color="primary" className="px-4">
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
