import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Table, Spinner, InputGroup } from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useColorModes } from '@coreui/react'
import { get, postWihoutMediaData, updateReq, deleteReq } from '../../lib/request'
import sweetAlert from 'sweetalert2';
import { getFormattedDAndT, utcToMelbourne } from '../../lib/getFormatedDate'
import { CButton } from '@coreui/react'
import { BsThreeDotsVertical } from 'react-icons/bs'

function AllServiceType() {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReferesh, setIsRefresh] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)

  const handleShowModal = () => setShowModal(true)
  const handleShowModal2 = (serviceType) => {
    setSelectedServiceType(serviceType);
    setServiceType(serviceType.text)
    setShowModal2(true)
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setServiceType('');
  }
  const handleCloseModal2 = () => {
    setShowModal2(false);
    setServiceType('');
  }

  const handleAddServiceType = () => {
    if (serviceType === "") {
      return sweetAlert.fire({ icon: 'error', title: 'Please enter service type' });
    }
    postWihoutMediaData('/admin/service/type', { "text": serviceType }, "admin")
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Type Added Successfully!' });
        setIsRefresh(!isReferesh)
        setShowModal(false)
        setServiceType("")
      })
      .catch(console.error)
  }

  const handleEditServiceType = () => {
    if (serviceType === "") {
      return sweetAlert.fire({ icon: 'error', title: 'Please enter service type' });
    }
    updateReq(`/admin/service/type?ID=${selectedServiceType._id}`, { "text": serviceType }, "admin")
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Type Updated Successfully!' });
        setIsRefresh(!isReferesh)
        setShowModal2(false)
        setServiceType("")
      })
      .catch(console.error)
  }

  // Deleting the Service type
  const handleDelete = (Id) => {
    sweetAlert
      .fire({
        title: 'Are you sure you want to delete this service type?',
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
          deleteReq(`/admin/service/type?ID=${Id}`, "admin").then((data) => {
            sweetAlert.fire({ icon: 'success', title: 'Service Type Deleted Successfully!' })
            setIsRefresh(!isReferesh)

          }).catch((e) => {
            console.log("Error while deleting:", e.message)
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your Service Type is safe :)', 'error')
        }
      })

  }
  // const handleDelete = (id) => {
  //   deleteReq(`/admin/service/type?ID=${id}`, "admin")
  //     .then((data) => {
  //       if (data.data.status) {
  //         setIsRefresh(!isReferesh)
  //         sweetAlert.fire({ icon: 'success', title: 'Service Type Deleted Successfully!' });
  //       }
  //     })
  //     .catch((e) => console.error("Error while deleting:", e.message))
  // }

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.text.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }

  useEffect(() => {
    setLoading(true)
    get('/admin/service/type', "admin")
      .then((response) => {
        const result = response?.data?.data || [];
        setData(result);
        setFilteredData(result);
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [isReferesh])

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">Service Type</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn" onClick={handleShowModal}>
            Add Service Type
          </CButton>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mt-3 client-rates-table">
            {/* <Row className="mb-3 justify-content-between">
              <Col md={6}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search by service type..."
                    value={searchText}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button onClick={handleShowModal} variant="primary">
                  <IoMdAdd /> Add Service Type
                </Button>
              </Col>
            </Row> */}

            <Table className="custom-table table-bordered" responsive hover>
              <thead>
                <tr>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '50px' }}>#</th>
                  <th className="text-start px-4">Service Type</th>
                  <th className="text-start px-4">Date</th>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '70px' }}>Status</th>
                  <th className="text-center px-4" style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : filteredData?.length > 0 ? (
                  filteredData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-start px-4">{index + 1}</td>
                      <td className="text-start px-4">{item?.text}</td>
                      <td className="text-start px-4">
                        {item?.createdDateTime ? utcToMelbourne(item.createdDateTime) : ''}
                      </td>
                      <td className="text-center px-4">
                        <div
                          className="rounded-5"
                          style={{
                            color: '#1F9254',
                            backgroundColor: '#EBF9F1',
                            padding: '4px 15px',
                            width: 'fit-content'
                          }}
                        >
                          {item?.status}
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
                                Delete Service Type
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
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">No service types found.</td>
                  </tr>
                )}
              </tbody>
            </Table>

          </div>
        </Col>

        {/* Add Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }} className="custom-modal">
          <Modal.Header closeButton><Modal.Title>Add Service Type</Modal.Title></Modal.Header>
          <Modal.Body className="pt-0">
            <Form.Group>
              <Form.Label>Enter Service Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service type..."
                onChange={(e) => setServiceType(e.target.value)}
                value={serviceType}
                className="custom-form-control"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="custom-btn" onClick={handleAddServiceType}>Add</Button>
            {/* <Button variant="secondary" onClick={handleCloseModal}>Close</Button> */}
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ marginTop: '10vh' }} dialogClassName="custom-modal">
          <Modal.Header closeButton><Modal.Title>Edit Service Type</Modal.Title></Modal.Header>
          <Modal.Body className="custom-form pt-0">
            <Form.Group>
              <Form.Label>Enter Service Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service type..."
                onChange={(e) => setServiceType(e.target.value)}
                value={serviceType}
                className="custom-form-control"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditServiceType}>Confirm Change</Button>
            {/* <Button variant="secondary" onClick={handleCloseModal2}>Close</Button> */}
          </Modal.Footer>
        </Modal>
      </Row>
    </>
  )
}

export default AllServiceType;
