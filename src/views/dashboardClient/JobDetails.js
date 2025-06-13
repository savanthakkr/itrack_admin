import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Modal } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import sweetAlert from 'sweetalert2'
import { get } from '../../lib/request'

const JobDetails = () => {
  const { id } = useParams()

  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [showAttachment, setShowAttachment] = useState(false)

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
          sweetAlert.fire('Cancelled!', 'Your booking has been cancelled.', 'success')
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your booking is safe :)', 'error')
        }
      })
  }

  useEffect(() => {
    get(`/client/job?id=${id}`).then((res) => {
      if (res.data.status) {
        setData(res.data.data)
      }
    })
  }, [])

  return (
    <>
      <Container className="shadow px-3 py-3  rounded-4 bg-white" style={{ fontSize: '16px' }}>
        <Row className=" border-bottom-3 " style={{ borderBottom: '3px solid #BAB6B6' }}>
          <Col md={6} className="border-3 border-end ">
            <h3 className="mb-3 fw-bold">Job Detailss</h3>
            <div className="mb-2">
              {' '}
              <b> Job Id: </b> {data.uid}{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Client Id: </b> 123{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> AWB: </b> 123{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Pieces: </b> 5{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Weight: </b> 3 KG{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b>Service Type: </b> service type{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b>Service Code: </b> service code{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b>Reference No: </b> ref no{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b>Attachment: </b>{' '}
              <Button
                variant="success"
                className="rounded-0 text-white"
                onClick={handleAttachmentShow}
              >
                View & Dashboard
              </Button>{' '}
            </div>
            {/* <div className='mb-2'> <b>Pickup Location: </b> pickup location address </div> 
        <div className='mb-2'> <b>Drop Location: </b> drop location address </div> */}
            <div className="mb-2">
              {' '}
              <b>Created Booking Time: </b> 30-04-2024, 12:30 PM{' '}
            </div>
            {/* <div className='mb-2'> <b>Ready Time: </b> 12:30 PM </div>
                  <div className='mb-2'> <b>Cut-off Time: </b> 2 Hrs </div> */}
          </Col>
          <Col md={6} className="ps-3">
            <h3 className="mb-3 fw-bold ">Driver Details</h3>
            <div className="mb-2">
              {' '}
              <b> Driver Id: </b> 123{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Username: </b> client username{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b>Full Name: </b> client name{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Email: </b> client email{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Phone: </b> client phone{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Company name </b> client company name{' '}
            </div>
            <div className="mb-2">
              {' '}
              <b> Driver Assigning Permission : </b> <FaCheckCircle className="text-success" />{' '}
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="d-flex align-item-center justify-content-end gap-2 py-3">
            <Button
              style={{ background: '#9B59B6', borderColor: '#9B59B6' }}
              onClick={() => navigate('/client/dashboard/job/123/768')}
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
      </Container>
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

export default JobDetails
