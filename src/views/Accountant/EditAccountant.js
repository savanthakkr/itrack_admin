import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner, Modal, Image } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { get, updateImage, updateReq } from '../../lib/request';
import Swal from 'sweetalert2';
import { CButton } from '@coreui/react';

function EditAccountant() {
    let imgSrc = process.env.Image_Src

    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isReferesh, setIsRefresh] = useState(false);
    const [show, setShow] = useState(false);
    const [newImage, setNewImage] = useState(null)
    const [showImage, setShowImage] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [accountantData, setAccountantData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        imageKey: '',
    })

    const formRef = useRef();
    const [validated, setValidated] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');

    // handle change state
    const handleChange = (e) => {
        const { name, value } = e.target
        setAccountantData({ ...accountantData, [name]: value })
    }
    // handle password reset
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handlePasswordReset = () => {
        const payload = {
            old_password: accountantData.password,
            new_password: newPassword
        }
        updateReq(`/admin/accountant/password-change?ID=${id}`, payload, "admin").then((data) => {
            if (data.data.status) {
                setIsRefresh(!isReferesh);
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated Successfully!',
                });
                handleClose();
                setNewPassword('');
            }
        })
    }

    // image update
    const handleImageShow = () => setShowImage(true);
    const handleImageClose = () => setShowImage(false);

    const handleImageUpdate = () => {
        updateImage(`/admin/accountant/image-update?ID=${id}`, { image: newImage }, "admin").then((data) => {
            if (data.data.status) {
                setIsRefresh(!isReferesh);
                Swal.fire({
                    icon: 'success',
                    title: 'Image Updated Successfully!',
                });
                handleImageClose();
            }
        })
    }
    // handleUpdate 
    const handleUpdate = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        if (form.checkValidity()) {
            setLoading(true)
            updateReq(`/admin/accountant?ID=${id}`, accountantData, "admin").then((data) => {
                if (data.data.status) {
                    setIsRefresh(!isReferesh);
                    Swal.fire({
                        icon: 'success',
                        title: data.data.message,
                    });
                    setLoading(false)
                } else {
                    setIsRefresh(!isReferesh);
                    Swal.fire({
                        icon: 'error',
                        title: data.data.message,
                    });
                    setLoading(false)
                }
            })
        }
        setValidated(true);
    }

    // getting the driver data
    useEffect(() => {
        get(`/admin/accountant/view?ID=${id}`, "admin")
            .then((data) => {
                setAccountantData(data.data.data)
            })
            .catch((error) => {
                console.error("Error fetching driver:", error);
            });
    }, [isReferesh]);

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (!emailPattern.test(email)) {
            setErrorMessages('Please enter a valid email')
        } else {
            setErrorMessages('')
        }
        setAccountantData({ ...accountantData, email: email })
    }

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h4 className="mb-0">Edit Accountant Details</h4>
                </Col>
                <Col className="text-end">
                    {
                        loading ? <Spinner animation="border" variant='success' /> :
                            // <CButton className="custom-btn" onClick={() => handleUpdate()}>
                            <CButton className="custom-btn" onClick={() => formRef.current?.requestSubmit()}>
                                Update Details
                            </CButton>
                    }
                </Col>
            </Row>
            <Container className="px-3 py-3 mt-3 bg-white custom-form">
                <Form ref={formRef} noValidate validated={validated} onSubmit={handleUpdate}>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter First Name"
                                    name='firstname' onChange={(e) => handleChange(e)}
                                    value={accountantData?.firstname}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a first name.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Last Name"
                                    name='lastname' onChange={(e) => handleChange(e)}
                                    value={accountantData?.lastname}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a last name.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-3">
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter Email Address."
                                    name='email' onChange={(e) => validateEmail(e.target.value)}
                                    value={accountantData?.email}
                                    isInvalid={!!errorMessages}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errorMessages || 'Please provide a valid email.'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mt-3">
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="text" placeholder="Enter Phone"
                                    name='phone' onChange={(e) => handleChange(e)}
                                    value={accountantData?.phone}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a phone number.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-3">
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username"
                                    name='username' onChange={(e) => handleChange(e)}
                                    value={accountantData?.username}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a username.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mt-3">
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <div>
                                    <Button type="button" className="border-0 custom-btn" size="small"
                                        onClick={handleShow}
                                    >
                                        Reset Password
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>
                        {/* <Col md={3} className="mt-3">
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <div>
                <Button variant='primary' className="border-0" size="small"
                  onClick={handleImageShow}
                >
                  View Image
                </Button>
              </div>
            </Form.Group>
          </Col> */}
                        <Col md={6} className="mt-3">
                            <Form.Group>
                                <Form.Label>Company Logo</Form.Label>
                                <div>
                                    <Button className="border-0 custom-btn" size="small"
                                        onClick={handleImageShow}
                                    >
                                        View Logo
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                {/* <Row>
          <Col md={3} className="mt-3">
            {
              loading ? <Spinner animation="border" variant='success' /> :

                <Button className="border-0" style={{ backgroundColor: '#2ECC71' }} size="small"
                  onClick={() => handleUpdate()}
                >
                  Update Driver
                </Button>
            }
          </Col>
        </Row> */}
            </Container>
            {/* password reset modal */}
            <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* // show old password */}
                    <div className='m-3'>
                        <b>Old Password:</b> {accountantData?.password}
                    </div>
                    <Form.Group className='m-3'>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="text" placeholder="Enter New Password"
                            name='password' onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    {
                        newPassword ?
                            <Button variant="primary" onClick={handlePasswordReset}>
                                Reset Password
                            </Button>
                            : ""}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* image update modal */}

            <Modal show={showImage} onHide={handleImageClose} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Accountant Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='text-center'>
                        <Image src={`${imgSrc}${accountantData?.imageKey}`} rounded height={150} width={150} />
                    </div>
                    {/* change logo */}
                    <Form.Group className="mt-3">
                        <Form.Label>Change Image</Form.Label>
                        <Form.Control type="file"
                            name='logo'
                            onChange={(e) => setNewImage(e.target.files[0])}
                        />
                    </Form.Group>


                </Modal.Body>
                <Modal.Footer>
                    {
                        newImage ? (
                            <Button variant="primary" onClick={handleImageUpdate}>
                                Change Image
                            </Button>
                        ) : null
                    }
                    <Button variant="secondary" onClick={handleImageClose}>
                        Close
                    </Button>


                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditAccountant;