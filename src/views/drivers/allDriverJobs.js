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
import { FaSearch, FaRegEdit, FaEye } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { get } from '../../lib/request'
import Select, { components } from 'react-select';
import MyPagination from '../../components/Pagination'

const AllDriverJobs = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [jobsCount, setJobsCount] = useState(0);

  useEffect(() => {
    setLoading(true)
    fetchJobData();
  }, []);

  const fetchJobData = () => {
    get(`/admin/info/jobFilter?driverId=${id}&page=${page}&limit=${limit}`, 'admin').then((response) => {
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
    // If you want to filter data by selected column:
    // setSearchQuery({ ...searchQuery, selectedColumn: option.value })
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
            onChange={setSelectedColumns}
            placeholder="Show only chosen columns"
            isSearchable
            closeMenuOnSelect={false}
            components={{ Option: customOption }}
          />
        </Col>
      </Row>
      <Row>
        {/* <Col md={12}> */}
        <div className="client-rates-table">
          {/* <Row className="mb-3 d-flex justify-content-between ">
          <Col md={2} className="d-flex align-items-center justify-content-between gap-2 ">
            <div className="d-flex align-items-center gap-2">
              show
              <Form.Select>
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </Form.Select>
              entries
            </div>
          </Col>
          <Col md={10} className="d-flex align-items-center">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <Form.Control type="text" placeholder="Search" />
            </div>
          </Col>
        </Row> */}

          <Table className="mt-3 custom-table" responsive hover style={{ minWidth: 2000 }}>
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Job Id</th>
                <th className="text-center">Service Code</th>
                <th className="text-center">Client Name</th>
                <th className="text-center">AWB</th>
                <th className="text-center">Pickup From</th>
                <th className="text-center">Deliver To</th>
                <th className="text-center">Ready Time</th>
                <th className="text-center">Cuttoff Time</th>
                <th className="text-center">Status</th>
                <th className="text-center" colSpan={4}>
                  Action
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
                        <td className="text-center cursor-pointer">
                          <FaEye
                            size={22}
                            color="#0984E3"
                            onClick={() => navigate(`/client/job/details/${item._id}`)}
                          />
                          {/* <FaEye onClick={handleShowModal} size={22} color="#0984E3" /> */}
                        </td>
                        <td className="text-center cursor-pointer">
                          <FaRegEdit
                            onClick={() => navigate('/client/edit/123')}
                            size={22}
                            color="#624DE3"
                          />
                        </td>
                      </tr>
                    )
                  }) :
                  <td colSpan={12} className="text-center text-danger">
                    No data found
                  </td>
              )}
            </tbody>
          </Table>

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
          {/* <div className="d-flex justify-content-center">
          <Pagination className="mt-3">
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </div> */}
        </div>
        {/* </Col> */}
      </Row>
    </>
  )
}

export default AllDriverJobs
