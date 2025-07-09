import React, { useEffect, useState, useRef } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { get, post } from '../../lib/request.js'
import sweetAlert from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { CButton } from '@coreui/react'

function AddAllocator() {
  const formRef = useRef(); 
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [allocatorData, setAllocatorData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    logo: null,
  })
  // const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target
    setAllocatorData({ ...allocatorData, [name]: value })
  }

  // handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target
    setAllocatorData({ ...allocatorData, [name]: files[0] })
  }

  // handle Add Allocator
  const handleAllocatorAdd = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      setLoading(true)
      // if (accountantData.firstname === '' || accountantData.lastname === '' || accountantData.email === '' || accountantData.phone === '') {
      //   sweetAlert.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: 'All fields are required',
      //   })
      //   setLoading(false)
      //   return
      // }
      post('/admin/allocator', allocatorData, "admin").then((res) => {
        if (res.status === 200) {
          setLoading(false)
          sweetAlert.fire({
            icon: 'success',
            title: 'Allocator Added Successfully!',
          }).then(() => {
            navigate("/allocator/all")
          })
        } else if (res.status === 400) {
          sweetAlert.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.data.message,
          })
          setLoading(false)
        }
      }).catch((error) => {
        console.error("Error adding allocator:", error)
        setLoading(false)
        sweetAlert.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to Add allocator',
        })
      })
    }
    setValidated(true)
  }

  // get all clients
  // const getAllClients = () => {
  //   get('/admin/info/allClients', "admin").then((res) => {
  //     console.log("all clients", res)
  //     setClients(res.data.data)
  //   }).catch((error) => {
  //     console.error("Error getting all clients:", error)
  //     alert('Failed to get clients.')
  //   })
  // }

  // // use effect
  // useEffect(() => {
  //   getAllClients()
  // }, [])

  return (
    <>
        <Row className="align-items-center">
          <Col>
            <h4 className="mb-0">Add Allocator</h4>
          </Col>
          <Col className="text-end">
            <CButton className="custom-btn" onClick={() => formRef.current?.requestSubmit()}>
              Add Allocator
            </CButton>
          </Col>
        </Row>
        <div className="shadow bg-white px-3 py-3 mt-3 custom-form">
          <Form ref={formRef} noValidate validated={validated} onSubmit={handleAllocatorAdd}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    name='firstname'
                    onChange={handleChange}
                    value={allocatorData.firstname}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a first name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    name='lastname'
                    onChange={handleChange}
                    value={allocatorData.lastname}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a last name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mt-3">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email Address"
                    name='email'
                    onChange={handleChange}
                    value={allocatorData.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6} className="mt-3">
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Phone"
                    name='phone'
                    onChange={handleChange}
                    value={allocatorData.phone}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a phone number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mt-3">
                <Form.Group>
                  <Form.Label>Image (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    name='logo'
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
    </>
  )
}

export default AddAllocator
