import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FaEye, FaRegEdit, FaSyncAlt } from 'react-icons/fa'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { Button, Col, Pagination, Row, Table, Tabs, Tab } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import EditJob from '../../components/Modals/EditJob'
import ViewJobs from '../../components/Modals/ViewJobs'
import { get } from '../../lib/request'
import { Spinner } from 'react-bootstrap'
import { FaTruckMoving, FaMapMarkedAlt } from 'react-icons/fa'
import { getCurrentDate, getFormattedDAndT, utcToMelbourne } from '../../lib/getFormatedDate'
import AssignDriverModal from '../../components/Modals/AssignDriver'
import DateRangeFilter from '../../components/DateRangeFilter'
import getStatusStyles from '../../services/getStatusColor'
import { LuChevronDown } from 'react-icons/lu'
import sortData from '../../services/sortData'
import { FaFilter } from 'react-icons/fa'
import { BsThreeDotsVertical } from 'react-icons/bs'
import FilterOffCanvas from '../../components/Filter'
import FilterTags from '../../components/FilterTags'
import { getSeachFilterResult } from '../../services/getSearchFilterResult'
import moment from 'moment'

const Dashboard = () => {
  let trackPermission = localStorage.getItem('clientTrackPermission')
  let assignDriverP = localStorage.getItem('clientDriverAssign')
  console.log(trackPermission);

  const currentDate = getCurrentDate();
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [showView, setShowView] = useState(false)
  // const [data, setData] = useState([])
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [message, setMessage] = useState('')
  const [isReferesh, setIsReferesh] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const searchQuery = useSelector((state) => state.searchQuery)
  const [activeTab, setActiveTab] = useState("todaysJob");
  const [selectedItem, setSelectedItem] = useState(location.state?.selectedItem || {})

  // useEffect(() => {
  //   setActiveTab("todaysJob");
  // }, []);

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

  const handleTabSelect = (key) => {
    setActiveTab(key);
    // handleClear();
    // setMessage('')
    // setIsReferesh(!isReferesh);
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

  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery',
      payload: query,
    })
  }

  const handleSearchClick = () => {
    setShowCanvas(false);

    let payload = { ...searchQuery };

    if (activeTab === 'todaysJob') {
      payload.fromDate = moment().format("YYYY-MM-DD");
      payload.toDate = moment().format("YYYY-MM-DD");
    }

    getSeachFilterResult(payload, "client")
      .then((res) => {
        onSearch(res);
        handleClose();
      })
      .catch((err) => {
        console.error('Filter API Error:', err);
      });

  };

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [showCanvas, setShowCanvas] = useState(false)
  const handleShowFilter = () => setShowCanvas(true);
  const handleCloseCanvas = () => setShowCanvas(false)

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

  // handle assign driver modal
  const handleShowAssign = (item) => {
    setSelectedJob(item)
    setShowAssign(true)
  }

  const handleTodayJobs = () => {
    setLoading(true);
    get(`/client/jobFilter?fromDate=${currentDate}&toDate=${currentDate}`, 'client').then(
      (response) => {
        if (response?.data?.status) {
          if (response?.data?.data?.length === 0) {
            setMessage('No data found')
          }
          // setData(response?.data?.data);
          dispatch({
            type: 'getJobData',
            // payload: response?.data?.data?.jobs,
            payload: response?.data?.data?.jobs
          });
          setLoading(false)
        }
      },
    )
  }

  // get initial data
  const getInitialData = () => {
    setLoading(true);
    get(`/client/jobFilter?currentStatus=Un-Delivered`, 'client')
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
          setLoading(false);
          setMessage('');
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    if (activeTab === 'allJobs') {
      getInitialData();
    } else if (activeTab === 'todaysJob') {
      handleTodayJobs();
    }
  }, [activeTab])

  const handleClear = (key) => {
    setMessage('')
    setIsReferesh(!isReferesh);
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

    if (activeTab === 'allJobs') {
      getInitialData();
    } else {
      handleTodayJobs();
    }
  }

  // handle sort
  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    setData(sortedData)
  }

  useEffect(() => {
    // Retrieve the selected item from local storage if it exists
    const storedSelectedItem = sessionStorage.getItem('selectedItem')
    if (storedSelectedItem) {
      setSelectedJob(JSON.parse(storedSelectedItem))
    }
  }, [])

  // handle Filter
  const handleFilterClose = () => {
    setFilterShow(false)
  }

  const handleRefresh = (filterObj, tagRemove) => {
    setLoading(true)
    setMessage('');
    let queryParams = [];

    console.log('not to remove tag')
    if (!tagRemove) {
      handleClear();
      // dispatch({
      // 	type: 'updateSearchQuery',
      // 	payload: {
      // 		AWB: "",
      // 		clientId: "",
      // 		driverId: "",
      // 		fromDate: "",
      // 		toDate: "",
      // 		currentStatus: "",
      // 		serviceCode: "",
      // 		serviceType: '',
      // 		serviceCodeId: '',
      // 		serviceTypeId: '',
      // 		jobId: "",
      // 		clientName: "",
      // 		driverName: "",
      // 		transferJob: false
      // 	},
      // });
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
      if (filter.transferJob) queryParams.push(`transferJob=${filter.transferJob}`)

      const query = queryParams.join('&');

      // if (activeTab === 'todaysJob') {
      // 	handleTodayJobs();
      // } else {
      get(`/admin/info/jobFilter?${query}`, 'client')
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
      // }
    }
  }

  return (
    <>
      <Row className="d-flex pb-3 align-items-center justify-content-between">
        <Col lg={2} className="m-0">
          {/* <SearchBar
            onSearch={onSearch}
            role="client"
            handleClear={handleClear}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          /> */}
          <h3>Dashboard</h3>
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
            // setData={setData}
            activeTab={activeTab}
            role="client"
            setMessage={setMessage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Button onClick={handleShowFilter} className="input-group-text cursor-pointer custom-icon-btn">
            <FaFilter />
          </Button>
          <Button onClick={handleClear} style={{ fontSize: '12px' }} className="custom-btn">
            Clear Filters
          </Button>
        </Col>
      </Row>
      <FilterOffCanvas
        show={showCanvas}
        handleClose={handleCloseCanvas}
        onApplyFilter={() => handleSearchClick()}
        role={'client'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {Object.values(searchQuery).some((v) => v) && (
        <div className="filter-container">
          <FilterTags searchQuery={searchQuery} onRemoveFilter={handleRemoveFilter} />
        </div>
      )}

      <div className="client-rates-table">
        <Tabs activeKey={activeTab} onSelect={handleTabSelect} defaultActiveKey="todaysJob" id="todays-job" className="mb-3 custom-tabs">
          {/* Today's Job Tab */}
          <Tab eventKey="todaysJob" title="Today's Jobs" className="client-rates-table">
            <div className="table-responsive">
              <Table responsive hover className="custom-table">
                <thead>
                  <tr style={{ fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    <th className="text-center" onClick={() => handleSort('clientId.companyName')}>
                      Client
                    </th>
                    <th className="text-center" onClick={() => handleSort('pickUpDetails.readyTime')}>
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
                    <th className="text-center onClick={() => handleSort('uid')}">
                      Job ID
                    </th>
                    <th className="text-center" onClick={() => handleSort('driverId.firstname')}>
                      Driver
                    </th>
                    <th className="text-center" style={{ width: 'auto', minWidth: '150px' }} onClick={() => handleSort('currentStatus')}>
                      Status
                    </th>
                    <th className="text-center" style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
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
                          fontSize: 14,
                          textAlign: 'left',
                        };

                        return (
                          <tr key={index} className="cursor-pointer">
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.clientId?.companyName}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {utcToMelbourne(item?.pickUpDetails?.readyTime)}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {utcToMelbourne(item?.dropOfDetails?.cutOffTime)}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.AWB}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.pieces}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.serviceTypeId?.text}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.serviceCodeId?.text}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.pickUpDetails?.pickupLocationId?.customName}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.dropOfDetails?.dropOfLocationId?.customName}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.uid}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              {item?.driverId ? `${item.driverId.firstname}-${item.driverId.lastname}` : ''}
                            </td>
                            <td onClick={() => handleView(item)} style={tdStyle}>
                              <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                                {status}
                              </div>
                            </td>
                            {/* <td className="text-center" style={tdStyle}>
                          {!item?.driverId ? (
                            <FaTruckMoving onClick={() => handleShowAssign(item)} />
                          ) : (
                            <FaExchangeAlt onClick={() => handelChangeDriver(item)} />
                          )}
                        </td>
                        <td className="text-center" style={tdStyle}>
                          <FaMapMarkedAlt className="text-primary" onClick={() => navigate(`/location/${item._id}`)} />
                        </td> */}
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
                                      onClick={() => handleEdit(item)}
                                    >
                                      Edit Job
                                    </button>
                                  </li>
                                  {assignDriverP === 'true' && (
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => {
                                          handleShowAssign(item)
                                        }}
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
                          </tr>
                        );
                      }) :
                      <tr>
                        <td colSpan={14} className="text-center text-danger">No data found</td>
                      </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>

          {/* All Jobs Tab */}
          <Tab eventKey="allJobs" title="All Jobs" className="client-rates-table">
            <div className="table-responsive">
              <Table className="custom-table" responsive hover>
                <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  <tr>
                    <th className="text-center" onClick={() => handleSort('clientId.companyName')}>
                      Client
                      {/* <LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                  /> */}
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
                <tbody style={{ fontSize: '13px' }}>
                  {loading ? (
                    <tr>
                      <td colSpan={14} className="text-center"><Spinner animation="border" variant="primary" /></td>
                    </tr>
                  ) : (
                    data?.length > 0 ?
                      data?.map((item, index) => {
                        const isSelected = item._id === selectedJob?._id
                        const status = item?.isHold ? 'Hold' : item?.currentStatus
                        const styles = getStatusStyles(status)
                        const tdStyle = {
                          backgroundColor: isSelected ? '#E0E0E0' : 'transparent',
                          fontSize: 14,
                          textAlign: 'left',
                        };

                        return (
                          <tr key={index} className='cursor-pointer' >
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
                              {utcToMelbourne(item?.pickUpDetails?.readyTime)}
                            </td>
                            <td
                              onClick={() => handleView(item)}
                              className="text-center"
                              style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                            >
                              {utcToMelbourne(item?.dropOfDetails?.cutOffTime)}
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
                              className="text-center"
                              style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                            >
                              <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                                {status}
                              </div>
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
                                      onClick={() => handleEdit(item)}
                                    >
                                      Edit Job
                                    </button>
                                  </li>
                                  {assignDriverP === 'true' && (
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => {
                                          handleShowAssign(item)
                                        }}
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
                      <td
                        className="text-center cursor-pointer"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {assignDriverP === 'true' ? (
                          <FaTruckMoving onClick={() => handleShowAssign(item)} />
                        ) : (
                          ''
                        )}
                      </td>
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
                      }) :
                      <tr>
                        <td colSpan={14} className="text-center text-danger">No data found</td>
                      </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* <div className="client-rates-table">
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={10}>
              <h4 id="traffic" className="card-title mb-0">
                Jobs
              </h4>
            </CCol>
            <CCol sm={2} className="d-flex justify-content-end">
              <CButton color="primary" style={{ fontSize: '12px' }} onClick={handleTodayJobs}>
                Today's Jobs
              </CButton>
            </CCol>
          </CRow>

          <Table className="custom-table mt-3" responsive hover>
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
                <th className="text-center" onClick={() => handleSort('currentStatus')}>
                  Status
                </th>
                <th className="text-center" colSpan={4}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              {message ? (
                <tr>
                  {' '}
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
                data &&
                data.map((item, index) => {
                  const isSelected = item._id === selectedJob?._id
                  const status = item?.isHold ? 'Hold' : item?.currentStatus
                  const styles = getStatusStyles(status)
                  return (
                    <tr key={index} className='cursor-pointer' >
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
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                          {status}
                        </div>
                      </td>
                      <td
                        className="text-center cursor-pointer "
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.currentStatus === 'Pending' ? (
                          <FaRegEdit className="text-primary" onClick={() => handleEdit(item)} />
                        ) : (
                          ''
                        )}
                      </td>
                      <td
                        className="text-center cursor-pointer"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {assignDriverP === 'true' ? (
                          <FaTruckMoving onClick={() => handleShowAssign(item)} />
                        ) : (
                          ''
                        )}
                      </td>
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
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </CCardBody>
      </CCard>
      </div> */}

      {show ? (
        <EditJob
          show={show}
          handleClose={handleClose}
          job={selectedJob}
          setIsRefresh={setIsReferesh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}

      {showAssign ? (
        <AssignDriverModal
          show={showAssign}
          setShow={setShowAssign}
          jobId={selectedJob._id}
          setIsRefresh={setIsReferesh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}

    </>
  )
}

export default Dashboard
