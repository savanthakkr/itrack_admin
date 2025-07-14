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
import { getSeachFilterResultInvoice } from '../../services/getSearchFilterResult'
import FilterTags from '../../components/FilterTags'

function AllInvoices() {
    let imgSrc = process.env.Image_Src
    const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [data, setData] = useState([])
    const invoiceData = useSelector((state) => state.invoiceData);
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10)
    const [message, setMessage] = useState('')
    const [selectedItem, setSelectedItem] = useState(location.state?.selectedItem || {})
    const searchQuery = useSelector((state) => state.searchQuery)
    const role = useSelector((state) => state.role)
    const handleShow = () => setShowCanvas(true);
    const [showCanvas, setShowCanvas] = useState(false)
    const dispatch = useDispatch();
    const invoiceCount = useSelector((state) => state.invoiceCount);
    const [filterShow, setFilterShow] = useState(false)

    const setSearchQuery = (query) => {
        dispatch({
            type: 'updateSearchQuery',
            payload: query
        })
    }

    const handleFilterClose = () => {
        setFilterShow(false)
    }

    const handleSearchClick = (selectedOption) => {
        setFilterShow(false);
        setPage(1);

        let payload = { ...searchQuery };

        getSeachFilterResultInvoice(payload, "admin", 1, limit)
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
        const responseData = newData?.invoices;
        dispatch({
            type: 'getInvoiceData',
            payload: responseData,
        });
        dispatch({
            type: 'setInvoiceCount',
            payload: newData?.totalCount,
        });
    }

    // fetch data
    const fetchInvoiceData = (filterObj) => {
        setLoading(true);

        let filter = filterObj || searchQuery;

        if (Object.values(filter).every(value => value === null)) {

            get(`/admin/invoice/list?page=${page}&limit=${limit}`, 'admin')
                .then((response) => {
                    // setData(response?.data?.data)
                    const responseData = response?.data?.data?.invoices;
                    dispatch({
                        type: 'getInvoiceData',
                        payload: responseData,
                    });
                    dispatch({
                        type: 'setInvoiceCount',
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

            get(`/admin/invoice/list?${query}&page=${page}&limit=${limit}`, 'admin')
                .then((response) => {
                    if (response?.data?.status) {
                        if (response?.data?.data?.length === 0) {
                            setMessage('No data found')
                        }
                        // setData(response?.data?.data)
                        const responseData = response?.data?.data?.invoices;
                        dispatch({
                            type: 'getInvoiceData',
                            payload: responseData,
                        });
                        dispatch({
                            type: 'setInvoiceCount',
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
        setTotalPages(Math.ceil(invoiceCount / limit));
    }, [limit, invoiceCount]);

    useEffect(() => {
        fetchInvoiceData();
    }, [page, limit]);

    useEffect(() => {
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
    }, []);

    const handlePageChange = (page) => {
        setPage(page)
    }

    const handleLimitChange = (e) => {
        setLimit(e.target.value)
        setTotalPages(Math.ceil(invoiceCount / e.target.value));
        setPage(1);
    }

    const handleRefresh = () => {
        setPage(1);
        setLimit(10);
        setMessage('');

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
        fetchInvoiceData(filter);
    }

    const handleRemoveFilter = (key) => {

        const filterObj = searchQuery;

        filterObj[key] = '';

        dispatch({
            type: 'updateSearchQuery',
            payload: { [key]: '' },
        });

        if (key === 'clientName') {
            dispatch({
                type: 'updateSearchQuery',
                payload: { clientId: '', clientName: '', companyName: '' },
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

        let filter = filterObj;

        fetchInvoiceData(filter);
    }

    // handle sort
    const handleSort = (field) => {
        const sortedData = sortData(invoiceData, field)
        setData(sortedData)
    }

    const handleCloseCanvas = () => setShowCanvas(false)

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h4 className="mb-0">Invoices</h4>
                </Col>
                <Col lg={10} className="d-flex flex-wrap justify-content-start justify-content-md-end align-items-center gap-3 mt-3 mt-lg-0">
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
                        // setIsFiltering={setIsFiltering}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        // selectedColumns={selectedColumns}
                        // setSelectedColumns={setSelectedColumns}
                        setInvoicesData={true}
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
            </Row>
            {/* Edited */}

            {Object.values(searchQuery).some((v) => v) && (
                <div className="filter-container">
                    <FilterTags searchQuery={searchQuery} onRemoveFilter={handleRemoveFilter} />
                </div>
            )}

            <div className="client-rates-table mt-5">
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
                            {loading ? (
                                <tr>
                                    <td colSpan={14} className="text-center"><Spinner animation="border" variant="primary" /></td>
                                </tr>
                            ) : (
                                invoiceData?.length > 0 ?
                                    invoiceData?.map((item, index) => {
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
                                                            {role !== "Accountant" &&
                                                                <li>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        onClick={() => navigate(`/client/invoice/${item?._id}`)}
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </li>
                                                            }
                                                            {/* <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => navigate(`/client/job/details/${item?.dispatchId?._id}`)}
                                                                >
                                                                    Add Manual Pricing
                                                                </button>
                                                            </li> */}
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
            </div>

            <Row>
                <Col md={12}>
                    <div>
                        {invoiceData?.length > 0 &&
                            <Row className="mb-3 mt-3 justify-content-between">
                                <Col md={8} className="d-flex justify-content-center justify-content-lg-start align-items-center gap-2 ">
                                    Show Entries
                                    <Col md={2}>
                                        <Form.Select
                                            className="page-entries"
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
                            </Row>
                        }
                    </div>
                </Col>
            </Row >
            <FilterOffCanvas
                show={filterShow}
                handleClose={handleFilterClose}
                onApplyFilter={(selectedOption) => handleSearchClick(selectedOption)}
                role={'admin'}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                invoice={true}
            />

        </>
    )
}

export default AllInvoices;
