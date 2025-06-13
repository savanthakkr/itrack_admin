import { useState } from 'react'
import { Button, Modal, Row, Col, Card } from 'react-bootstrap'

export default function ViewDriverUploads({ captures, Rname, RSign }) {
  const imgSrc = process.env.Image_Src

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleDownload = (url) => {
    window && window.open ? window.open(url) : window.location.assign(url)
  }
  return (
    <>
      <Button variant="primary" className="rounded-2 text-white fs-6 m-2 custom-btn" onClick={handleShow}>
        View Driver Uploads{' '}
      </Button>
      <Modal show={show} onHide={handleClose} size="lg" dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Driver Uploads</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Card className="p-2">
                <Row>
                  {captures && captures.length == 0 ? (
                    <Col md={12} className="text-center text-danger fw-bold">
                      <h6>No Capture Found</h6>
                    </Col>
                  ) : (
                    captures?.map((capture, index) => (
                      <Col md={4} key={index}>
                        <Card className="p-2 text-center">
                          <img
                            src={`${imgSrc}${capture}`}
                            alt="Capture"
                            className=" mx-auto d-block rounded-2"
                            width={120}
                            height={100}
                          />
                          <Button
                            variant="primary"
                            className="rounded-2 text-white fs-6 m-2"
                            onClick={() => handleDownload(`${imgSrc}${capture}`)}
                          >
                            Download
                          </Button>
                        </Card>
                      </Col>
                    ))
                  )}
                  {Rname && RSign && (
                    <>
                      <hr />
                      <Row>
                        <h4 className="mt-1">Recipient Details </h4>
                        <p>
                          Recipient Name: <span className="fw-bold">{Rname}</span>
                        </p>
                        <Col md={6} className="d-flex">
                          <p>Recipient Signature: </p>
                          <img
                            src={`${imgSrc}${RSign}`}
                            alt="sign"
                            className="img-fluid mx-auto d-block"
                            width={100}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
