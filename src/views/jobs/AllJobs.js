/* eslint-disable react/react-in-jsx-scope */
import { FaTruckMoving, FaEye, FaMapMarkedAlt, FaFilter } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { get, postWihoutMediaData } from '../../lib/request'
import { getTotalDocs } from '../../services/getTotalDocs'
import MyPagination from '../../components/Pagination'
import { Button, Col, Container, Form, Row, Table, Modal, Spinner, Tabs, Tab } from 'react-bootstrap'
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
import AssignClientModal from '../../components/Modals/AssignClient'
import Swal from 'sweetalert2'
import { FaFileExcel } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

const AllJobs = () => {
    const dispatch = useDispatch()
    const searchQuery = useSelector((state) => state.searchQuery)
    const role = useSelector((state) => state.role);
    const jobsCount = useSelector((state) => state.jobsCount)
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isReferesh, setIsRefresh] = useState(false)
    // const [data, setData] = useState([])
    const data = useSelector((state) => state.data);
    const [message, setMessage] = useState(null)
    const handleShow = () => setShowCanvas(true);
    const [selectedJob, setSelectedJob] = useState(null)

    const [showAssign, setShowAssign] = useState(false);
    const [showAssignClient, setShowAssignClient] = useState(false);
    const [showChangeDriver, setShowChangeDriver] = useState(false)
    const [filterShow, setFilterShow] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFiltering, setIsFiltering] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState(['Client', 'Ready Time', 'Cutoff Time', 'AWB', 'Pieces', 'Service Type', 'Service Code', 'Pickup From', 'Deliver To', 'Driver', 'Notes', 'Status', 'Transfer Status']);
    const [activeTab, setActiveTab] = useState("allJobs");

    const setSearchQuery = (query) => {
        dispatch({
            type: 'updateSearchQuery',
            payload: query
        })
    }

    const setJobsData = (response) => {
        const finalArr = [];

        for (let data of response) {
            const obj = {};

            if (data?.adminId && data?.isTransferAccept) {
                obj.Client = data?.adminId ? data?.adminId?.firstname + " " + data?.adminId?.lastname : '-';
            } else {
                obj.Client = data?.clientId?.companyName;
            }

            obj._id = data?._id;
            // obj['Ready Time'] = data?.pickUpDetails?.readyTime;
            obj['Ready Time'] = data?.pickUpDetails?.readyTime ? getFormattedDAndT(data?.pickUpDetails?.readyTime) : "-";
            // obj['Cutoff Time'] = data?.dropOfDetails?.cutOffTime;
            obj['Cutoff Time'] = data?.dropOfDetails?.cutOffTime ? getFormattedDAndT(data?.dropOfDetails?.cutOffTime) : "-";
            obj.AWB = data?.AWB;
            obj.Pieces = data?.pieces;
            obj['Service Type'] = data?.serviceTypeId?.text;
            obj['Service Code'] = data?.serviceCodeId?.text;
            obj['Pickup From'] = data?.pickUpDetails?.pickupLocationId?.customName;
            obj['Deliver To'] = data?.dropOfDetails?.dropOfLocationId?.customName;
            obj.Driver = data?.driverId ? `${data?.driverId?.firstname}-${data?.driverId?.lastname}` : '';
            obj.Notes = data?.note;
            obj.Status = data?.isHold ? 'Hold' : data?.currentStatus;
            obj.isTransfer = data?.isTransfer;
            obj.blurJob = data?.blurJob;
            obj['Transfer To'] = data?.transferAdminId ? data?.transferAdminId?.firstname + " " + data?.transferAdminId?.lastname : '-';
            obj['Transfer Status'] = data?.isTransferAccept ? 'Accepted' : data?.isTransfer ? 'Pending' : '';

            // if (activeTab === 'allJobs' && !data.transferTab) {
            //     finalArr.push(obj);
            // } else if (activeTab === 'transferJobs' && data.transferTab) {
            //     finalArr.push(obj);
            // }

            finalArr.push(obj);

        }

        return finalArr;
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
        setFilterShow(false);
        setPage(1);

        let payload = { ...searchQuery };

        getSeachFilterResult(payload, "admin", 1, limit)
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
        const responseData = setJobsData(newData?.jobs);
        dispatch({
            type: 'getJobData',
            payload: responseData,
        });
        dispatch({
            type: 'setJobCount',
            payload: newData?.totalCount,
        });
    }

    // fetch data
    const fetchData = (filterObj) => {
        setLoading(true);

        let filter = filterObj || searchQuery;

        if (Object.values(filter).every(value => value === null)) {
            get(`/admin/info/jobFilter?page=${page}&limit=${limit}`, 'admin')
                .then((response) => {
                    // setData(response?.data?.data)
                    const responseData = setJobsData(response?.data?.data?.jobs);
                    dispatch({
                        type: 'getJobData',
                        payload: responseData,
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
            if (filter.transferJob) queryParams.push(`transferJob=${filter.transferJob}`)

            const query = queryParams.join('&');

            get(`/admin/info/jobFilter?${query}&page=${page}&limit=${limit}`, 'admin')
                .then((response) => {
                    if (response?.data?.status) {
                        if (response?.data?.data?.length === 0) {
                            setMessage('No data found')
                        }
                        // setData(response?.data?.data)
                        const responseData = setJobsData(response?.data?.data?.jobs);
                        dispatch({
                            type: 'getJobData',
                            payload: responseData,
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
        setLoading(true);
        get(`/admin/transfer-job-requests`, 'admin')
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
            setSearchQuery({
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
                driverName: "",
                transferJob: false,
                companyName: ""
            });
        } else if (activeTab === 'jobRequest') {
            getJobTransferRequests();
        }
    }, [activeTab]);

    useEffect(() => {
        setTotalPages(Math.ceil(jobsCount / limit))
    }, [limit, jobsCount])

    useEffect(() => {
        if (activeTab === 'allJobs') {
            fetchData();
        }
    }, [page, limit]);

    const handlePageChange = (page) => {
        setPage(page)
    }

    const handleLimitChange = (e) => {
        setLimit(e.target.value)
        setTotalPages(Math.ceil(jobsCount / e.target.value));
        setPage(1);
    }

    // handle search
    const debouncedSearch = useCallback(
        debounce((val) => {
            // setIsFiltering(true);
            let url = `/admin/info/search-string/${val}`;
            get(url, 'admin').then((res) => {
                if (res.data.status) {
                    // setData(res.data.data);
                    const responseData = setJobsData(res.data.data);
                    dispatch({
                        type: 'getJobData',
                        payload: responseData,
                    });
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
        // setIsFiltering(true)
        // setData(sortedData)
        const responseData = setJobsData(sortedData);
        dispatch({
            type: 'getJobData',
            payload: responseData,
        });
    }

    const handleRefresh = () => {
        setPage(1);
        setLimit(10);
        setMessage('');
        setSelectedColumns(['Client', 'Ready Time', 'Cutoff Time', 'AWB', 'Pieces', 'Service Type', 'Service Code', 'Pickup From', 'Deliver To', 'Driver', 'Notes', 'Status', 'Transfer Status']);
        // setIsRefresh(!isReferesh)
        const filter = {
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
            driverName: "",
            transferJob: false,
            companyName: ""
        }
        setSearchQuery({
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
            driverName: "",
            transferJob: false,
            companyName: ""
        });
        fetchData(filter);
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
            filterObj['companyName'] = '';
            filterObj['clientName'] = '';
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

        if (key === 'transferJob') {
            dispatch({
                type: 'updateSearchQuery',
                payload: { transferJob: false },
            });
            filterObj['transferJob'] = false;
        }

        let filter = filterObj;

        fetchData(filter);
    }

    const handleTransferJob = (item) => {
        setSelectedJob(item)
        setShowAssignClient(true);
    }

    const handleJobAccept = (item) => {
        const data = {
            job_id: item._id
        }
        postWihoutMediaData('/admin/acceptJob', data, "admin")
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
        postWihoutMediaData('/admin/declineJob', data, "admin")
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
            serviceCodeId: '',
            transferJob: false
        });
    };

    const handleDownloadExcel = () => {
        // Step 1: Add index + selected column data
        const exportData = data.map((row, index) => {
            const rowData = Object.fromEntries(
                selectedColumns.map(col => [col, row[col]])
            );
            return { '#': index + 1, ...rowData }; // prepend index
        });

        const ws = XLSX.utils.json_to_sheet(exportData);

        // Step 2: Set dynamic column widths (include index column)
        const allColumns = ['#', ...selectedColumns];
        const colWidths = allColumns.map(col => {
            const headerLength = col.length;
            const maxDataLength = exportData.reduce(
                (max, row) => Math.max(max, row[col] ? row[col].toString().length : 0),
                0
            );
            return { wch: Math.max(headerLength, maxDataLength) + 2 };
        });
        ws['!cols'] = colWidths;

        // Step 3: Create workbook and export
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'FilteredData');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'booking_data.xlsx');
    };

    return (
        <>
            <Row className="d-flex pb-3 align-items-center justify-content-between">
                <Col lg={activeTab === 'allJobs' ? 2 : 12} className="m-0">
                    <h3>{activeTab === 'allJobs' ? 'All Bookings' : 'Booking Transfer Requests'}</h3>
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
                            role="admin"
                            setMessage={setMessage}
                            setIsFiltering={setIsFiltering}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedColumns={selectedColumns}
                            setSelectedColumns={setSelectedColumns}
                            setJobsData={setJobsData}
                            page={page}
                            limit={limit}
                        />
                        <Button onClick={() => setFilterShow(true)} className="input-group-text cursor-pointer custom-icon-btn">
                            <FaFilter />
                        </Button>
                        <Button onClick={handleRefresh} style={{ fontSize: '12px' }} className="custom-btn">
                            Clear Filters
                        </Button>
                    </Col>
                }
            </Row>
            <div className="d-flex justify-content-end">
                <Button
                    onClick={handleDownloadExcel}
                    className="d-flex align-items-center justify-content-center  custom-icon-btn"
                    style={{ width: '40px', height: '40px' }}
                >
                    <FaFileExcel />
                </Button>
            </div>
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
                        <Tabs activeKey={activeTab} onSelect={handleTabSelect} defaultActiveKey="allJobs" id="todays-job" className="mb-3 custom-tabs">
                            {/* Today's Job Tab */}
                            <Tab eventKey="allJobs" title="All Jobs" className="client-rates-table">
                                <div className="client-rates-table">
                                    <Table className="custom-table" bordered responsive hover>
                                        <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                            <tr>
                                                {selectedColumns.map((col, index) => (
                                                    <>
                                                        <th className="text-center" key={index} onClick={() => handleSort(item)}>
                                                            {col}
                                                        </th>
                                                    </>
                                                ))}
                                                {/* <th className="text-start" onClick={() => handleSort('clientId.companyName')}>
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
                                    </th> */}
                                                {/* <th className="text-start" onClick={() => handleSort('uid')}>
                    Job Id
                  </th> */}
                                                {/* <th className="text-start" onClick={() => handleSort('driverId.firstname')}>
                                        Driver
                                    </th>
                                    <th className="text-center" style={{ width: 'auto', minWidth: '100px' }} onClick={() => handleSort('notes')}>
                                        Notes
                                    </th>
                                    <th className="text-center" style={{ width: 'auto', minWidth: '120px' }} onClick={() => handleSort('currentStatus')}>
                                        Status
                                    </th> */}
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
                                            ) : loading ? (
                                                <tr>
                                                    <td colSpan={14} className="text-center"><Spinner animation="border" variant="primary" /></td>
                                                </tr>
                                            ) : (
                                                data?.map((item, index) => {
                                                    const isSelected = item?._id === selectedJob?._id;
                                                    const status = item?.Status;
                                                    const styles = getStatusStyles(status);
                                                    const transferStatus = item['Transfer Status'];
                                                    const transferStyle = transferStatus ? getStatusStyles(transferStatus) : {};
                                                    const tdStyle = {
                                                        backgroundColor: isSelected ? '#E0E0E0' : 'transparent',
                                                        fontSize: 14,
                                                        textAlign: 'left',
                                                    };
                                                    return (
                                                        <tr key={index} className="cursor-pointer">
                                                            {selectedColumns.map((col) => (
                                                                <>

                                                                    {col === 'Status' ?
                                                                        <td onClick={() => handleView(item)} style={{
                                                                            ...tdStyle,
                                                                            ...(item.blurJob
                                                                                ? { pointerEvents: 'none' }
                                                                                : {}),
                                                                        }}>
                                                                            <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                                                                                {status}
                                                                            </div>
                                                                        </td>
                                                                        :
                                                                        col === 'Transfer Status' ?
                                                                            <td onClick={() => handleView(item)} style={{
                                                                                ...tdStyle,
                                                                                ...(item.blurJob
                                                                                    ? { pointerEvents: 'none' }
                                                                                    : {}),
                                                                            }}>
                                                                                <div className="px-1 py-1 rounded-5 text-center" style={transferStyle}>
                                                                                    {transferStatus || "-"}
                                                                                </div>
                                                                            </td>
                                                                            :
                                                                            <td onClick={() => handleView(item)} style={{
                                                                                ...tdStyle,
                                                                                ...(item.blurJob && col === 'Transfer To'
                                                                                    ? { pointerEvents: 'none' }
                                                                                    : {}),
                                                                            }}
                                                                                className={item.blurJob && col !== 'Transfer To' ? 'blurred-row' : ''}
                                                                            >
                                                                                {/* {item?.clientId?.companyName} */}
                                                                                {item[col] ?? "-"}
                                                                            </td>
                                                                    }
                                                                </>
                                                            ))}
                                                            {/* <td className="text-start"
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
                                                </td> */}
                                                            {/* <td className="text-start"
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.uid}
                        </td> */}
                                                            {/* <td className="text-start"
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
                                                </td> */}
                                                            <td className="text-center action-dropdown-menu" style={{
                                                                ...tdStyle,
                                                                ...(item.blurJob
                                                                    ? { pointerEvents: 'none' }
                                                                    : {}),
                                                            }}>
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
                                                                        {role !== 'Allocant' && item?.Status === 'Pending' && item?.isTransfer === false &&
                                                                            <li>
                                                                                <button
                                                                                    className="dropdown-item"
                                                                                    onClick={() => handleTransferJob(item)}
                                                                                >
                                                                                    Transfer Job
                                                                                </button>
                                                                            </li>
                                                                        }
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
                            </Tab>

                            {/* <Tab eventKey="transferJobs" title="Accepted Jobs" className="client-rates-table">
                                <div className="client-rates-table">
                                    <Table className="custom-table" bordered responsive hover>
                                        <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                            <tr>
                                                {selectedColumns.map((col, index) => (
                                                    <>
                                                        <th className="text-center" key={index} onClick={() => handleSort(item)}>
                                                            {col}
                                                        </th>
                                                    </>
                                                ))}
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
                                            ) : loading ? (
                                                <tr>
                                                    <td colSpan={14} className="text-center"><Spinner animation="border" variant="primary" /></td>
                                                </tr>
                                            ) : (
                                                data?.map((item, index) => {
                                                    const isSelected = item?._id === selectedJob?._id;
                                                    const status = item?.Status;
                                                    const styles = getStatusStyles(status);
                                                    const tdStyle = {
                                                        backgroundColor: isSelected ? '#E0E0E0' : 'transparent',
                                                        fontSize: 14,
                                                        textAlign: 'left',
                                                    };
                                                    return (
                                                        <tr key={index} className="cursor-pointer">
                                                            {selectedColumns.map((col) => (
                                                                <>

                                                                    {col === 'Status' ?
                                                                        <td onClick={() => handleView(item)} style={{
                                                                            ...tdStyle,
                                                                            ...(item.blurJob
                                                                                ? { pointerEvents: 'none' }
                                                                                : {}),
                                                                        }}>
                                                                            <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                                                                                {status}
                                                                            </div>
                                                                        </td>
                                                                        :
                                                                        <td onClick={() => handleView(item)} style={{
                                                                            ...tdStyle,
                                                                            ...(item.blurJob && col === 'Transfer To'
                                                                                ? { pointerEvents: 'none' }
                                                                                : {}),
                                                                        }}
                                                                            className={item.blurJob && col !== 'Transfer To' ? 'blurred-row' : ''}
                                                                        >
                                                                            {item[col] ?? "-"}
                                                                        </td>
                                                                    }
                                                                </>
                                                            ))}

                                                            <td className="text-center action-dropdown-menu" style={{
                                                                ...tdStyle,
                                                                ...(item.blurJob
                                                                    ? { pointerEvents: 'none' }
                                                                    : {}),
                                                            }}>
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
                                                                        {item?.Status === 'Pending' && item?.isTransfer === false &&
                                                                            <li>
                                                                                <button
                                                                                    className="dropdown-item"
                                                                                    onClick={() => handleTransferJob(item)}
                                                                                >
                                                                                    Transfer Job
                                                                                </button>
                                                                            </li>
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab> */}

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
                                            ) : loading ? (
                                                <tr>
                                                    <td colSpan={14} className="text-center"><Spinner animation="border" variant="primary" /></td>
                                                </tr>
                                            ) : (
                                                data?.map((item, index) => {
                                                    const isSelected = item._id === selectedJob?._id
                                                    const status = item?.isHold ? 'Hold' : item?.currentStatus
                                                    const styles = getStatusStyles(status)
                                                    return (
                                                        <tr key={index} className="cursor-pointer">
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
                                                        </tr>
                                                    )
                                                })
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab>
                        </Tabs >
                    </div>
                </Col>
            </Row>

            {activeTab === 'allJobs' && data.length > 0 &&
                <Row className="mb-3 mt-3 justify-content-between">
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
            }
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
            {showAssignClient ? (
                <AssignClientModal
                    show={showAssignClient}
                    setShow={setShowAssignClient}
                    jobId={selectedJob._id}
                    setIsRefresh={setIsRefresh}
                    isReferesh={isReferesh}
                    fetchData={fetchData}
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
