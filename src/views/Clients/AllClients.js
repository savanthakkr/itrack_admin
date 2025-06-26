import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Pagination, Row, Table, Spinner, Image, Tabs, Tab } from 'react-bootstrap'
import {
  FaBoxOpen,
  FaEye,
  FaMapMarkedAlt,
  FaRegEdit,
  FaSearch,
  FaTruckMoving,
  FaPlusCircle,
  FaArrowRight,
  FaSyncAlt,
  FaFilter
} from 'react-icons/fa'
import { CButton } from '@coreui/react'
import DateRangeFilter from '../../components/DateRangeFilter'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useColorModes } from '@coreui/react'
import { get, deleteReq } from '../../lib/request'
import { getAdminToken } from '../../lib/getTokens'
import MyPagination from '../../components/Pagination'
import { getTotalDocs } from '../../services/getTotalDocs'
import sweetAlert from 'sweetalert2'
import Moment from 'react-moment'
import { BsThreeDotsVertical } from 'react-icons/bs'
import sortData from '../../services/sortData'
import getStatusStyles from '../../services/getStatusColor'
import { getFormattedDAndT, getLocalDateAndTime, convertToMelbourneFormat } from '../../lib/getFormatedDate'
import FilterOffCanvas from '../../components/Filter'

function AllClients() {
  let currentUrl = useLocation();
  let imgSrc = process.env.Image_Src
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [clientData, setClientData] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [activeTab, setActiveTab] = useState('allClients')
  const [message, setMessage] = useState('')
  const [selectedItem, setSelectedItem] = useState(location.state?.selectedItem || {})
  const searchQuery = useSelector((state) => state.searchQuery)
  const handleShow = () => setShowCanvas(true);
  const [showCanvas, setShowCanvas] = useState(false)
  const dispatch = useDispatch()

  const tabLabels = {
    allClients: 'All Clients',
    invoices: 'Invoices',
  };
  const handleShowModal = (client) => {
    setSelectedClient(client)
    setShowModal(true)
  }

  // handle sort
  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    setData(sortedData)
  }

  const handleCloseCanvas = () => setShowCanvas(false)

  const handleCloseModal = () => {
    setShowModal(false)
  }
  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery',
      payload: query,
    })
  }

  const handleClear = () => {
    setMessage('')
    setIsRefresh(!isReferesh)
    setSearchQuery({
      AWB: '',
      clientId: '',
      driverId: '',
      fromDate: '',
      toDate: '',
      currentStatus: '',
      jobId: '',
      clientName: '',
      driverName: '',
      serviceType: '',
      serviceCode: ''
    })
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
  // Pagination
  const handlePageChange = (page) => {
    setPage(page);
  };
  // Limit
  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    // console.log('totalDocs', totalDocs);
    setTotalPages(Math.ceil(totalDocs / e.target.value))
    setPage(1);
  }

  // useEffect(() => {
  //   setLoading(true);
  //   get(`/admin/info/allClients?page=${page}&limit=${limit}`, "admin").then((data) => {
  //     setClientData(data.data.data)
  //     setLoading(false)
  //   }).catch((e) => {
  //     console.log("errr", e.message);
  //   })
  //   // Getting total pages

  // }, [isReferesh, page, limit])

  useEffect(() => {
    getClientsData();
  }, [page, limit, isReferesh]);

  useEffect(() => {
    if (activeTab === 'allClients') {
      getClientsData();
    } else if (activeTab === 'invoices') {
      getInvoiceData();
    }
  }, [activeTab]);

  // get invoice data
  const getInvoiceData = () => {
    get(`/admin/invoice/list`, 'admin')
      .then((response) => {
        if (response?.data?.data?.length === 0) {
          setMessage('No data found')
        }
        setData(response?.data?.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error);
        setData([]); // Reset data
        setMessage('No Data Found');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const getClientsData = () => {
    get(`/admin/info/allClients`, 'admin')
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

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
  };

  const handleRefresh = () => {
    setLoading(true)
    setMessage('')

    getClientsData();

  }

  useEffect(() => {
    if (currentUrl.pathname.includes("/invoices")) {
      setActiveTab('invoices');
    } else {
      setActiveTab('allClients');
    }
  }, [currentUrl]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">{tabLabels[activeTab]}</h4>
        </Col>
        {tabLabels[activeTab] === 'All Clients' ?
          (<Col className="text-end">
            <CButton className="custom-btn" onClick={() => navigate('/client/add')} >
              Add Client
              <FaArrowRight size={12} className="ms-2" />
            </CButton>
          </Col>) : (<Col lg={10} className="d-flex flex-wrap justify-content-start justify-content-md-end align-items-center gap-3 mt-3 mt-lg-0">
            <Button
              variant="dark"
              className="input-group-text cursor-pointer custom-icon-btn"
              onClick={handleRefresh}
            >
              <FaSyncAlt />
            </Button>
            <Button onClick={handleShow} className="input-group-text cursor-pointer custom-icon-btn">
              <FaFilter />
            </Button>
            <Button onClick={handleClear} style={{ fontSize: '12px' }} className="custom-btn">
              Clear Filters
            </Button>
          </Col>)
        }


      </Row>
      {/* Edited */}
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} id="job-tabs" className="mb-3 custom-tabs">
        {/* Job Details */}
        {!currentUrl.pathname.includes("/invoices") &&
          <Tab eventKey="allClients" title="All Clients">
            <>
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

              {data.length > 0 && <Row className="mb-3 justify-content-between">
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
            </>
          </Tab>
        }

        {/* Invoices */}
        <Tab eventKey="invoices" title="Invoices" className="client-rates-table">
          <div className="table-responsive">
            <Table responsive hover bordered>
              <thead>
                <tr style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  <th className="text-center" onClick={() => handleSort('clientId.companyName')}>
                    Client
                  </th>
                  <th className="text-center" onClick={() => handleSort('pickUpDetails.readyTime')} >
                    Ready Time
                  </th>
                  <th className="text-center" onClick={() => handleSort('dropOfDetails.cutOffTime')}>
                    Cutoff Time
                  </th>
                  <th className="text-center" onClick={() => handleSort('AWB')}>
                    AWB
                  </th>
                  <th className="text-center" onClick={() => handleSort('pieces')}>
                    Pieces
                  </th>
                  <th className="text-center" onClick={() => handleSort('serviceTypeId.text')}>
                    Service Type
                  </th>
                  <th className="text-center" onClick={() => handleSort('serviceCodeId.text')}>
                    Service Code
                  </th>
                  <th className="text-center" onClick={() => handleSort('pickUpDetails.pickupLocationId.customName')}>
                    Pickup From
                  </th>
                  <th className="text-center" onClick={() => handleSort('dropOfDetails.dropOfLocationId.customName')}>
                    Deliver To
                  </th>
                  {/* <th className="text-center">
                    <LuChevronDown className="cursor-pointer m-1" size={20} onClick={() => handleSort('uid')} />
                    Job ID
                  </th> */}
                  <th className="text-center" onClick={() => handleSort('driverId.firstname')}>
                    Driver
                  </th>
                  <th className="text-center" onClick={() => handleSort('rates')}>
                    Rates
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: '100px' }} onClick={() => handleSort('is_invoices')}>
                    Invoiced
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: 'auto' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {message ? (
                  <tr>
                    <td colSpan={14} className="text-center text-danger">{message}</td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={14} className="text-center"><Spinner animation="border" variant="primary" /></td>
                  </tr>
                ) : (
                  data?.length > 0 ?
                    data?.map((item, index) => {
                      const isSelected = item._id === selectedItem._id;
                      const status = item?.isHold ? 'Hold' : item?.currentStatus;
                      const styles = getStatusStyles(status);

                      const tdStyle = {
                        backgroundColor: isSelected ? '#E0E0E0' : 'transparent',
                        fontSize: 13,
                        textAlign: 'left',
                      };

                      return (
                        <tr key={index} className="cursor-pointer">
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.clientId?.companyName || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {getFormattedDAndT(item?.pickUpDetails?.readyTime) || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {getFormattedDAndT(item?.dropOfDetails?.cutOffTime) || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.AWB || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.pieces || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.serviceTypeId?.text || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.serviceCodeId?.text || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.pickUpDetails?.pickupLocationId?.customName || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.dropOfDetails?.dropOfLocationId?.customName || "-"}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.driverId ? `${item.driverId.firstname}-${item.driverId.lastname}` : '-'}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.rates != null ? item.rates : '-'}
                          </td>
                          <td onClick={() => handleView(item)} style={tdStyle}>
                            {item?.invoiced === true ? 'Yes' : 'No'}
                          </td>
                          <td className="text-center action-dropdown-menu" style={tdStyle}>
                            <div className="dropdown">
                              <button
                                className="btn btn-link p-0 border-0"
                                type="button"
                                id={`dropdownMenuButton-${item._id}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <BsThreeDotsVertical size={18} />
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${item._id}`}>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => navigate(`/client/invoice/${item._id}`)}
                                  >
                                    View Details
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => navigate(`/client/job/details/${item._id}`)}
                                  >
                                    Add Manual Pricing
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      );
                    }) :
                    <tr>
                      <td colSpan={12} className="text-center text-danger">No data found</td>
                    </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>
      <Row>
        <Col md={12}>
          <div>
            {/* <Row className="mb-3 justify-content-between">
              <Col md={8} className="d-flex align-items-center gap-2 ">
                Show
                <Col md={2}>
                  <Form.Select
                    value={limit}
                    onChange={handleLimitChange}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </Form.Select>
                </Col>
                Entries

              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button onClick={() => navigate('/client/add')} variant="primary">
                  {' '}
                  <IoMdAdd /> Add Client
                </Button>
              </Col>
            </Row> */}

          </div>
        </Col>
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
      </Row >
      <FilterOffCanvas
        show={showCanvas}
        handleClose={handleCloseCanvas}
        onApplyFilter={(selectedOption) =>
          handleSearchClick(searchTerm, selectedOption)
        }
        role="admin"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

    </>
  )
}

export default AllClients
