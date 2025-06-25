import React, { useState, useRef, useEffect } from 'react'
import { Button, Col, Container, Form, Row, Spinner, Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import makeAnimated from 'react-select/animated';
import { post, get, postWihoutMediaData, deleteReq, deleteReqWithoutMedia, updateReq } from '../../lib/request.js'
import sweetAlert2 from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { Tab, Tabs, Table } from 'react-bootstrap';
import Select from 'react-select';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';

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
  const [serviceCode, setServiceCode] = useState([])

  const [editRate, setEditRate] = useState('');
  const [editSelectedUnit, setEditSelectedUnit] = useState(null);
  const [editDropDownData, setEditDropDownData] = useState({
    serviceCode: {},
  });

  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)

  const handleShowModal = () => setShowModal(true)

  const handleCloseModal = () => setShowModal(false)
  const handleCloseModal2 = () => setShowModal2(false)

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [rate, setRate] = useState('');
  const [rates, setRates] = useState([
    { _id: '1', code: 'PMC', rate: '$55.00', item: 'Per Unit' },
    { _id: '2', code: 'AKE', rate: '$45.00', item: 'Per Unit' },
    { _id: '3', code: 'HH14', rate: '$70.00', item: 'Per Hour' },
    { _id: '4', code: 'HH22', rate: '$90.00', item: 'Per Hour' },
  ]);

  const unitOptions = [
    { value: 'per_hour', label: 'Per Hour' },
    { value: 'per_unit', label: 'Per Unit' }
  ];

  const [clientRateData, setClientRateData] = useState({
    rate: '',
    item: '',
    serviceCodeId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setClientRateData({
      rate: '',
      item: '',
      serviceCodeId: ''
    });
    setErrors({});
  }, [showModal]);

  const handleShowModal2 = (item) => {

    setSelectedClientId(item._id);

    setClientRateData({ rate: item.rate.replace(/[^0-9.]/g, ''), serviceCodeId: item.serviceCodeId?._id, item: item.item });

    setShowModal2(true);
  };

  // Deleting the client rate
  const handleDelete = (Id) => {
    console.log('Id', Id);
    sweetAlert2
      .fire({
        title: 'Are you sure you want to delete this client rate?',
        text: 'Once deleted you can’t revert this action',
        imageUrl: 'src/assets/images/delete_modal_icon.png',
        imageWidth: 60,
        imageHeight: 60,
        imageAlt: 'Delete Icon',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it!',
        cancelButtonText: 'No, Keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteReqWithoutMedia(`/admin/client/rate?id=${Id}`, "admin").then((data) => {
            console.log('data', data);
            if (data.status) {
              sweetAlert2.fire({ icon: 'success', title: data.data.message })
            } else {
              sweetAlert2.fire({ icon: 'error', title: data.data.message })
            }
            getClientRateData();
          }).catch((e) => {
            console.log("Error while deleting:", e.message)
          })
        } else if (result.dismiss === sweetAlert2.DismissReason.cancel) {
          sweetAlert2.fire('Cancelled', 'Your client rate is safe :)', 'error')
        }
      })

  }

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
            sweetAlert2.fire({
              icon: 'success',
              title: 'Client added successfully',
            }).then(() => {
              navigate('/client/all')
            })
          } else if (res.status === 400) {
            setLoading(false)
            sweetAlert2.fire({
              icon: 'error',
              title: res.data.message,
            })
          } else {
            console.log(res)
            sweetAlert2.fire({
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

  const [dropDownData, setDropDownData] = useState({
    serviceCode: {
      text: '',
      _id: '',
    },
  });

  const getClientRateData = async () => {
    get('/admin/client/rate', 'admin')
      .then((response) => {
        setRates(response.data.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    setLoading(true)

    // get service code
    get('/admin/service/code', 'admin')
      .then((response) => {
        setServiceCode(response.data.data)
      })
      .catch((error) => {
        console.error(error)
      })

    // get client rate
    getClientRateData();

  }, [])

  const validateClientRateForm = () => {
    const errors = {}
    if (clientRateData.serviceCodeId === '') {
      errors.serviceCodeId = 'Service code is required.'
    }
    if (clientRateData.item === '') {
      errors.item = 'item is required.'
    }
    return errors;
  }

  const handleClientRateSubmit = async (e) => {
    e.preventDefault();
    const errors = validateClientRateForm();

    if (Object.keys(errors).length === 0) {
      // Submit form
      // create job
      if (showModal2) {
        updateReq(`/admin/client/rate?id=${selectedClientId}`, clientRateData, 'admin')
          .then((response) => {
            // setLoading5(false)
            if (response.data.status) {
              // get client rate
              getClientRateData();
              setShowModal2(false);
              setClientRateData({
                rate: '',
                item: '',
                serviceCodeId: ''
              });
              Swal.fire({
                icon: 'success',
                title: response.data.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data.message || 'Failed to add client rate',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message || 'Failed to add client rate',
            });
          })
      } else if (showModal) {
        postWihoutMediaData('/admin/client/rate', clientRateData, 'admin')
          .then((response) => {
            // setLoading5(false)
            if (response.data.status) {
              console.log('response', response);
              // get client rate
              getClientRateData();
              setShowModal(false);
              Swal.fire({
                icon: 'success',
                title: response.data.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data.message || 'Failed to add client rate',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message || 'Failed to add client rate',
            });
          })
      }
    } else {
      setErrors(errors);
      return;
    }
  }

  const handleClientRateChange = (e) => {
    const { name, value } = e.target
    setClientRateData({ ...clientRateData, [name]: value })
  }

  const handleServiceCodeRateChange = (selectedOption) => {
    setClientRateData({
      ...clientRateData,
      serviceCodeId: selectedOption.value,
    });
    if (errors.serviceCodeId) {
      setErrors(prev => ({ ...prev, serviceCodeId: "" }));
    }
  };

  const handleItemRateChange = (selectedOption) => {
    setClientRateData({
      ...clientRateData,
      item: selectedOption.label,
    });
    if (errors.item) {
      setErrors(prev => ({ ...prev, item: "" }));
    }
  };

  const [serviceOptionForRate, setServiceOptionForRate] = useState();
  useEffect(() => {
    const service = [];
    serviceCode?.map((item) => {
      service.push({ value: item._id, label: item.text });
    });
    setServiceOptionForRate(service);
  }, [serviceCode]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">{activeTab === 'addClient' ? 'Add Client' : 'Client Rates'}</h4>
        </Col>
        <Col className={activeTab === 'addClient' ? 'text-end' : 'text-end'}>
          {activeTab === 'addClient' ? (
            <CButton className="custom-btn" onClick={() => formRef.current?.requestSubmit()}>
              Add Client
            </CButton>
          ) : (
            <CButton className="custom-btn" onClick={handleShowModal}>
              Add Client Rates
            </CButton>
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
          <Table hover responsive className="custom-table">
            <thead className="table-light">
              <tr>
                <th className="text-start">Service Code</th>
                <th className="text-start">Rate</th>
                <th className="text-start">Item</th>
                <th style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.length > 0 ? rates.map((item) => (
                <tr key={item._id}>
                  <td className="text-start">{item?.serviceCodeId?.text}</td>
                  <td className="text-start">{item.rate}</td>
                  <td className="text-start">{item.item}</td>
                  <td className="text-center action-dropdown-menu">
                    <div className="dropdown">
                      <button
                        className="btn btn-link p-0 border-0"
                        type="button"
                        id={`dropdownMenuButton-${item._id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby={`dropdownMenuButton-${item._id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleShowModal2(item)}
                          >
                            Edit Client Rates
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete Client Rate
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              )) :
                <tr>
                  <td colSpan={4} className="text-center text-danger">No Records Found.</td>
                </tr>
              }
            </tbody>
          </Table>

          {/* <Table hover responsive className="custom-table">
            <thead className="table-light">
              <tr>
                <td>Client Fuel Levy</td>
                <td>20%</td>
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
          </Table> */}

          <div className='border' style={{ minHeight: '50px', paddingLeft: '10px' }}>
            <Row className="align-items-center" style={{ minHeight: '50px' }}>
              <Col md={6} className="d-flex align-items-center" style={{ height: '50px' }}>
                <label className="mb-0"><b>Client Fuel Levy</b></label>
              </Col>
              <Col md={6} className="d-flex align-items-center" style={{ height: '50px' }}>
                <label className="mb-0">20%</label>
              </Col>
            </Row>
          </div>
        </Tab>
      </Tabs>
      {/* Add Modal */}
      <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }} className="custom-modal">
        <Modal.Header closeButton><Modal.Title>Add Client Rates</Modal.Title></Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleClientRateSubmit}>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Enter rate here"
                value={clientRateData?.rate}
                name="rate"
                // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                onChange={handleClientRateChange}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Service Code</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                name="serviceCodeId"
                options={serviceOptionForRate}
                value={clientData?.serviceCodeId?._id}
                onChange={handleServiceCodeRateChange}
                placeholder="Enter service code"
                isSearchable
                required
              />
              {errors.serviceCodeId ? (
                <Form.Text className="text-danger">{errors.serviceCodeId}</Form.Text>
              ) : null}
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Item</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={unitOptions}
                value={clientData?.item}
                name="item"
                // onChange={(selectedOption) => setSelectedUnit(selectedOption)}
                onChange={handleItemRateChange}
                placeholder="Select from the list"
                isSearchable
              />
              {errors.item ? (
                <Form.Text className="text-danger">{errors.item}</Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">Submit</Button>
            {/* <Button variant="secondary" onClick={handleCloseModal}>Close</Button> */}
          </Modal.Footer>
        </Form>
      </Modal >

      {/* Edit Modal */}
      < Modal
        show={showModal2}
        onHide={handleCloseModal2}
        style={{ marginTop: '10vh' }
        }
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Client Rates</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleClientRateSubmit}>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Enter rate here"
                value={clientRateData?.rate}
                name="rate"
                // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                onChange={handleClientRateChange}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Service Code</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                name="serviceCodeId"
                options={serviceOptionForRate}
                value={serviceOptionForRate?.find(opt => opt.value === clientRateData?.serviceCodeId)}
                onChange={handleServiceCodeRateChange}
                placeholder="Enter service code"
                isSearchable
                required
              />
              {errors.serviceCodeId ? (
                <Form.Text className="text-danger">{errors.serviceCodeId}</Form.Text>
              ) : null}
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Item</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={unitOptions}
                value={unitOptions?.find(opt => opt.label === clientRateData?.item)}
                name="item"
                // onChange={(selectedOption) => setSelectedUnit(selectedOption)}
                onChange={handleItemRateChange}
                placeholder="Select from the list"
                isSearchable
              />
              {errors.item ? (
                <Form.Text className="text-danger">{errors.item}</Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">
              Confirm Change
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >

    </>
  )
}

export default AddClients
