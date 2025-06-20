import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FaExchangeAlt, FaEye, FaTruckMoving, FaMapMarkedAlt, FaSyncAlt, FaFilter } from 'react-icons/fa'
import { Button, Col, Row, Spinner, Table, Tab, Tabs, Form } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import EditJobAdmin from '../../components/Modals/EditJobAdmin'
import { get } from '../../lib/request'
import { getCurrentDate, getFormattedDAndT } from '../../lib/getFormatedDate'
import DateRangeFilter from '../../components/DateRangeFilter'
import AssignDriverModal from '../../components/Modals/AssignDriver'
import ChangeDriverModal from '../../components/Modals/ChangeDriver'
import EditJob from '../../components/Modals/EditJob'
import ViewJobs from '../../components/Modals/ViewJobs'
import getStatusStyles from '../../services/getStatusColor'
import sortData from '../../services/sortData'
import { LuChevronDown } from 'react-icons/lu'
import { BsThreeDotsVertical } from 'react-icons/bs'
import FilterOffCanvas from '../../components/Filter'
import MyPagination from '../../components/Pagination'
import FilterTags from '../../components/FilterTags'
import { getSeachFilterResult } from '../../services/getSearchFilterResult'


const Dashboard = () => {
	const currentDate = getCurrentDate()
	const navigate = useNavigate()
	const location = useLocation()
	const dispatch = useDispatch()
	const searchQuery = useSelector((state) => state.searchQuery)
	const [show, setShow] = useState(false)
	const [showView, setShowView] = useState(false)
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [isReferesh, setIsReferesh] = useState(false)
	const [selectedItem, setSelectedItem] = useState(location.state?.selectedItem || {})
	const [message, setMessage] = useState('')
	const [showAssign, setShowAssign] = useState(false)
	const [showChangeDriver, setShowChangeDriver] = useState(false)
	const [showCanvas, setShowCanvas] = useState(false)
	const handleShow = () => setShowCanvas(true);
	const [validated, setValidated] = useState(false)
	const [activeTab, setActiveTab] = useState("todaysJob");
	const [totalPages, setTotalPages] = useState(1);
	const [showFilter, setShowFilter] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const handleApplyFilter = () => {
		// Filter logic here
		setShowFilter(false);
	};

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

		handleRefresh(filterObj, true);
	}

	const handleRemove = (index) => {
		const updated = filters.filter((_, i) => i !== index);
		setFilters(updated);
	};

	useEffect(() => {
		const handleEsc = (event) => {
			if (event.key === 'Escape') {
				navigate(-1);
			}
		};

		window.addEventListener('keydown', handleEsc);

		return () => {
			window.removeEventListener('keydown', handleEsc);
		};
	}, [navigate]);

	const handleSearchClick = (searchTerm, selectedOption) => {
		setShowCanvas(false);
		getSeachFilterResult(searchQuery, "admin")
			.then((res) => {
				onSearch(res);
				handleClose();
			})
			.catch((err) => {
				console.error('Filter API Error:', err);
			});
	};

	useEffect(() => {

		// handleTabSelect("todaysJob");
		setActiveTab("todaysJob");

		const hasFilters =
			searchQuery.currentStatus ||
			searchQuery.clientId ||
			searchQuery.driverId ||
			searchQuery.fromDate ||
			searchQuery.toDate ||
			searchQuery.jobId ||
			searchQuery.clientName ||
			searchQuery.driverName;

		if (hasFilters && searchTerm.trim()) {
			handleSearchClick(searchTerm, searchQuery);
		}

		// Retrieve the selected item from local storage if it exists
		const storedSelectedItem = sessionStorage.getItem('selectedItem')
		if (storedSelectedItem) {
			setSelectedItem(JSON.parse(storedSelectedItem))
		}

	}, []);

	// useEffect(() => {
	//   handleTabSelect("todaysJob");
	// }, []);

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
			serviceCode: ''
		});

		// if (key === 'allJobs') {
		// 	handleClear(key);
		// } else {
		// 	handleClear();
		// 	// handleTodayJobs();
		// }
	};

	const setSearchQuery = (query) => {
		dispatch({
			type: 'updateSearchQuery',
			payload: query,
		})
	}

	// handle edit
	const handleClose = () => setShow(false)

	const handleCloseCanvas = () => setShowCanvas(false)

	// handle assign
	const handleShowAssign = (item) => {
		setSelectedItem(item)
		setShowAssign(true)
	}
	// handle change driver
	const handelChangeDriver = (item) => {
		setSelectedItem(item)
		setShowChangeDriver(true)
	}

	// handle view
	const handleView = (item) => {
		setSelectedItem(item)
		sessionStorage.setItem('selectedItem', JSON.stringify(item))
		navigate(`/client/job/details/${item._id}`, { state: { selectedItem: item } })
	}
	// close view
	const handleCloseView = () => setShowView(false)

	const onSearch = (newData) => {
		setMessage('')
		if (newData.length === 0) {
			setMessage('No data found')
		}
		setData(newData)
	}

	const handleTodayJobs = () => {
		setLoading(true)
		get(`/admin/info/jobFilter?fromDate=${currentDate}&toDate=${currentDate}`, 'admin').then(
			(response) => {
				if (response?.data?.status) {
					if (response?.data?.data?.length === 0) {
						setMessage('No data found')
					}
					setData(response?.data?.data)
					setLoading(false)
				}
			},
		)
	}

	// get initial data
	const getInitialData = () => {
		setLoading(true);
		get(`/admin/info/jobFilter?currentStatus=Un-Delivered`, 'admin')
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
			})
	}

	// useEffect(() => {
	// 	setLoading(true)
	// 	setMessage('')
	// 	if (
	// 		searchQuery.currentStatus ||
	// 		searchQuery.clientId ||
	// 		searchQuery.driverId ||
	// 		searchQuery.fromDate ||
	// 		searchQuery.toDate ||
	// 		searchQuery.jobId ||
	// 		searchQuery.clientName ||
	// 		searchQuery.driverName
	// 	) {
	// 		setLoading(false)

	// 	}
	// // }, [page, limit, isReferesh])
	// }, []);

	useEffect(() => {
		if (activeTab === 'allJobs') {
			getInitialData();
		} else {
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
			serviceCode: ''
		});

		// setActiveTab(activeTab);

		if (activeTab === 'allJobs') {
			getInitialData();
		} else {
			handleTodayJobs();
		}
	}

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
							setData(response?.data?.data)
							setLoading(false)
						}
					})
					.catch((error) => {
						console.error(error)
						setLoading(false)
					})
			}
		}

		// get(`/admin/info/jobFilter?${query}`, 'admin')
		// 	.then((response) => {
		// 		if (response?.data?.status) {
		// 			if (response?.data?.data?.length === 0) {
		// 				setMessage('No data found')
		// 			}
		// 			setData(response?.data?.data)
		// 			setLoading(false)
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.error(error)
		// 		setLoading(false)
		// 	})
	}


	// handle sort
	const handleSort = (field) => {
		const sortedData = sortData(data, field)
		setData(sortedData)
	}


	// useEffect(() => {
	// 	// Retrieve the selected item from local storage if it exists
	// 	const storedSelectedItem = sessionStorage.getItem('selectedItem')
	// 	if (storedSelectedItem) {
	// 		setSelectedItem(JSON.parse(storedSelectedItem))
	// 	}
	// }, [])


	// // Pagination
	// const handlePageChange = (page) => {
	//   setPage(page);
	// };
	// // Limit
	// const handleLimitChange = (e) => {
	//   setLimit(e.target.value)
	//   setTotalPages(Math.ceil(totalDocs / e.target.value))
	// }

	// useEffect(() => {
	//   setLoading(true);
	//   get(`/admin/info/jobFilter?page=${page}&limit=${limit}`, "admin").then((data) => {
	//     setData(response?.data?.data)
	//     setLoading(false)
	//   }).catch((e) => {
	//     console.log("errr", e.message);
	//   })
	//   // Getting total pages

	// }, [isReferesh, page, limit])


	return (
		<>
			<Row className="d-flex pb-3 align-items-center justify-content-between">
				<Col md={2} className="m-0">
					{/* <SearchBar
            onSearch={onSearch}
            role="admin"
            handleClear={handleClear}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          /> */}
					<h3>Dashboard</h3>
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
						role="admin"
						setMessage={setMessage}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
					<Button onClick={handleShow} className="input-group-text cursor-pointer custom-icon-btn">
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
				onApplyFilter={(selectedOption) =>
					handleSearchClick(searchTerm, selectedOption)
				}
				role="admin"
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>

			{Object.values(searchQuery).some((v) => v) && (
				<div className="filter-container">
					<FilterTags searchQuery={searchQuery} onRemoveFilter={handleRemoveFilter} />
				</div>
			)}

			<Tabs activeKey={activeTab} onSelect={handleTabSelect} defaultActiveKey="todaysJob" id="todays-job" className="mb-3 custom-tabs">
				{/* Today's Job Tab */}
				<Tab eventKey="todaysJob" title="Today's Jobs" className="client-rates-table">
					<div className="table-responsive">
						<Table responsive hover bordered>
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
									{/* <th className="text-center">
                    <LuChevronDown className="cursor-pointer m-1" size={20} onClick={() => handleSort('uid')} />
                    Job ID
                  </th> */}
									<th className="text-center" onClick={() => handleSort('note')} >
										Notes
									</th>
									<th className="text-center" onClick={() => handleSort('driverId.firstname')}>
										Driver
									</th>
									<th className="text-center" style={{ width: 'auto', minWidth: '170px' }} onClick={() => handleSort('currentStatus')}>
										Status
									</th>
									<th className="text-center" style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
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
									data && data.map((item, index) => {
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
													{getFormattedDAndT(item?.pickUpDetails?.readyTime)}
												</td>
												<td onClick={() => handleView(item)} style={tdStyle}>
													{getFormattedDAndT(item?.dropOfDetails?.cutOffTime)}
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
												{/* <td onClick={() => handleView(item)} style={tdStyle}>
                          {item?.uid}
                        </td> */}
												<td onClick={() => handleView(item)} style={tdStyle}>
													{item?.note}
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
											</tr>
										);
									})
								)}
							</tbody>
						</Table>
					</div>
				</Tab>

				{/* <Row className="mb-3 justify-content-between">
              <Col md={8} className="d-flex align-items-center gap-2 ">
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
              <Col className="d-flex align-items-center justify-content-end">
              <MyPagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
              </Col>
            </Row> */}


				{/* All Jobs Tab */}
				<Tab eventKey="allJobs" title="All Jobs" className="client-rates-table">
					<div className="table-responsive">
						<Table responsive hover bordered className="custom-table">
							<thead>
								<tr style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
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
									{/* <th className="text-center">
                    <LuChevronDown className="cursor-pointer m-1" size={20} onClick={() => handleSort('uid')} />
                    Job ID
                  </th> */}
									<th className="text-center" onClick={() => handleSort('note')}>
										Notes
									</th>
									<th className="text-center" onClick={() => handleSort('driverId.firstname')}>
										Driver
									</th>
									<th className="text-center" onClick={() => handleSort('currentStatus')} style={{ width: 'auto', minWidth: '170px' }}>
										Status
									</th>
									<th className="text-center" style={{ width: 'auto', minWidth: '70px' }}>Actions</th>
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
									data && data.map((item, index) => {
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
													{item?.clientId?.companyName}
												</td>
												<td onClick={() => handleView(item)} style={tdStyle}>
													{getFormattedDAndT(item?.pickUpDetails?.readyTime)}
												</td>
												<td onClick={() => handleView(item)} style={tdStyle}>
													{getFormattedDAndT(item?.dropOfDetails?.cutOffTime)}
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
												{/* <td onClick={() => handleView(item)} style={tdStyle}>
                          {item?.uid}
                        </td> */}
												<td onClick={() => handleView(item)} style={tdStyle}>
													{item?.note}
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
											</tr>
										);
									})
								)}
							</tbody>
						</Table>
					</div>
				</Tab>
			</Tabs>
			{show && (
				<EditJob
					show={show}
					handleClose={handleClose}
					job={selectedItem}
					setIsRefresh={setIsReferesh}
					isReferesh={isReferesh}
				/>
			)}
			{showView && <ViewJobs show={showView} handleClose={handleCloseView} job={selectedItem} />}
			{showAssign && (
				<AssignDriverModal
					show={showAssign}
					setShow={setShowAssign}
					jobId={selectedItem._id}
					setIsRefresh={setIsReferesh}
					isReferesh={isReferesh}
				/>
			)}
			{showChangeDriver && (
				<ChangeDriverModal
					show={showChangeDriver}
					setShow={setShowChangeDriver}
					jobId={selectedItem._id}
					setIsRefresh={setIsReferesh}
					isReferesh={isReferesh}
				/>
			)}
		</>
	)
}

export default Dashboard
