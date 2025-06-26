import React, { useState, useRef, useEffect } from 'react'
import { Button, Col, Container, Form, Row, Modal, Card } from 'react-bootstrap'
import { CButton } from '@coreui/react'
import makeAnimated from 'react-select/animated';
import { get } from '../../lib/request.js'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment-timezone';
import { getFormattedDAndT } from '../../lib/getFormatedDate.js';

function ClientInvoice() {
  const navigate = useNavigate()
  const [data, setData] = useState({})
  const formRef = useRef();
  const [errorMessages, setErrorMessages] = useState('')
  const [validated, setValidated] = useState(false)
  const [clientData, setClientData] = useState({})
  // const [clientData, setClientData] = useState({
  //   allocateTo: '',
  //   dispatchId: '',
  //   client: '',
  //   awb: '',
  //   custJobNumber: '',
  //   readyTime: '',
  //   pickupLocation: '',
  //   dropOffLocation: '',
  //   arrivalTime: '',
  //   deliveredTime: '',
  // })
  const [isReferesh, setIsRefresh] = useState(false);

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("addClient");
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [showAttachment, setShowAttachment] = useState(false)
  const handleAttachmentShow = () => setShowAttachment(true)
  const handleAttachmentClose = () => setShowAttachment(false)

  const animatedComponents = makeAnimated();
  const { id } = useParams();

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

  // useEffect(() => {
  //   setLoading(true)

  //   get(`/admin/info/jobFilter?clientId=${id}`, "admin").then((data) => {
  //     console.log('data',data);
  //     setClientData({
  //       firstname: data.data.data.firstname,
  //       lastname: data.data.data.lastname,
  //       email: data.data.data.email,
  //       phone: data.data.data.phone,
  //       companyName: data.data.data.companyName,
  //       username: data.data.data.username,
  //       logoKey: data.data.data.logoKey,
  //       password: data.data.data.password,
  //       isDriverPermission: data.data.data.isDriverPermission,
  //       isTrackPermission: data.data.data.isTrackPermission
  //     })
  //     setLoading(false)
  //   }).catch((e) => {
  //     console.log("error while getting", e.message);
  //   })
  // }, [isReferesh])


  const getMelbourneTime = () => {
    return moment().tz("Australia/Melbourne").format("YYYY-MM-DDTHH:mm");
  };

  useEffect(() => {
    get(`/admin/invoice/getById?id=${id}`, 'admin')
      .then((response) => {
        if (response?.data?.status) {
          if (response?.data?.data?.length === 0) {
            setMessage('No data found')
          }
          setClientData(response?.data?.data)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, []);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">Invoice</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn">
            Download Invoice
          </CButton>
        </Col>
      </Row>
      <div className="mt-3 px-3 py-3 bg-white">
        <Form ref={formRef} noValidate validated={validated} className="custom-form">
          <Row>
            <Col md={6} className="mt-3 mt-md-0">
              <Form.Group>
                <Form.Label>Allocate To</Form.Label>
                <Form.Control
                  type="text"
                  name="allocateTo"
                  placeholder="Enter Allocate To"
                  value={clientData?.allocateTo ? clientData?.allocateTo?.firstname + " " + clientData?.allocateTo?.lastname : ""}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a Allocate to
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3 mt-md-0">
              <Form.Group>
                <Form.Label>Dispatch ID</Form.Label>
                <Form.Control
                  type="text"
                  name="dispatchId"
                  placeholder="Enter Dispatch Id"
                  value={clientData?.dispatchId?.uid || ""}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a dispatch id to
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Client</Form.Label>
                <Form.Control
                  type="text"
                  name="client"
                  placeholder="Enter Client"
                  value={clientData?.clientId?.companyName || ""}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a Client
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>AWB</Form.Label>
                <Form.Control
                  type="text"
                  name="Enter AWB"
                  placeholder="Text"
                  maxLength={30}
                  value={clientData?.AWB || ""}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Customer Job Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Customer Job Number"
                  name="custJobNumber"
                  maxLength={30}
                  value={clientData.custRefNumber}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Ready Time and Date</Form.Label>
                <Form.Control
                  type="text"
                  // placeholder="30/04/2025 12:00 AM"
                  name="readyTime"
                  maxLength={30}
                  value={getFormattedDAndT(clientData?.pickUpDetails?.readyTime) || ""}
                />
              </Form.Group>
            </Col>
            {/* <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Ready Time and Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  placeholder="date"
                  name="readyTime"
                  onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                  value={clientData?.pickUpDetails?.readyTime || ""}
                // min={getMelbourneTime()}
                />
              </Form.Group>
            </Col> */}
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Pick Up Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Pick Up Location"
                  name="pickupLocation"
                  maxLength={30}
                  value={clientData?.pickUpDetails?.pickupLocationId?.customName || ""}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Drop Off Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Drop Off Location"
                  name="dropOffLocation"
                  maxLength={30}
                  value={clientData?.dropOfDetails?.dropOfLocationId?.customName || ""}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Arrival Time</Form.Label>
                <Form.Control
                  type="text"
                  // placeholder="30/04/2025 12:00 AM"
                  name="arrivalTime"
                  maxLength={30}
                  value={getFormattedDAndT(clientData?.dropOfDetails?.arrivalTime) || ""}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Delivered Time</Form.Label>
                <Form.Control
                  type="text"
                  // placeholder="30/04/2025 12:00 AM"
                  name="deliveredTime"
                  maxLength={30}
                  value={getFormattedDAndT(clientData?.dropOfDetails?.deliveredTime) || ""}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Service Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Service Code"
                  name="serviceCode"
                  value={clientData?.serviceCodeId?.text || ""}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Service Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Service Type"
                  name="serviceType"
                  value={clientData?.serviceTypeId?.text || ""}
                  required
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
                  value={clientData?.pieces || ""}
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
                  value={clientData?.weight || ""}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Reference No</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="referenceNo"
                  name="referenceNo"
                  maxLength={20}
                  value={clientData?.referenceNo || ""}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Invoiced</Form.Label>
                <Form.Control
                  type="text"
                  name="invoiced"
                  placeholder="invoiced"
                  maxLength={20}
                  value={clientData?.invoiced ? 'Yes' : 'No'}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Rates</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="rates"
                  name="rates"
                  maxLength={20}
                  value={clientData?.rates || ""}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Invoice Number</Form.Label>
                <Form.Control
                  type="number"
                  name="invoiceNumber"
                  placeholder="invoice number"
                  maxLength={20}
                  value={clientData?.invoiceNumber || ""}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Pick Up Waiting Time</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="0:00"
                  name="pickupWaitingTime"
                  maxLength={20}
                  value={clientData?.pickUpDetails?.pickUpWaitingTime || ""}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Fuel Surcharge</Form.Label>
                <Form.Control
                  type="number"
                  name="fuelSurcharge"
                  placeholder="Write fuel surcharge number here"
                  maxLength={20}
                  value={clientData?.fuel_charge || ""}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Pick Up Waiting Rate</Form.Label>
                <Form.Control
                  type="number"
                  // placeholder="-20"
                  name="pickupWaitingRate"
                  maxLength={20}
                  value={clientData?.pickUpDetails?.pickUpWaitingRate || 0}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Delivery Waiting Time</Form.Label>
                <Form.Control
                  type="text"
                  // placeholder="0:00"
                  name="deliveryWaitingTime"
                  maxLength={20}
                  value={clientData?.dropOfDetails?.deliveryWaitingTime || ""}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Admin Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your note here..."
                    name="adminNote"
                    value={clientData?.adminNote || ""}
                  />
                </Form.Group>
              </Col>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Group>
                <Form.Label>Delivery Waiting Rate</Form.Label>
                <Form.Control
                  type="number"
                  // placeholder="-90"
                  name="deliveryWaitingRate"
                  maxLength={20}
                  value={clientData?.dropOfDetails?.deliveryWaitingRate || 0}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mt-3">
              <Form.Group controlId="attachment">
                <Form.Label>Attachment</Form.Label>
                <div
                  onClick={handleAttachmentShow}
                  className="border border-dashed py-2 px-3 mb-1 d-flex align-items-center justify-content-start"
                  style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                >
                  <Button
                    className="me-3 custom-btn"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering parent div's onClick
                      handleAttachmentShow();
                    }}
                  >
                    View Attachment
                  </Button>
                </div>
                <small className="text-muted">
                  Please ensure that the file size does not exceed 5MB and that it is in either PNG or JPG format.
                </small>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your note here..."
                  name="note"
                  value={clientData?.note || ""}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
      <Modal show={showAttachment} onHide={handleAttachmentClose} dialogClassName="custom-modal">
        <Modal.Header className="border-0 text-center w-100">
          <Modal.Title className="w-100">
            {' '}
            <p className="mx-auto d-block">Attachments</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <Card>
            <Card.Body>
              <p className="m-1 text-center fw-bold">
                {' '}
                You can download the attachment from here.{' '}
              </p>
              {data?.attachmentKeys?.map((key, index) => {
                return (
                  <div key={index} className="mb-2 ">
                    <b>{index + 1} :</b>{' '}
                    <Button
                      variant="success"
                      className="rounded-0 text-white rounded-1"
                      onClick={() => window.open(`${imgSrc}${key}`, '_blank')}
                    >
                      {' '}
                      Download{' '}
                    </Button>
                  </div>
                )
              })}
              {data?.isVpap ? (
                <>
                  <hr />
                  <h5 className="fw-bold"> VPAP </h5>
                  <VPAPdfGenerate
                    jobDetail={{
                      AWB: data?.AWB,
                      driverName: data?.driverId?.firstname + ' ' + data?.driverId?.lastname,
                      companyName: data?.clientId?.companyName,
                      date: getFormattedDAndT(data?.pickUpDetails?.readyTime),
                    }}
                    VPAPData={data?.VpapId}
                  />
                </>
              ) : (
                ''
              )}
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAttachmentClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ClientInvoice
