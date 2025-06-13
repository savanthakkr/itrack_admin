import { useEffect, useState } from 'react'
import { Modal, Form, Row, Col, Dropdown, Spinner, Button } from 'react-bootstrap'
import { get, updateReq } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import { FaRegEdit } from 'react-icons/fa'

function formatDateForInput(date) {
  if (!date) return ''
  // Split the date and time part
  const [datePart, timePart] = date.split('T')
  // Remove milliseconds and the 'Z' from the time part
  const formattedTime = timePart.slice(0, 5)
  return `${datePart}T${formattedTime}`
}

export default function EditJobAdmin({ job, setIsRefresh, isReferesh }) {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [pickupLocations, setPickupLocations] = useState([])
  const [dropLocations, setDropLocations] = useState([])

  const [editFormData, setEditFormData] = useState({
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
    // driverNote: job?.driverNote,
  })

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
  })
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [loading3, setLoading3] = useState(true)
  const [loading4, setLoading4] = useState(true)

  // handle change
  const handleEditChange = (e) => {
    const { name, value } = e.target
    if (name === 'is_invoices') {
      setEditFormData({ ...editFormData, [name]: e.target.checked })
      return
    }

    setEditFormData({ ...editFormData, [name]: value })
  }

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
      // driverNote: editFormData.driverNote,
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
  }, [])

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
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Weight"
                  value={editFormData.weight}
                  name="weight"
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
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
                </Dropdown>
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
                  value={editFormData.rates}
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
      </Modal>
    </>
  )
}
