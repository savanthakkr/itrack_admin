import { Modal, Row, Col, } from 'react-bootstrap';
import { getFormattedDAndT, utcToMelbourne } from '../../lib/getFormatedDate';
export default function ViewJobs({ show, handleClose, job }) {
    return (
        <>
            <Modal show={show} onHide={handleClose} size='lg' dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>View Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="">
                        <Col md={2} className='fw-bold '>
                            <p>AWB</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.AWB} </p>
                        </Col>
                        <Col md={2} className='fw-bold'>
                            <p>Pieces</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.pieces}</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col md={2} className='fw-bold'>
                            <p>Weight</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.weight}</p>
                        </Col>
                        <Col md={2} className='fw-bold'>
                            <p>Service Type</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.serviceTypeId?.text}</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col md={2} className='fw-bold'>
                            <p>Customer Ref No</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.custRefNumber} </p>
                        </Col>
                        <Col md={2} className='fw-bold'>
                            <p>Service Code</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.serviceCodeId?.text}</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col md={2} className='fw-bold'>
                            <p>Ready Time </p>
                        </Col>
                        <Col md={4}>
                            <p>
                                {
                                    utcToMelbourne(job?.pickUpDetails?.readyTime)
                                }
                            </p>
                        </Col>
                        <Col md={2} className='fw-bold'>
                            <p>Cut-Off Time</p>
                        </Col>
                        <Col md={4}>
                            <p>
                                {utcToMelbourne(job?.dropOfDetails?.cutOffTime)}

                            </p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col md={2} className='fw-bold'>
                            <p>Pickup Location</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.pickUpDetails?.pickupLocationId?.customName} </p>
                        </Col>
                        <Col md={2} className='fw-bold'>
                            <p>Drop Location</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.dropOfDetails?.dropOfLocationId?.customName} </p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col md={2} className='fw-bold'>
                            <p>Note</p>
                        </Col>
                        <Col md={10}>
                            <p> {job?.note}</p>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col md={2} className='fw-bold'>
                            <p>Status</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.currentStatus} </p>
                        </Col>
                        <Col md={2} className='fw-bold'>
                            <p>Need VPAP</p>
                        </Col>
                        <Col md={4}>
                            <p>{job?.isVpap ? "Yes" : "No"} </p>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    {/* close */}
                    <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
