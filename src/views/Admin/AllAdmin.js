/* eslint-disable react/react-in-jsx-scope */
import { FaRegEdit, FaTruckMoving, FaEye, FaSearch, FaBoxOpen } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { Button, Col, Container, Form, Spinner, Pagination, Row, Table, Modal } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, deleteReq } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import { getTotalDocs } from '../../services/getTotalDocs'
import MyPagination from '../../components/Pagination'
import Moment from 'react-moment'
import { CButton } from '@coreui/react'
import { FaArrowRight } from 'react-icons/fa'
import { BsThreeDotsVertical } from 'react-icons/bs'
const AllAdmin = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [allDrivers, setAllDrivers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isReferesh, setIsRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)

  // Pagination
  const handlePageChange = (page) => {
    setPage(page);
  };

  // Limit
  const handleLimitChange = (e) => {
    setLimit(e.target.value);
    setTotalPages(Math.ceil(totalDocs / e.target.value))
    setPage(1);
  };

  // delete driver
  const handleDelete = (Id) => {
    sweetAlert
      .fire({
        title: 'Are you sure you want to delete this driver?',
        text: 'Once deleted you can’t revert this action',
        imageUrl: 'src/assets/images/delete_modal_icon.png',
        imageWidth: 60,
        imageHeight: 60,
        imageAlt: 'Delete Icon',
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it!',
        cancelButtonText: 'No, Keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteReq(`admin/driver?ID=${Id}`, "admin").then((data) => {
            sweetAlert.fire({
              icon: 'success',
              title: 'Driver Deleted Successfully!',
            });
            setIsRefresh(!isReferesh)
          }).catch((e) => {
            console.log("error while deleting driver", e)
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Driver is safe :)', 'error');
        }

      })
  }
  // handle view
  const handleViewClick = (item) => {
    setSelectedItem(item)
    handleShow()
  }


  // fetch All Admins
  useEffect(() => {
    setLoading(true)
    get(`admin/info/allDrivers?page=${page}&limit=${limit}`, "admin")
      .then((response) => {
        if (response.data.status) {
          setAllDrivers(response.data.data)
          setLoading(false)
        }
      })

  }
    , [isReferesh, page, limit])

  // get total pages
  useEffect(() => {
    getTotalDocs("DRIVER", "admin").then((data) => {
      setTotalDocs(data);
      setTotalPages(Math.ceil(data / limit))
    }).catch((e) => {
      console.log("error while getting total pages", e.message);
    })
  }
    , [isReferesh])

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">All Admin</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn" onClick={() => navigate('/driver/add')} >
            Add Admin
            <FaArrowRight size={12} className="ms-2" />
          </CButton>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mt-3 client-rates-table">
            {/* <Row className="mb-3 justify-content-between">
              <Col md={8} className="d-flex align-items-center gap-2 ">
                Show
                <Col md={2}>
                  <Form.Select onChange={handleLimitChange} aria-label="Default select example">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </Form.Select>
                </Col>
                Entries

              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button onClick={() => navigate('/driver/add')} variant="primary">
                  {' '}
                  <IoMdAdd /> Add Admin
                </Button>
              </Col>
            </Row> */}

            <Table className="table-bordered custom-table" responsive hover>
              <thead>
                <tr>
                  {/* <th className="text-center px-4">#</th> */}
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '300px' }}>Full Name</th>
                  <th className="text-start px-4">Email</th>
                  <th className="text-start px-4">Phone</th>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '250px' }}>Registered Date</th>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: 'auto' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={10} className="text-center">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                )}
                {allDrivers && allDrivers.map((item, index) => (
                  <tr key={index}>
                    {/* <td className="text-start px-4">{index + 1}</td> */}
                    <td className="text-start px-4">{item?.firstname} {item?.lastname}</td>
                    <td className="text-start px-4">{item.email}</td>
                    <td className="text-start px-4">{item.phone}</td>
                    <td className="text-start px-4">
                      <Moment format="DD/MM/YYYY, hh:mm a">{item.createdDateTime}</Moment>
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
                              className="dropdown-item" onClick={() => navigate(`/driver/edit/${item._id}`)}
                            >
                              View/Edit Details
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item" onClick={() => navigate(`/driver/jobs/${item._id}`)}
                            >
                              Booking Details
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item" onClick={() => handleDelete(item._id)}
                            >
                              Delete Driver
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                    {/* <td className="text-start px-4">
                      <FaRegEdit
                        size={22}
                        className="text-primary cursor-pointer"
                        onClick={() => navigate(`/driver/edit/${item._id}`)}
                      />
                    </td>
                    <td className="text-start px-4">
                      <FaBoxOpen
                        size={22}
                        className="cursor-pointer"
                        onClick={() => navigate(`/driver/jobs/${item._id}`)}
                      />
                    </td>
                    <td className="text-start px-4">
                      <FaEye
                        size={22}
                        className="text-success cursor-pointer"
                        onClick={() => handleViewClick(item)}
                      />
                    </td>
                    <td className="text-start px-4">
                      <RiDeleteBin5Line
                        size={22}
                        className="text-danger cursor-pointer"
                        onClick={() => handleDelete(item._id)}
                      />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>


            <Row className="mb-3 justify-content-between">
              <Col md={8} className="d-flex align-items-center gap-2 ">
                Show Entries
                <Col md={2}>
                  <Form.Select className="page-entries"
                    value={limit}
                    onChange={handleLimitChange}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </Form.Select>
                </Col>
              </Col>
              <Col className="d-flex align-items-center justify-content-end mt-3 mt-lg-0">
                <MyPagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={handlePageChange}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Driver Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Col md={12} className="m-3">
            <b>Full Name :</b> {selectedItem?.firstname} {selectedItem?.lastname}{' '}
          </Col>
          <Col md={12} className="m-3">
            <b>Email :</b> {selectedItem?.email}{' '}
          </Col>
          <Col md={12} className="m-3">
            <b>Username :</b> {selectedItem?.username}{' '}
          </Col>
          <Col md={12} className="m-3">
            <b>password :</b> {selectedItem?.password}{' '}
          </Col>
          <Col md={12} className="m-3">
            <b>Phone :</b> {selectedItem?.phone}{' '}
          </Col>
          <Col md={12} className="m-3">
            <b>Registered Date :</b>
            <Moment format="DD/MM/YYYY, hh:mm a">{selectedItem?.createdDateTime}</Moment>
            {' '}
          </Col>
          <Col md={12} className="m-3">
            <b>Status :</b> {selectedItem?.status}{' '}
          </Col>
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

export default AllAdmin
