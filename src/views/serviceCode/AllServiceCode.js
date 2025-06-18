import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useColorModes } from '@coreui/react'
import { deleteReq, get, postWihoutMediaData, updateReq } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import { getFormattedDAndT } from '../../lib/getFormatedDate'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { CButton } from '@coreui/react'

function AllServiceCode() {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [serviceCode, setServiceCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedServiceCode, setSelectedServiceCode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleShowModal = () => setShowModal(true)
  const handleShowModal2 = (serviceCode) => {
    setSelectedServiceCode(serviceCode)
    setServiceCode(serviceCode.text)
    setShowModal2(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setServiceCode('');
  }
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setServiceCode('');
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredData(data)
    } else {
      const filtered = data.filter(item =>
        item.text.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }

  const handleAddServiceCode = () => {
    if (serviceCode === '') {
      sweetAlert.fire({ icon: 'error', title: 'Please enter service code' })
      return
    }
    postWihoutMediaData('/admin/service/code', { text: serviceCode }, 'admin')
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Code Added Successfully!' })
        setIsRefresh(!isReferesh)
        setShowModal(false)
        setServiceCode('')
      })
      .catch(console.error)
  }

  const handelUpdateServiceCode = () => {
    if (serviceCode === '') {
      sweetAlert.fire({ icon: 'error', title: 'Please enter service code' })
      return
    }
    updateReq(`/admin/service/code?ID=${selectedServiceCode._id}`, { text: serviceCode }, 'admin')
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Code Updated Successfully!' })
        setIsRefresh(!isReferesh)
        setShowModal2(false)
        setServiceCode('')
      })
      .catch(console.error)
  }
  // Deleting the service code
  const handleDelete = (Id) => {
    sweetAlert
      .fire({
        title: 'Are you sure you want to delete this service code?',
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
          deleteReq(`/admin/service/code?ID=${Id}`, 'admin').then((data) => {
            sweetAlert.fire({ icon: 'success', title: 'Service Type Deleted Successfully!' })
            setIsRefresh(!isReferesh)

          }).catch((e) => {
            console.log("Error while deleting:", e.message)
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your Service Code is safe :)', 'error')
        }
      })

  }
  // const handleDelete = (id) => {
  //   deleteReq(`/admin/service/code?ID=${id}`, 'admin')
  //     .then((res) => {
  //       if (res.data.status) {
  //         sweetAlert.fire({ icon: 'success', title: 'Service Code Deleted Successfully!' })
  //         setIsRefresh(!isReferesh)
  //       }
  //     })
  //     .catch((e) => {
  //       console.error('Error while deleting the service type', e.message)
  //     })
  // }

  useEffect(() => {
    setLoading(true)
    get('/admin/service/code', 'admin')
      .then((res) => {
        setData(res?.data?.data || [])
        setFilteredData(res?.data?.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [isReferesh])

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">Service Code</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn" onClick={handleShowModal}>
            Add Service Code
          </CButton>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mt-3 client-rates-table">
            {/* <Row className="mb-3 justify-content-between">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search Service Code..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button onClick={handleShowModal} variant="primary">
                  <IoMdAdd /> Add Service Code
                </Button>
              </Col>
            </Row> */}

            <Table className="custom-table table-bordered" responsive hover>
              <thead>
                <tr>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '70px' }}>#</th>
                  <th className="text-start px-4">Service Code</th>
                  <th className="text-start px-4">Date</th>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '150px' }}>Status</th>
                  <th className="text-center px-4" style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="text-start px-4">{index + 1}</td>
                      <td className="text-start px-4">{item.text}</td>
                      <td className="text-start px-4">
                        {item?.createdDateTime ? getFormattedDAndT(item.createdDateTime) : ''}
                      </td>
                      <td className="text-start px-4">
                        <div
                          className="rounded-5"
                          style={{
                            color: '#1F9254',
                            backgroundColor: '#EBF9F1',
                            width: 'fit-content',
                            padding: '4px 15px',
                          }}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="text-center action-dropdown-menu">
                        <div className="dropdown">
                          <button
                            className="btn btn-link p-0 border-0"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDotsVertical size={18} />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button
                                className="dropdown-item" onClick={() => handleShowModal2(item)}
                              >
                                Edit Details
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item" onClick={() => handleDelete(item._id)}
                              >
                                Delete Service Code
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      {/* <td className="text-start px-4 cursor-pointer">
                        <FaRegEdit size={22} color="#624DE3" onClick={() => handleShowModal2(item)} />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <RiDeleteBin5Line size={22} color="#A30D11" onClick={() => handleDelete(item._id)} />
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

          </div>
        </Col>

        {/* Add Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Add Service Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Enter Service Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter service Code..."
                  onChange={(e) => setServiceCode(e.target.value)}
                  value={serviceCode}
                  className="custom-form-control"
                />
              </Form.Group>
            </Col>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button className="custom-btn" onClick={handleAddServiceCode}>
              Add Service Code
            </Button>
            {/* <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button> */}
          </Modal.Footer>
        </Modal>

        {/* Update Modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ marginTop: '10vh' }} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Service Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Enter Service Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter service Code..."
                  onChange={(e) => setServiceCode(e.target.value)}
                  value={serviceCode}
                  className="custom-form-control"
                />
              </Form.Group>
            </Col>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button onClick={handelUpdateServiceCode}>
              Confirm Change
            </Button>
            {/* <Button variant="secondary" onClick={handleCloseModal2}>
              Close
            </Button> */}
          </Modal.Footer>
        </Modal>
      </Row>
    </>
  )
}

export default AllServiceCode
