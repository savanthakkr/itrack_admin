import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Table, Spinner, Image } from 'react-bootstrap'
import {
  FaArrowRight
} from 'react-icons/fa'
import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useColorModes } from '@coreui/react'
import { get, deleteReq } from '../../lib/request'
import MyPagination from '../../components/Pagination'
import { getTotalDocs } from '../../services/getTotalDocs'
import sweetAlert from 'sweetalert2'
import Moment from 'react-moment'
import { BsThreeDotsVertical } from 'react-icons/bs'
import sortData from '../../services/sortData'

function AllClients() {
  let imgSrc = process.env.Image_Src
  // const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [clientData, setClientData] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isReferesh, setIsRefresh] = useState(false)
  // const [data, setData] = useState([])
  const invoiceData = useSelector((state) => state.invoiceData);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [activeTab, setActiveTab] = useState('allClients')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getClientsData();
  }, [page, limit]);

  const handlePageChange = (page) => {
    setPage(page)
  }

  const handleLimitChange = (e) => {
    getTotalDocs("CLIENT", "admin").then((data) => {
      setTotalDocs(data);
      setTotalPages(Math.ceil(data / e.target.value))
    }).catch((e) => {
      console.log("error while getting total pages", e.message);
    })
  }

  const handleShowModal = (client) => {
    setSelectedClient(client)
    setShowModal(true)
  }

  // handle sort
  const handleSort = (field) => {
    const sortedData = sortData(invoiceData, field)
    setData(sortedData)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  // Deleting the client
  const handleDelete = (Id) => {
    sweetAlert
      .fire({
        title: 'Are you sure you want to delete this client?',
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
          deleteReq(`admin/client?ID=${Id}`, "admin").then((data) => {
            sweetAlert.fire('Deleted!', 'Client has been deleted.', 'success')
            setIsRefresh(!isReferesh)

          }).catch((e) => {
            console.log("error while deleting client", e)
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your Client is safe :)', 'error')
        }
      })
  }

  // get total pages
  useEffect(() => {
    getTotalDocs("CLIENT", "admin").then((data) => {
      setTotalDocs(data);
      setTotalPages(Math.ceil(data / limit))
    }).catch((e) => {
      console.log("error while getting total pages", e.message);
    })
  }, [isReferesh]);

  useEffect(() => {
    localStorage.removeItem('clientIdForRate');
  }, []);

  const getClientsData = () => {
    get(`/admin/info/allClients?page=${page}&limit=${limit}`, 'admin')
      .then((response) => {
        if (response?.data?.status) {
          if (response?.data?.data?.length === 0) {
            setMessage('No data found')
          }
          setClientData(response?.data?.data)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }

  const handleViewClientRates = (clientId) => {
    localStorage.setItem("clientIdForRate", clientId);
    localStorage.setItem("goToClientRateTab", "true");
    navigate("/client/add");
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">All Clients</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn" onClick={() => navigate('/client/add')} >
            Add Client
            <FaArrowRight size={12} className="ms-2" />
          </CButton>
        </Col>
      </Row>

      <div className="client-rates-table mt-5">
        <div className="client-rates-table">
          <Table className="custom-table table-bordered" responsive hover>
            <thead>
              <tr>
                {/* <th className="text-center px-4">#</th> */}
                <th className="text-start px-4">Company Name</th>
                <th className="text-start px-4">Email</th>
                <th className="text-start px-4">Phone</th>
                <th className="text-start px-4" style={{ width: 'auto', minWidth: '250px' }}>Registered Date</th>
                <th className="text-start px-4" style={{ width: 'auto', minWidth: 'auto' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center">
                    <Spinner animation="border" className="mx-auto d-block" />
                  </td>
                </tr>
              ) : (
                clientData?.length > 0 ?
                  clientData?.map((client, index) => (
                    <tr key={index}>
                      {/* <td className="text-start px-4">{index + 1}</td> */}
                      <td className="text-start px-4">{client?.companyName}</td>
                      <td className="text-start px-4">{client?.email}</td>
                      <td className="text-start px-4">{client?.phone}</td>
                      <td className="text-start px-4">
                        <Moment format="DD/MM/YYYY, hh:mm a">{client?.createdDateTime}</Moment>
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
                                className="dropdown-item" onClick={() => navigate(`/client/edit/${client?._id}`)}
                              >
                                View/Edit Details
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item" onClick={() => navigate(`/client/${client?._id}/jobs`)}
                              >
                                Booking Details
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item" onClick={() => handleDelete(client?._id)}
                              >
                                Delete Client
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleViewClientRates(client?._id)}
                              >
                                View Client Rates
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      {/* <td className="text-start px-4 cursor-pointer">
                        <FaEye
                          onClick={() => handleShowModal(client)}
                          size={22}
                          color="#0984E3"
                        />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <FaBoxOpen
                          onClick={() => navigate(`/client/${client?._id}/jobs`)}
                          size={22}
                          color="#FDCB6E"
                        />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <FaRegEdit
                          onClick={() => navigate(`/client/edit/${client?._id}`)}
                          size={22}
                          color="#624DE3"
                        />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <RiDeleteBin5Line
                          size={22}
                          color="#A30D11"
                          onClick={() => handleDelete(client?._id)}
                        />
                      </td> */}
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan={5} className="text-center text-danger">No data found</td>
                  </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {clientData?.length > 0 &&
        <Row className="mb-3 justify-content-between">
          <Col md={8} className="d-flex justify-content-center justify-content-lg-start align-items-center gap-2 ">
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
          <Col className="d-flex align-items-center justify-content-lg-end mt-3 mt-lg-0">
            <MyPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>}

      <Row>
        {/* Modal for showing details */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Client Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              selectedClient?.logoKey ?
                < Col md={12} className='m-2' >
                  <div className='fw-bold text-center' >Logo :</div> <Image src={`${imgSrc}${selectedClient?.logoKey}`} rounded height={100} width={100} className='mx-auto d-block mt-2 shadow-lg' />
                </Col>
                : ""}
            <Col md={12} className='m-2' >
              <b>Full Name :</b> {selectedClient?.firstname} {selectedClient?.lastname}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Email :</b> {selectedClient?.email}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Phone :</b> {selectedClient?.phone}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Username :</b> {selectedClient?.username}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Password :</b> {selectedClient?.password}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Company Name :</b> {selectedClient?.companyName}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Driver Permission :</b> {selectedClient?.isDriverPermission ? "yes" : "No"}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Enable Tracker Feature for client :</b> {selectedClient?.isTrackPermission ? "yes" : "No"}{' '}
            </Col>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </>
  )
}

export default AllClients