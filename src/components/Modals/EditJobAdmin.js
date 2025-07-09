import { useEffect, useState } from 'react'
import { Modal, Form, Row, Col, Dropdown, Spinner, Button } from 'react-bootstrap'
import { get, updateReq } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import { FaRegEdit } from 'react-icons/fa'
import Select from 'react-select';
import { drop } from 'lodash'

function formatDateForInput(date) {
  if (!date) return ''
  // Split the date and time part
  const [datePart, timePart] = date.split('T')
  // Remove milliseconds and the 'Z' from the time part
  const formattedTime = timePart.slice(0, 5)
  return `${datePart}T${formattedTime}`
}

export default function EditJobAdmin({ job, setIsRefresh, isReferesh, fetchJobDetails }) {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [pickupLocations, setPickupLocations] = useState([])
  const [dropLocations, setDropLocations] = useState([])

  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (Object.keys(job).length !== 0) {
      setEditFormData(
        {
          AWB: job.AWB,
          pieces: job.pieces,
          weight: job.weight,
          serviceTypeId: job.serviceTypeId?._id,
          custRefNumber: job?.custRefNumber,
          serviceCodeId: job.serviceCodeId?._id,
          readyTime: formatDateForInput(job?.pickUpDetails?.readyTime),
          cutOffTime: formatDateForInput(job?.dropOfDetails?.cutOffTime),
          note: job.note,
          adminNote: job.adminNote,
          pickupLocationId: job.pickUpDetails?.pickupLocationId?._id,
          dropOfLocationId: job.dropOfDetails?.dropOfLocationId?._id,
          rates: job?.rates,
          fuel_charge: job?.fuel_charge,
          is_invoices: job?.is_invoices,
          invoice_number: job?.invoice_number,
          wait_time_charge: job?.wait_time_charge,
          isVpap: job?.isVpap,
          manualPrice: job?.manualPrice,
          // driverNote: job?.driverNote,
        }
      )
    }
  }, [job]);



  const [serviceTypes, setServiceTypes] = useState([])
  const [serviceCode, setServiceCode] = useState([])
  const [dropDownData, setDropDownData] = useState({
    serviceType: {
      text: job.serviceTypeId?.text,
      _id: job.serviceTypeId?._id,
    },
    serviceCode: {
      text: job.serviceCodeId?.text,
      _id: job.serviceCodeId?._id,
    },
    weight: {
      value: '',
      label: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(true)
  const [loading4, setLoading4] = useState(true)

  useEffect(() => {
    if (dropDownData?.serviceCode?.text?.toLowerCase()?.trim() === 'loose') {
      const selectedWeight = weightOptions.find((item) => item.value === job?.weight);

      setDropDownData({
        ...dropDownData,
        weight: {
          label: selectedWeight.label,
          value: selectedWeight.value,
          rate: selectedWeight.rate
        },
      });
    }
  }, []);

  const handleServiceCodeChange = (selectedOption) => {
    const isLoose = selectedOption?.text?.toLowerCase()?.trim() === "loose";
    const wasLoose = dropDownData.serviceCode?.text?.toLowerCase()?.trim() === "loose";

    setDropDownData({
      ...dropDownData,
      serviceCode: { text: selectedOption.text, _id: selectedOption._id },
    });

    if (isLoose) {
      // Going to "loose" → reset weight
      setEditFormData(prev => ({
        ...prev,
        weight: null,
      }));
    } else if (wasLoose) {
      // Only reset weight/rates if switching away from "loose"
      const { rateRange, ...rest } = editFormData;

      setEditFormData({
        ...rest,
        weight: '',
        rates: '',
      });
    }
  };

  // handle change
  const handleEditChange = (e) => {
    const { name, value } = e.target
    if (name === 'is_invoices') {
      setEditFormData({ ...editFormData, [name]: e.target.checked })
      return
    }

    setEditFormData({ ...editFormData, [name]: value })
  }

  const weightOptions = [
    {
      value: '0-50',
      label: '0-50',
      rate: 32.80
    },
    {
      value: '51-499',
      label: '51-499',
      rate: 37.42
    },
    {
      value: '500-999',
      label: '500-999',
      rate: 46.53
    },
    {
      value: '1000-1999',
      label: '1000-1999',
      rate: 56.01
    },
    {
      value: '2000-2999',
      label: '2000-2999',
      rate: 65.11
    },
    {
      value: '3000-3999',
      label: '3000-3999',
      rate: 76.72
    },
    {
      value: '4000-4999',
      label: '4000-4999',
      rate: 88.44
    },
    {
      value: '5000-5999',
      label: '5000-5999',
      rate: 99.66
    },
    {
      value: '6000-6999',
      label: '6000-6999',
      rate: 111.63
    },
    {
      value: '7000-7999',
      label: '7000-7999',
      rate: 123.23
    },
    {
      value: '8000-8999',
      label: '8000-8999',
      rate: 139.44
    },
    {
      value: '9000-9999',
      label: '9000-9999',
      rate: 187.09
    },
    {
      value: '10,000-10,999',
      label: '10,000-10,999',
      rate: 212.05
    },
    {
      value: '11,000-11,999',
      label: '11,000-11,999',
      rate: 237.00
    },
    {
      value: '12,000-12,999',
      label: '12,000-12,999',
      rate: 261.94
    },
    {
      value: '13,000-13,999',
      label: '13,000-13,999',
      rate: 286.88
    }
  ];

  const handleWeightChange = (selectedOption) => {
    setDropDownData({
      ...dropDownData,
      weight: {
        label: selectedOption.label,
        value: selectedOption.value,
        rate: selectedOption.rate
      },
    });

    setEditFormData({
      ...editFormData,
      weight: selectedOption.value,
      rates: selectedOption.rate,
      rateRange: selectedOption.rate,
    });
  };

  // handle save
  const handleSave = () => {
    const data = {
      AWB: editFormData.AWB,
      pieces: editFormData.pieces,
      weight: editFormData.weight,
      serviceTypeId: dropDownData.serviceType._id,
      custRefNumber: editFormData.custRefNumber,
      serviceCodeId: dropDownData.serviceCode._id,
      readyTime: editFormData.readyTime + ':00.000Z',
      cutOffTime: editFormData.cutOffTime + ':00.000Z',
      note: editFormData.note,
      adminNote: editFormData.adminNote,
      pickupLocationId: editFormData.pickupLocationId,
      dropOfLocationId: editFormData.dropOfLocationId,
      rates: editFormData.rates,
      fuel_charge: editFormData.fuel_charge,
      is_invoices: editFormData.is_invoices,
      invoice_number: editFormData.invoice_number,
      wait_time_charge: editFormData.wait_time_charge,
      isVpap: editFormData.isVpap === 'true' ? true : false,
      manualPrice: editFormData?.manualPrice
      // driverNote: editFormData.driverNote,
    }

    const optionalFields = [
      'adminNote',
      'rates',
      'fuel_charge',
      'wait_time_charge',
      'invoice_number',
      'is_invoices'
    ];

    const requiredFields = Object.keys(data).filter(key => !optionalFields.includes(key));

    const isValid = requiredFields.every(
      (field) => data[field] !== '' && data[field] !== null && data[field] !== undefined
    );

    if (dropDownData?.serviceCode?.text?.toLowerCase()?.trim() === 'loose') {
      data.rateRange = editFormData.rateRange;
    }

    if (!isValid) {
      sweetAlert.fire({
        title: 'Error',
        text: 'All required fields must be filled.',
        icon: 'error',
      });
      return
    }

    updateReq(`/v2/admin/job?job_id=${job._id}`, data, 'admin')
      .then((response) => {
        if (response.data.status) {
          sweetAlert.fire({
            title: 'Success',
            text: 'Job Updated Successfully',
            icon: 'success',
          })
          setIsRefresh(!isReferesh)
          handleClose()
          fetchJobDetails();
        }
      })
      .catch((error) => {
        console.error(error)
        sweetAlert.fire({
          title: 'Error',
          text: 'Job Updated Failed',
          icon: 'error',
        })
      })
  }

  function fetchPickupLocations() {
    // get pickup locations
    get('/admin/locations/pickup', 'admin')
      .then((response) => {
        setPickupLocations(response.data.data)
        setLoading3(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function fetchDropLocations() {
    // get drop locations
    get('/admin/locations/dropoff', 'admin').then((response) => {
      setDropLocations(response.data.data)
      setLoading4(false)
    })
  }

  // getting service type and service code

  useEffect(() => {
    setLoading(true)
    setLoading2(true)
    // get service type

    get(`/admin/service/type`, 'admin')
      .then((response) => {
        setServiceTypes(response.data.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })

    get(`/admin/service/code`, 'admin')
      .then((response) => {
        setServiceCode(response.data.data)
        setLoading2(false)
      })
      .catch((error) => {
        console.error(error)
      })

    fetchDropLocations()
    fetchPickupLocations()
  }, []);

  return (
    <>
      <Button className="text-White custom-border-btn" onClick={() => handleShow()}>
        {' '}
        Edit Job
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" style={{ fontSize: '12px' }} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>AWB</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="AWB"
                  value={editFormData.AWB}
                  name="AWB"
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Pieces</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Pieces"
                  value={editFormData.pieces}
                  name="pieces"
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Service Code</Form.Label>
                <Dropdown data-bs-theme="primary">
                  <Dropdown.Toggle
                    id="dropdown-button-dark-example1"
                    variant="secondary"
                    className="w-100"
                  >
                    {dropDownData.serviceCode.text}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {loading2 ? (
                      <Spinner animation="border" variant="primary" />
                    ) : (
                      serviceCode?.map((serviceCode) => (
                        <Dropdown.Item
                          key={serviceCode._id}
                          // onClick={() => {
                          //   const isLoose = serviceCode?.text?.toLowerCase()?.trim() === "loose";

                          //   setDropDownData({
                          //     ...dropDownData,
                          //     serviceCode: { text: serviceCode.text, _id: serviceCode._id },
                          //   });

                          //   setEditFormData(prev => ({
                          //     ...prev,
                          //     weight: isLoose ? null : job.weight, // null if Loose, else keep existing
                          //   }));
                          // }}
                          onClick={() => handleServiceCodeChange(serviceCode)}
                        >
                          {serviceCode.text}
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>


            </Row>

            <Row className="mb-3">
              {dropDownData?.serviceCode?.text?.toLowerCase()?.trim() === 'loose' ?
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Weight</Form.Label>
                  {/* <Select
                    className="w-100 custom-select"
                    classNamePrefix="custom-select"
                    options={weightOptions}
                    value={
                      dropDownData.weight.value
                        ? {
                          value: dropDownData.weight.value,
                          label: dropDownData.weight.label,
                          rate: dropDownData.weight.rate
                        }
                        : null
                    }
                    onChange={handleWeightChange}
                    placeholder="Select Weight Range"
                    isSearchable
                  /> */}
                  <Dropdown data-bs-theme="primary">
                    <Dropdown.Toggle
                      id="dropdown-button-dark-example1"
                      variant="secondary"
                      className="w-100"
                    >
                      {dropDownData.weight.label}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {loading2 ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        weightOptions?.map((weight) => (
                          <Dropdown.Item
                            key={weight._id}
                            onClick={() => handleWeightChange(weight)}
                          >
                            {weight.label}
                          </Dropdown.Item>
                        ))
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                :
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    placeholder="Number"
                    maxLength={20}
                    onChange={handleEditChange}
                    value={editFormData?.weight}
                  />
                </Form.Group>

              }

              < Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Service Type</Form.Label>
                <Dropdown data-bs-theme="primary">
                  <Dropdown.Toggle
                    id="dropdown-button-dark-example1"
                    variant="secondary"
                    className="w-100"
                  >
                    {dropDownData.serviceType.text}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {loading ? (
                      <Spinner animation="border" variant="primary" />
                    ) : (
                      serviceTypes?.map((serviceType) => (
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
                </Dropdown>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Customer Reference No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Customer Reference No"
                  value={editFormData.custRefNumber}
                  name="custRefNumber"
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Ready Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  placeholder="Ready Time"
                  value={editFormData.readyTime}
                  name="readyTime"
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Cut-Off Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  placeholder="Cut-Off Time"
                  value={editFormData.cutOffTime}
                  name="cutOffTime"
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Note"
                  rows={2} // Number of visible rows in the textarea
                  value={editFormData.note}
                  name="note"
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="formGridState">
                  <Form.Label>Pickup Location</Form.Label>
                  <Form.Select
                    aria-label="Select Pickup Location"
                    name="pickupLocationId"
                    onChange={handleEditChange}
                  >
                    <option value={editFormData?.pickupLocationId}>
                      {job?.pickUpDetails?.pickupLocationId?.customName}
                    </option>
                    {loading3 ? (
                      <option>Loading...</option>
                    ) : (
                      pickupLocations.map((location) => (
                        <option key={location._id} value={location._id}>
                          {location.customName}
                        </option>
                      ))
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formGridState">
                  <Form.Label>Drop Location</Form.Label>
                  <Form.Select
                    aria-label="Select Drop Location"
                    name="dropOfLocationId"
                    onChange={handleEditChange}
                  >
                    <option value={editFormData?.dropOfLocationId}>
                      {job?.dropOfDetails?.dropOfLocationId?.customName}
                    </option>
                    {loading4 ? (
                      <option>Loading...</option>
                    ) : (
                      dropLocations.map((location) => (
                        <option key={location._id} value={location._id}>
                          {location.customName}
                        </option>
                      ))
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formGridState">
                  <Form.Label>VPAP</Form.Label>
                  <Form.Select aria-label="Select VPAP" name="isVpap" onChange={handleEditChange}>
                    <option value={editFormData?.isVpap}>
                      {editFormData?.isVpap ? 'Yes' : 'No'}
                    </option>
                    {editFormData?.isVpap ? <option value={false}>No</option> : <option value={true}>Yes</option>}


                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {/* <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="formGridEmail">
                  <Form.Label>Driver Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Driver Note"
                    rows={2} // Number of visible rows in the textarea
                    value={editFormData.driverNote}
                    name="driverNote"
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </Col>
            </Row> */}

            <Row className="mb-3"></Row>

            <h5 className="mt-3 fw-bold">Invoice Details</h5>
            <hr />
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Admin Note</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Admin Note"
                  rows={2} // Number of visible rows in the textarea
                  value={editFormData.adminNote}
                  name="adminNote"
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Rates</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Rates"
                  value={editFormData?.rates}
                  name="rates"
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Fuel Charge</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Fuel Charge"
                  value={editFormData.fuel_charge}
                  name="fuel_charge"
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Wait Time Charge</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Wait Time Charge"
                  value={editFormData.wait_time_charge}
                  name="wait_time_charge"
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Invoice Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Invoice Number"
                  value={editFormData.invoice_number}
                  name="invoice_number"
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Invoiced</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Invoiced"
                  checked={editFormData.is_invoices}
                  name="is_invoices"
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="clientAssignDriverCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Add manual price"
                  name="manualPrice"
                  checked={editFormData?.manualPrice}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, manualPrice: e.target.checked })
                  }
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
        </Modal.Footer>
      </Modal >
    </>
  )
}