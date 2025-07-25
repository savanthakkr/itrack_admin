import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Spinner, Modal, Card, Tabs, Tab, Form } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import sweetAlert from 'sweetalert2'
import { get, updateReq } from '../../lib/request'
import Moment from 'react-moment'
import { getFormattedDAndT, getLocalDateAndTime, convertToMelbourneFormat, utcToMelbourne } from '../../lib/getFormatedDate'
import ViewDriverUploads from '../Clients/viewDriverUploads'
import VPAPdfGenerate from '../../components/operations/VPAPdfGenerate'
import ChangeAttchment from '../Clients/changeAttchment'

const JobDetails = () => {
  const { id } = useParams()
  const imgSrc = process.env.Image_Src

  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAttachment, setShowAttachment] = useState(false)
  const [activeTab, setActiveTab] = useState("jobDetails");
  const [job, setJob] = useState({})
  const [isRefresh, setIsRefresh] = useState(false)

  const tabLabels = {
    jobDetails: 'Job Details',
    driverAttachments: 'Driver Attachments',
    pickupDetails: 'Pickup Details',
    dropDetails: 'Drop Details',
  };

  // handle attachment modal
  const handleAttachmentClose = () => setShowAttachment(false)
  const handleAttachmentShow = () => setShowAttachment(true)
  const handleConfirm = () => {
    sweetAlert
      .fire({
        title: 'Are you sure?',
        text: 'You want to cancel this booking',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Cancel it!',
        cancelButtonText: 'No, Keep it',
      })
      .then((result) => {
        if (result.isConfirmed) {
          updateReq(`/client/cancel-job/${id}`, {}, 'client').then((res) => {
            if (res.data.status) {
              sweetAlert.fire('Cancelled!', 'Your booking has been cancelled.', 'success')
            } else {
              sweetAlert.fire('Cancelled!', `${res.data.message}`, 'error')
            }
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your booking is safe :)', 'error')
        }
      })
  }

  useEffect(() => {
    setLoading(true)
    get(`/client/job?id=${id}`, 'client').then((res) => {
      if (res.data.status) {
        setData(res.data.data)
        setLoading(false)
      }
    })
  }, [])

  const [activeBtn, setActiveBtn] = useState('jobDetails')

  const changeActiveBtn = (btn) => {
    setActiveBtn(btn)
  }

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" role="status" className="mx-auto d-block" />
      ) : (
        <>
          <div>
            <Row className="d-flex flex-row align-items-center">
              <Col md={4}>
                <h4 className="mb-0">{tabLabels[activeTab]}</h4>
              </Col>
            </Row>
          </div>

          <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="job-tabs" className="mt-2 mb-3 custom-tabs">
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
                          value={data?.uid || ""}
                          placeholder="Enter Job ID"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="clientId">
                        <Form.Label>Client ID</Form.Label>
                        <Form.Control type="text" readOnly value={data?.clientId?._id} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="awb">
                        <Form.Label>AWB</Form.Label>
                        <Form.Control type="text" readOnly value={data.AWB} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="pieces">
                        <Form.Label>Pieces</Form.Label>
                        <Form.Control type="text" readOnly value={data?.pieces} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="weight">
                        <Form.Label>Weight (KG)</Form.Label>
                        <Form.Control type="text" readOnly value={data?.weight} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="serviceType">
                        <Form.Label>Service Type</Form.Label>
                        <Form.Control type="text" readOnly value={data?.serviceTypeId?.text} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="serviceCode">
                        <Form.Label>Service Code</Form.Label>
                        <Form.Control type="text" readOnly value={data?.serviceCodeId?.text} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="referenceNumber">
                        <Form.Label>Reference No</Form.Label>
                        <Form.Control type="text" readOnly value={data?.custRefNumber || ""} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="note">
                        <Form.Label>Note</Form.Label>
                        <Form.Control as="textarea" rows={1} readOnly value={data?.note} />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="vpapSubmitted">
                        <Form.Label>VPAP Submitted</Form.Label>
                        <Form.Control type="text" readOnly value={data?.isVpap ? 'Yes' : 'No'} />
                      </Form.Group>
                    </Col>

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
                      <Form.Group controlId="driverNote">
                        <Form.Label>Driver Note</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={1}
                          readOnly
                          value={
                            data?.driverNote?.map((noteObj, index) =>
                              `${index + 1}. ${noteObj.text} (${new Date(noteObj.createdAt).toLocaleString()})`
                            ).join('\n') || ""
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="createdBookingTime">
                        <Form.Label>Created Booking Time</Form.Label>
                        <Form.Control
                          type="text"
                          readOnly
                          // value={
                          //   data?.createdDateTime
                          //     ? new Date(data.createdDateTime).toLocaleString('en-GB', {
                          //       day: '2-digit',
                          //       month: '2-digit',
                          //       year: 'numeric',
                          //       hour: '2-digit',
                          //       minute: '2-digit',
                          //       hour12: true
                          //     })
                          //     : ''
                          // }
                          value={utcToMelbourne(data?.createdDateTime)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="driverName">
                        <Form.Label>Driver Name</Form.Label>
                        <Form.Control type="text" readOnly value={data?.driverId ? data?.driverId?.firstname + ' ' + data?.driverId?.lastname : ""} />
                      </Form.Group>
                    </Col>
                  </Row>
                </ul>
              </>
            </Tab>

            {/* Driver Attachments */}
            <Tab eventKey="driverAttachments" title="Driver Attachments">
              <>
                <div className="custom-list-main d-flex flex-row align-items-center justify-content-center">
                  <ViewDriverUploads
                    captures={data?.capturedPic}
                    Rname={data?.signature_name}
                    RSign={data?.deliveredVerificationImage}
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
                            data?.pickUpDetails?.readyTime
                              ? utcToMelbourne(data?.pickUpDetails?.readyTime)
                              : ''
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
                          value={data?.pickUpDetails?.pickupLocationId?.customName || ""}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="arrivalTime">
                        <Form.Label>Arrival Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={data?.pickUpDetails?.arrivalTime
                            ? utcToMelbourne(data?.pickUpDetails?.arrivalTime)
                            : ''}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group controlId="pickedUpTime">
                        <Form.Label>Picked Up Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={data?.pickUpDetails?.pickedUpTime
                            ? utcToMelbourne(data?.pickUpDetails?.pickedUpTime)
                            : ''}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    {/* <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Pickup Address:</b> <span>{pickupLocationName}</span>
                      </li>
                    </Col> */}
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
                          value={data?.dropOfDetails?.cutOffTime
                            ? utcToMelbourne(data?.dropOfDetails?.cutOffTime)
                            : ''}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="dropOffLocation">
                        <Form.Label>Drop Off Location</Form.Label>
                        <Form.Control
                          type="text"
                          value={data?.dropOfDetails?.dropOfLocationId?.customName}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="arrivalTimeDrop">
                        <Form.Label>Arrival Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={data?.dropOfDetails?.arrivalTime
                            ? utcToMelbourne(data?.dropOfDetails?.arrivalTime)
                            : ''}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="deliveredTime">
                        <Form.Label>Delivered Time</Form.Label>
                        <Form.Control
                          type="text"
                          value={data?.dropOfDetails?.deliveredTime
                            ? utcToMelbourne(data?.dropOfDetails?.deliveredTime)
                            : ''}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    {/* <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Delivery Address:</b> <span>{deliveryLocationName}</span>
                      </li>
                    </Col> */}
                  </Row>
                </ul>
              </>
            </Tab>
          </Tabs>
          <Row>
            <Col md={8} className="d-flex flex-wrap align-item-center justify-content-start ms-auto justify-content-lg-end gap-2 py-3">
              {localStorage.getItem('clientTrackPermission') == 'true' &&
                <Button className="custom-border-btn"
                  onClick={() => navigate(`/client/dashboard/location/${data._id}`)}
                >
                  {' '}
                  Track Driver{' '}
                </Button>
              }
              <Button className="text-white" variant="danger" onClick={handleConfirm}>
                {' '}
                Cancel Booking{' '}
              </Button>
            </Col>
          </Row>
          {/* <div style={{ fontSize: '11px' }}>
            <div style={{ fontSize: '11px' }}>
              <button
                onClick={() => changeActiveBtn('jobDetails')}
                className="custom-btn me-3 rounded-3"
                style={{
                  backgroundColor: activeBtn === 'jobDetails' ? '#5856d6' : 'transparent',
                  color: activeBtn === 'jobDetails' ? 'white' : 'black',
                }}
              >
                Job Details
              </button>
              <button
                onClick={() => changeActiveBtn('driverDetails')}
                className="custom-btn mx-3 rounded-3"
                style={{
                  backgroundColor: activeBtn === 'driverDetails' ? '#5856d6' : 'transparent',
                  color: activeBtn === 'driverDetails' ? 'white' : 'black',
                }}
              >
                Driver Details
              </button>
              <button
                onClick={() => changeActiveBtn('driverAttachments')}
                className="custom-btn mx-3 rounded-3"
                style={{
                  backgroundColor: activeBtn === 'driverAttachments' ? '#5856d6' : 'transparent',
                  color: activeBtn === 'driverAttachments' ? 'white' : 'black',
                }}
              >
                Driver Attachments
              </button>
              <button
                onClick={() => changeActiveBtn('pickupDetails')}
                className="custom-btn mx-3 rounded-3"
                style={{
                  backgroundColor: activeBtn === 'pickupDetails' ? '#5856d6' : 'transparent',
                  color: activeBtn === 'pickupDetails' ? 'white' : 'black',
                }}
              >
                Pickup Details
              </button>
              <button
                onClick={() => changeActiveBtn('dropOfDetails')}
                className="custom-btn mx-3 rounded-3"
                style={{
                  backgroundColor: activeBtn === 'dropOfDetails' ? '#5856d6' : 'transparent',
                  color: activeBtn === 'dropOfDetails' ? 'white' : 'black',
                }}
              >
                Drop of Details
              </button>
            </div>

            <Container className="mt-2 bg-white shadow p-3">
              {activeBtn === 'jobDetails' ? (
                <>
                  <h4 className="text-center mb-2 fw-bold" style={{ fontSize: '14px' }}>
                    Job Details
                  </h4>
                  <ul className="m-0 p-0 custom-list-main">
                    <Row style={{ fontSize: '11px' }}>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Job Id:</b> <span>{data?.uid}</span>
                        </li>
                      </Col>

                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Client Id:</b> <span>{data?.clientId?._id}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>AWB:</b> <span>{data.AWB}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Pieces:</b> <span>{data?.pieces}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Weight:</b> <span>{data?.weight}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Service Type:</b> <span>{data?.serviceTypeId?.text}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Service Code:</b> <span>{data?.serviceCodeId?.text}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Reference No:</b> <span>{data?.custRefNumber}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Note:</b> <span>{data?.note}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>VPAP Submitted:</b> <span>{data?.isVpap ? 'Yes' : 'No'}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Attachment:</b>{' '}
                          <span
                            className="text-primary text-decoration-underline"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAttachmentShow()}
                          >
                            View & Dashboard
                          </span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Driver Note: </b>{' '}
                          <span>
                            {data?.driverNote?.map((noteObj, index) => (
                              <div key={index} className="two-line-ellipsis">
                                <b>{index + 1}.</b>{' '}
                                {noteObj.text}{' '}
                                <Moment format="DD/MM/YYYY hh:mm A">
                                  {noteObj.createdAt}
                                </Moment>
                              </div>
                            ))}
                          </span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Created Booking Time:</b>{' '}
                          <span>
                            <Moment format="DD/MM/YYYY, hh:mm a">{data?.createdDateTime}</Moment>
                          </span>
                        </li>
                      </Col>
                    </Row>
                  </ul>
                </>
              ) : activeBtn === 'driverDetails' ? (
                <>
                  <h4 className="text-center mb-4">Driver Details</h4>
                  <ul className="m-0 p-0 custom-list-main">
                    <Row>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Full Name:</b>{' '}
                          <span>
                            {data?.driverId?.firstname} {data?.driverId?.lastname}
                          </span>
                        </li>
                      </Col>
                    </Row>
                  </ul>
                </>
              ) : activeBtn === 'pickupDetails' ? (
                <>
                  <h4 className="text-center mb-4">Pickup Details</h4>
                  <ul className="m-0 p-0 custom-list-main">
                    <Row>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Ready Time:</b>{' '}
                          <span>
                            {data?.pickUpDetails?.readyTime
                              ? getFormattedDAndT(data?.pickUpDetails?.readyTime)
                              : ''}
                          </span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Pick Up Location:</b>{' '}
                          <span>{data?.pickUpDetails?.pickupLocationId?.customName}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Arrival Time:</b>{' '}
                          <span>
                            {data?.pickUpDetails?.arrivalTime
                              ? getFormattedDAndT(data?.pickUpDetails?.arrivalTime)
                              : ''}
                          </span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Picked Up Time:</b>{' '}
                          <span>
                            {data?.pickUpDetails?.pickedUpTime
                              ? getFormattedDAndT(data?.pickUpDetails?.pickedUpTime)
                              : ''}
                          </span>
                        </li>
                      </Col>
                    </Row>
                  </ul>
                </>
              ) : activeBtn === 'driverAttachments' ? (
                <>
                  <h4 className="text-center mb-4">Driver Attachments</h4>
                  <ViewDriverUploads
                    captures={data?.capturedPic}
                    Rname={data?.signature_name}
                    RSign={data?.deliveredVerificationImage}
                  />
                </>
              ) : (
                <>
                  <h4 className="text-center mb-4">Drop of Details</h4>
                  <ul className="m-0 p-0 custom-list-main">
                    <Row>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Cut off Time:</b>{' '}
                          <span>
                            {data?.dropOfDetails?.cutOffTime
                              ? getFormattedDAndT(data?.dropOfDetails?.cutOffTime)
                              : ''}
                          </span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Drop Off Location:</b>{' '}
                          <span>{data?.dropOfDetails?.dropOfLocationId?.customName}</span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Arrival Time:</b>{' '}
                          <span>
                            {data?.dropOfDetails?.arrivalTime
                              ? getFormattedDAndT(data?.dropOfDetails?.arrivalTime)
                              : ''}
                          </span>
                        </li>
                      </Col>
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Delivered Time:</b>{' '}
                          <span>
                            {data?.dropOfDetails?.deliveredTime
                              ? getFormattedDAndT(data?.dropOfDetails?.deliveredTime)
                              : ''}
                          </span>
                        </li>
                      </Col>
                    </Row>
                  </ul>
                </>
              )}
            </Container>

            <Row className="mt-3">
              <Col className="d-flex align-item-center justify-content-end gap-2 py-3">
                <Button
                  style={{ background: '#9B59B6', borderColor: '#9B59B6' }}
                  onClick={() => navigate(`/client/dashboard/location/${data._id}`)}
                >
                  {' '}
                  Track Driver{' '}
                </Button>
                <Button onClick={handleConfirm} variant="danger" className="text-white">
                  {' '}
                  Cancel Booking{' '}
                </Button>
              </Col>
            </Row>

          
          </div> */}
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
                          date: utcToMelbourne(data?.pickUpDetails?.readyTime),
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
          {/* <Modal show={showAttachment} onHide={handleAttachmentClose}>
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
          </Modal> */}
        </>
      )}
    </>
  )
}

export default JobDetails
