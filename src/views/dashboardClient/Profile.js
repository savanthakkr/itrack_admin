import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row, Spinner, Form } from 'react-bootstrap'
import { get, updateReq } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import Moment from 'react-moment'
import { CButton } from '@coreui/react'
import UpdateLogoModal from '../../components/Modals/UpdateLogo'

export default function Profile() {
  let imgSrc = process.env.Image_Src
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  // const [showEdit, setShowEdit] = useState(false)
  const [showView, setShowView] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    companyName: '',
    username: '',
  })

  //handle edit

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEdit = () => {
    updateReq('/client/profile', formData, 'client').then((data) => {
      if (data.data.status) {
        setRefresh(!refresh)
        setShowEdit(false)
        sweetAlert.fire({
          icon: 'success',
          title: 'Profile Updated Successfully',
        })
      }
    })
  }

  // get profile data

  useEffect(() => {
    setLoading(true)
    get('/client/profile', 'client').then((data) => {
      if (data.data.status) {
        setData(data.data.data)
        setFormData(data.data.data)
        setLoading(false)
      }
    })
  }, [refresh])
  return (
    <div>
      {loading ? (
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: '80vh' }}
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      ) : (
        <div>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Profile</h4>
            </Col>
            <Col className="text-end">
              <CButton className="custom-btn" onClick={handleEdit}>
                Submit
              </CButton>
            </Col>
          </Row>

          <div className="mt-3 px-3 py-3 bg-white custom-form">
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  placeholder="Text"
                  onChange={(e) => handleChanges(e)}
                  value={formData?.firstname}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="lastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={(e) => handleChanges(e)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChanges(e)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => handleChanges(e)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="companyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => handleChanges(e)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="username">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="User Name"
                  value={formData.username}
                  onChange={(e) => handleChanges(e)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="isDriverPermission">
                <Form.Label>Driver Permission</Form.Label>
                <Form.Select
                  className="form-control"
                  name="isDriverPermission"
                  value={formData.isDriverPermission}
                  onChange={(e) => handleChanges(e)}
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  name="status"
                  placeholder="Status"
                  value={formData.status}
                  onChange={(e) => handleChanges(e)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group controlId="createdDateTime">
                <Form.Label>Created Date</Form.Label>
                <Form.Control
                  type="text"
                  name="createdDateTime"
                  value={formData.createdDateTime}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company Logo</Form.Label>
                <div>
                  <Button className="border-0 custom-btn" size="small"
                    onClick={() => setShowView(true)}
                  >
                    View Logo
                  </Button>
                </div>
              </Form.Group>
            </Col>
            {/* <Col md={6} className="mb-3">
              <Button className="btn btn-primary w-100 m-1" onClick={() => setShowEdit(true)}>
                Edit Profile
              </Button>
            </Col> */}
          </Row>
          <UpdateLogoModal
            show={showView}
            setShow={setShowView}
            currentLogoUrl={data.logoUrl}
            onSave={(file) => {
              console.log('File selected:', file);
            }}
          />
          </div>
        </div>
      )}
      {/* <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                onChange={handleChanges}
                value={formData.firstname}
                name="firstname"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                onChange={handleChanges}
                value={formData.lastname}
                name="lastname"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={handleChanges}
                value={formData.email}
                name="email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Phone"
                onChange={handleChanges}
                value={formData.phone}
                name="phone"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Company Name"
                onChange={handleChanges}
                value={formData.companyName}
                name="companyName"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                onChange={handleChanges}
                value={formData.username}
                name="username"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEdit()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
      {/* <Modal show={showView} onHide={() => setShowView(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Company Logo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imgSrc + data.logoKey} alt="logo" className="w-50 h-50 mx-auto d-block" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowView(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  )
}
