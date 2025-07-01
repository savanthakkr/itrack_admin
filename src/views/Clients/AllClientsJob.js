import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap'
import {
  FaBoxOpen,
  FaEye,
  FaMapMarkedAlt,
  FaRegEdit,
  FaSearch,
  FaTruckMoving,
} from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { useColorModes } from '@coreui/react'
import { get } from '../../lib/request'
import Select, { components } from 'react-select';
import { FaCheck } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs'
import MyPagination from '../../components/Pagination'

function AllClientsJob() {
  const { id } = useParams()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [jobsCount, setJobsCount] = useState(0);

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    setLoading(true);
    fetchJobData();
  }, []);

  const fetchJobData = () => {
    get(`/admin/info/jobFilter?clientId=${id}&page=${page}&limit=${limit}`, 'admin').then((response) => {
      if (response.data.status) {
        if (response.data.data.length === 0) {
          setMessage('No data found')
        }
        setClients(response.data.data.jobs);
        setJobsCount(response?.data?.data?.totalCount);
        setLoading(false)
      }
    });
  }

  useEffect(() => {
    setTotalPages(Math.ceil(jobsCount / limit))
  }, [limit, jobsCount]);

  useEffect(() => {
    fetchJobData();
  }, [page, limit]);

  const [selectedColumns, setSelectedColumns] = useState([]);

  const columnOptions = [
    { value: 'all', label: 'All' },
    { value: 'client', label: 'Client' },
    { value: 'readyTime', label: 'Ready Time' },
    { value: 'cutoffTime', label: 'Cutoff Time' },
    { value: 'awb', label: 'AWB' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'serviceType', label: 'Service Type' },
    { value: 'serviceCode', label: 'Service Code' },
    { value: 'pickupFrom', label: 'Pickup From' },
    { value: 'deliveryTo', label: 'Delivery To' },
    { value: 'driver', label: 'Driver' },
    { value: 'notes', label: 'Notes' },
    { value: 'status', label: 'Status' },
  ]
  const handleColumnSelect = (option) => {
    setSelectedColumns(option)
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

  const handlePageChange = (page) => {
    setPage(page)
  }

  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    setTotalPages(Math.ceil(jobsCount / e.target.value));
    setPage(1);
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">Booking Details</h4>
        </Col>
        <Col lg={6} className="mt-3 mt-lg-0">
          <Select
            className="ms-lg-auto custom-select"
            classNamePrefix="custom-select"
            isMulti
            options={columnOptions}
            value={selectedColumns}
            onChange={handleColumnSelect}
            placeholder="Show only chosen columns"
            isSearchable
            closeMenuOnSelect={false}
            components={{ Option: customOption }}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mt-3">
            {/* <Row className="mb-3 d-flex justify-content-between ">
              <Col md={12} className="d-flex align-items-center justify-content-between gap-2 ">
                <div className="d-flex align-items-center gap-2">
                  show
                  <Col md={4}>
                    <Form.Select>
                      <option>10</option>
                      <option>20</option>
                      <option>30</option>
                    </Form.Select>
                  </Col>
                  entries
                </div>
                <Col md={8} className="d-flex align-items-center">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <Form.Control type="text" placeholder="Search" />
                  </div>
                </Col>
              </Col>
            </Row> */}
            <div className="client-rates-table">
              <Table bordered responsive hover className="custom-table">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: 'auto', minWidth: '70px' }}>#</th>
                    <th className="text-center">Job Id</th>
                    <th className="text-center">Service Code</th>
                    <th className="text-center">Client Name</th>
                    <th className="text-center">AWB</th>
                    <th className="text-center">Pickup From</th>
                    <th className="text-center">Deliver To</th>
                    <th className="text-center">Ready Time</th>
                    <th className="text-center">Cutoff Time</th>
                    <th className="text-center" style={{ width: 'auto', minWidth: '170px' }}>Status</th>
                    <th className="text-center" style={{ width: 'auto', minWidth: '70px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {message ? (
                    <tr>
                      <td colSpan={12} className="text-center text-danger">
                        {message}
                      </td>
                    </tr>
                  ) : loading ? (
                    <tr>
                      {' '}
                      <Spinner animation="border" variant="primary" />
                    </tr>
                  ) : (
                    clients?.length > 0 ?
                      clients?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{item?.uid}</td>
                            <td className="text-center">{item?.serviceCodeId?.text}</td>
                            <td className="text-center">
                              {item?.clientId?.firstname} {item?.clientId?.lastname}
                            </td>
                            <td className="text-center">{item?.AWB}</td>
                            <td className="text-center">
                              {item?.pickUpDetails?.pickupLocationId?.customName}
                            </td>
                            <td className="text-center">
                              {item?.dropOfDetails?.dropOfLocationId?.customName}
                            </td>
                            <td className="text-center">{item?.pickUpDetails?.readyTime}</td>
                            <td className="text-center">{item?.dropOfDetails?.cutOffTime}</td>

                            <td className="text-center">
                              <div
                                className="px-1 py-1 rounded-5 text-center"
                                style={{ color: '#1F9254', backgroundColor: '#EBF9F1' }}
                              >
                                {item?.currentStatus}
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
                                      className="dropdown-item" onClick={() => navigate(`/client/job/details/${item._id}`)}
                                    >
                                      View Details
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item" onClick={() => navigate('/client/edit/123')}
                                    >
                                      Edit Client
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                            {/* <td className="text-center cursor-pointer">
                            <FaEye
                              size={22}
                              color="#0984E3"
                              onClick={() => navigate(`/client/job/details/${item._id}`)}
                            />
                          </td>
                          <td className="text-center cursor-pointer">
                            <FaRegEdit
                              onClick={() => navigate('/client/edit/123')}
                              size={22}
                              color="#624DE3"
                            />
                          </td> */}
                          </tr>
                        )
                      }) :
                      <td colSpan={12} className="text-center text-danger">
                        No data found.
                      </td>
                  )}
                </tbody>
              </Table>
            </div>

            {clients?.length > 0 &&
              <Row className="mb-3 mt-3 justify-content-between">
                <Col md={6} className="d-flex align-items-center gap-2">
                  Show Entries
                  <Form.Select className="page-entries"
                    value={limit}
                    onChange={handleLimitChange}
                  >
                    <option>10</option>
                    <option>20</option>
                    <option>30</option>
                  </Form.Select>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-end mt-3 mt-lg-0">
                  <MyPagination
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={handlePageChange}
                  />
                </Col>
              </Row>
            }
          </div>
        </Col>
        {/* Modal for showing details */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Client Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col md={12}>
              <b>Client Id :</b> Client Unique Id{' '}
            </Col>
            <Col md={12}>
              <b>Full Name :</b> John Smith{' '}
            </Col>
            <Col md={12}>
              <b>Email :</b> john-smith@email.com{' '}
            </Col>
            <Col md={12}>
              <b>Phone :</b> +1 1234567890{' '}
            </Col>
            <Col md={12}>
              <b>Username :</b> @john-smith2020{' '}
            </Col>
            <Col md={12}>
              <b>Company Name :</b> Company Name{' '}
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => navigate('/client/edit/123')}>
              Edit
            </Button>
            <Button variant="danger" className="text-white" onClick={handleCloseModal}>
              Delete
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </>
  )
}

export default AllClientsJob
