import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row, Modal, Image, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { get, updateReq, updateImage } from '../../lib/request'
import Swal from "sweetalert2"
import { CButton } from '@coreui/react'
import Select, { components } from 'react-select';

function EditClient() {
    let imgSrc = process.env.Image_Src
    const [clientData, setClientData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        companyName: '',
        username: '',
        logoKey: '',
        password: '',
        isDriverPermission: false,
        isTrackPermission: false,
    })
    const [isReferesh, setIsRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [imageinput, setImageInput] = useState(null)
    const [newPassword, setNewPassword] = useState('');
    const formRef = useRef();
    const [validated, setValidated] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');
    const [clientRateOptions, setClientRateOptions] = useState([]);
    const [selectedClientRate, setSelectedClientRate] = useState([]);

    const { id } = useParams();

    // handle change state
    const handleChange = (e) => {
        const { name, value } = e.target
        setClientData({ ...clientData, [name]: value })
    }

    const getClientRateData = async () => {
        get('/admin/client/rate', 'admin')
            .then((response) => {

                const newOptions = response?.data?.data?.map((item) => ({
                    label: item?.serviceCodeId?.text + " - " + item?.rate + " - " + item?.item,
                    value: item._id,
                }));

                setClientRateOptions(newOptions);
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        getClientRateData();
    }, [])

    //handle update function
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        clientData.rateDetails = selectedClientRate;
        if (form.checkValidity()) {
            updateReq(`/admin/client?ID=${id}`, clientData, "admin")
                .then((data) => {
                    setIsRefresh(!isReferesh);
                    Swal.fire({
                        icon: 'success',
                        title: 'Client Updated Successfully!',
                    });
                })
                .catch((error) => {
                    console.error("Error updating client:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update client.',
                    });
                });
        }
        setValidated(true);
    };

    // show modal
    const handleShowModal = () => {
        setShowModal(true)
    }
    // hide modal
    const handleCloseModal = () => {
        setShowModal(false)
    }

    // handle password modal
    const handleShowPasswordModal = () => {
        setShowPasswordModal(true)
    }
    // hide password modal
    const handleClosePasswordModal = () => {
        setShowPasswordModal(false)
    }

    // handle logo change 
    const handleLogoChange = () => {
        setImageLoading(true)
        updateImage(`/admin/client/logo?ID=${id}`, { logo: imageinput }, "admin").then((data) => {
            if (data.data.status) {
                setIsRefresh(!isReferesh);
                setImageLoading(false)
                Swal.fire({
                    icon: 'success',
                    title: 'Logo Updated Successfully!',
                }).then(() => {
                    setShowModal(false)
                    setImageInput(null)
                });
            }
        })
    }

    // handle password change
    const handlePasswordChange = () => {
        const payload = {
            old_password: clientData.password,
            new_password: newPassword

        }
        updateReq(`/admin/client/password?ID=${id}`, payload, "admin").then((data) => {
            if (data.data.status) {
                setIsRefresh(!isReferesh);
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated Successfully!',
                });
                setNewPassword('')
                setShowPasswordModal(false)
            }
        })
    }

    // handle permission to assign driver
    const handleChangePermission = (e, scope) => {
        const payload = {
            permission_type: scope,
            bool_value: e.target.checked

        }
        updateReq(`/admin/client/permission?ID=${id}`, payload, "admin").then((data) => {
            if (data.data.status) {
                setIsRefresh(!isReferesh);
                Swal.fire({
                    icon: 'success',
                    title: 'Permission Updated Successfully!',
                });
            }
        })
    }

    // get client data

    useEffect(() => {
        setLoading(true)

        get(`/admin/client?ID=${id}`, "admin").then((data) => {

            setClientData({
                firstname: data.data.data.firstname,
                lastname: data.data.data.lastname,
                email: data.data.data.email,
                phone: data.data.data.phone,
                companyName: data.data.data.companyName,
                username: data.data.data.username,
                logoKey: data.data.data.logoKey,
                password: data.data.data.password,
                isDriverPermission: data.data.data.isDriverPermission,
                isTrackPermission: data.data.data.isTrackPermission,
                rateDetails: data.data.data.rateDetails
            })

            setLoading(false)
        }).catch((e) => {
            console.log("error while getting", e.message);
        })
    }, [isReferesh]);

    useEffect(() => {
        const selectedRates = [];
        if (clientData?.rateDetails?.length > 0) {
            clientData?.rateDetails?.map((option) => {
                const match = clientRateOptions.find((item) => item.value === option.rateId);

                selectedRates.push(match);
            });
            setSelectedClientRate(selectedRates);
        }
    }, [clientData, clientRateOptions]);

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (!emailPattern.test(email)) {
            setErrorMessages('Please enter a valid email')
        } else {
            setErrorMessages('')
        }
        setClientData({ ...clientData, email: email })
    }

    const handleColumnSelect = (option) => {
        setSelectedClientRate(option)
    }

    const customOption = (props) => {
        const { isSelected, label } = props;
        return (
            <components.Option {...props}>
                <div className="d-flex justify-content-between align-items-center">
                    <span>{label}</span>
                    {isSelected && <FaCheck className="text-primary" />}
                </div>
            </components.Option>
        );
    };

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h4 className="mb-0">Edit Client Details</h4>
                </Col>
                <Col className="text-end">
                    {/* <CButton className="custom-btn" onClick={() => handleupdate(clientData?._id)}> */}
                    <CButton className="custom-btn" onClick={() => formRef.current?.requestSubmit()}>
                        Update Details
                    </CButton>
                </Col>
            </Row>
            {
                loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) :
                    <Container className="shadow px-3 py-3 mt-3 bg-white custom-form">
                        <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter First Name"
                                            name='firstname'
                                            onChange={(e) => handleChange(e)}
                                            value={clientData?.firstname}
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
                                        <Form.Control type="text"
                                            name='lastname' onChange={(e) => handleChange(e)} value={clientData?.lastname}
                                            placeholder="Enter Last Name" required />
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
                                            name='email' onChange={(e) => validateEmail(e.target.value)} value={clientData?.email}
                                            required
                                            isInvalid={!!errorMessages}
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
                                            name='phone' onChange={(e) => handleChange(e)} value={clientData?.phone}
                                            required
                                            onWheel={(e) => e.target.blur()}
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
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Company Name"
                                            name='companyName' onChange={(e) => handleChange(e)} value={clientData?.companyName}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a company name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mt-3">
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Enter username"
                                            name='username' onChange={(e) => handleChange(e)} value={clientData?.username}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a username.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-3">
                                    <Select
                                        className="ms-lg-auto custom-select"
                                        classNamePrefix="custom-select"
                                        isMulti
                                        options={clientRateOptions}
                                        value={selectedClientRate}
                                        onChange={handleColumnSelect}
                                        placeholder="Select Rates"
                                        isSearchable
                                        closeMenuOnSelect={false}
                                        components={{ Option: customOption }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="mt-3">
                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <div>
                                            <Button className="border-0 custom-btn"
                                                onClick={handleShowPasswordModal}
                                            >
                                                Reset Password
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="mt-3">
                                    <Form.Group >
                                        <Form.Label>Company Logo</Form.Label>
                                        <div>
                                            <Button className="border-0 custom-btn"
                                                onClick={handleShowModal}
                                            >
                                                View Logo
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3} className="mt-3">
                                    <Form.Group controlId="clientAssignDriverCheckbox">
                                        <Form.Check
                                            type="checkbox"
                                            label="Client able to assign the drivers"
                                            checked={clientData?.isDriverPermission ? true : false}
                                            onChange={(e) => handleChangePermission(e, "isDriverPermission")}

                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} >
                                    <Form.Group controlId="clientAssignDriverCheckbox" className='mt-3' >
                                        <Form.Check type="checkbox" label="Enable Tracker Feature for client"
                                            name='isDriverPermission'
                                            className='text-danger fw-bold'
                                            checked={clientData?.isTrackPermission ? true : false}
                                            onChange={(e) => handleChangePermission(e, "isTrackPermission")}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* <br />
              <Col md={3} className="mt-3">
                <Button className="border-0" style={{ backgroundColor: '#2ECC71' }}
                  onClick={() => handleupdate(clientData?._id)}
                  size="small">
                  Update Client
                </Button>
              </Col> */}
                            </Row>
                        </Form>
                    </Container>

            }
            <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Company Logo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        clientData.logoKey ? (
                            <div className='text-center'>
                                <Image src={`${imgSrc}${clientData.logoKey}`} rounded height={150} width={150} />
                            </div>

                        ) : <div className='text-center text-danger fw-bold'>No Logo Found</div>
                    }
                    {/* change logo */}
                    {
                        imageLoading ? (
                            <Spinner animation="border" className='mx-auto d-block m-2' />
                        ) : null

                    }
                    <Form.Group className="mt-3">
                        <Form.Label>Change Logo</Form.Label>
                        <Form.Control type="file"
                            name='logo'
                            onChange={(e) => setImageInput(e.target.files[0])}
                        />
                    </Form.Group>


                </Modal.Body>
                <Modal.Footer>
                    {
                        imageinput ? (
                            <Button variant="primary" onClick={handleLogoChange}>
                                Change Image
                            </Button>
                        ) : null
                    }

                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>


                </Modal.Footer>
            </Modal>
            {/* Modal for password */}

            <Modal show={showPasswordModal} onHide={handleClosePasswordModal} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* // show old password */}
                    <div className='m-3'>
                        <b>Old Password:</b> {clientData?.password}
                    </div>

                    <Form.Group className='m-3'>
                        <Form.Label> New Password</Form.Label>
                        <Form.Control type="text" placeholder="Enter New Password"
                            name='password' onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                        />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    {
                        newPassword ? (
                            <Button variant="primary" onClick={handlePasswordChange}>
                                Change Password
                            </Button>
                        ) : null

                    }

                    <Button variant="secondary" onClick={handleClosePasswordModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default EditClient
