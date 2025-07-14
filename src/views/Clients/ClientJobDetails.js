import { Button, Card, Col, Container, Dropdown, Form, Modal, Row, Spinner, Tabs, Tab, Table } from 'react-bootstrap'
import { LuChevronDown } from 'react-icons/lu'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { get, postWihoutMediaData, updateReq } from '../../lib/request'
import { useNavigate, useParams } from 'react-router-dom'
import sweetAlert from 'sweetalert2'
import { getFormattedDAndT, getLocalDateAndTime, convertToMelbourneFormat } from '../../lib/getFormatedDate'
import VPAPdfGenerate from '../../components/operations/VPAPdfGenerate'
import ChangeAttchment from './changeAttchment'
import getLocationByCordinates from '../../services/getLocationByCordinates'
import ViewDriverUploads from './viewDriverUploads'
import EditJobAdmin from '../../components/Modals/EditJobAdmin'
import { MdOutlineArrowBack } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment';
import getStatusStyles from '../../services/getStatusColor'
import { BsThreeDotsVertical } from 'react-icons/bs'
import sortData from '../../services/sortData'

export default function ClientJobDetails() {
  const navigate = useNavigate()
  const imgSrc = process.env.Image_Src
  const { id } = useParams()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [job, setJob] = useState({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [isRefresh, setIsRefresh] = useState(false)
  const [showAttachment, setShowAttachment] = useState(false)
  const [pickupLocationName, setPickupLocationName] = useState('')
  const [deliveryLocationName, setDeliveryLocationName] = useState('')
  const [message, setMessage] = useState('')
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isReferesh, setIsReferesh] = useState(false)
  const searchQuery = useSelector((state) => state.searchQuery)
  const [selectedItem, setSelectedItem] = useState(location.state?.selectedItem || {})
  const [isAdminReview, setIsAdminReview] = useState(false);
  const [activeTab, setActiveTab] = useState("jobDetails");
  const role = useSelector((state) => state.role);

  // handle attachment modal
  const handleAttachmentClose = () => setShowAttachment(false)
  const handleAttachmentShow = () => setShowAttachment(true)

  const [activeBtn, setActiveBtn] = useState('jobDetails')

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };
  const changeActiveBtn = (btn) => {
    setActiveBtn(btn)
  }

  const statusFields = [
    'Pending',
    'Driver Assigned',
    'Arrival on Pickup',
    'Picked Up',
    'Arrival on Delivery',
    'Delivered',
    'Cancelling',
    'Cancelled',
    'Hold',
    'Un Hold',
  ]

  const tabLabels = {
    jobDetails: 'Job Details',
    clientDetails: 'Client Details',
    driverAttachments: 'Driver Attachments',
    pickupDetails: 'Pickup Details',
    dropDetails: 'Drop Details',
  };
  useEffect(() => {
    setLoading(true)
    setMessage('')
    if (
      searchQuery.currentStatus ||
      searchQuery.clientId ||
      searchQuery.driverId ||
      searchQuery.fromDate ||
      searchQuery.toDate ||
      searchQuery.jobId ||
      searchQuery.clientName ||
      searchQuery.driverName
    ) {
      setLoading(false)

    } else {
      getInitialData()
    }
  }, [page, limit, isReferesh])

  // get initial data
  const getInitialData = () => {
    get(`/admin/info/jobFilter?currentStatus=Un-Delivered`, 'admin')
      .then((response) => {
        if (response?.data?.status) {
          if (response?.data?.data?.length === 0) {
            setMessage('No data found')
          }
          setData(response?.data?.data)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }


  const handleStatusChange = () => {
    if (status === 'Hold' || status === 'Un Hold') {
      updateReq(`/v2/admin/job?job_id=${id}`, { currentStatus: status }, 'admin').then((res) => {
        if (res.data.status) {
          sweetAlert.fire({
            icon: 'success',
            title: 'Status Changed Successfully',
          })
          setIsRefresh(!isRefresh)
          handleClose()
        } else {
          sweetAlert.fire({
            icon: 'error',
            title: `${res.data.message}`,
          })
        }
      })
    } else {
      updateReq(`/admin/job/status?id=${id}`, { new_status: status }, 'admin').then((res) => {
        if (res.data.status) {
          sweetAlert.fire({
            icon: 'success',
            title: 'Status Changed Successfully',
          })
          setIsRefresh(!isRefresh)
          handleClose()
        } else {
          sweetAlert.fire({
            icon: 'error',
            title: `${res.data.message}`,
          })
        }
      })
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setClientData({ ...clientData, [name]: value })
  }
  // handle sort
  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    setData(sortedData)
  }

  // handle cancle booking
  const handleCancleBooking = () => {
    sweetAlert
      .fire({
        title: 'Are you sure?',
        text: 'You want to cancel the booking',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Cancel it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          postWihoutMediaData(`/v2/admin/job-cancellation?job_id=${id}`, {}, 'admin').then(
            (res) => {
              if (res.data.status) {
                sweetAlert.fire({
                  icon: 'success',
                  title: 'Booking Cancelled Successfully',
                })
                setIsRefresh(!isRefresh)
              } else {
                sweetAlert.fire({
                  icon: 'error',
                  title: `${res.data.message}`,
                })
              }
            },
          )
        }
      })
  }

  const fetchJobDetails = () => {
    get(`/admin/job?id=${id}`, 'admin').then((res) => {
      if (res.data.status) {
        setJob(res.data.data);
        setStatus(res.data.data.currentStatus);
        setLoading(false);
      }
    }).catch((error) => {
      console.error("Error fetching job details:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);

    // Initial data fetch
    fetchJobDetails();

    // Polling every 10 seconds
    // const interval = setInterval(fetchJobDetails, 10000);

    // Clear interval on component unmount
    // return () => clearInterval(interval);

    fetchJobDetails();
  }, [id]);


  useEffect(() => {
    const fetchLocationNames = async () => {
      if (job.pickUpDetails?.pickupAddress) {
        const { latitude, longitude } = job.pickUpDetails.pickupAddress
        const locationName = await getLocationByCordinates(latitude, longitude)
        setPickupLocationName(locationName)
      }
      if (job.dropOfDetails?.deliveryAddress) {
        const { latitude, longitude } = job.dropOfDetails.deliveryAddress
        const locationName = await getLocationByCordinates(latitude, longitude)
        setDeliveryLocationName(locationName)
      }
    }
    fetchLocationNames()
  }, [job])

  return (
    <>
      {loading ? (
        <Spinner animation="border" role="status" className="mx-auto d-block" />
      ) : (
        <div>
          <Row className="d-flex flex-row align-items-center">
            <Col md={4}>
              <h4 className="mb-0">{tabLabels[activeTab]}</h4>
            </Col>

            <Col md={8} className="d-flex flex-wrap align-item-center justify-content-start justify-content-lg-end gap-2 py-3">
              <EditJobAdmin job={job} setIsRefresh={setIsRefresh} isReferesh={isRefresh} fetchJobDetails={fetchJobDetails} />
              {role !== 'Allocator' && (
                <>
                  <Button className="custom-border-btn" onClick={() => handleShow()}>
                    Change Status
                  </Button>

                  {job?.VpapId == null ? (
                    <Button className="custom-border-btn" onClick={() => navigate(`/client/vpap/add/${id}`)}>
                      Add Vpap
                    </Button>
                  ) : null}

                  <Button className="custom-border-btn" onClick={() => navigate(`/location/${id}`)}>
                    Track Driver
                  </Button>

                  <Button className="text-white" variant="danger" onClick={handleCancleBooking}>
                    Cancel Booking
                  </Button>
                </>
              )}
            </Col>
          </Row>

          {/* Edited */}
          <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="job-tabs" className="mb-3 custom-tabs">
            {/* Job Details */}
            <Tab eventKey="jobDetails" title="Job Details">
              <>
                <ul className="m-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="jobId">
                        <Form.Label>Job Id</Form.Label>
                        <Form.Control
                          type="text"
                          name="jobId"
                          value={job?.uid || ""}
                          placeholder="Enter Job ID"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="clientId">
                        <Form.Label>Client ID</Form.Label>
                        <Form.Control type="text" readOnly value={job?.clientId?._id || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="awb">
                        <Form.Label>AWB</Form.Label>
                        <Form.Control type="text" readOnly value={job?.AWB || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="pieces">
                        <Form.Label>Pieces</Form.Label>
                        <Form.Control type="text" readOnly value={job?.pieces || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="weight">
                        <Form.Label>Weight (KG)</Form.Label>
                        <Form.Control type="text" readOnly value={job?.weight || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="serviceType">
                        <Form.Label>Service Type</Form.Label>
                        <Form.Control type="text" readOnly value={job?.serviceTypeId?.text || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="serviceCode">
                        <Form.Label>Service Code</Form.Label>
                        <Form.Control type="text" readOnly value={job?.serviceCodeId?.text || ""} />
                      </Form.Group>
                    </Col>



                    <Col md={6} className="mb-3">
                      <Form.Group controlId="vpapSubmitted">
                        <Form.Label>VPAP Submitted</Form.Label>
                        <Form.Control type="text" readOnly value={job?.VpapId == null ? "No" : "Yes"} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="fuelSurcharge">
                        <Form.Label>Fuel Surcharge</Form.Label>
                        <Form.Control type="text" readOnly value={job?.invoiceDetails?.fuelChargeCalculation || 0} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="rates">
                        <Form.Label>Rates</Form.Label>
                        <Form.Control type="text" readOnly value={job?.invoiceDetails?.rates || 0} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="invoiceNumber">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control type="text" readOnly value={job?.invoice_number || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="invoices">
                        <Form.Label>Invoices</Form.Label>
                        <Form.Control type="text" readOnly value={job?.is_invoices ? "Yes" : "No"} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="createdBookingTime">
                        <Form.Label>Created Booking Time</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          value={getFormattedDAndT(job?.createdDateTime) || ""}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="waitTimeCharge">
                        <Form.Label>Pickup Wait Time Charge</Form.Label>
                        <Form.Control type="text" readOnly value={job?.invoiceDetails?.pickUpDetails?.pickUpWaitingRate || 0} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="waitTimeCharge">
                        <Form.Label>Drop off Wait Time Charge</Form.Label>
                        <Form.Control type="text" readOnly value={job?.invoiceDetails?.dropOfDetails?.deliveryWaitingRate || 0} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="adminNote">
                        <Form.Label>Admin Note</Form.Label>
                        <Form.Control as="textarea" rows={3} readOnly value={job?.adminNote || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="driverNote">
                        <Form.Label>Driver Note</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          readOnly
                          value={job?.driverNote?.map((n, i) =>
                            `${i + 1}. ${n.text} (${new Date(n.createdAt).toLocaleString()})`
                          ).join('\n') || ""}
                        />
                      </Form.Group>
                    </Col>

                    {/* <Col md={6} className="mb-3">
                      <Form.Group controlId="referenceNumber">
                        <Form.Label>Reference No</Form.Label>
                        <Form.Control type="text" readOnly value={job?.custRefNumber || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="note">
                        <Form.Label>Note</Form.Label>
                        <Form.Control as="textarea" rows={2} readOnly value={job?.note || ""} />
                      </Form.Group>
                    </Col> */}

                    <Col md={6} className="mb-3">
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

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="adminReviewCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Admin Review for manual pricing"
                          checked={isAdminReview}
                          className="custom-checkbox"
                          // onChange={(e) => setIsAdminReview(e.target.checked)}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </ul>
              </>
            </Tab>

            {/* Client Details */}
            <Tab eventKey="clientDetails" title="Client Details">
              <>
                <ul className="m-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={job?.clientId?.username || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={`${job?.clientId?.firstname || ""} ${job?.clientId?.lastname || ""}`}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={job?.clientId?.email || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          value={job?.clientId?.phone || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="companyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={job?.clientId?.companyName || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    {job?.booked_by && (
                      <Col md={6} className="mb-3">
                        <Form.Group controlId="bookedBy">
                          <Form.Label>Booked By</Form.Label>
                          <Form.Control
                            type="text"
                            value={job?.booked_by}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    )}

                    {job?.clientId?.isDriverPermission && (
                      <Col md={6} className="mb-3 d-flex align-items-center">
                        <Form.Group controlId="driverAssignPermission" className="mb-0">
                          <Form.Check
                            type="checkbox"
                            label="Driver Assigning Permission"
                            checked={true}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                </ul>
              </>
            </Tab>

            {/* Driver Attachments */}
            <Tab eventKey="driverAttachments" title="Driver Attachments">
              <>
                <div className="custom-list-main d-flex flex-row align-items-center justify-content-center">
                  <ViewDriverUploads
                    captures={job?.capturedPic}
                    Rname={job?.signature_name}
                    RSign={job?.deliveredVerificationImage}
                  />
                </div>
              </>
            </Tab>

            {/* Pickup Details */}
            <Tab eventKey="pickupDetails" title="Pickup Details">
              <>
                <ul className="m-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="readyTime">
                        <Form.Label>Ready Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            job?.pickUpDetails?.readyTime
                              ? getFormattedDAndT(job?.pickUpDetails?.readyTime)
                              : ""
                          }
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="pickupLocation">
                        <Form.Label>Pick Up Location</Form.Label>
                        <Form.Control
                          type="text"
                          value={job?.pickUpDetails?.pickupLocationId?.customName || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="arrivalTime">
                        <Form.Label>Arrival Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            job?.pickUpDetails?.arrivalTime
                              ? getFormattedDAndT(job?.pickUpDetails?.arrivalTime)
                              : ""
                          }
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="pickedUpTime">
                        <Form.Label>Picked Up Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            job?.pickUpDetails?.pickedUpTime
                              ? getFormattedDAndT(job?.pickUpDetails?.pickedUpTime)
                              : ""
                          }
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="pickupAddress">
                        <Form.Label>Pickup Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={pickupLocationName || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </ul>
              </>
            </Tab>

            {/* Drop Details */}
            <Tab eventKey="dropDetails" title="Drop Details">
              <>
                <ul className="m-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="cutOffTime">
                        <Form.Label>Cut Off Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            job?.dropOfDetails?.cutOffTime
                              ? getFormattedDAndT(job?.dropOfDetails?.cutOffTime)
                              : ""
                          }
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="dropOffLocation">
                        <Form.Label>Drop Off Location</Form.Label>
                        <Form.Control
                          type="text"
                          value={job?.dropOfDetails?.dropOfLocationId?.customName || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="arrivalTimeDrop">
                        <Form.Label>Arrival Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            job?.dropOfDetails?.arrivalTime
                              ? getFormattedDAndT(job?.dropOfDetails?.arrivalTime)
                              : ""
                          }
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="deliveredTime">
                        <Form.Label>Delivered Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            job?.dropOfDetails?.deliveredTime
                              ? getFormattedDAndT(job?.dropOfDetails?.deliveredTime)
                              : ""
                          }
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="deliveryAddress">
                        <Form.Label>Delivery Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={deliveryLocationName || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </ul>
              </>
            </Tab>
          </Tabs>

          <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
            <Modal.Header className="border-0 text-center w-100">
              <Modal.Title className="w-100">
                {' '}
                <p className="mx-auto d-block">Change Status </p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  className="w-75 mx-auto d-block"
                  id="dropdown-autoclose-false"
                >
                  {status}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-75">
                  {statusFields.map((status, index) => (
                    <Dropdown.Item key={index} onClick={() => setStatus(status)}>
                      {status}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleStatusChange}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showAttachment} onHide={handleAttachmentClose} dialogClassName="custom-modal">
            <Modal.Header className="border-0 text-center w-100">
              <Modal.Title className="w-100">
                {' '}
                <p className="mx-auto d-block">Attachmens</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-3">
              <Card>
                <Card.Body>
                  <p className="m-1 text-center fw-bold">
                    {' '}
                    You can download the attachment from here.{' '}
                  </p>
                  {job?.attachmentKeys?.length === 0 && (
                    <p className="text-center text-danger"> No Attachment Found </p>
                  )}
                  {job?.attachmentKeys?.map((key, index) => {
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
                  <hr />
                  <h5 className="fw-bold"> VPAP </h5>
                  {job?.isVpap ? (
                    <VPAPdfGenerate
                      jobDetail={{
                        AWB: job?.AWB,
                        driverName: job?.driverId?.firstname + ' ' + job?.driverId?.lastname,
                        companyName: job?.clientId?.companyName,
                        // date: getFormattedDAndT(job?.pickUpDetails?.readyTime),
                        date: getFormattedDAndT(job?.pickUpDetails?.pickedUpTime),
                      }}
                      VPAPData={job?.VpapId}
                    />
                  ) : (
                    ''
                  )}
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <ChangeAttchment id={job._id} isRefresh={isRefresh} setIsRefresh={setIsRefresh} />

              <Button variant="secondary" onClick={handleAttachmentClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  )
}
