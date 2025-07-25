import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap'
import { get, post } from '../../lib/request'
import { useNavigate } from 'react-router-dom'
import AddLocation from './chooseLocManual'
import sweetAlert from 'sweetalert2'
import moment from 'moment-timezone';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CButton } from '@coreui/react'

function AddJobs() {
  const navigate = useNavigate()
  const [readyTime, setReadyTime] = useState(new Date());
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [serviceTypes, setServiceTypes] = useState([])
  const [pickupLocations, setPickupLocations] = useState([])
  const [dropLocations, setDropLocations] = useState([])
  const [serviceCode, setServiceCode] = useState([])
  const [clients, setClients] = useState([])
  const [errors, setErrors] = useState({
    serviceTypeId: '',
    serviceCodeId: '',
    pickupLocationId: '',
    dropOfLocationId: '',
    clientId: '',
  })
  const [formData, setFormData] = useState({
    AWB: '',
    pieces: '',
    weight: '',
    custRefNumber: '',
    readyTime: '',
    cutoffTime: '',
    attachments: [],
    note: '',
    isVpap: '',
    adminNote: '',
  })
  const [dropDownData, setDropDownData] = useState({
    serviceType: {
      text: '',
      _id: '',
    },
    serviceCode: {
      text: '',
      _id: '',
    },
    pickupLocation: {
      name: '',
      _id: '',
    },
    dropLocation: {
      name: '',
      _id: '',
    },
    selectedClient: {
      name: '',
      _id: '',
    },
  })

  const clientOptions = clients
    .sort((a, b) => a.companyName.localeCompare(b.companyName))
    .map((client) => ({
      value: client._id,
      label: client.companyName,
    }));

  const handleSelectChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      selectedClient: {
        name: selectedOption.label,
        _id: selectedOption.value,
      },
    });
  };

  const pickupOptions = pickupLocations
    .sort((a, b) => a.customName.localeCompare(b.customName))
    .map((location) => ({
      value: location._id,
      label: location.customName,
    }));

  const handlePickupChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      pickupLocation: {
        name: selectedOption.label,
        _id: selectedOption.value,
      },
    });
  };

  const dropOptions = dropLocations
    .sort((a, b) => a.customName.localeCompare(b.customName))
    .map((location) => ({
      value: location._id,
      label: location.customName,
    }));

  const handleDropChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      dropLocation: {
        name: selectedOption.label,
        _id: selectedOption.value,
      },
    });
  };

  const serviceTypeOptions = serviceTypes
    .sort((a, b) => a.text.localeCompare(b.text))
    .map((type) => ({
      value: type._id,
      label: type.text,
    }));

  const handleServiceTypeChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      serviceType: {
        text: selectedOption.label,
        _id: selectedOption.value,
      },
    });
  };

  const serviceCodeOptions = serviceCode
    .sort((a, b) => a.text.localeCompare(b.text))
    .map((code) => ({
      value: code._id,
      label: code.text,
    }));

  const handleServiceCodeChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      serviceCode: {
        text: selectedOption.label,
        _id: selectedOption.value,
      },
    });
  };
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target



    // if (name === 'readyTime') {
    //   // Ensure value is not already in Melbourne time format before converting
    //   const melbourneTime = moment.tz("Australia/Melbourne").format("YYYY-MM-DD HH:mm:ss");

    //   console.log("Melbourne Time:", melbourneTime);
    //   console.log("normal Time:", value);

    //   // Check if the new value is different from the current value to prevent unnecessary re-renders
    //   if (formData[name] !== melbourneTime) {

    //     setFormData({ ...formData, [name]: melbourneTime });
    //   }

    //   return;
    // }

    // if (name === 'cutoffTime') {
    //   // Ensure value is not already in Melbourne time format before converting
    //   const melbourneTime = moment.tz("Australia/Melbourne").format("YYYY-MM-DD HH:mm:ss");

    //   console.log("Melbourne Time:", melbourneTime);
    //   console.log("normal Time:", value);

    //   // Check if the new value is different from the current value to prevent unnecessary re-renders
    //   if (formData[name] !== melbourneTime) {

    //     setFormData({ ...formData, [name]: melbourneTime });
    //   }

    //   return;
    // }

    if (name === 'isVpap') {
      setFormData({ ...formData, [name]: value === e.target.value ? value : '' })
      return
    }
    setFormData({ ...formData, [name]: value })
  }

  // handle file change
  const handleFileChange = (e) => {
    const files = e.target.files // Get all selected files
    const fileList = Array.from(files) // Convert FileList to array
    setFormData({ ...formData, attachments: fileList })
  }

  const validateDropdown = () => {
    const errors = {}
    if (dropDownData.serviceType._id === '') {
      errors.serviceTypeId = 'Service Type is required'
    }
    if (dropDownData.serviceCode._id === '') {
      errors.serviceCodeId = 'Service Code is required'
    }
    if (dropDownData.pickupLocation._id === '') {
      errors.pickupLocationId = 'Pickup Location is required'
    }
    if (dropDownData.dropLocation._id === '') {
      errors.dropOfLocationId = 'Drop Location is required'
    }
    if (dropDownData.selectedClient._id === '') {
      errors.clientId = 'Client is required'
    }
    return errors
  }
  // handle form submission
  const handleSubmit = () => {
    setLoading5(true)

    // Validate required fields
    const requiredFields = [
      'AWB',
      'pieces',
      'weight',
      'custRefNumber',
      'readyTime',
      'cutoffTime',
      'serviceType',
      'serviceCode',
      'pickupLocation',
      'dropLocation',
      'selectedClient',
      'isVpap',
    ]
    const isValid = requiredFields.every(
      (field) => formData[field] !== '' && formData[field] !== null,
    )

    if (!isValid || formData.isVpap === '') {
      highlightEmptyFields()
      setLoading5(false)
      const errors = validateDropdown()
      setErrors(errors)

      return
    }
    const errors = validateDropdown()

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
    payload.append('clientId', dropDownData.selectedClient._id)
    payload.append('adminNote', formData.adminNote)

    formData.attachments.forEach((file) => {
      payload.append('attachments', file)
    })

    // create job
    post('/admin/job', payload, 'admin')
      .then((response) => {
        setLoading5(false)
        if (response.data.status) {
          sweetAlert
            .fire({
              icon: 'success',
              title: 'Success',
              text: 'Job added successfully',
            })
            .then(() => navigate('/job/all'))
        } else {
          sweetAlert.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.data.message || 'Failed to add job',
          })
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading5(false)
        alert('Failed to add job') // You can replace this with a more styled notification
      })
  }

  // Function to highlight empty fields
  const highlightEmptyFields = () => {
    const requiredFields = [
      'AWB',
      'pieces',
      'weight',
      'custRefNumber',
      'readyTime',
      'cutoffTime',
      'serviceType',
      'serviceCode',
      'pickupLocation',
      'dropLocation',
      'selectedClient',
      'isVpap',
    ]
    const fieldsToHighlight = requiredFields.filter(
      (field) => formData[field] === '' || formData[field] === null,
    )

    fieldsToHighlight.forEach((field) => {
      const element = document.getElementsByName(field)[0]
      if (element) {
        element.classList.add('is-invalid')
      }
    })
  }


  const getMelbourneTime = () => {
    return moment().tz("Australia/Melbourne").format("YYYY-MM-DDTHH:mm");
  };

  // Clear highlighting when fields are filled
  useEffect(() => {
    const requiredFields = [
      'AWB',
      'pieces',
      'weight',
      'custRefNumber',
      'readyTime',
      'cutoffTime',
      'note',
    ]
    requiredFields.forEach((field) => {
      const element = document.getElementsByName(field)[0]
      if (element) {
        element.addEventListener('input', () => {
          if (element.value !== '') {
            element.classList.remove('is-invalid')
          }
        })
      }
    })
  }, [])

  // get all clients
  const getAllClients = () => {
    get('/admin/info/allClients', 'admin')
      .then((res) => {
        setClients(res.data.data)
      })
      .catch((error) => {
        console.error('Error getting all clients:', error)
        alert('Failed to get clients.') // You can replace this with a more styled notification
      })
  }

  // fetch pickup locations
  function fetchPickupLocations() {
    get('/admin/locations/pickup', 'admin')
      .then((response) => {
        setPickupLocations(response.data.data)
        console.log(pickupLocations);
        console.log("pickupLocations");


        setLoading3(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // fetch drop locations
  function fetchDropLocations() {
    get('/admin/locations/dropoff', 'admin')
      .then((response) => {
        setDropLocations(response.data.data)
        setLoading4(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // fetch service types and service code on component mount
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
    fetchPickupLocations()

    // get drop locations
    fetchDropLocations()

    // get all clients
    getAllClients()
  }, [])

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">New Booking</h4>
        </Col>
        <Col className="text-end">
          {loading5 ? (
            <Spinner animation="border" />
          ) : (
            <CButton className="custom-btn" onClick={handleSubmit}>
              Add Booking
            </CButton>
          )}
        </Col>
      </Row>
      <Container className="mt-3 px-3 py-3 bg-white custom-form">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Client</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={clientOptions}
                value={dropDownData.selectedClient._id ? {
                  value: dropDownData.selectedClient._id,
                  label: dropDownData.selectedClient.name
                } : null}
                onChange={handleSelectChange}
                placeholder="Select from the list"
                isSearchable
              />
              {/* <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="w-100 dropdown-css-custom">
                  {dropDownData.selectedClient.name
                    ? dropDownData.selectedClient.name
                    : 'Select Client'}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="w-100 custom-scroll"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  {clients &&
                    [...clients]
                      .sort((a, b) =>
                        a.companyName.localeCompare(b.companyName)
                      )
                      .map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            setDropDownData({
                              ...dropDownData,
                              selectedClient: {
                                name: item.companyName,
                                _id: item._id,
                              },
                            })
                          }
                        >
                          {item.companyName}
                        </Dropdown.Item>
                      ))}
                </Dropdown.Menu>
              </Dropdown> */}
              {errors.clientId ? (
                <Form.Text className="text-danger">{errors.clientId}</Form.Text>
              ) : null}
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3 mt-lg-0">
            <Form.Group>
              <Form.Label>Customer Reference No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Text"
                name="custRefNumber"
                maxLength={30}
                onChange={(e) => handleChange(e)}
                value={formData?.custRefNumber}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Pieces</Form.Label>
              <Form.Control
                type="number"
                placeholder="Number"
                name="pieces"
                maxLength={20}
                onChange={(e) => handleChange(e)}
                value={formData?.pieces}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                name="weight"
                placeholder="Number"
                maxLength={20}
                onChange={(e) => handleChange(e)}
                value={formData?.weight}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Label>Service Type</Form.Label>
            {/* <Dropdown data-bs-theme="primary">
              <Dropdown.Toggle
                id="dropdown-button-dark-example1"
                variant="secondary"
                className="w-100 dropdown-css-custom d-flex justify-content-between align-items-center"
              >
                {dropDownData.serviceType.text
                  ? dropDownData.serviceType.text
                  : 'Select Service Type'}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="w-100 custom-scroll"
                style={{ maxHeight: '250px', overflowY: 'auto' }}
              >
                {loading ? (
                  <div className="text-center py-2">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  [...serviceTypes]
                    .sort((a, b) => a.text.localeCompare(b.text)).map((serviceType) => (
                      <Dropdown.Item
                        key={serviceType._id}
                        onClick={() =>
                          setDropDownData({
                            ...dropDownData,
                            serviceType: { text: serviceType.text, _id: serviceType._id },
                          })
                        }
                      >
                        {serviceType.text}
                      </Dropdown.Item>
                    ))
                )}
              </Dropdown.Menu>
            </Dropdown> */}
            <Select
              className="w-100 custom-select"
              classNamePrefix="custom-select"
              options={serviceTypeOptions}
              value={
                dropDownData.serviceType._id
                  ? {
                    value: dropDownData.serviceType._id,
                    label: dropDownData.serviceType.text,
                  }
                  : null
              }
              onChange={handleServiceTypeChange}
              placeholder="Select Service Type"
              isSearchable
            />
            {errors.serviceTypeId ? (
              <Form.Text className="text-danger">{errors.serviceTypeId}</Form.Text>
            ) : null}
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Service Code</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={serviceCodeOptions}
                value={
                  dropDownData.serviceCode._id
                    ? {
                      value: dropDownData.serviceCode._id,
                      label: dropDownData.serviceCode.text,
                    }
                    : null
                }
                onChange={handleServiceCodeChange}
                placeholder="Select Service Code"
                isSearchable
              />
              {/* <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                  className="w-100 dropdown-css-custom d-flex justify-content-between align-items-center"
                >
                  {dropDownData.serviceCode.text
                    ? dropDownData.serviceCode.text
                    : 'Select Service Code'}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="w-100 custom-scroll"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  {loading2 ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    [...serviceCode]
                      .sort((a, b) => a.text.localeCompare(b.text))?.map((serviceCode) => (
                        <Dropdown.Item
                          key={serviceCode._id}
                          onClick={() =>
                            setDropDownData({
                              ...dropDownData,
                              serviceCode: { text: serviceCode.text, _id: serviceCode._id },
                            })
                          }
                        >
                          {serviceCode.text}
                        </Dropdown.Item>
                      ))
                  )}
                </Dropdown.Menu>
              </Dropdown> */}
              {errors.serviceCodeId ? (
                <Form.Text className="text-danger">{errors.serviceCodeId}</Form.Text>
              ) : null}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Ready Time</Form.Label>
              {/* <DatePicker
              selected={readyTime}
              onChange={(date) => setReadyTime(date)}
              showTimeSelect
              showTimeSelectOnly={false}
              dateFormat="yyyy-MM-dd, HH:mm"
              timeFormat="HH:mm"
              timeIntervals={1}
              minDate={new Date()}
              className="form-control"
            /> */}
              <Form.Control
                type="datetime-local"
                placeholder="date"
                name="readyTime"
                onChange={(e) => handleChange(e)}
                onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                value={formData?.readyTime || getMelbourneTime()}
                min={getMelbourneTime()}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Cut-Off Time</Form.Label>
              <Form.Control
                type="datetime-local"
                placeholder="date"
                name="cutoffTime"
                onChange={(e) => handleChange(e)}
                onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                value={formData?.cutoffTime || getMelbourneTime()}
                min={getMelbourneTime()}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Pickup Location</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={pickupOptions}
                value={
                  dropDownData.pickupLocation._id
                    ? {
                      value: dropDownData.pickupLocation._id,
                      label: dropDownData.pickupLocation.name,
                    }
                    : null
                }
                onChange={handlePickupChange}
                placeholder="Select Pickup Location"
                isSearchable
              />
              {/* <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                  className="w-100 dropdown-css-custom d-flex justify-content-between align-items-center"
                >
                  {dropDownData.pickupLocation.name
                    ? dropDownData.pickupLocation.name
                    : 'Select Pickup Location'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100 custom-scroll" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <AddLocation type="PickUp" refetch={fetchPickupLocations} />
                  {loading3 ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    [...pickupLocations].sort((a, b) => a.customName.localeCompare(b.customName)).map((pickupLocation) => (
                      <Dropdown.Item
                        key={pickupLocation._id}
                        onClick={() =>
                          setDropDownData({
                            ...dropDownData,
                            pickupLocation: {
                              name: pickupLocation.customName,
                              _id: pickupLocation._id,
                            },
                          })
                        }
                      >
                        {pickupLocation.customName}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown> */}
              {errors.pickupLocationId ? (
                <Form.Text className="text-danger">{errors.pickupLocationId}</Form.Text>
              ) : null}
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Drop Location</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={dropOptions}
                value={
                  dropDownData.dropLocation._id
                    ? {
                      value: dropDownData.dropLocation._id,
                      label: dropDownData.dropLocation.name,
                    }
                    : null
                }
                onChange={handleDropChange}
                placeholder="Select Drop Location"
                isSearchable
              />
              {/* <Dropdown data-bs-theme="dark">
                <Dropdown.Toggle
                  id="dropdown-button-dark-example1"
                  variant="secondary"
                  className="w-100 dropdown-css-custom d-flex justify-content-between align-items-center"
                >
                  {dropDownData.dropLocation.name
                    ? dropDownData.dropLocation.name
                    : 'Select Drop Location'}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="w-100 custom-scroll"
                  style={{ maxHeight: '250px', overflowY: 'auto' }}
                >
                  <AddLocation type="DropOff" refetch={fetchDropLocations} />
                  {loading4 ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    [...dropLocations].sort((a, b) => a.customName.localeCompare(b.customName))?.map((dropLocation) => (
                      <Dropdown.Item
                        key={dropLocation._id}
                        onClick={() =>
                          setDropDownData({
                            ...dropDownData,
                            dropLocation: { name: dropLocation.customName, _id: dropLocation._id },
                          })
                        }
                      >
                        {dropLocation.customName}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown> */}
              {errors.dropOfLocationId ? (
                <Form.Text className="text-danger">{errors.dropOfLocationId}</Form.Text>
              ) : null}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Upload Attachment</Form.Label>
              <Form.Control
                type="file"
                placeholder="Text"
                name="attachments"
                multiple
                onChange={(e) => handleFileChange(e)}
              />
            </Form.Group>
          </Col>
          {/* {dropDownData.serviceType.text?.toUpperCase() === 'AIR IMPORT ' && ( */}
          <Col className="mt-3 w-100">
            <Form.Group>
              <Form.Label>Is VPAP</Form.Label>
              <Form.Control
                as="select"
                name="isVpap"
                onChange={(e) => handleChange(e)}
                value={formData?.isVpap}
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Control>
            </Form.Group>
          </Col>
          {/* )} */}
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter your note here..."
                name="note"
                onChange={(e) => handleChange(e)}
                value={formData?.note}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label>AWB</Form.Label>
                  <Form.Control
                    type="text"
                    name="AWB"
                    placeholder="Text"
                    maxLength={30}
                    onChange={(e) => handleChange(e)}
                    value={formData?.AWB}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Admin Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    placeholder="Enter your note here..."
                    name="adminNote"
                    onChange={(e) => handleChange(e)}
                    value={formData?.adminNote}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* <Row>
          <Col md={3} className="mt-3">
            {loading5 ? (
              <Spinner animation="border" />
            ) : (
              <Button variant="success" className="text-white px-4 p-2" style={{ backgroundColor: '#5856D5' }} onClick={handleSubmit}>
                Add Booking
              </Button>
            )}
          </Col> 
        </Row> */}
      </Container>
    </>
  )
}

export default AddJobs
