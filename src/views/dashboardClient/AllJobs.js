import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Container, Form, Row, Spinner, Table, Modal, Button, Tabs, Tab } from 'react-bootstrap'
import { FaSearch, FaRegEdit, FaEye, FaTruckMoving, FaMapMarkedAlt, FaFilter } from 'react-icons/fa'
import { get, postWihoutMediaData } from '../../lib/request'
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
import Swal from 'sweetalert2'
import FilterTags from '../../components/FilterTags'
import moment from 'moment'

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
  // const [data, setData] = useState([]);
  const data = useSelector((state) => state.data);
  const [isFiltering, setIsFiltering] = useState(false)
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState("allJobs");

  const [selectedJob, setSelectedJob] = useState(null)

  const [show, setShow] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showAssign, setShowAssign] = useState(false)

  const [filterShow, setFilterShow] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCanvas, setShowCanvas] = useState(false);
  const searchQuery = useSelector((state) => state.searchQuery);
  const jobsCount = useSelector((state) => state.jobsCount)
  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery',
      payload: query,
    })
  }

  const handleClose = () => setShow(false)

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
    setShowCanvas(false);
  }

  const handleTabSelect = (key) => {
    setActiveTab(key);
    setSearchQuery({
      AWB: '',
      clientId: '',
      driverId: '',
      fromDate: '',
      toDate: '',
      currentStatus: '',
      serviceCode: '',
      jobId: '',
      clientName: '',
      driverName: '',
      serviceType: '',
      serviceCode: '',
      serviceTypeId: '',
      serviceCodeId: ''
    });
  };

  useEffect(() => {
    setTotalPages(Math.ceil(jobsCount / limit))
  }, [limit, jobsCount])

  useEffect(() => {
    fetchData()
  }, [page, limit]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const onSearch = (newData) => {
    setMessage('')
    if (newData.length === 0) {
      setMessage('No data found')
    }
    // setData(newData)
    dispatch({
      type: 'getJobData',
      payload: newData?.jobs,
    });
  }

  const handleSearchClick = (searchTerm, selectedOption) => {

    setShowCanvas(false);

    let payload = { ...searchQuery };

    getSeachFilterResult(payload, "client")
      .then((res) => {
        onSearch(res);
        handleClose();
      })
      .catch((err) => {
        console.error('Filter API Error:', err);
      });
  }

  // New
  const handleClear = (key) => {
    setMessage('')
    setIsRefresh(!isReferesh);
    setSearchQuery({
      AWB: '',
      clientId: '',
      driverId: '',
      fromDate: '',
      toDate: '',
      currentStatus: '',
      serviceCode: '',
      jobId: '',
      clientName: '',
      driverName: '',
      serviceType: '',
      serviceCode: '',
      serviceTypeId: '',
      serviceCodeId: ''
    });

    // setActiveTab(activeTab);

    // if (activeTab === 'allJobs') {
    //   getInitialData();
    // } else {
    //   handleTodayJobs();
    // }
  }

  // fetch data
  const fetchData = (filterObj) => {
    setLoading(true);

    let filter = filterObj || searchQuery;

    if (Object.values(filter).every(value => value === null)) {
      get(`/client/jobFilter?page=${page}&limit=${limit}`, 'client')
        .then((response) => {
          // setData(response?.data?.data)
          dispatch({
            type: 'getJobData',
            payload: response?.data?.data?.jobs,
          });
          dispatch({
            type: 'setJobCount',
            payload: response?.data?.data?.totalCount,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
        });
    } else {

      let queryParams = [];

      if (filter.currentStatus)
        queryParams.push(`currentStatus=${filter.currentStatus}`)
      if (filter.clientId) queryParams.push(`clientId=${filter.clientId}`)
      if (filter.driverId) queryParams.push(`driverId=${filter.driverId}`)
      if (filter.fromDate) queryParams.push(`fromDate=${filter.fromDate}`)
      if (filter.toDate) queryParams.push(`toDate=${filter.toDate}`)
      if (filter.jobId) queryParams.push(`jobId=${filter.jobId}`)
      if (filter.clientName) queryParams.push(`clientName=${filter.clientName}`)
      if (filter.driverName) queryParams.push(`driverName=${filter.driverName}`)
      if (filter.serviceTypeId) queryParams.push(`serviceTypeId=${filter.serviceTypeId}`)
      if (filter.serviceCodeId) queryParams.push(`serviceCodeId=${filter.serviceCodeId}`)

      const query = queryParams.join('&');

      get(`/client/jobFilter?${query}&page=${page}&limit=${limit}`, 'client')
        .then((response) => {
          if (response?.data?.status) {
            if (response?.data?.data?.length === 0) {
              setMessage('No data found')
            }
            // setData(response?.data?.data)
            dispatch({
              type: 'getJobData',
              payload: response?.data?.data?.jobs,
            });
            dispatch({
              type: 'setJobCount',
              payload: response?.data?.data?.totalCount,
            });
            setLoading(false)
          }
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
        })
    }
  }

  const getJobTransferRequests = () => {
    get(`/client/transfer-job-requests`, 'client')
      .then((response) => {
        // setData(response?.data?.data)
        dispatch({
          type: 'getJobData',
          payload: response?.data?.data,
        });
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (activeTab === 'allJobs') {
      fetchData();
    } else if (activeTab === 'jobRequest') {
      getJobTransferRequests();
    }
  }, [activeTab]);

  // useEffect(() => {
  //   if (isFiltering) {
  //     return
  //   } else if (
  //     searchQuery.currentStatus ||
  //     searchQuery.clientId ||
  //     searchQuery.driverId ||
  //     searchQuery.fromDate ||
  //     searchQuery.toDate ||
  //     searchQuery.jobId ||
  //     searchQuery.clientName ||
  //     searchQuery.driverName
  //   ) {
  //     getSeachFilterResult(searchQuery, 'client').then((res) => {
  //       // setData(res)
  //       dispatch({
  //         type: 'getJobData',
  //         payload: res?.jobs,
  //       });
  //     })
  //     return
  //   }

  //   fetchData()

  //   // const intervalId = setInterval(fetchData, 3000)

  //   // return () => clearInterval(intervalId)
  // }, [page, limit, isReferesh, isFiltering])

  const handlePageChange = (page) => {
    setPage(page)
  }

  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    setTotalPages(Math.ceil(jobsCount / e.target.value));
    setPage(1);
  }

  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    setIsFiltering(true)
    // setData(sortedData)
    dispatch({
      type: 'getJobData',
      payload: sortedData,
    });
  }

  useEffect(() => {
    // Retrieve the selected item from local storage if it exists
    const storedSelectedItem = sessionStorage.getItem('selectedItem')
    if (storedSelectedItem) {
      setSelectedJob(JSON.parse(storedSelectedItem))
    }
  }, [])

  // Old
  // const handleRefresh = () => {
  //   setLoading(true)
  //   setMessage('')

  //   let queryParams = []

  //   if (searchQuery.currentStatus)
  //     queryParams.push(`currentStatus=${searchQuery.currentStatus}`)
  //   if (searchQuery.clientId) queryParams.push(`clientId=${searchQuery.clientId}`)
  //   if (searchQuery.driverId) queryParams.push(`driverId=${searchQuery.driverId}`)
  //   if (searchQuery.fromDate) queryParams.push(`fromDate=${searchQuery.fromDate}`)
  //   if (searchQuery.toDate) queryParams.push(`toDate=${searchQuery.toDate}`)
  //   if (searchQuery.jobId) queryParams.push(`jobId=${searchQuery.jobId}`)
  //   if (searchQuery.clientName) queryParams.push(`clientName=${searchQuery.clientName}`)
  //   if (searchQuery.driverName) queryParams.push(`driverName=${searchQuery.driverName}`)

  //   const query = queryParams.join('&')

  //   get(`/admin/info/jobFilter?${query}`, 'admin')
  //     .then((response) => {
  //       if (response?.data?.status) {
  //         if (response?.data?.data?.length === 0) {
  //           setMessage('No data found')
  //         }
  //         setData(response?.data?.data)
  //         setLoading(false)
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //       setLoading(false)
  //     })
  // }

  const handleRemoveFilter = (key) => {
    // const updatedQuery = { ...searchQuery };
    // const updatedQuery = { ...searchQuery, [key]: '' };
    // delete updatedQuery[key];

    const filterObj = searchQuery;

    filterObj[key] = '';

    dispatch({
      type: 'updateSearchQuery',
      payload: { [key]: '' },
    });

    if (key === 'clientName') {
      dispatch({
        type: 'updateSearchQuery',
        payload: { clientId: '' },
      });
      filterObj['clientId'] = '';
    }

    if (key === 'driverName') {
      dispatch({
        type: 'updateSearchQuery',
        payload: { driverId: '' },
      });
      filterObj['driverId'] = '';
    }

    if (key === 'currentStatus') {
      dispatch({
        type: 'updateSearchQuery',
        payload: { currentStatus: '' },
      });
      filterObj['currentStatus'] = '';
    }

    if (key === 'serviceType') {
      dispatch({
        type: 'updateSearchQuery',
        payload: { serviceTypeId: '' },
      });
      filterObj['serviceTypeId'] = '';
    }

    if (key === 'serviceCode') {
      dispatch({
        type: 'updateSearchQuery',
        payload: { serviceCodeId: '' },
      });
      filterObj['serviceCodeId'] = '';
    }

    handleRefresh(filterObj, true);
  }

  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShow = () => setShowCanvas(true);

  // New 
  const handleRefresh = (filterObj, tagRemove) => {
    setLoading(true)
    setMessage('');
    let queryParams = [];

    if (!tagRemove) {
      handleClear();
      dispatch({
        type: 'updateSearchQuery',
        payload: {
          AWB: "",
          clientId: "",
          driverId: "",
          fromDate: "",
          toDate: "",
          currentStatus: "",
          serviceCode: "",
          serviceType: '',
          serviceCodeId: '',
          serviceTypeId: '',
          jobId: "",
          clientName: "",
          driverName: ""
        },
      });
    } else {

      let filter = filterObj || searchQuery;

      if (filter.currentStatus)
        queryParams.push(`currentStatus=${filter.currentStatus}`)
      if (filter.clientId) queryParams.push(`clientId=${filter.clientId}`)
      if (filter.driverId) queryParams.push(`driverId=${filter.driverId}`)
      if (filter.fromDate) queryParams.push(`fromDate=${filter.fromDate}`)
      if (filter.toDate) queryParams.push(`toDate=${filter.toDate}`)
      if (filter.jobId) queryParams.push(`jobId=${filter.jobId}`)
      if (filter.clientName) queryParams.push(`clientName=${filter.clientName}`)
      if (filter.driverName) queryParams.push(`driverName=${filter.driverName}`)
      if (filter.serviceTypeId) queryParams.push(`serviceTypeId=${filter.serviceTypeId}`)
      if (filter.serviceCodeId) queryParams.push(`serviceCodeId=${filter.serviceCodeId}`)

      const query = queryParams.join('&');

      get(`/client/jobFilter?${query}`, 'client')
        .then((response) => {
          if (response?.data?.status) {
            if (response?.data?.data?.length === 0) {
              setMessage('No data found')
            }
            // setData(response?.data?.data)
            // const responseData = setJobsData(response?.data?.data?.jobs);
            dispatch({
              type: 'getJobData',
              payload: response?.data?.data?.jobs,
            });
            setLoading(false)
          }
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
        })
    }
  }

  const handleJobAccept = (item) => {
    const data = {
      job_id: item._id
    }
    postWihoutMediaData('/client/acceptJob', data, "client")
      .then((response) => {
        if (response.data.status) {
          Swal.fire({
            icon: 'success',
            title: 'Job has been accepted successfully!',
          });
          // handleClose();
          getJobTransferRequests();

        }
      })
  }

  const handleJobDecline = (item) => {
    const data = {
      job_id: item._id
    }
    postWihoutMediaData('/client/declineJob', data, "client")
      .then((response) => {
        if (response.data.status) {
          Swal.fire({
            icon: 'success',
            title: 'Job has been declined successfully!',
          });
          // handleClose();
          getJobTransferRequests();

        }
      })
  }

  return (
    <>
      <Row className="d-flex pb-3 align-items-center justify-content-between">
        <Col lg={activeTab === 'allJobs' ? 2 : 12} className="m-0">
          <h3>{activeTab === 'allJobs' ? 'All Bookings' : 'Job Transfer Requests'}</h3>
        </Col>

        {activeTab === 'allJobs' &&
          <Col lg={10} className="d-flex flex-wrap justify-content-start justify-content-md-end align-items-center gap-3 mt-3 mt-md-0">
            <Button
              variant="dark"
              className="input-group-text cursor-pointer custom-icon-btn"
              onClick={handleRefresh}
            >
              <FaSyncAlt />
            </Button>
            <DateRangeFilter
              // setData={setData}
              role="client"
              activeTab={activeTab}
              setMessage={setMessage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            // selectedColumns={selectedColumns}
            // setSelectedColumns={setSelectedColumns}
            // setJobsData={setJobsData}
            />
            <Button onClick={handleShow} className="input-group-text cursor-pointer custom-icon-btn">
              <FaFilter />
            </Button>
            <Button onClick={handleClear} style={{ fontSize: '12px' }} className="custom-btn">
              Clear Filters
            </Button>
          </Col>}
      </Row>

      {Object.values(searchQuery).some((v) => v) && (
        <div className="filter-container">
          <FilterTags searchQuery={searchQuery} onRemoveFilter={handleRemoveFilter} />
        </div>
      )}

      {/* <Row>
        <Col md={12}> */}
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} defaultActiveKey="allJobs" id="todays-job" className="mb-3 custom-tabs">
        {/* Today's Job Tab */}
        <Tab eventKey="allJobs" title="All Jobs" className="client-rates-table">
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
                  <th className="text-center" onClick={() => handleSort('pickUpDetails.pickupLocationId.customName')}>
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
                {data?.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center text-danger">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  data?.map((item, index) => {
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
        </Tab>

        <Tab eventKey="jobRequest" title="Job Transfer Requests" className="client-rates-table">
          <div className="table-responsive">
            <Table className="custom-table" bordered responsive hover>
              <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                <tr>
                  {/* <th className="text-center" onClick={() => handleSort('clientId.companyName')}>
                        Client
                      </th> */}
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
                  {/* <th className="text-center" onClick={() => handleSort('serviceTypeId.text')}>
                        Service Type
                      </th> */}
                  {/* <th className="text-center" onClick={() => handleSort('serviceCodeId.text')}>
                        Service Code
                      </th> */}
                  <th className="text-center" onClick={() => handleSort('pickUpDetails.pickupLocationId.customName')}>
                    Pickup From
                  </th>
                  <th className="text-center" onClick={() => handleSort('dropOfDetails.dropOfLocationId.customName')}>
                    Deliver To
                  </th>
                  <th className="text-center" onClick={() => handleSort('uid')}>
                    Job Id
                  </th>
                  {/* <th className="text-center" onClick={() => handleSort('driverId.firstname')}>
                        Driver
                      </th> */}
                  <th className="text-center" style={{ width: 'auto', minWidth: '150px' }} onClick={() => handleSort('currentStatus')}>
                    Status
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: '70px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: 13 }}>
                {data?.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center text-danger">
                      No job transfer request found
                    </td>
                  </tr>
                ) : (
                  data?.map((item, index) => {
                    const isSelected = item._id === selectedJob?._id
                    const status = item?.isHold ? 'Hold' : item?.currentStatus
                    const styles = getStatusStyles(status)
                    return (
                      <tr key={index} className="cursor-pointer">
                        {/* <td
                              onClick={() => handleView(item)}
                              className="text-center"
                              style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                            >
                              {item?.clientId?.companyName}
                            </td> */}
                        <td
                          // onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.pickUpDetails?.readyTime)}
                        </td>
                        <td
                          // onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.dropOfDetails?.cutOffTime)}
                        </td>
                        <td
                          // onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.AWB}
                        </td>
                        <td
                          // onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.pieces}
                        </td>
                        {/* <td
                              onClick={() => handleView(item)}
                              className="text-center"
                              style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                            >
                              {item?.serviceTypeId?.text}
                            </td> */}
                        {/* <td
                              onClick={() => handleView(item)}
                              className="text-center"
                              style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                            >
                              {item?.serviceCodeId?.text}
                            </td> */}
                        <td
                          // onClick={() => handleView(item)}
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
                          // onClick={() => handleView(item)}
                          className="text-center"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.uid}
                        </td>
                        {/* <td
                              onClick={() => handleView(item)}
                              className="text-center"
                              style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                            >
                              {' '}
                              {item?.driverId
                                ? `${item?.driverId?.firstname}-${item?.driverId?.lastname}`
                                : ''}{' '}
                            </td> */}

                        <td
                          // onClick={() => handleView(item)}
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
                                  onClick={() => handleJobAccept(item)}
                                >
                                  Accept Job
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleJobDecline(item)}
                                >
                                  Decline Job
                                </button>
                              </li>
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
        </Tab>
      </Tabs >
      {/* </Col>
      </Row> */}

      {activeTab === 'allJobs' &&
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
      }

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
        show={showCanvas}
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
