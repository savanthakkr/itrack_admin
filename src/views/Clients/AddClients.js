import React, { useState, useRef } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import makeAnimated from 'react-select/animated';
import { post } from '../../lib/request.js'
import sweetalert2 from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { Tab, Tabs, Table } from 'react-bootstrap';
import Select from 'react-select';

function AddClients() {
  const navigate = useNavigate()
  const formRef = useRef();
  const [errorMessages, setErrorMessages] = useState('')
  const [validated, setValidated] = useState(false)
  const [clientData, setClientData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    companyName: '',
    isDriverPermission: false,
    isTrackPermission: false,
    logo: null,
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("addClient");
  const [selectedCodes, setSelectedCodes] = useState([]);

  const animatedComponents = makeAnimated();

  const options = [
    { value: 'AAX', label: 'AAX' },
    { value: 'AKE', label: 'AKE' },
    { value: 'AKH', label: 'AKH' },
    { value: 'PMC', label: 'PMC' },
    { value: 'HH14', label: 'HH14' },
    { value: 'HH22', label: 'HH22' },
    { value: 'ALF', label: 'ALF' },
    { value: 'INTBDL', label: 'INTBDL' },
    { value: 'LOOSE', label: 'LOOSE' },
    { value: 'METRO DELIVERY', label: 'METRO DELIVERY' },
    { value: 'PLA', label: 'PLA' },
    { value: 'PAG', label: 'PAG' },
    { value: 'PGA', label: 'PGA' },
    { value: 'ER', label: 'ER' },
    { value: 'HH34', label: 'HH34' },
    { value: 'INTSFL', label: 'INTSFL' },
    { value: 'WHH14', label: 'WHH14' },
    { value: 'WHH22', label: 'WHH22' },
    { value: 'W-AKE', label: 'W-AKE' },
    { value: 'W-PMC', label: 'W-PMC' }
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedCodes(selectedOptions);
  };
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setClientData({ ...clientData, [name]: value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0].type.split('/')[0] !== 'image') {
      sweetalert2.fire({
        icon: 'error',
        title: 'Please upload image only',
      })
      e.target.value = ''
      return
    }
    setClientData({ ...clientData, [name]: files[0] })
  }

  const handleSubmit = (event) => {
    console.log(event);
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      setLoading(true)
      post('/admin/client', clientData, "admin")
        .then((res) => {
          console.log("res", res)
          if (res.data.status) {
            setLoading(false)
            sweetalert2.fire({
              icon: 'success',
              title: 'Client added successfully',
            }).then(() => {
              navigate('/client/all')
            })
          } else if (res.status === 400) {
            setLoading(false)
            sweetalert2.fire({
              icon: 'error',
              title: res.data.message,
            })
          } else {
            console.log(res)
            sweetalert2.fire({
              icon: 'error',
              title: 'An error occured',
            })
            setLoading(false)
          }
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
          console.log("An error occured")
        })
    }
    setValidated(true)
  }

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailPattern.test(email)) {
      setErrorMessages('Please enter a valid email')
    } else {
      setErrorMessages('')
    }
    setClientData({ ...clientData, email: email })
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">{activeTab === 'addClient' ? 'Add Client' : 'Client Rates'}</h4>
        </Col>
        <Col className={activeTab === 'addClient' ? 'text-end' : ''}>
          {activeTab === 'addClient' ? (
            <CButton className="custom-btn" onClick={() => formRef.current?.requestSubmit()}>
              Add Client
            </CButton>
          ) : (
            // <Form.Select className="w-75  d-inline-block custom-dropdown" multiple value={selectedCodes}
            // onChange={handleMultiSelectChange}>
            //   <option value="">Service Codes</option>
            //   <option value="PMC">PMC</option>
            //   <option value="AKE">AKE</option>
            //   <option value="HH14">HH14</option>
            //   <option value="HH22">HH22</option>
            // </Form.Select>
            <Select
              className="w-75 ms-auto"
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={options}
              value={selectedOptions}
              onChange={setSelectedOptions}
              placeholder="service codes"
            />
          )}
        </Col>
      </Row>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} defaultActiveKey="addClient" id="client-tabs" className="mb-3 custom-tabs">
        {/* Add Client Tab */}
        <Tab eventKey="addClient" title="Add Client">
          <Container className="shadow px-3 py-3 bg-white">
            <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstname"
                      placeholder="Enter First Name"
                      onChange={handleChange}
                      value={clientData.firstname}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a first name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      placeholder="Enter Last Name"
                      onChange={handleChange}
                      value={clientData.lastname}
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
                      name="email"
                      placeholder="Enter Email"
                      onChange={(e) => validateEmail(e.target.value)}
                      value={clientData.email}
                      required
                      isInvalid={!!errorMessages}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorMessages || 'Please provide a valid email.'}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="mt-3">
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="number"
                      name="phone"
                      placeholder="Enter Phone"
                      onChange={handleChange}
                      value={clientData.phone}
                      required
                      onWheel={(e) => e.target.blur()}
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
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Company Name"
                      name="companyName"
                      onChange={handleChange}
                      value={clientData.companyName}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a company name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="mt-3">
                  <Form.Group>
                    <Form.Label>Company Logo</Form.Label>
                    <Form.Control
                      type="file"
                      name="logo"
                      onChange={handleFileChange}
                    />
                    <small className="text-secondary">Please ensure that the file size does not exceed 5MB and that it is in either PNG or JPG format.</small>
                    <Form.Control.Feedback type="invalid">
                      Please upload a valid image.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3} className="mt-3">
                  <Form.Group controlId="clientAssignDriverCheckbox">
                    <Form.Check
                      type="checkbox"
                      label="Client able to assign the drivers"
                      name="isDriverPermission"
                      checked={clientData.isDriverPermission}
                      onChange={(e) =>
                        setClientData({ ...clientData, isDriverPermission: e.target.checked })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mt-3">
                  <Form.Group controlId="clientAssignDriverCheckbox2">
                    <Form.Check
                      type="checkbox"
                      label="Enable Tracker Feature for client"
                      name="isTrackPermission"
                      checked={clientData.isTrackPermission}
                      onChange={(e) =>
                        setClientData({ ...clientData, isTrackPermission: e.target.checked })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* <Row>
                <Col md={3} className="mt-3">
                  {loading ? (
                    <Spinner animation="border" />
                  ) : (
                    <Button type="submit">Submit</Button>
                  )}
                </Col>
              </Row> */}
            </Form>
          </Container>
        </Tab>

        {/* Client Rates Tab */}
        <Tab eventKey="clientRates" title="Client Rates" className="client-rates-table">
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Service Code</th>
                <th>Rate</th>
                <th>Item</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PMC</td>
                <td>$55.00</td>
                <td>Per Unit</td>
              </tr>
              <tr>
                <td>AKE</td>
                <td>$45.00</td>
                <td>Per Unit</td>
              </tr>
              <tr>
                <td>HH14</td>
                <td>$70.00</td>
                <td>Per Hour</td>
              </tr>
              <tr>
                <td>HH22</td>
                <td>$90.00</td>
                <td>Per Hour</td>
              </tr>
            </tbody>
          </Table>
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Client Fuel Levy</th>
                <th>Percent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PMC</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>AKE</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>HH14</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>HH22</td>
                <td>20%</td>
              </tr>
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </>
  )
}

export default AddClients
