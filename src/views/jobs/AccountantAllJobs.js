/* eslint-disable react/react-in-jsx-scope */
import { FaTruckMoving, FaEye, FaMapMarkedAlt, FaFilter } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { get, updateReq } from '../../lib/request'
import { getTotalDocs } from '../../services/getTotalDocs'
import MyPagination from '../../components/Pagination'
import { Button, Col, Container, Form, Row, Table, Modal, Spinner, Dropdown } from 'react-bootstrap'
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

const AccountantAllJobs = () => {
    const dispatch = useDispatch()
    const searchQuery = useSelector((state) => state.searchQuery2)
    const jobsCount = useSelector((state) => state.jobsCount)
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isReferesh, setIsRefresh] = useState(false)

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
    const [selectedColumns, setSelectedColumns] = useState(['Client', 'Ready Time', 'AWB', 'Customer Job Number', 'Pieces', 'Service Type', 'Service Code', 'Weight', 'Pickup From', 'Deliver To', 'Arrived At Pickup', 'Picked Up Time', 'Arrival At Delivery', 'Delivered Time', 'Pickup Waiting Time Charges', 'Delivery Wait Time Charges', 'Admin Notes', 'Base Rate', 'Fuel Surcharge', 'Invoice Number', 'Notes']);
    const [checkedItems, setCheckedItems] = useState([]);
    const [serviceCodes, setServiceCodes] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);


    const setSearchQuery = (query) => {
        dispatch({
            type: 'updateSearchQuery2',
            payload: query
        })
    }

    const setJobsData = (response) => {
        const finalArr = [];

        for (let data of response) {
            const obj = {};

            obj._id = data?._id;
            obj.Client = data?.clientId?.companyName;
            // obj['Ready Time'] = data?.pickUpDetails?.readyTime;
            obj['Ready Time'] = data?.pickUpDetails?.readyTime ? getFormattedDAndT(data?.pickUpDetails?.readyTime) : "";
            // obj['Cutoff Time'] = data?.dropOfDetails?.cutOffTime;
            obj['Cutoff Time'] = data?.dropOfDetails?.cutOffTime ? getFormattedDAndT(data?.dropOfDetails?.cutOffTime) : "";
            obj.AWB = data?.AWB;
            obj.Pieces = data?.pieces;
            obj['Service Type'] = data?.serviceTypeId?.text;
            obj['Service Code'] = data?.serviceCodeId?.text;
            obj['Pickup From'] = data?.pickUpDetails?.pickupLocationId?.mapName;
            obj['Deliver To'] = data?.dropOfDetails?.dropOfLocationId?.mapName;
            obj.Driver = data?.driverId ? `${data?.driverId?.firstname}-${data?.driverId?.lastname}` : '';
            obj.Notes = data?.note;
            obj.Status = data?.isHold ? 'Hold' : data?.currentStatus;
            obj.isTransfer = data?.isTransfer;
            obj.isTransferAccept = data?.isTransferAccept;
            obj['Transfer To'] = data?.transferClientId ? data?.transferClientId?.companyName : '';
            obj['Arrived At Pickup'] = data?.pickUpDetails?.arrivalTime ? getFormattedDAndT(data?.pickUpDetails?.arrivalTime) : "";
            obj['Picked Up Time'] = data?.pickUpDetails?.pickedUpTime ? getFormattedDAndT(data?.pickUpDetails?.pickedUpTime) : "";
            obj['Arrival At Delivery'] = data?.dropOfDetails?.arrivalTime ? getFormattedDAndT(data?.dropOfDetails?.arrivalTime) : "";
            obj['Delivered Time'] = data?.dropOfDetails?.deliveredTime ? getFormattedDAndT(data?.dropOfDetails?.deliveredTime) : "";
            obj['Admin Notes'] = data?.adminNote || "-";
            obj['Base Rate'] = data?.rates || "";
            obj['Fuel Surcharge'] = data?.fuel_charge || "";
            obj['Invoice Number'] = data?.invoiceNumber || "-";
            obj['Customer Job Number'] = data?.custRefNumber || "";
            obj['Weight'] = data?.weight || "";
            obj['serviceTypeId'] = data?.serviceTypeId ? data?.serviceTypeId?._id : "";
            obj['serviceCodeId'] = data?.serviceCodeId ? data?.serviceCodeId?._id : "";
            obj['Pickup Waiting Time Charges'] = data?.invoiceDetail?.pickUpDetails?.pickUpWaitingRate || 0;
            obj['Delivery Wait Time Charges'] = data?.invoiceDetail?.dropOfDetails?.deliveryWaitingRate || 0;
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

        let payload = { ...searchQuery };

        getSeachFilterResult(payload, "admin", page, limit)
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

    useEffect(() => {
        setTotalPages(Math.ceil(jobsCount / limit))
    }, [limit, jobsCount])

    useEffect(() => {
        fetchData()
    }, [page, limit]);

    const handlePageChange = (page) => {
        setPage(page)
    }

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

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
        setSelectedColumns(['Client', 'Ready Time', 'AWB', 'Customer Job Number', 'Pieces', 'Service Type', 'Service Code', 'Weight', 'Pickup From', 'Deliver To', 'Arrived At Pickup', 'Picked Up Time', 'Arrival At Delivery', 'Delivered Time', 'Pickup Waiting Time Charges', 'Delivery Wait Time Charges', 'Admin Notes', 'Base Rate', 'Fuel Surcharge', 'Invoice Number', 'Notes']);

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
            driverName: ""
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
            driverName: ""
        });
        fetchData(filter);
    }

    const handleRemoveFilter = (key) => {

        const filterObj = searchQuery;

        filterObj[key] = '';

        dispatch({
            type: 'updateSearchQuery2',
            payload: { [key]: '' },
        });

        if (key === 'clientName') {
            dispatch({
                type: 'updateSearchQuery2',
                payload: { clientId: '' },
            });
            filterObj['clientId'] = '';
        }

        if (key === 'driverName') {
            dispatch({
                type: 'updateSearchQuery2',
                payload: { driverId: '' },
            });
            filterObj['driverId'] = '';
        }

        if (key === 'currentStatus') {
            dispatch({
                type: 'updateSearchQuery2',
                payload: { currentStatus: '' },
            });
            filterObj['currentStatus'] = '';
        }

        if (key === 'serviceType') {
            dispatch({
                type: 'updateSearchQuery2',
                payload: { serviceTypeId: '' },
            });
            filterObj['serviceTypeId'] = '';
        }

        if (key === 'serviceCode') {
            dispatch({
                type: 'updateSearchQuery2',
                payload: { serviceCodeId: '' },
            });
            filterObj['serviceCodeId'] = '';
        }

        let filter = filterObj;

        fetchData(filter);
    }

    const handleTransferJob = (item) => {
        setSelectedJob(item)
        setShowAssignClient(true);
    }

    const columnOptions = [
        'All', 'Client', 'Ready Time', 'AWB', 'Customer Job Number', 'Pieces', 'Service Type', 'Service Code', 'Weight', 'Pickup From', 'Deliver To', 'Arrived At Pickup', 'Picked Up Time', 'Arrival At Delivery', 'Delivered Time', 'Pickup Waiting Time Charges', 'Delivery Wait Time Charges', 'Admin Notes', 'Base Rate', 'Fuel Surcharge', 'Invoice Number', 'Notes'
    ];

    const editableFields = [
        'Ready Time', 'AWB', 'Customer Job Number', 'Service Type', 'Service Code', 'Pieces', 'Weight', 'Arrived At Pickup', 'Picked Up Time', 'Arrival At Delivery', 'Delivered Time', 'Notes', 'Base Rate', 'Fuel Surcharge'
    ]

    const handleCheckBoxChange = (e, item) => {
        const isChecked = e.target.checked;

        setCheckedItems((prev) => {
            if (isChecked) {
                // Add item if not already present
                const exists = prev.some(i => i._id === item._id);
                return exists ? prev : [...prev, { ...item }];
            } else {
                // Remove item if unchecked
                return prev.filter(i => i._id !== item._id);
            }
        });
    };

    const handleFieldChange = (itemId, fieldName, value, id = null) => {
        setCheckedItems((prev) =>
            prev.map((item) =>
                item._id === itemId
                    ? {
                        ...item,
                        [fieldName]: value,
                        ...(fieldName === 'Service Code' && id ? { serviceCodeId: id } : {}),
                        ...(fieldName === 'Service Type' && id ? { serviceTypeId: id } : {})
                    }
                    : item
            )
        );
    };

    const handleSubmitCheckedItems = async () => {
        if (checkedItems.length === 0) {
            alert("No items selected.");
            return;
        }

        try {

            const payload = checkedItems.map(item => ({
                _id: item['_id'],
                AWB: item['AWB'],
                custRefNumber: item['Customer Job Number'],
                serviceTypeId: item['serviceTypeId'],
                serviceCodeId: item['serviceCodeId'],
                pieces: item['Pieces'],
                weight: item['Weight'],
                pickUpDetails: {
                    readyTime: formatDateTimeValue(item['Ready Time']) || item['Ready Time'],
                    arrivalTime: formatDateTimeValue(item['Arrived At Pickup']) || item['Arrived At Pickup'],
                    pickedUpTime: formatDateTimeValue(item['Picked Up Time']) || item['Picked Up Time']
                },
                dropOfDetails: {
                    arrivalTime: formatDateTimeValue(item['Arrival At Delivery']) || item['Arrival At Delivery'],
                    deliveredTime: formatDateTimeValue(item['Delivered Time']) || item['Delivered Time']
                },
                note: item['Notes'],
                rates: item['Base Rate'],
                fuel_charge: item['Fuel Surcharge']
            }));

            updateReq(`/admin/accountant/edit-job`, payload, "admin").then((data) => {
                if (data.data.status) {
                    setIsRefresh(!isReferesh);
                    Swal.fire({
                        icon: 'success',
                        title: 'Job has been Updated Successfully!',
                    });
                    fetchData();
                    setCheckedItems([]);
                }
            })
        } catch (error) {
            console.error("Failed to update jobs:", error);
            alert("Update failed. Try again.");
        }
    };

    const isItemChecked = (id) => checkedItems.some(i => i._id === id);

    useEffect(() => {
        get(`/admin/service/code`, "admin").then((res) => {
            if (res.data.status) {
                setServiceCodes(res.data.data);
            }
        });
        get(`/admin/service/type`, "admin").then((res) => {
            if (res.data.status) {
                setServiceTypes(res.data.data);
            }
        });
    }, []);

    const formatDateTimeValue = (dateString) => {
        if (!dateString) return '';

        // Example input: "17/06/2025, 05:39 pm"
        const [datePart, timePartRaw] = dateString.split(', ');
        if (!datePart || !timePartRaw) return '';

        const [day, month, year] = datePart.split('/');
        const [time, meridian] = timePartRaw.split(' ');
        let [hour, minute] = time.split(':');

        hour = parseInt(hour, 10);
        if (meridian.toLowerCase() === 'pm' && hour < 12) {
            hour += 12;
        } else if (meridian.toLowerCase() === 'am' && hour === 12) {
            hour = 0;
        }

        // Pad with leading zero if needed
        const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour
            .toString()
            .padStart(2, '0')}:${minute}`;
        return formatted;
    };

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
                        accountantColumnOption={columnOptions}
                    />
                    <Button onClick={() => setFilterShow(true)} className="input-group-text cursor-pointer custom-icon-btn">
                        <FaFilter />
                    </Button>
                    <Button onClick={handleRefresh} style={{ fontSize: '12px' }} className="custom-btn">
                        Clear Filters
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <div className="client-rates-table">

                        {Object.values(searchQuery).some((v) => v) && (
                            <div className="filter-container">
                                <FilterTags searchQuery={searchQuery} onRemoveFilter={handleRemoveFilter} />
                            </div>
                        )}
                        <Table className="custom-table" bordered responsive hover>
                            <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                <tr>
                                    <th className="text-center">
                                        Edit
                                    </th>
                                    {selectedColumns.map((col, index) => (
                                        <>
                                            <th className="text-center" key={index} onClick={() => handleSort(col)}>
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
                                                <td className="text-center" style={{
                                                    ...tdStyle,
                                                    // ...(item.isTransferAccept
                                                    //     ? { pointerEvents: 'none' }
                                                    //     : {}),
                                                }}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name="isDriverPermission"
                                                        checked={checkedItems.some(i => i._id === item._id)}
                                                        onChange={(e) => handleCheckBoxChange(e, item)}
                                                    />
                                                </td>
                                                {selectedColumns.map((col) => {
                                                    const isChecked = isItemChecked(item._id);
                                                    const editableItem = checkedItems.find(i => i._id === item._id);

                                                    let displayValue;
                                                    if (editableItem && col in editableItem) {
                                                        displayValue = editableItem[col];
                                                    } else if (col === 'Service Code') {
                                                        const codeObj = serviceCodes.find(sc => sc._id === item.serviceCodeId);
                                                        displayValue = codeObj?.text;
                                                    } else if (col === 'Service Type') {
                                                        const typeObj = serviceTypes.find(st => st._id === item.serviceTypeId);
                                                        displayValue = typeObj?.text;
                                                    } else {
                                                        displayValue = item[col] || "-";
                                                    }

                                                    // If col is Status, render special style (unchanged)
                                                    if (col === 'Status') {
                                                        return (
                                                            <td
                                                                key={col}
                                                                onClick={() => handleView(item)}
                                                                style={{
                                                                    ...tdStyle,
                                                                    ...(item.isTransferAccept ? { pointerEvents: 'none' } : {})
                                                                }}
                                                            >
                                                                <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                                                                    {status}
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    // For all other editable columns
                                                    return (
                                                        <>
                                                            <td key={col} style={tdStyle}>
                                                                {editableFields.includes(col) && isChecked ? (
                                                                    col === 'Service Code' || col === 'Service Type' ? (
                                                                        <Form.Select
                                                                            size="sm"
                                                                            value={
                                                                                col === 'Service Code'
                                                                                    ? (editableItem?.serviceCodeId || item.serviceCodeId || '')
                                                                                    : (editableItem?.serviceTypeId || item.serviceTypeId || '')
                                                                            }
                                                                            onChange={(e) => {
                                                                                const selectedId = e.target.value;
                                                                                const selectedItem = (col === 'Service Code' ? serviceCodes : serviceTypes).find(item => item._id === selectedId);
                                                                                handleFieldChange(item._id, col, selectedItem?.text || '', selectedId);
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    handleSubmitCheckedItems();
                                                                                }
                                                                            }}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            {(col === 'Service Code' ? serviceCodes : serviceTypes).map((option) => (
                                                                                <option key={option._id} value={option._id}>
                                                                                    {option.text}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Select>
                                                                    ) : ['Ready Time', 'Arrived At Pickup', 'Picked Up Time', 'Arrival At Delivery', 'Delivered Time'].includes(col) ? (
                                                                        <Form.Control
                                                                            type="datetime-local"
                                                                            size="sm"
                                                                            value={formatDateTimeValue(displayValue) || displayValue}
                                                                            // value={displayValue}
                                                                            onChange={(e) => handleFieldChange(item._id, col, e.target.value)}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitCheckedItems()}
                                                                        />
                                                                    ) : (
                                                                        <Form.Control
                                                                            size="sm"
                                                                            value={displayValue}
                                                                            onChange={(e) => handleFieldChange(item._id, col, e.target.value)}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitCheckedItems()}
                                                                        />
                                                                    )
                                                                ) : (
                                                                    displayValue ?? "-"
                                                                )}
                                                            </td>
                                                        </>
                                                    );
                                                })}

                                                <td className="text-center action-dropdown-menu" style={{
                                                    ...tdStyle,
                                                    ...(item.isTransferAccept
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
                                                            {item?.Status === 'Pending' &&
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
                </Col>
            </Row>

            {data.length > 0 &&
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
            }
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

export default AccountantAllJobs;
