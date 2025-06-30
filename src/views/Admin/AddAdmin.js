import React, { useEffect, useState, useRef } from 'react'
import { Badge, Button, Col, Container, Form, Row, Spinner, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import { get, post } from '../../lib/request.js'
import sweetAlert from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { CButton } from '@coreui/react'

function AddAdmin() {
  const formRef = useRef();
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [adminData, setAdminData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    logo: null,
    companyName: ''
  })
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [modules, setModules] = useState([]);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target
    setAdminData({ ...adminData, [name]: value })
  }

  // handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target
    setAdminData({ ...adminData, [name]: files[0] })
  }

  // handle Add Admin
  const handleAddAdmin = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      setLoading(true)
      // if (adminData.firstname === '' || adminData.lastname === '' || adminData.email === '' || adminData.phone === '') {
      //   sweetAlert.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: 'All fields are required',
      //   })
      //   setLoading(false)
      //   return
      // }
      post('/super-admin/admin', adminData, "admin").then((res) => {
        if (res.status === 200) {
          setLoading(false)
          sweetAlert.fire({
            icon: 'success',
            title: 'Admin Added Successfully!',
          }).then(() => {
            navigate("/admin/all")
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
        console.error("Error adding admin:", error)
        setLoading(false)
        sweetAlert.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to Add Admin',
        })
      })
    }
    setValidated(true)
  }

  // get all clients
  const getAllClients = () => {
    get('/admin/info/allClients', "admin").then((res) => {
      console.log("all clients", res)
      setClients(res.data.data)
    }).catch((error) => {
      console.error("Error getting all clients:", error)
      alert('Failed to get clients.')
    })
  }

  const getModuleList = async () => {
    get('/super-admin/module-list', "admin").then((res) => {
      // setClients(res.data.data)
      setModules(res.data.data);
    }).catch((error) => {
      console.error("Error getting all modules:", error)
      alert('Failed to get modules.')
    })
  }

  // use effect
  useEffect(() => {
    getAllClients();
    getModuleList();
  }, []);

  console.log('module list', modules);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">Add Admin</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn" onClick={() => formRef.current?.requestSubmit()}>
            Add Admin
          </CButton>
        </Col>
      </Row>
      <div className="shadow bg-white px-3 py-3 mt-3 custom-form">
        <Form ref={formRef} noValidate validated={validated} onSubmit={handleAddAdmin}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  name='firstname'
                  onChange={handleChange}
                  value={adminData.firstname}
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
                  value={adminData.lastname}
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
                  value={adminData.email}
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
                  value={adminData.phone}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a phone number.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          {/* <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter username"
                  name='username' 
                  onChange={handleChange} 
                  value={adminData.username}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a username.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row> */}
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Company Name"
                  name='companyName'
                  onChange={handleChange}
                  value={adminData.companyName}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a company name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
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
          {/* <Row>
              <Col md={3} className="mt-5">
                {loading ? <Spinner animation="border" variant="success" /> :
                  <Button
                    className="border-0"
                    style={{ backgroundColor: '#5856D5' }}
                    size="small"
                    type="submit"
                  >
                    Add Admin
                  </Button>
                }
              </Col>
            </Row> */}


          {
            modules?.map((module, index) => (
              <>
                <Row>
                  <Col md={6} className="mt-3">
                    {module.name}
                  </Col>
                  <Col md={6} className="mt-3">
                    <Row>
                      <Col md={4}>
                        {/* <ToggleButtonGroup
                          // value={false}
                          exclusive
                          name={`read_access-${index}`}
                        // onChange={(event, newValue) => toggleAccess(index, "read_access", newValue)}
                        >
                          <ToggleButton
                            // value={false}
                            sx={{ padding: '18px 0px !important', height: "0px", minWidth: "98px" }}
                            className={module?.permissions?.read_access ? "toggle-button-active" : ""}>
                            Read
                          </ToggleButton>
                        </ToggleButtonGroup> */}
                        <Badge
                          key={index}
                          bg={"primary"}
                          // onClick={() => togglePermission(permission)}
                          style={{
                            cursor: "pointer",
                            padding: "10px 15px",
                            fontSize: "14px",
                            borderRadius: "20px",
                            userSelect: "none",
                          }}
                        >
                          Read
                        </Badge>
                      </Col>
                      <Col md={4}>
                        {/* <ToggleButtonGroup
                          value={module?.permissions?.write_access}
                          exclusive
                          name={`read_access-${index}`}
                        // onChange={(event, newValue) => toggleAccess(index, "write_access", newValue)}
                        >
                          <ToggleButton
                            // value={true}
                            sx={{ padding: '18px 0px !important', height: "0px", minWidth: "98px" }}
                            className={module?.permissions?.write_access ? "toggle-button-active" : ""}>
                            Write
                          </ToggleButton>
                        </ToggleButtonGroup> */}
                        <Badge
                          key={index}
                          bg={"secondary"}
                          // onClick={() => togglePermission(permission)}
                          style={{
                            cursor: "pointer",
                            padding: "10px 15px",
                            fontSize: "14px",
                            borderRadius: "20px",
                            userSelect: "none",
                          }}
                        >
                          Write
                        </Badge>
                      </Col>
                      <Col md={4}>
                        {/* <ToggleButtonGroup
                          value={module?.permissions?.delete_access}
                          exclusive
                          name={`read_access-${index}`}
                        // onChange={(event, newValue) => toggleAccess(index, "delete_access", newValue)}
                        >
                          <ToggleButton
                            // value={true}
                            sx={{ padding: '18px 0px !important', height: "0px", minWidth: "98px" }}
                            className={module?.permissions?.delete_access ? "toggle-button-active" : ""}>
                            Delete
                          </ToggleButton>
                        </ToggleButtonGroup> */}
                        <Badge
                          key={index}
                          bg={"primary"}
                          // bg={selected.includes(permission) ? "primary" : "secondary"}
                          // onClick={() => togglePermission(permission)}
                          style={{
                            cursor: "pointer",
                            padding: "10px 15px",
                            fontSize: "14px",
                            borderRadius: "20px",
                            userSelect: "none",
                          }}
                        >
                          Delete
                        </Badge>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ))
          }
        </Form>
      </div >
    </>
  )
}

export default AddAdmin;