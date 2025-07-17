import React, { useState, useRef, useEffect, use } from 'react'
import { Button, Col, Container, Form, Row, Spinner, Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import makeAnimated from 'react-select/animated';
import { post, get, postWihoutMediaData, deleteReq, deleteReqWithoutMedia, updateReq } from '../../lib/request.js'
import sweetAlert2 from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { Tab, Tabs, Table } from 'react-bootstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';
import Select, { components } from 'react-select';
import { set } from 'lodash';

function AddClients() {
  const navigate = useNavigate()
  const formRef = useRef();
  const [errorMessages, setErrorMessages] = useState('')
  const [validated, setValidated] = useState(false)
  const [clientData, setClientData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    companyName: '',
    isDriverPermission: false,
    isTrackPermission: false,
    logo: null,
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("addClient");
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [serviceCode, setServiceCode] = useState([])

  const [editRate, setEditRate] = useState('');
  const [editSelectedUnit, setEditSelectedUnit] = useState(null);
  const [editDropDownData, setEditDropDownData] = useState({
    serviceCode: {},
  });

  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [errors, setErrors] = useState({});

  const handleShowModal = () => {
    setShowModal(true);
    setErrors({});
  }

  const handleCloseModal = () => setShowModal(false)
  const handleCloseModal2 = () => setShowModal2(false)

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [rate, setRate] = useState('');
  const [rates, setRates] = useState([]);

  const [fuelLevy, setFuelLevy] = useState(20);
  const [addFuelLevyModal, setAddFuelLevyModal] = useState(false);
  const [editFuelLevyModal, setEditFuelLevyModal] = useState(false);
  const [fuelLevyData, setFuelLevyData] = useState({});

  const [pickupCharge, setPickupCharge] = useState(1.5);
  const [addPickupChargeModal, setAddPickupChargeModal] = useState(false);
  const [editPickupChargeModal, setEditPickupChargeModal] = useState(false);
  const [pickupChargeData, setPickupChargeData] = useState({});

  const [deliveryCharge, setDeliveryCharge] = useState(1.5);
  const [addDeliveryChargeModal, setAddDeliveryChargeModal] = useState(false);
  const [editDeliveryChargeModal, setEditDeliveryChargeModal] = useState(false);
  const [deliveryChargeData, setDeliveryChargeData] = useState({});

  const [specialCodeRates, setSpecialCodeRates] = useState([]);
  const [editSpecialCodeRateModal, setEditSpecialCodeRateModal] = useState(false);
  const [specialCodeRateData, setSpecialCodeRateData] = useState({});


  // const [clientRateOptions, setClientRateOptions] = useState([]);
  // const [selectedClientRate, setSelectedClientRate] = useState([]);

  const [isClientCreated, setIsClientCreated] = useState(false);

  const [specialCode, setSpecialCode] = useState(false);

  const unitOptions = [
    { value: 'per_hour', label: 'Per Hour' },
    { value: 'per_unit', label: 'Per Unit' }
  ];

  const [clientRateData, setClientRateData] = useState({
    rate: '',
    item: '',
    serviceCodeId: '',
    minimumHours: ''
  });

  console.log('clientRateData', clientRateData);

  const [clientName, setClientName] = useState('');

  useEffect(() => {
    setClientRateData({
      rate: '',
      item: '',
      serviceCodeId: '',
      minimumHours: ''
    });
    setErrors({});
  }, [showModal]);

  useEffect(() => {
    setFuelLevyData({
      fuelLevy: ''
    });
    setErrors({});
  }, [addFuelLevyModal]);

  const handleShowModal2 = (item) => {

    setSelectedClientId(item._id);

    setErrors({});

    if (item?.serviceCodeId?.text?.toLowerCase()?.trim() === 'loose') {
      setSpecialCode(true);
    } else {
      setSpecialCode(false);
    }

    setClientRateData({ rate: item?.rate?.replace(/[^0-9.]/g, ''), serviceCodeId: item?.serviceCodeId?._id || "", item: item?.item || "", minimumHours: item?.minimumHours || "" });

    setShowModal2(true);
  };

  const handleFuelLevyEdit = (item) => {

    setSelectedClientId(item._id);

    setFuelLevyData({ fuelLevy: item });

    setEditFuelLevyModal(true);
  };

  const handlePickupChargeEdit = (item) => {

    setSelectedClientId(item._id);

    setPickupChargeData({ pickupCharge: item });

    setEditPickupChargeModal(true);
  };

  const handleSpecialCodeRateEdit = (item) => {

    setSelectedClientId(item._id);

    setSpecialCodeRateData({ rate: item?.rate, weight: item?.weight, specialCodeRateId: item?._id });

    setEditSpecialCodeRateModal(true);
  };


  const handleDeliveryChargeEdit = (item) => {

    setSelectedClientId(item._id);

    setDeliveryChargeData({ deliveryCharge: item });

    setEditDeliveryChargeModal(true);
  };

  // Deleting the client rate
  const handleDelete = (Id) => {
    sweetAlert2
      .fire({
        title: 'Are you sure you want to delete this client rate?',
        text: 'Once deleted you can’t revert this action',
        imageUrl: 'src/assets/images/delete_modal_icon.png',
        imageWidth: 60,
        imageHeight: 60,
        imageAlt: 'Delete Icon',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it!',
        cancelButtonText: 'No, Keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteReqWithoutMedia(`/admin/clientRate/delete?id=${localStorage.getItem('clientIdForRate')}&rateDetailId=${Id}`, "admin").then((data) => {
            if (data.status) {
              sweetAlert2.fire({ icon: 'success', title: data.data.message })
            } else {
              sweetAlert2.fire({ icon: 'error', title: data.data.message })
            }
            getClientRateData();
          }).catch((e) => {
            console.log("Error while deleting:", e.message)
          })
        } else if (result.dismiss === sweetAlert2.DismissReason.cancel) {
          sweetAlert2.fire('Cancelled', 'Your client rate is safe :)', 'error')
        }
      })

  }

  // Deleting the fuel levy
  // const handleFuelLevyDelete = () => {
  //   sweetAlert2
  //     .fire({
  //       title: 'Are you sure you want to delete this fuel levy?',
  //       text: 'Once deleted you can’t revert this action',
  //       imageUrl: 'src/assets/images/delete_modal_icon.png',
  //       imageWidth: 60,
  //       imageHeight: 60,
  //       imageAlt: 'Delete Icon',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, Delete it!',
  //       cancelButtonText: 'No, Keep it',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         deleteReqWithoutMedia(`/admin/client/fuelLevy/delete?id=${localStorage.getItem('clientIdForRate')}`, "admin").then((data) => {
  //           if (data?.status) {
  //             sweetAlert2.fire({ icon: 'success', title: data?.data?.message })
  //           } else {
  //             sweetAlert2.fire({ icon: 'error', title: data?.data?.message })
  //           }
  //           // getFuelLevyData();
  //           getClientRateData();
  //         }).catch((e) => {
  //           console.log("Error while deleting:", e?.message)
  //         })
  //       } else if (result.dismiss === sweetAlert2.DismissReason.cancel) {
  //         sweetAlert2.fire('Cancelled', 'Your fuel levy is safe :)', 'error')
  //       }
  //     })

  // }

  const handleTabSelect = (key) => {
    if (key === "clientRates" && !isClientCreated) return; // block if not allowed
    setActiveTab(key);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setClientData({ ...clientData, [name]: value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0].type.split('/')[0] !== 'image') {
      sweetalert2.fire({
        icon: 'error',
        title: 'Please upload image only',
      })
      e.target.value = ''
      return
    }
    setClientData({ ...clientData, [name]: files[0] })
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      setLoading(true)
      // clientData.rateDetails = selectedClientRate;

      post('/admin/client', clientData, "admin")
        .then((res) => {
          if (res.data.status) {
            setLoading(false)
            sweetAlert2.fire({
              icon: 'success',
              title: 'Client added successfully',
            }).then(() => {
              const clientId = res.data.data._id;

              // Store in localStorage
              localStorage.setItem("clientIdForRate", clientId);

              // Move to rates tab and enable it
              setIsClientCreated(true);
              setActiveTab("clientRates");
              // navigate('/client/all')
            })
          } else if (res.status === 400) {
            setLoading(false)
            sweetAlert2.fire({
              icon: 'error',
              title: res.data.message,
            })
          } else {
            sweetAlert2.fire({
              icon: 'error',
              title: 'An error occured',
            })
            setLoading(false)
          }
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
          console.log("An error occured")
        })
    }
    setValidated(true)
  }

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailPattern.test(email)) {
      setErrorMessages('Please enter a valid email')
    } else {
      setErrorMessages('')
    }
    setClientData({ ...clientData, email: email })
  }

  const [dropDownData, setDropDownData] = useState({
    serviceCode: {
      text: '',
      _id: '',
    },
  });

  const getClientRateData = async () => {
    const clientId = localStorage.getItem('clientIdForRate');
    get(`/admin/clientRate/list?id=${clientId}`, 'admin')
      .then((response) => {
        setClientName(response?.data?.data?.firstname + ' ' + response?.data?.data?.lastname);
        setRates(response?.data?.data?.rateDetails);
        setFuelLevy(response?.data?.data?.fuelLevy);
        setPickupCharge(response?.data?.data?.pickupCharge);
        setDeliveryCharge(response?.data?.data?.deliveryCharge);
        setSpecialCodeRates(response?.data?.data?.specialCodeRateDetails);
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // const getFuelLevyData = async () => {
  //   const clientId = localStorage.getItem('clientIdForRate');
  //   get(`/admin/client/fuelLevy/list?id=${clientId}`, 'admin')
  //     .then((response) => {
  //       setFuelLevy(response?.data?.data);
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //     })
  // }

  useEffect(() => {
    if (activeTab === 'clientRates') {
      getClientRateData();
      // getFuelLevyData();

      get('/admin/service/code', 'admin')
        .then((response) => {
          setServiceCode(response.data.data)
        })
        .catch((error) => {
          console.error(error)
        });
    } else {
      setClientData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        companyName: '',
        isDriverPermission: false,
        isTrackPermission: false,
        logo: null,
      })
      const shouldGoToRateTab = localStorage.getItem("goToClientRateTab") === "true";
      if (!shouldGoToRateTab) {
        localStorage.removeItem('clientIdForRate');
        setIsClientCreated(false);
      }
    }
  }, [activeTab]);

  const validateClientRateForm = () => {
    const errors = {}
    if (clientRateData.serviceCodeId === '') {
      errors.serviceCodeId = 'Service code is required.'
    }
    if (!specialCode && clientRateData.item === '') {
      errors.item = 'Item is required.'
    }
    if (!specialCode && clientRateData.rate === '') {
      errors.rate = 'Rate is required.'
    }
    if (clientRateData?.item === 'Per Hour' && clientRateData?.minimumHours === '') {
      errors.minimumHours = 'Minimum hour is required.'
    }
    return errors;
  }

  const validateFuelLevyForm = () => {
    const errors = {}
    if (fuelLevyData.fuelLevy === '') {
      errors.fuelLevy = 'Fuel levy is required.'
    }
    return errors;
  }

  const validatePickupChargeForm = () => {
    const errors = {}
    if (pickupChargeData.pickupCharge === '') {
      errors.pickupCharge = 'Pickup charge is required.'
    }
    return errors;
  }

  const validateDeliveryChargeForm = () => {
    const errors = {}
    if (deliveryChargeData.deliveryCharge === '') {
      errors.deliveryCharge = 'Delivery charge is required.'
    }
    return errors;
  }

  const validateSpecialCodeRateForm = () => {
    const errors = {}
    if (specialCodeRateData.rate === '') {
      errors.rate = 'Rate is required.'
    }
    return errors;
  }

  const handleClientRateSubmit = async (e) => {
    e.preventDefault();
    const errors = validateClientRateForm();
    const clientId = localStorage.getItem('clientIdForRate');
    if (Object.keys(errors).length === 0) {
      // Submit form
      // create job
      if (showModal2) {
        const payload = {
          ...clientRateData,
          rateDetailId: selectedClientId
        }
        updateReq(`/admin/clientRate/update?id=${clientId}`, payload, 'admin')
          .then((response) => {
            // setLoading5(false)
            if (response.data.status) {
              // get client rate
              getClientRateData();
              setShowModal2(false);
              setClientRateData({
                rate: '',
                item: '',
                serviceCodeId: '',
                minimumHours: ''
              });
              setErrors({});
              Swal.fire({
                icon: 'success',
                title: response.data.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data.message || 'Failed to add client rate',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message || 'Failed to add client rate',
            });
          })
      } else if (showModal) {

        updateReq(`/admin/clientRate/add?id=${clientId}`, clientRateData, 'admin')
          .then((response) => {
            // setLoading5(false)
            if (response.data.status) {
              // get client rate
              getClientRateData();
              setShowModal(false);
              Swal.fire({
                icon: 'success',
                title: response.data.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data.message || 'Failed to add client rate',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message || 'Failed to add client rate',
            });
          })
      }
    } else {
      setErrors(errors);
      return;
    }
  }

  const handleFuelLevySubmit = async (e) => {
    e.preventDefault();
    const errors = validateFuelLevyForm();
    const clientId = localStorage.getItem('clientIdForRate');
    if (Object.keys(errors).length === 0) {
      if (editFuelLevyModal) {
        updateReq(`/admin/client/fuelLevy/update?id=${clientId}`, fuelLevyData, 'admin')
          .then((response) => {
            // setLoading5(false)
            if (response.data.status) {
              // get client rate
              // getFuelLevyData();
              getClientRateData();
              setEditFuelLevyModal(false);
              setFuelLevyData({
                fuelLevy: ''
              });
              setErrors({});
              Swal.fire({
                icon: 'success',
                title: response.data.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data.message || 'Failed to add client rate',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message || 'Failed to add client rate',
            });
          })
      } else if (addFuelLevyModal) {
        updateReq(`/admin/client/fuelLevy/add?id=${clientId}`, fuelLevyData, 'admin')
          .then((response) => {
            if (response.data.status) {
              // getFuelLevyData();
              getClientRateData();
              setAddFuelLevyModal(false);
              Swal.fire({
                icon: 'success',
                title: response.data.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data.message || 'Failed to add client rate',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.message || 'Failed to add client rate',
            });
          })
      }
    } else {
      setErrors(errors);
      return;
    }
  }

  const handlePickupChargeSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePickupChargeForm();
    const clientId = localStorage.getItem('clientIdForRate');
    if (Object.keys(errors).length === 0) {
      if (editPickupChargeModal) {
        updateReq(`/admin/client/pickup-charge/update?id=${clientId}`, pickupChargeData, 'admin')
          .then((response) => {
            if (response?.data?.status) {
              getClientRateData();
              setEditPickupChargeModal(false);
              setPickupChargeData({
                pickupCharge: ''
              });
              setErrors({});
              Swal.fire({
                icon: 'success',
                title: response?.data?.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response?.data?.message || 'Failed to edit pickup charge',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.data?.message || 'Failed to edit pickup charge',
            });
          })
      }
    } else {
      setErrors(errors);
      return;
    }
  }

  const handleDeliveryChargeSubmit = async (e) => {
    e.preventDefault();
    const errors = validateDeliveryChargeForm();
    const clientId = localStorage.getItem('clientIdForRate');
    if (Object.keys(errors).length === 0) {
      if (editDeliveryChargeModal) {
        updateReq(`/admin/client/delivery-charge/update?id=${clientId}`, deliveryChargeData, 'admin')
          .then((response) => {
            if (response?.data?.status) {
              getClientRateData();
              setEditDeliveryChargeModal(false);
              setDeliveryChargeData({
                deliveryCharge: ''
              });
              setErrors({});
              Swal.fire({
                icon: 'success',
                title: response?.data?.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response?.data?.message || 'Failed to edit delivery charge',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.data?.message || 'Failed to edit delivery charge',
            });
          })
      }
    } else {
      setErrors(errors);
      return;
    }
  }

  const handleSpecialCodeRateSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSpecialCodeRateForm();
    const clientId = localStorage.getItem('clientIdForRate');
    if (Object.keys(errors).length === 0) {
      if (editSpecialCodeRateModal) {
        updateReq(`/admin/client/special-code-rate/update?id=${clientId}`, specialCodeRateData, 'admin')
          .then((response) => {
            if (response?.data?.status) {
              getClientRateData();
              setEditSpecialCodeRateModal(false);
              setSpecialCodeRateData({});
              setErrors({});
              Swal.fire({
                icon: 'success',
                title: response?.data?.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response?.data?.message || 'Failed to edit delivery charge',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.data?.message || 'Failed to edit delivery charge',
            });
          })
      }
    } else {
      setErrors(errors);
      return;
    }
  }

  const handleClientRateChange = (e) => {
    const { name, value } = e.target
    setClientRateData({ ...clientRateData, [name]: value })
  }

  const handleServiceCodeRateChange = (selectedOption) => {

    if (selectedOption?.label?.toLowerCase()?.trim() === 'loose') {
      setSpecialCode(true);
      setClientRateData({
        ...clientRateData,
        serviceCodeId: selectedOption.value,
        rate: '',
        item: ''
      });
    } else {
      setSpecialCode(false);
      setClientRateData({
        ...clientRateData,
        serviceCodeId: selectedOption.value
      });
    }

    if (errors.serviceCodeId) {
      setErrors(prev => ({ ...prev, serviceCodeId: "" }));
    }
  };

  const handleItemRateChange = (selectedOption) => {
    setClientRateData({
      ...clientRateData,
      item: selectedOption.label,
      minimumHours: ''
    });
    if (errors.item) {
      setErrors(prev => ({ ...prev, item: "" }));
    }
  };

  const [serviceOptionForRate, setServiceOptionForRate] = useState();
  useEffect(() => {
    const service = [];
    serviceCode?.map((item) => {
      service.push({ value: item._id, label: item.text });
    });
    setServiceOptionForRate(service);
  }, [serviceCode]);

  // const handleColumnSelect = (option) => {
  //   setSelectedClientRate(option)
  // }

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

  useEffect(() => {
    const clientId = localStorage.getItem("selectedClientId");
    const shouldGoToRateTab = localStorage.getItem("goToClientRateTab") === "true";

    if (clientId) {
      // setClientId(clientId); // if needed in your logic

      setIsClientCreated(true); // unlock rate tab
    }

    if (shouldGoToRateTab) {
      setActiveTab("clientRates");
      localStorage.removeItem("goToClientRateTab"); // clear after use
    }
  }, []);

  console.log('errors?.minimumHours', errors?.minimumHours);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">{activeTab === 'addClient' ? 'Add Client' : `Client Rates for ${clientName} `}</h4>
        </Col>
        <Col className={activeTab === 'addClient' ? 'text-end' : 'text-end'}>
          {activeTab === 'addClient' ? (
            <CButton className="custom-btn" onClick={() => formRef.current?.requestSubmit()}>
              Add Client
            </CButton>
          ) : (
            <CButton className="custom-btn" onClick={handleShowModal}>
              Add Client Rates
            </CButton>
          )}
        </Col>
      </Row>
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} defaultActiveKey="addClient" id="client-tabs" className="mb-3 custom-tabs">
        {/* Add Client Tab */}
        <Tab eventKey="addClient" title="Add Client">
          <Container className="shadow px-3 py-3 bg-white">
            <Form ref={formRef} noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstname"
                      placeholder="Enter First Name"
                      onChange={handleChange}
                      value={clientData.firstname}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a first name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      placeholder="Enter Last Name"
                      onChange={handleChange}
                      value={clientData.lastname}
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
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      onChange={(e) => validateEmail(e.target.value)}
                      value={clientData.email}
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
                    <Form.Control
                      type="number"
                      name="phone"
                      placeholder="Enter Phone"
                      onChange={handleChange}
                      value={clientData.phone}
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
                    <Form.Control
                      type="text"
                      placeholder="Enter Company Name"
                      name="companyName"
                      onChange={handleChange}
                      value={clientData.companyName}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a company name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="mt-3">
                  <Form.Group>
                    <Form.Label>Company Logo</Form.Label>
                    <Form.Control
                      type="file"
                      name="logo"
                      onChange={handleFileChange}
                    />
                    <small className="text-secondary">Please ensure that the file size does not exceed 5MB and that it is in either PNG or JPG format.</small>
                    <Form.Control.Feedback type="invalid">
                      Please upload a valid image.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* <Row>
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
              </Row> */}

              <Row>
                <Col md={3} className="mt-3">
                  <Form.Group controlId="clientAssignDriverCheckbox">
                    <Form.Check
                      type="checkbox"
                      label="Client able to assign the drivers"
                      name="isDriverPermission"
                      checked={clientData.isDriverPermission}
                      onChange={(e) =>
                        setClientData({ ...clientData, isDriverPermission: e.target.checked })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="mt-3">
                  <Form.Group controlId="clientAssignDriverCheckbox2">
                    <Form.Check
                      type="checkbox"
                      label="Enable Tracker Feature for client"
                      name="isTrackPermission"
                      checked={clientData.isTrackPermission}
                      onChange={(e) =>
                        setClientData({ ...clientData, isTrackPermission: e.target.checked })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* <Row>
                <Col md={3} className="mt-3">
                  {loading ? (
                    <Spinner animation="border" />
                  ) : (
                    <Button type="submit">Submit</Button>
                  )}
                </Col>
              </Row> */}
            </Form>
          </Container>
        </Tab>

        {/* Client Rates Tab */}
        <Tab eventKey="clientRates" title="Client Rates" className="client-rates-table" disabled={!isClientCreated}>
          <Table hover responsive className="custom-table">
            <thead className="table-light">
              <tr>
                <th className="text-start">Service Code</th>
                <th className="text-start">Rate</th>
                <th className="text-start">Item</th>
                <th className="text-start">Minimum Hour</th>
                <th style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates?.length > 0 ? rates?.map((item) => (
                <tr key={item._id}>
                  <td className="text-start">{item?.serviceCodeId?.text}</td>
                  <td className="text-start">{item?.rate || "-"}</td>
                  <td className="text-start">{item?.item || "-"}</td>
                  <td className="text-start">{item?.minimumHours || "-"}</td>
                  <td className="text-center action-dropdown-menu">
                    <div className="dropdown">
                      <button
                        className="btn btn-link p-0 border-0"
                        type="button"
                        id={`dropdownMenuButton-${item?._id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby={`dropdownMenuButton-${item?._id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleShowModal2(item)}
                          >
                            Edit Client Rates
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete Client Rate
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              )) :
                <tr>
                  <td colSpan={4} className="text-center text-danger">No Records Found.</td>
                </tr>
              }
            </tbody>
          </Table>

          {/* <div className='border' style={{ minHeight: '50px', paddingLeft: '10px' }}>
            <Row className="align-items-center" style={{ minHeight: '50px' }}>
              <Col md={6} className="d-flex align-items-center" style={{ height: '50px' }}>
                <label className="mb-0"><b>Client Fuel Levy</b></label>
              </Col>
              <Col md={6} className="d-flex align-items-center" style={{ height: '50px' }}>
                <label className="mb-0">20%</label>
              </Col>
            </Row>
          </div> */}

          {/* {!fuelLevy &&
            <Row className="align-items-center">
              <Col className='text-end'>
                <CButton className="custom-btn" onClick={() => setAddFuelLevyModal(true)}>
                  Add Fuel Levy
                </CButton>
              </Col>
            </Row>
          } */}

          {/* Fuel levy table */}
          <div className='table-responsive mt-3'>
            <Table hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th className="text-start">Fuel Levy</th>
                  <th className="text-start">{fuelLevy ? fuelLevy : '-'}</th>
                  {/* {fuelLevy && */}
                  <th style={{ minWidth: '70px' }}>
                    <div className="dropdown">
                      <button
                        className="btn btn-link p-0 border-0"
                        type="button"
                        // id={`dropdownMenuButton-${item._id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end"
                      // aria-labelledby={`dropdownMenuButton-${item._id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleFuelLevyEdit(fuelLevy)}
                          >
                            Edit Fuel Levy
                          </button>
                        </li>
                        {/* <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleFuelLevyDelete()}
                            >
                              Delete Fuel Levy
                            </button>
                          </li> */}
                      </ul>
                    </div>
                  </th>
                  {/* } */}
                </tr>
              </thead>
            </Table>
          </div>

          {/* Pickup and delivery charge table */}
          <div className='table-responsive mt-3'>
            <Table hover responsive className="custom-table">
              <thead className="table-light">
                <tr>
                  <th className="text-start">Pickup Charge</th>
                  <th className="text-start">{pickupCharge || '-'}</th>
                  {/* {fuelLevy && */}
                  <th style={{ minWidth: '70px' }}>
                    <div className="dropdown">
                      <button
                        className="btn btn-link p-0 border-0"
                        type="button"
                        // id={`dropdownMenuButton-${item._id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end"
                      // aria-labelledby={`dropdownMenuButton-${item._id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handlePickupChargeEdit(pickupCharge)}
                          >
                            Edit Pickup Charge
                          </button>
                        </li>
                        {/* <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleFuelLevyDelete()}
                            >
                              Delete Fuel Levy
                            </button>
                          </li> */}
                      </ul>
                    </div>
                  </th>
                  {/* } */}
                </tr>
                <tr>
                  <th className="text-start">Delivery Charge</th>
                  <th className="text-start">{deliveryCharge || '-'}</th>
                  {/* {fuelLevy && */}
                  <th style={{ minWidth: '70px' }}>
                    <div className="dropdown">
                      <button
                        className="btn btn-link p-0 border-0"
                        type="button"
                        // id={`dropdownMenuButton-${item._id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BsThreeDotsVertical size={18} />
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end"
                      // aria-labelledby={`dropdownMenuButton-${item._id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDeliveryChargeEdit(deliveryCharge)}
                          >
                            Edit Delivery Charge
                          </button>
                        </li>
                        {/* <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleFuelLevyDelete()}
                            >
                              Delete Fuel Levy
                            </button>
                          </li> */}
                      </ul>
                    </div>
                  </th>
                  {/* } */}
                </tr>
              </thead>
            </Table>
          </div>

          {/* Loose Service Code Rates */}
          {rates?.find((rate) => rate?.serviceCodeId?.text?.toLowerCase()?.trim() === 'loose') &&
            <Table hover responsive className="custom-table mt-3">
              <thead className="table-light">
                <tr>
                  <th className="text-start">Weight</th>
                  <th className="text-start">Rate</th>
                  <th style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialCodeRates?.length > 0 ? specialCodeRates?.map((item) => (
                  <tr key={item._id}>
                    <td className="text-start">{item?.weight}</td>
                    <td className="text-start">{item?.rate}</td>
                    <td className="text-center action-dropdown-menu">
                      <div className="dropdown">
                        <button
                          className="btn btn-link p-0 border-0"
                          type="button"
                          id={`dropdownMenuButton-${item?._id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <BsThreeDotsVertical size={18} />
                        </button>
                        <ul
                          className="dropdown-menu dropdown-menu-end"
                          aria-labelledby={`dropdownMenuButton-${item?._id}`}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleSpecialCodeRateEdit(item)}
                            >
                              Edit Rate
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                )) :
                  <tr>
                    <td colSpan={4} className="text-center text-danger">No Records Found.</td>
                  </tr>
                }
              </tbody>
            </Table>
          }
        </Tab>
      </Tabs>
      {/* Add Modal */}
      <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }} className="custom-modal">
        <Modal.Header closeButton><Modal.Title>Add Client Rates</Modal.Title></Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleClientRateSubmit}>
          <Modal.Body className="pt-0">
            <Form.Group className="mt-3">
              <Form.Label>Service Code</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                name="serviceCodeId"
                options={serviceOptionForRate}
                value={clientData?.serviceCodeId?._id}
                onChange={handleServiceCodeRateChange}
                placeholder="Enter service code"
                isSearchable
                required
              />
              {errors?.serviceCodeId ? (
                <Form.Text className="text-danger">{errors?.serviceCodeId}</Form.Text>
              ) : null}
            </Form.Group>
            {!specialCode && (
              <>
                < Form.Group className="mt-3">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-form-control"
                    placeholder="Enter rate here"
                    value={clientRateData?.rate}
                    name="rate"
                    // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                    onChange={handleClientRateChange}
                  />
                  {errors.rate ? (
                    <Form.Text className="text-danger">{errors.rate}</Form.Text>
                  ) : null}
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Item</Form.Label>
                  <Select
                    className="w-100 custom-select"
                    classNamePrefix="custom-select"
                    options={unitOptions}
                    value={clientData?.item}
                    name="item"
                    // onChange={(selectedOption) => setSelectedUnit(selectedOption)}
                    onChange={handleItemRateChange}
                    placeholder="Select from the list"
                    isSearchable
                  />
                  {errors?.item ? (
                    <Form.Text className="text-danger">{errors?.item}</Form.Text>
                  ) : null}
                </Form.Group>
              </>
            )}
            {clientRateData?.item == 'Per Hour' &&
              <Form.Group className="mt-3">
                <Form.Label>Minimum Hours</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-form-control"
                  placeholder="Enter rate here"
                  value={clientRateData?.minimumHours}
                  name="minimumHours"
                  // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                  onChange={handleClientRateChange}
                />
                {clientRateData?.item === 'Per Hour' && errors?.minimumHours ? (
                  <Form.Text className="text-danger">{errors?.minimumHours}</Form.Text>
                ) : null}
              </Form.Group>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">Submit</Button>
            {/* <Button variant="secondary" onClick={handleCloseModal}>Close</Button> */}
          </Modal.Footer>
        </Form>
      </Modal >

      {/* Edit Modal */}
      < Modal
        show={showModal2}
        onHide={handleCloseModal2}
        style={{ marginTop: '10vh' }
        }
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Client Rates</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleClientRateSubmit}>
          <Modal.Body className="pt-0">
            <Form.Group className="mt-3">
              <Form.Label>Service Code</Form.Label>
              <Select
                className="w-100 custom-select"
                classNamePrefix="custom-select"
                name="serviceCodeId"
                options={serviceOptionForRate}
                value={serviceOptionForRate?.find(opt => opt?.value === clientRateData?.serviceCodeId)}
                onChange={handleServiceCodeRateChange}
                placeholder="Enter service code"
                isSearchable
                required
              />
              {errors?.serviceCodeId ? (
                <Form.Text className="text-danger">{errors?.serviceCodeId}</Form.Text>
              ) : null}
            </Form.Group>
            {!specialCode && (
              <>
                <Form.Group className="mt-3">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-form-control"
                    placeholder="Enter rate here"
                    value={clientRateData?.rate}
                    name="rate"
                    // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                    onChange={handleClientRateChange}
                  />
                  {errors?.rate ? (
                    <Form.Text className="text-danger">{errors?.rate}</Form.Text>
                  ) : null}
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Item</Form.Label>
                  <Select
                    className="w-100 custom-select"
                    classNamePrefix="custom-select"
                    options={unitOptions}
                    value={unitOptions?.find(opt => opt?.label === clientRateData?.item)}
                    name="item"
                    // onChange={(selectedOption) => setSelectedUnit(selectedOption)}
                    onChange={handleItemRateChange}
                    placeholder="Select from the list"
                    isSearchable
                  />
                  {errors?.item ? (
                    <Form.Text className="text-danger">{errors?.item}</Form.Text>
                  ) : null}
                </Form.Group>
              </>)}
            {clientRateData?.item === 'Per Hour' &&
              <Form.Group className='mt-3'>
                <Form.Label>Minimum Hours</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-form-control"
                  placeholder="Enter rate here"
                  value={clientRateData?.minimumHours}
                  name="minimumHours"
                  // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                  onChange={handleClientRateChange}
                />
                {clientRateData?.item === 'Per Hour' && errors?.minimumHours ? (
                  <Form.Text className="text-danger">{errors?.minimumHours}</Form.Text>
                ) : null}
              </Form.Group>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">
              Confirm Change
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >

      {/* Fuel Levy Add Modal */}
      < Modal show={addFuelLevyModal} onHide={() => setAddFuelLevyModal(false)} style={{ marginTop: '10vh' }} className="custom-modal" >
        <Modal.Header closeButton><Modal.Title>Add Fuel Levy</Modal.Title></Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleFuelLevySubmit}>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Fuel Levy</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Enter fuel levy here"
                value={fuelLevyData?.fuelLevy}
                name="rate"
                // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                onChange={(e) => setFuelLevyData({ fuelLevy: e.target.value })}
              />
              {errors?.fuelLevy ? (
                <Form.Text className="text-danger">{errors?.fuelLevy}</Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal >

      {/* Fuel Levy Edit Modal */}
      < Modal
        show={editFuelLevyModal}
        onHide={() => setEditFuelLevyModal(false)}
        style={{ marginTop: '10vh' }
        }
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Fuel Levy</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleFuelLevySubmit}>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Fuel Levy</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Enter fuel levy here"
                value={fuelLevyData?.fuelLevy}
                name="rate"
                // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                onChange={(e) => setFuelLevyData({ fuelLevy: e.target.value })}
                required
              />
              {errors?.fuelLevy ? (
                <Form.Text className="text-danger">{errors?.fuelLevy}</Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">
              Confirm Change
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >

      {/* Pickup Charge Edit Modal */}
      < Modal
        show={editPickupChargeModal}
        onHide={() => setEditPickupChargeModal(false)}
        style={{ marginTop: '10vh' }
        }
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Pickup Charge</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handlePickupChargeSubmit}>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Pickup Charge</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Enter fuel levy here"
                value={pickupChargeData?.pickupCharge}
                name="rate"
                // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                onChange={(e) => setPickupChargeData({ pickupCharge: e.target.value })}
                required
              />
              {errors?.pickupCharge ? (
                <Form.Text className="text-danger">{errors?.pickupCharge}</Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">
              Confirm Change
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >

      {/* Delivery Charge Edit Modal */}
      < Modal
        show={editDeliveryChargeModal}
        onHide={() => setEditDeliveryChargeModal(false)}
        style={{ marginTop: '10vh' }
        }
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Delivery Charge</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleDeliveryChargeSubmit}>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Delivery Charge</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Enter fuel levy here"
                value={deliveryChargeData?.deliveryCharge}
                name="rate"
                // onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ''))}
                onChange={(e) => setDeliveryChargeData({ deliveryCharge: e.target.value })}
                required
              />
              {errors?.deliveryCharge ? (
                <Form.Text className="text-danger">{errors?.deliveryCharge}</Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">
              Confirm Change
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >

      {/* Special code rate edit modal */}
      < Modal
        show={editSpecialCodeRateModal}
        onHide={() => setEditSpecialCodeRateModal(false)}
        style={{ marginTop: '10vh' }
        }
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit rate for {specialCodeRateData?.weight} </Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSpecialCodeRateSubmit}>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="text"
                className="custom-form-control"
                placeholder="Enter fuel levy here"
                value={specialCodeRateData?.rate}
                name="rate"
                onChange={(e) => setSpecialCodeRateData({ ...specialCodeRateData, rate: e.target.value })}
                required
              />
              {errors?.rate ? (
                <Form.Text className="text-danger">{errors?.rate}</Form.Text>
              ) : null}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className="custom-btn">
              Confirm Change
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >

    </>
  )
}

export default AddClients