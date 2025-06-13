import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap'
import sweetAlert from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { clientToken, clientUrl, get_req } from '../../lib/clietnRequests'
import axiosInstance from '../../lib/axiosInstance'
import moment from 'moment-timezone';
import { CButton } from '@coreui/react'
import Select from 'react-select';

const AddClientJob = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(false)
  const [loading4, setLoading4] = useState(false)
  const [loading5, setLoading5] = useState(false)
  const [serviceTypes, setServiceTypes] = useState([])
  const [pickupLocations, setPickupLocations] = useState([])
  const [dropLocations, setDropLocations] = useState([])
  const [serviceCode, setServiceCode] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    AWB: '',
    pieces: '',
    weight: '',
    // serviceTypeId: '',
    custRefNumber: '',
    // serviceCodeId: '',
    readyTime: '',
    cutoffTime: '',
    attachments: [],
    // pickupLocationId: '',
    // dropOfLocationId: '',
    note: '',
    // isVpap: '',
    booked_by: '',
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
  })

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const getMelbourneTime = () => {
    return moment().tz("Australia/Melbourne").format("YYYY-MM-DDTHH:mm");
  };


  // handle file change
  const handleFileChange = (e) => {
    const files = e.target.files // Get all selected files
    const fileList = Array.from(files) // Convert FileList to array
    setFormData({ ...formData, attachments: fileList })
  }

  // validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.AWB) errors.AWB = 'AWB is required'
    if (!formData.pieces) errors.pieces = 'Pieces are required'
    if (!formData.weight) errors.weight = 'Weight is required'
    if (!dropDownData.serviceType._id) errors.serviceType = 'Service Type is required'
    if (!formData.custRefNumber) errors.custRefNumber = 'Customer Reference Number is required'
    if (!dropDownData.serviceCode._id) errors.serviceCode = 'Service Code is required'
    if (!formData.readyTime) errors.readyTime = 'Ready Time is required'
    if (!formData.cutoffTime) errors.cutoffTime = 'Cut-Off Time is required'
    if (!dropDownData.pickupLocation._id) errors.pickupLocation = 'Pickup Location is required'
    if (!dropDownData.dropLocation._id) errors.dropLocation = 'Drop Location is required'
    if (!formData.booked_by) errors.booked_by = 'Booked By is required'
    if (formData.isVpap === '') errors.isVpap = 'Need VPAP is required'
    return errors
  }

  const handleSubmit = () => {
    setLoading5(true)
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      sweetAlert.fire({
        icon: 'error',
        title: 'All fields are required',
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
    payload.append('booked_by', formData.booked_by)
    formData.attachments.forEach((file) => {
      payload.append('attachments', file)
    })

    axiosInstance
      .post('/client/job', payload, {
        headers: {
          Authorization: `Bearer ${clientToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setLoading5(false)
        if (response.data.status) {
          sweetAlert.fire({
            icon: 'success',
            title: 'Booking added successfully',
          }).then(() => {
            navigate("/client/dashboard/job/all")
          })
        } else {
          sweetAlert.fire({
            icon: 'error',
            title: 'Failed to add job',
          })
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading5(false)
        sweetAlert.fire({
          icon: 'error',
          title: 'Failed to add job',
        })
      })
  }

  // fetch service types and service code
  useEffect(() => {
    setLoading(true)
    setLoading2(true)
    setLoading3(true)
    setLoading4(true)
    get_req(clientUrl.serviceType)
      .then((response) => {
        setServiceTypes(response.data.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
    get_req(clientUrl.serviceCode)
      .then((response) => {
        setServiceCode(response.data.data)
        setLoading2(false)
      })
      .catch((error) => {
        console.error(error)
      })
    get_req(clientUrl.pickups, null, true)
      .then((response) => {
        setPickupLocations(response.data.data)
        setLoading3(false)
      })
      .catch((error) => {
        console.error(error)
      })
    get_req(clientUrl.dropoffs, null, true).then((response) => {
      setDropLocations(response.data.data)
      setLoading4(false)
    })
  }, [])

  const serviceTypeOptions = serviceTypes
    .sort((a, b) => a.text.localeCompare(b.text))
    .map((type) => ({
      value: type._id,
      label: type.text,
    }));

  const handleServiceTypeChange = (selectedOption) => {
    setDropDownData((prev) => ({
      ...prev,
      serviceType: {
        _id: selectedOption?.value,
        text: selectedOption?.label,
      },
    }));
  
    // Optionally clear error
    setFormErrors((prev) => ({
      ...prev,
      serviceType: '',
    }));
  };

  const serviceCodeOptions = serviceCode
    .sort((a, b) => a.text.localeCompare(b.text))
    .map((code) => ({
      value: code._id,
      label: code.text,
    }));

  // Handle serviceCode select change
  const handleServiceCodeChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      serviceCode: {
        _id: selectedOption?.value || '',
        text: selectedOption?.label || '',
      },
    });
  };

  const pickupLocationOptions = pickupLocations
    ?.sort((a, b) => a.customName.localeCompare(b.customName))
    .map((location) => ({
      value: location._id,
      label: location.customName,
    }));

  const dropLocationOptions = dropLocations
    ?.sort((a, b) => a.customName.localeCompare(b.customName))
    .map((location) => ({
      value: location._id,
      label: location.customName,
    }));

  // Handle pickupLocation selection
  const handlePickupLocationChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      pickupLocation: {
        _id: selectedOption?.value || '',
        name: selectedOption?.label || '',
      },
    });
  };

  const handleDropLocationChange = (selectedOption) => {
    setDropDownData((prev) => ({
      ...prev,
      dropLocation: {
        name: selectedOption.label,
        _id: selectedOption.value,
      },
    }));
  };

  const vpapOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ];

  const handleVpapChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, isVpap: selectedOption.value }));
  };

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
      <div className="mt-3 px-3 py-3 bg-white custom-form">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>AWB</Form.Label>
              <Form.Control
                type="text"
                name="AWB"
                placeholder="Text"
                onChange={(e) => handleChange(e)}
                value={formData?.AWB}
                isInvalid={!!formErrors.AWB}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.AWB}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Customer Reference No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Text"
                name="custRefNumber"
                onChange={(e) => handleChange(e)}
                value={formData?.custRefNumber}
                isInvalid={!!formErrors.custRefNumber}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.custRefNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Pieces</Form.Label>
              <Form.Control
                type="number"
                placeholder="number"
                name="pieces"
                onChange={(e) => handleChange(e)}
                value={formData?.pieces}
                isInvalid={!!formErrors.pieces}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.pieces}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                name="weight"
                placeholder="number"
                onChange={(e) => handleChange(e)}
                value={formData?.weight}
                isInvalid={!!formErrors.weight}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.weight}
              </Form.Control.Feedback>
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

              <Dropdown.Menu className="w-100">
                {loading ? (
                  <div className="text-center py-2">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  serviceTypes?.map((serviceType) => {
                    return (
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
                    )
                  })
                )}
              </Dropdown.Menu>

            </Dropdown> */}
            <Select
              className={`w-100 ${formErrors.serviceType ? 'custom-select__control--is-invalid' : ''}`}
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
              isLoading={loading}
            />
            {formErrors.serviceType && (
              <div className="invalid-feedback d-block">{formErrors.serviceType}</div>
            )}
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Service Code</Form.Label>
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
                <Dropdown.Menu className="w-100">
                  {loading2 ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    serviceCode &&
                    serviceCode?.map((serviceCode) => {
                      return (
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
                      )
                    })
                  )}
                </Dropdown.Menu>
              </Dropdown> */}
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
                isLoading={loading2}
              />
              {formErrors.serviceCode && (
                <div className="invalid-feedback d-block">{formErrors.serviceCode}</div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Ready Time</Form.Label>
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

                <Dropdown.Menu className="w-100">
                  {loading3 ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    pickupLocations?.map((pickupLocation) => {
                      return (
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
                      )
                    })
                  )}
                </Dropdown.Menu>
              </Dropdown> */}
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={pickupLocationOptions}
                value={
                  dropDownData.pickupLocation._id
                    ? {
                      value: dropDownData.pickupLocation._id,
                      label: dropDownData.pickupLocation.name,
                    }
                    : null
                }
                onChange={handlePickupLocationChange}
                placeholder="Select Pickup Location"
                isSearchable
                isLoading={loading3}
              />
              {formErrors.pickupLocation && (
                <div className="invalid-feedback d-block">{formErrors.pickupLocation}</div>
              )}
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Drop Location</Form.Label>
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

                <Dropdown.Menu className="w-100">
                  {loading4 ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    dropLocations?.map((dropLocation) => {
                      return (
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
                      )
                    })
                  )}
                </Dropdown.Menu>
              </Dropdown> */}
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                options={dropLocationOptions}
                value={
                  dropDownData.dropLocation._id
                    ? {
                      value: dropDownData.dropLocation._id,
                      label: dropDownData.dropLocation.name,
                    }
                    : null
                }
                onChange={handleDropLocationChange}
                placeholder="Select Drop Location"
                isSearchable
                isLoading={loading4}
              />
              {formErrors.dropLocation && (
                <div className="invalid-feedback d-block">{formErrors.dropLocation}</div>
              )}
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
                isInvalid={!!formErrors.attachments}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.attachments}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Label>VPAP</Form.Label>
            {/* <Dropdown data-bs-theme="dark">
              <Dropdown.Toggle
                id="dropdown-button-dark-example1"
                variant="secondary"
                className="w-100 dropdown-css-custom d-flex justify-content-between align-items-center"
              >
                {formData.isVpap ? (formData.isVpap === 'true' ? 'Yes' : 'No') : 'Need VPAP'}
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                <Dropdown.Item onClick={() => setFormData({ ...formData, isVpap: 'true' })}>
                  Yes
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFormData({ ...formData, isVpap: 'false' })}>
                  No
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            <Select
              className="w-100 custom-select"
              classNamePrefix="custom-select"
              options={vpapOptions}
              value={
                formData.isVpap
                  ? { value: formData.isVpap, label: formData.isVpap === 'true' ? 'Yes' : 'No' }
                  : null
              }
              onChange={handleVpapChange}
              placeholder="Need VPAP"
              isSearchable={false}
            />
            {formErrors.isVpap && (
              <div className="invalid-feedback d-block">{formErrors.isVpap}</div>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Enter your note Here"
                name="note"
                onChange={(e) => handleChange(e)}
                value={formData?.note}
                isInvalid={!!formErrors.note}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.note}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group>
              <Form.Label>Booked By</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your text here"
                name="booked_by"
                onChange={(e) => handleChange(e)}
                value={formData?.booked_by}
                isInvalid={!!formErrors.booked_by}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.booked_by}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {/* <Row>
          <Col md={3} className="mt-3">
            {loading5 ? (
              <Spinner animation="border" />
            ) : (
              <Button variant="success" className="text-white px-4 p-2" onClick={handleSubmit}>
                Add Booking
              </Button>
            )}
          </Col>
        </Row> */}
      </div>
    </>
  )
}

export default AddClientJob
