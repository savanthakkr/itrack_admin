import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Container, Form, Row, Spinner, Table, Modal, Button } from 'react-bootstrap'
import { FaSearch, FaRegEdit, FaEye, FaTruckMoving, FaMapMarkedAlt, FaFilter } from 'react-icons/fa'
import { get } from '../../lib/request'
import MyPagination from '../../components/Pagination'
import { useNavigate } from 'react-router-dom'
import { getTotalDocs } from '../../services/getTotalDocs'
import ViewJobs from '../../components/Modals/ViewJobs'
import { BiDetail } from 'react-icons/bi'
import FilterOffCanvas from '../../components/Filter'
import { getSeachFilterResult } from '../../services/getSearchFilterResult'
import EditJob from '../../components/Modals/EditJob'
import AssignDriverModal from '../../components/Modals/AssignDriver'
import JsonToExcelBtn from '../../components/operations/JsonToExcelBtn'
import DateRangeFilter from '../../components/DateRangeFilter'
import getStatusStyles from '../../services/getStatusColor'
import { LuChevronDown } from 'react-icons/lu'
import sortData from '../../services/sortData'
import { getFormattedDAndT } from '../../lib/getFormatedDate'
import { FaSyncAlt } from 'react-icons/fa'
import { BsThreeDotsVertical } from 'react-icons/bs'

const AllJobs = () => {
  let assignPermission = localStorage.getItem('clientDriverAssign')
  let trackPermission = localStorage.getItem('clientTrackPermission')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [message, setMessage] = useState('')

  const [selectedJob, setSelectedJob] = useState(null)

  const [show, setShow] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showAssign, setShowAssign] = useState(false)

  const [filterShow, setFilterShow] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchQuery = useSelector((state) => state.searchQuery2)
  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery2',
      payload: query,
    })
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  // handle edit

  const handleEdit = (item) => {
    setSelectedJob(item)
    handleShow()
  }
  // handle view
  const handleView = (item) => {
    sessionStorage.setItem('selectedItem', JSON.stringify(item))
    navigate(`/client/dashboard/job/${item._id}`)
  }
  // close view
  const handleCloseView = () => setShowView(false)

  // handle assign driver modal
  const handleShowAssign = (item) => {
    setSelectedJob(item)
    setShowAssign(true)
  }

  // handle Filter
  const handleFilterClose = () => {
    setFilterShow(false)
  }
  const handleSearchClick = (searchTerm, selectedOption) => {
    let query = {
      AWB: searchQuery.AWB,
      clientId: searchQuery.clientId,
      driverId: searchQuery.driverId,
      fromDate: searchQuery.fromDate,
      toDate: searchQuery.toDate,
      currentStatus: searchQuery.currentStatus,
    }
    if (selectedOption === 'jobId') {
      query.jobId = searchTerm
      query.AWB = ''
    } else if (selectedOption === 'AWB') {
      query.AWB = searchTerm
      query.jobId = ''
    } else {
      query.AWB = ''
      query.jobId = ''
    }
    setIsFiltering(true)

    getSeachFilterResult(query, 'client').then((res) => {
      setFilterShow(false)
      setData(res)
    })
  }
  const handleClear = () => {
    setMessage('')
    setIsFiltering(!isReferesh)
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
    })
    setSearchTerm('')
    setIsFiltering(false)
    isReferesh ? setIsRefresh(false) : setIsRefresh(true)
  }

  useEffect(() => {
    getTotalDocs('JOB', 'client')
      .then((data) => {
        setTotalDocs(data)
        setTotalPages(Math.ceil(data / limit))
      })
      .catch((e) => {
        console.log('error while getting total docs', e.message)
      })
  }, [isReferesh])

  useEffect(() => {
    console.log('searchQuery', searchQuery)
    if (isFiltering) {
      return
    } else if (
      searchQuery.currentStatus ||
      searchQuery.clientId ||
      searchQuery.driverId ||
      searchQuery.fromDate ||
      searchQuery.toDate ||
      searchQuery.jobId ||
      searchQuery.clientName ||
      searchQuery.driverName
    ) {
      getSeachFilterResult(searchQuery, 'client').then((res) => {
        setData(res)
      })
      return
    }

    const fetchData = () => {
      console.log('fetch data called');
      get(`/client/jobFilter`, 'client')
        .then((response) => {
          setData(response?.data?.data)
          setLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
        })
    }

    fetchData()

    const intervalId = setInterval(fetchData, 3000)

    return () => clearInterval(intervalId)
  }, [page, limit, isReferesh, isFiltering])

  const handlePageChange = (page) => {
    setPage(page)
  }

  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    setTotalPages(Math.ceil(totalDocs / e.target.value))
  }

  // handle search
  const handleSearch = (val) => {
    setIsFiltering(true)
    setSearchTerm(val)

    let url = `/client/search-string/${val}`

    get(url, 'client').then((res) => {
      if (res.data.status) {
        setData(res.data.data)
      }
    })
  }

  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    setIsFiltering(true)
    setData(sortedData)
  }

  useEffect(() => {
    // Retrieve the selected item from local storage if it exists
    const storedSelectedItem = sessionStorage.getItem('selectedItem')
    if (storedSelectedItem) {
      setSelectedJob(JSON.parse(storedSelectedItem))
    }
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    setMessage('')

    let queryParams = []

    if (searchQuery.currentStatus)
      queryParams.push(`currentStatus=${searchQuery.currentStatus}`)
    if (searchQuery.clientId) queryParams.push(`clientId=${searchQuery.clientId}`)
    if (searchQuery.driverId) queryParams.push(`driverId=${searchQuery.driverId}`)
    if (searchQuery.fromDate) queryParams.push(`fromDate=${searchQuery.fromDate}`)
    if (searchQuery.toDate) queryParams.push(`toDate=${searchQuery.toDate}`)
    if (searchQuery.jobId) queryParams.push(`jobId=${searchQuery.jobId}`)
    if (searchQuery.clientName) queryParams.push(`clientName=${searchQuery.clientName}`)
    if (searchQuery.driverName) queryParams.push(`driverName=${searchQuery.driverName}`)

    const query = queryParams.join('&')

    get(`/admin/info/jobFilter?${query}`, 'admin')
      .then((response) => {
        if (response?.data?.status) {
          if (response?.data?.data?.length === 0) {
            setMessage('No data found')
          }
          setData(response?.data?.data)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }
  return (
    <>
      <Row className="d-flex pb-3 align-items-center justify-content-between">
        <Col md={2} className="m-0">
          <h3>All Bookings</h3>
        </Col>

        <Col md={10} className="d-flex flex-wrap justify-content-start justify-content-md-end align-items-center gap-3 mt-3 mt-md-0">
          <Button
            variant="dark"
            className="input-group-text cursor-pointer custom-icon-btn"
            onClick={handleRefresh}
          >
            <FaSyncAlt />
          </Button>
          <DateRangeFilter
            setData={setData}
            role="client"
            setMessage={setMessage}
            setIsFiltering={setIsFiltering}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Button onClick={() => setFilterShow(true)} className="input-group-text cursor-pointer custom-icon-btn">
            <FaFilter />
          </Button>
          <Button onClick={handleClear} style={{ fontSize: '12px' }} className="custom-btn">
            Clear Filters
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="client-rates-table">
            {/* <Row className="mb-3 justify-content-between">
              <Col md={4} className="d-flex align-items-center gap-3">
                show:
                <Form.Select value={limit} onChange={handleLimitChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </Form.Select>
              </Col>
              <Col md={8} className="d-flex align-items-center gap-3">
                entries:
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <span className="input-group-text">
                    <FaFilter onClick={() => setFilterShow(true)} className="cursor-pointer" />
                  </span>
                  <Button style={{ fontSize: '12px' }} onClick={handleClear}>
                    {' '}
                    Clear Filter/Search{' '}
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="mb-3 justify-content-between">
              <Col md={6} className="d-flex">
                <DateRangeFilter
                  setData={setData}
                  role="client"
                  setMessage={setMessage}
                  setIsFiltering={setIsFiltering}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </Col>

              <Col md={6} className="d-flex justify-content-end">
                <JsonToExcelBtn jsonData={data} fileName="Booking" />
              </Col>
            </Row> */}

            <Table className="custom-table" bordered responsive hover>
              <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                <tr>
                  <th className="text-center" onClick={() => handleSort('clientId.companyName')}>
                    Client 
                  </th>
                  <th className="text-center" onClick={() => handleSort('pickUpDetails.readyTime')}>
                    Ready Time
                  </th>
                  <th className="text-center" onClick={() => handleSort('dropOfDetails.cutOffTime')}>
                    Cuttoff Time
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
                  <th className="text-center"onClick={() => handleSort('pickUpDetails.pickupLocationId.customName')}>
                    Pickup From
                  </th>
                  <th className="text-center" onClick={() => handleSort('dropOfDetails.dropOfLocationId.customName')}>
                    Deliver To
                  </th>
                  <th className="text-center" onClick={() => handleSort('uid')}>
                    Job Id
                  </th>
                  <th className="text-center" onClick={() => handleSort('driverId.firstname')}>
                    Driver
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: '150px' }} onClick={() => handleSort('currentStatus')}>
                    Status
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: '70px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 13 }}>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center text-danger">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => {
                    const isSelected = item._id === selectedJob?._id
                    const status = item?.isHold ? 'Hold' : item?.currentStatus
                    const styles = getStatusStyles(status)
                    return (
                      <tr key={index} className="cursor-pointer">
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.clientId?.companyName}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.pickUpDetails?.readyTime)}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.dropOfDetails?.cutOffTime)}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.AWB}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.pieces}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.serviceTypeId?.text}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.serviceCodeId?.text}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.pickUpDetails?.pickupLocationId?.customName}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.dropOfDetails?.dropOfLocationId?.customName}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.uid}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {' '}
                          {item?.driverId
                            ? `${item?.driverId?.firstname}-${item?.driverId?.lastname}`
                            : ''}{' '}
                        </td>

                        <td
                          onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                            {status}
                          </div>
                        </td>
                        <td className="text-center action-dropdown-menu" style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}>
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
                                    onClick={() => handleEdit(item)} 
                                  >
                                    Edit Job
                                  </button>
                                </li>
                                {assignPermission === 'true' && !item?.driverId && (
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleShowAssign(item)}
                                    >
                                      Change Driver
                                    </button>
                                  </li>
                                )}
                                {trackPermission === 'true' && (
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => navigate(`/client/dashboard/location/${item._id}`)}
                                    >
                                      Package Location
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        {/* <td
                          className="text-center cursor-pointer "
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.currentStatus === 'Pending' ? (
                            <FaRegEdit className="text-primary" onClick={() => handleEdit(item)} />
                          ) : (
                            ''
                          )}
                        </td>
                        <td className="text-center cursor-pointer">

                                                        <FaEye className="text-success" onClick={() => handleView(item)} />
                                                    </td>
                        {assignPermission === 'true' ? (
                          <td
                            className="text-center cursor-pointer"
                            style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                          >
                            {!item?.driverId ? (
                              <FaTruckMoving onClick={() => handleShowAssign(item)} />
                            ) : (
                              ''
                            )}
                          </td>
                        ) : (
                          ''
                        )}

                        {trackPermission === 'true' ? (
                          <td
                            className="text-center cursor-pointer"
                            style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                          >
                            <FaMapMarkedAlt
                              className="text-primary"
                              onClick={() => navigate(`/client/dashboard/location/${item._id}`)}
                            />
                          </td>
                        ) : (
                          ''
                        )} */}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Row className="mb-3 justify-content-between">
        <Col md={6} className="d-flex align-items-center gap-2 ">
          Show Entries
          <Col md={2}>
            <Form.Select value={limit} onChange={handleLimitChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </Form.Select>
          </Col>
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-lg-end mt-3 mt-lg-0">
          <MyPagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>

      {show ? (
        <EditJob
          show={show}
          handleClose={handleClose}
          job={selectedJob}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}
      {showView ? <ViewJobs show={showView} handleClose={handleCloseView} job={selectedJob} /> : ''}
      {showAssign && !selectedJob?.driverId ? (
        <AssignDriverModal
          show={showAssign}
          setShow={setShowAssign}
          jobId={selectedJob._id}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}
      <FilterOffCanvas
        show={filterShow}
        handleClose={handleFilterClose}
        onApplyFilter={(selectedOption) => handleSearchClick(searchTerm, selectedOption)}
        role={'client'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  )
}

export default AllJobs
