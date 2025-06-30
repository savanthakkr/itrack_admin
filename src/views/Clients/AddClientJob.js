import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap'
import { get, post } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

const AddClientJOb = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [serviceTypes, setServiceTypes] = useState([])
  // const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [pickupLocations, setPickupLocations] = useState([])
  const [dropLocations, setDropLocations] = useState([])
  const [serviceCode, setServiceCode] = useState('')
  const [formData, setFormData] = useState({
    AWB: '',
    pieces: '',
    weight: '',
    serviceTypeId: '',
    custRefNumber: '',
    serviceCodeId: '',
    readyTime: '',
    cutoffTime: '',
    attachments: [],
    pickupLocationId: '',
    dropOfLocationId: '',
    note: '',
    isVpap: false,
    clientId: id
  })

  const [dropDownData, setDropDownData] = useState({
    serviceType: {
      text: '',
      _id: ''
    },
    serviceCode: {
      text: '',
      _id: ''
    },
    pickupLocation: {
      name: '',
      _id: ''
    },
    dropLocation: {
      name: '',
      _id: ''
    }


  })

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // handle file change
  const handleFileChange = (e) => {
    const files = e.target.files; // Get all selected files
    const fileList = Array.from(files); // Convert FileList to array
    setFormData({ ...formData, attachments: fileList });
  }
  // handle Dropdown change

  const handleSubmit = () => {
    setLoading5(true)
    if (!formData.AWB || !formData.pieces || !formData.weight || !dropDownData.serviceType._id || !formData.custRefNumber || !dropDownData.serviceCode._id || !formData.readyTime || !formData.cutoffTime  || !dropDownData.pickupLocation._id || !dropDownData.dropLocation._id || !formData.note || !formData.isVpap || !id) {
      sweetAlert.fire({
        icon: 'error',
        title: 'All fields are required'
      })
      setLoading5(false)
      return
    }

    const payload = new FormData()
    payload.append('AWB', formData.AWB)
    payload.append('pieces', formData.pieces)
    payload.append('weight', formData.weight)
    payload.append('serviceTypeId', dropDownData.serviceType._id)
    payload.append('custRefNumber', formData.custRefNumber)
    payload.append('serviceCodeId', dropDownData.serviceCode._id)
    payload.append('readyTime', formData.readyTime)
    payload.append('cutoffTime', formData.cutoffTime)
    payload.append('pickupLocationId', dropDownData.pickupLocation._id)
    payload.append('dropOfLocationId', dropDownData.dropLocation._id)
    payload.append('note', formData.note)
    payload.append('isVpap', formData.isVpap)
    payload.append('clientId', id);
    formData.attachments.forEach((file) => {
      payload.append('attachments', file)
    })
  // create job
    post('/admin/job', payload, 'admin')
      .then((response) => {
        setLoading5(false)
        if (response.data.status) {
          sweetAlert.fire({
            icon: 'success',
            title: 'Booking added successfully'
          }).then(() => {
            // navigate to jobs
            navigate('/job/all')
          })
       
         
        }else{
          sweetAlert.fire({
            icon: 'error',
            title: 'Failed to add job'
          })
        }
      })
      .catch((error) => {
        setLoading5(false)
        console.error(error)
        sweetAlert.fire({
          icon: 'error',
          title: 'Failed to add job'
        })
      })
  }

  // fetch service types and service code
  useEffect(() => {
    setLoading(true)
    setLoading2(true)
    setLoading3(true)
    setLoading4(true)
    // get service type
    get('/admin/service/type', 'admin')
      .then((response) => {
        setServiceTypes(response.data.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
    // get service code
    get('/admin/service/code', 'admin')
      .then((response) => {
        setServiceCode(response.data.data)
        setLoading2(false)
      })
      .catch((error) => {
        console.error(error)
      })
    // get pickup locations
    get('/admin/locations/pickup', 'admin')
      .then((response) => {
        setPickupLocations(response.data.data)
        setLoading3(false)
      })
      .catch((error) => {
        console.error(error)
      })
    // get drop locations
    get('/admin/locations/dropoff', 'admin')
      .then((response) => {
        setDropLocations(response.data.data)
        setLoading4(false)
      }
      )

  }, [])

  return (
    <>
      <Row>
        <Col>
          <h5>Add Booking for client </h5>
        </Col>
      </Row>
      <Container className="shadow px-3 py-3 rounded-4 bg-white">
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>AWB</Form.Label>
              <Form.Control type="text" name="AWB" placeholder="Text"
                onChange={(e) => handleChange(e)}
                value={formData?.AWB}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Pieces</Form.Label>
              <Form.Control type="text" placeholder="number"
                name="pieces"
                onChange={(e) => handleChange(e)}
                value={formData?.pieces}

              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Weight</Form.Label>
              <Form.Control type="number" name="weight" placeholder="number"
                onChange={(e) => handleChange(e)}
                value={formData?.weight}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Label>Service Type</Form.Label>
            <Dropdown data-bs-theme="primary">
              <Dropdown.Toggle
                id="dropdown-button-dark-example1"
                variant="secondary"
                className="w-75"
              >
                {
                  dropDownData.serviceType.text ? dropDownData.serviceType.text : 'Select Service Type'
                }
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-75">
                {loading ? (
                  <Spinner animation="border" />
                ) : (
                  serviceTypes?.map((serviceType) => {
                    return (
                      <Dropdown.Item
                        key={serviceType._id}
                        onClick={() => setDropDownData({ ...dropDownData, serviceType: { text: serviceType.text, _id: serviceType._id } })}
                      >
                        {serviceType.text}
                      </Dropdown.Item>
                    )
                  })
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Customer Reference No</Form.Label>
              <Form.Control type="text" placeholder="Text" name="custRefNumber"
                onChange={(e) => handleChange(e)}
                value={formData?.custRefNumber}

              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Service Code</Form.Label>
              <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                  className="w-75"
                >
                  {
                    dropDownData.serviceCode.text ? dropDownData.serviceCode.text : 'Select Service Code'
                  }

                </Dropdown.Toggle>
                <Dropdown.Menu className="w-75">
                  {loading2 ? (
                    <Spinner animation="border" />
                  ) : (
                    serviceCode &&
                    serviceCode?.map((serviceCode) => {
                      return (
                        <Dropdown.Item
                          key={serviceCode._id}
                          onClick={() => setDropDownData({ ...dropDownData, serviceCode: { text: serviceCode.text, _id: serviceCode._id } })}
                        >
                          {serviceCode.text}
                        </Dropdown.Item>
                      )
                    })
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Ready Time</Form.Label>
              <Form.Control type="datetime-local" placeholder="date" name="readyTime"
                onChange={(e) => handleChange(e)}
                value={formData?.readyTime}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Cut-Off Time</Form.Label>
              <Form.Control type="datetime-local" placeholder="date"
                name="cutoffTime"
                onChange={(e) => handleChange(e)}
                value={formData?.cutoffTime}

              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Upload Attachment</Form.Label>
              <Form.Control type="file" placeholder="Text" name="attachments" multiple
                onChange={(e) => handleFileChange(e)}

              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Pickup Location</Form.Label>
              <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                  className="w-75"
                >
                  {
                    dropDownData.pickupLocation.name ? dropDownData.pickupLocation.name : 'Select Pickup Location'
                  }
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-75">
                  {loading3 ? (
                    <Spinner animation="border" />
                  ) : (
                    pickupLocations?.map((pickupLocation) => {
                      return (
                        <Dropdown.Item
                          key={pickupLocation._id}
                          onClick={() => setDropDownData({ ...dropDownData, pickupLocation: { name: pickupLocation.customName, _id: pickupLocation._id } })}
                        >
                          {pickupLocation.customName}
                        </Dropdown.Item>
                      )
                    })
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Drop Location</Form.Label>
              <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                  className="w-75"
                >
                  {
                    dropDownData.dropLocation.name ? dropDownData.dropLocation.name : 'Select Drop Location'
                  }
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-75">
                  {loading4 ? (
                    <Spinner animation="border" />
                  ) : (
                    dropLocations?.map((dropLocation) => {
                      return (
                        <Dropdown.Item
                          key={dropLocation._id}
                          onClick={() => setDropDownData({ ...dropDownData, dropLocation: { name: dropLocation.customName, _id: dropLocation._id } })}
                        >
                          {dropLocation.customName}
                        </Dropdown.Item>
                      )
                    })
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={4} // Number of visible rows in the textarea
                placeholder="Enter your note here..."
                name="note"
                onChange={(e) => handleChange(e)}
                value={formData?.note}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <br />
          <Row>
            <Col md={3} className="mt-3">
              <Form.Group className="fw-bold">
                <Form.Check type="checkbox" label="Need VPAP"
                  name="isVpap"
                  onChange={(e) => setFormData({ ...formData, isVpap: e.target.checked })}
                  value={formData?.isVpap}

                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="mt-3">
              <Button variant="primary" onClick={handleSubmit}>
                {loading5 ? <Spinner animation="border" /> : 'Submit'}
              </Button>
            </Col>
          </Row>
        </Row>
      </Container>
    </>
  )
}

export default AddClientJOb