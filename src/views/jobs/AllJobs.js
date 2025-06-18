/* eslint-disable react/react-in-jsx-scope */
import { FaTruckMoving, FaEye, FaMapMarkedAlt, FaFilter } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { get } from '../../lib/request'
import { getTotalDocs } from '../../services/getTotalDocs'
import MyPagination from '../../components/Pagination'
import { Button, Col, Container, Form, Row, Table, Modal, Spinner } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import AssignDriverModal from '../../components/Modals/AssignDriver'
import FilterOffCanvas from '../../components/Filter'
import { getSeachFilterResult } from '../../services/getSearchFilterResult'
import { FaExchangeAlt } from 'react-icons/fa'
import ChangeDriverModal from '../../components/Modals/ChangeDriver'
import JsonToExcelBtn from '../../components/operations/JsonToExcelBtn'
import DateRangeFilter from '../../components/DateRangeFilter'
import getStatusStyles from '../../services/getStatusColor'
import sortData from '../../services/sortData'
import { LuChevronDown } from 'react-icons/lu'
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getFormattedDAndT } from '../../lib/getFormatedDate'
import { FaSyncAlt, FaRegCommentAlt } from 'react-icons/fa'
import { BsThreeDotsVertical } from 'react-icons/bs'
import FilterTags from '../../components/FilterTags'

const AllJobs = () => {
  const dispatch = useDispatch()
  const searchQuery = useSelector((state) => state.searchQuery2)
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [message, setMessage] = useState(null)
  const handleShow = () => setShowCanvas(true);

  const [selectedJob, setSelectedJob] = useState(null)

  const [showAssign, setShowAssign] = useState(false)
  const [showChangeDriver, setShowChangeDriver] = useState(false)
  const [filterShow, setFilterShow] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery2',
      payload: query,
    })
  }


  // handle view
  const handleView = (item) => {
    sessionStorage.setItem('selectedItem', JSON.stringify(item))
    navigate(`/client/job/details/${item._id}`, { state: { selectedItem: item } })
  }

  // handle assign driver modal
  const handleShowAssign = (item) => {
    setSelectedJob(item)
    setShowAssign(true)
  }

  const handelChangeDriver = (item) => {
    setSelectedJob(item)
    setShowChangeDriver(true)
  }

  // handle Filter
  const handleFilterClose = () => {
    setFilterShow(false)
  }
  const handleSearchClick = (selectedOption) => {
    setShowCanvas(false);

    let payload = { ...searchQuery };

    console.log('payload', payload);

    if (activeTab === 'todaysJob') {

      payload.fromDate = moment().format("YYYY-MM-DD");
      payload.toDate = moment().format("YYYY-MM-DD");

    }
    getSeachFilterResult(payload, "admin")
      .then((res) => {
        onSearch(res);
        // handleClose();
      })
      .catch((err) => {
        console.error('Filter API Error:', err);
      });
  }

  const onSearch = (newData) => {
    setMessage('')
    if (newData.length === 0) {
      setMessage('No data found')
    }
    // setData(newData)
    dispatch({
      type: 'getJobData',
      payload: newData,
    });
  }

  // fetch data
  const fetchData = () => {
    // setLoading(true);
    get(`/admin/info/allJobs?page=${page}&limit=${limit}`, 'admin')
      .then((response) => {
        setData(response?.data?.data)
        setLoading(false);
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    getTotalDocs('JOB', 'admin')
      .then((data) => {
        setTotalDocs(data)
        setTotalPages(Math.ceil(data / limit))
      })
      .catch((e) => {
        console.log('error while getting total docs', e.message)
      })
  }, [isReferesh])

  useEffect(() => {
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
      getSeachFilterResult(searchQuery, 'admin').then((res) => {
        setData(res)
      })
      return
    }
    fetchData()
    // const intervalId = setInterval(fetchData, 3000)
    // return () => clearInterval(intervalId)
  }, [page, limit, isReferesh, isFiltering])

  const handlePageChange = (page) => {
    handleClear();
    setPage(page)
  }

  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    setTotalPages(Math.ceil(totalDocs / e.target.value))
    setPage(1);
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
    })
    setSearchTerm('')
    setIsFiltering(false)
  }

  // handle search
  const debouncedSearch = useCallback(
    debounce((val) => {
      setIsFiltering(true);
      let url = `/admin/info/search-string/${val}`;
      get(url, 'admin').then((res) => {
        if (res.data.status) {
          setData(res.data.data);
        }
      });
    }, 1000), // Wait 1 second after typing stops
    []
  );

  const handleSearch = (val) => {
    setSearchTerm(val);
    debouncedSearch(val);
  };


  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    console.log('sortedData', sortedData)
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


  const handleRefresh = (filterObj, tagRemove) => {
    setLoading(true)
    setMessage('');
    let queryParams = [];

    if (!tagRemove) {
      handleClear();
      dispatch({
        type: 'searchQuery2',
        payload: {
          AWB: "",
          clientId: "",
          driverId: "",
          fromDate: "",
          toDate: "",
          currentStatus: "",
          serviceCode: "",
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
      if (filter.serviceTypeId) queryParams.push(`driverName=${filter.serviceTypeId}`)
      if (filter.serviceCodeId) queryParams.push(`driverName=${filter.serviceCodeId}`)

      const query = queryParams.join('&');

      if (activeTab === 'todaysJob') {
        handleTodayJobs();
      } else {
        get(`/admin/info/jobFilter?${query}`, 'admin')
          .then((response) => {
            if (response?.data?.status) {
              if (response?.data?.data?.length === 0) {
                setMessage('No data found')
              }
              // setData(response?.data?.data)
              dispatch({
                type: 'getJobData',
                payload: response?.data?.data,
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
  }

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

    // Also remove IDs linked with names
    // if (key === 'clientName') delete updatedQuery.clientId;
    // if (key === 'driverName') delete updatedQuery.driverId;
    // if (key === 'currentStatus') delete updatedQuery.currentStatus;

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

  return (
    <>
      <Row className="d-flex pb-3 align-items-center justify-content-between">
        <Col lg={2} className="m-0">
          <h3>All Bookings</h3>
        </Col>

        <Col lg={10} className="d-flex flex-wrap justify-content-start justify-content-md-end align-items-center gap-3 mt-3 mt-md-0">
          <Button
            variant="dark"
            className="input-group-text cursor-pointer custom-icon-btn"
            onClick={handleRefresh}
          >
            <FaSyncAlt />
          </Button>
          <DateRangeFilter
            setData={setData}
            role="admin"
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
              <Col className="d-flex align-items-center gap-3">
                Show:
                <Form.Select className="entries-dropdown" value={limit} onChange={handleLimitChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </Form.Select>
                Entries
              </Col>
              <Col md={8} className="d-flex align-items-center gap-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Job Id or AWB"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <span className="input-group-text cursor-pointer" onClick={() => setFilterShow(true)} >
                    <FaFilter/>
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
                  role="admin"
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
            {Object.values(searchQuery).some((v) => v) && (
              <div className="filter-container">
                <FilterTags searchQuery={searchQuery} onRemoveFilter={handleRemoveFilter} />
              </div>
            )}
            <Table className="custom-table" bordered responsive hover>
              <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                <tr>
                  <th className="text-start" onClick={() => handleSort('clientId.companyName')}>
                    Client
                  </th>
                  <th className="text-start" onClick={() => handleSort('pickUpDetails.readyTime')}>
                    Ready Time
                  </th>
                  <th className="text-start" onClick={() => handleSort('dropOfDetails.cutOffTime')}>
                    Cutoff Time
                  </th>
                  <th className="text-start" onClick={() => handleSort('AWB')}>
                    AWB
                  </th>
                  <th className="text-start" style={{ width: 'auto', minWidth: '100px' }} onClick={() => handleSort('pieces')}>
                    Pieces
                  </th>
                  <th className="text-start" onClick={() => handleSort('serviceTypeId.text')}>
                    Service Type
                  </th>
                  <th className="text-start" onClick={() => handleSort('serviceCodeId.text')}>
                    Service Code
                  </th>
                  <th className="text-start" onClick={() => handleSort('pickUpDetails.pickupLocationId.customName')}>
                    Pickup From
                  </th>
                  <th className="text-start" onClick={() => handleSort('dropOfDetails.dropOfLocationId.customName')}>
                    Deliver To
                  </th>
                  {/* <th className="text-start" onClick={() => handleSort('uid')}>
                    Job Id
                  </th> */}
                  <th className="text-start" onClick={() => handleSort('driverId.firstname')}>
                    Driver
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: '100px' }} onClick={() => handleSort('notes')}>
                    Notes
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: '120px' }} onClick={() => handleSort('currentStatus')}>
                    Status
                  </th>
                  <th className="text-center" style={{ width: 'auto', minWidth: '120px' }} colSpan={4}>
                    Action
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
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.clientId?.companyName}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.pickUpDetails?.readyTime)}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.dropOfDetails?.cutOffTime)}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.AWB}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.pieces}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.serviceTypeId?.text}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.serviceCodeId?.text}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.pickUpDetails?.pickupLocationId?.customName}
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.dropOfDetails?.dropOfLocationId?.customName}
                        </td>
                        {/* <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.uid}
                        </td> */}
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {' '}
                          {item?.driverId
                            ? `${item?.driverId?.firstname}-${item?.driverId?.lastname}`
                            : ''}{' '}
                        </td>
                        <td className="text-center"
                          onClick={() => handleView(item)} style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}>
                          <FaRegCommentAlt size={20} color={'#0074A8'} />
                        </td>
                        <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                            {status}
                          </div>
                        </td>
                        <td className="text-center action-dropdown-menu"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
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
                                  onClick={() => {
                                    item?.driverId ? handelChangeDriver(item) : handleShowAssign(item)
                                  }}
                                >
                                  {item?.driverId ? 'Change Driver' : 'Assign Driver'}
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/location/${item._id}`)}
                                >
                                  Package Location
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                        {/* <td className="text-start cursor-pointer"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {!item?.driverId ? (
                            <FaTruckMoving onClick={() => handleShowAssign(item)} />
                          ) : (
                            <FaExchangeAlt onClick={() => handelChangeDriver(item)} />
                          )}
                        </td>

                        <td
                          className="text-center cursor-pointer"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          <FaMapMarkedAlt
                            className="text-primary"
                            onClick={() => navigate(`/location/${item?._id}`)}
                          />
                        </td> */}
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
            <Form.Select
              value={limit}
              onChange={handleLimitChange}
            >
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
      {/* <div className="d-flex justify-content-center mt-4">
        <div className="text-center w-100" style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <MyPagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
        </div>
      </div> */}
      {showAssign ? (
        <AssignDriverModal
          show={showAssign}
          setShow={setShowAssign}
          jobId={selectedJob._id}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
        />
      ) : (
        ''
      )}
      {showChangeDriver ? (
        <ChangeDriverModal
          show={showChangeDriver}
          setShow={setShowChangeDriver}
          jobId={selectedJob._id}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
        />
      ) : (
        ''
      )}
      <FilterOffCanvas
        show={filterShow}
        handleClose={handleFilterClose}
        onApplyFilter={(selectedOption) => handleSearchClick(selectedOption)}
        role={'admin'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  )
}

export default AllJobs
