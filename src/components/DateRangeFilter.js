import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Dropdown, DropdownButton } from 'react-bootstrap'
import { getSeachFilterResult } from '../services/getSearchFilterResult'
import Select from 'react-select';
import FilterOffCanvas from './Filter';
import { BsCheck } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { getCurrentDate } from '../lib/getFormatedDate';

export default function DateRangeFilter({
	setData,
	role,
	setMessage,
	setIsFiltering,
	searchQuery,
	setSearchQuery,
	activeTab,
	page,
	limit
}) {
	// const [searchQuery, setSearchQuery] = useState({
	//     AWB: "",
	//     clientId: "",
	//     driverId: "",
	//     fromDate: "",
	//     toDate: "",
	//     currentStatus: "",
	//     jobId: "",
	//     clientName: "",
	//     driverName: ""
	// });

	const dispatch = useDispatch()

	const handleTimeChange = (e) => {
		setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value })
	}
	const handleColumnSelect = (options) => {
		setSelectedColumns(options || []);
		// If you want to filter data by selected column:
		// setSearchQuery({ ...searchQuery, selectedColumn: option.value })
	}
	useEffect(() => {
		if (searchQuery.fromDate && searchQuery.toDate) {
			setMessage('')
			if (setIsFiltering) {
				setIsFiltering(true)
			}
			const filteredQuery = Object.fromEntries(
				Object.entries(searchQuery).map(([key, value]) => {
					if (key === 'fromDate' || key === 'toDate') {
						return [key, value];
					} else if (value) {
						return [key, value];
					} else {
						return [key, ""];
					}
				})
			);
			if (page && limit) {
				getSeachFilterResult(filteredQuery, role, page, limit).then((res) => {
					// setData(res)
					dispatch({
						type: 'getJobData',
						payload: res?.jobs,
					});

					dispatch({
						type: 'setJobCount',
						payload: res?.totalCount,
					});
				})
			} else {
				getSeachFilterResult(filteredQuery, role).then((res) => {
					// setData(res)
					dispatch({
						type: 'getJobData',
						payload: res?.jobs,
					});

					dispatch({
						type: 'setJobCount',
						payload: res?.totalCount,
					});
				})
			}

		} else {
			const filterQuery = searchQuery;

			if (activeTab === 'todaysJob') {
				filterQuery.fromDate = getCurrentDate();
				filterQuery.toDate = getCurrentDate()
			}
			
			if (page && limit) {
				getSeachFilterResult(filterQuery, role, page, limit).then((res) => {
					// setData(res)
					dispatch({
						type: 'getJobData',
						payload: res?.jobs,
					});

					dispatch({
						type: 'setJobCount',
						payload: res?.totalCount,
					});
				})
			} else {
				getSeachFilterResult(filterQuery, role).then((res) => {
					// setData(res)
					dispatch({
						type: 'getJobData',
						payload: res?.jobs,
					});

					dispatch({
						type: 'setJobCount',
						payload: res?.totalCount,
					});
				})
			}
		}
	}, [searchQuery.fromDate, searchQuery.toDate])

	const [showDropdown, setShowDropdown] = useState(false);
	const [selectedColumns, setSelectedColumns] = useState([]);

	const toggleColumn = (col) => {
		if (selectedColumns.includes(col)) {
			setSelectedColumns(selectedColumns.filter(c => c !== col));
		} else {
			setSelectedColumns([...selectedColumns, col]);
		}
	};
	// const columnOptions = [
	//   { value: 'all', label: 'All' },
	//   { value: 'client', label: 'Client' },
	//   { value: 'readyTime', label: 'Ready Time' },
	//   { value: 'cutoffTime', label: 'Cutoff Time' },
	//   { value: 'awb', label: 'AWB' },
	//   { value: 'pieces', label: 'Pieces' },
	//   { value: 'serviceType', label: 'Service Type' },
	//   { value: 'serviceCode', label: 'Service Code' },
	//   { value: 'pickupFrom', label: 'Pickup From' },
	//   { value: 'deliveryTo', label: 'Delivery To' },
	//   { value: 'driver', label: 'Driver' },
	//   { value: 'notes', label: 'Notes' },
	//   { value: 'status', label: 'Status' },
	// ]
	const columnOptions = [
		'All', 'Client', 'Ready Time', 'Cutoff Time', 'AWB', 'Pieces',
		'Service Type', 'Service Code', 'Pickup From', 'Deliver To',
		'Driver', 'Notes', 'Status'
	];

	return (
		<>
			<div className="d-flex flex-wrap align-items-center gap-3">
				{activeTab !== 'todaysJob' &&
					<>
						<div className="d-flex align-items-center">
							{/* <Form.Label></Form.Label> */}
							{/* <span className="me-2">From:</span> */}
							<Form.Control
								type="date"
								placeholder="Start Date"
								name="fromDate"
								onChange={handleTimeChange}
								onFocus={(e) => e.target.showPicker && e.target.showPicker()}
								value={searchQuery.fromDate}
								style={{ width: 170 }}
							/>
						</div>
						<span>-</span>
						<div className="d-flex align-items-center">
							{/* <span className="me-2">To:</span> */}
							<Form.Control
								type="date"
								placeholder="End Date"
								name="toDate"
								onChange={handleTimeChange}
								onFocus={(e) => e.target.showPicker && e.target.showPicker()}
								value={searchQuery.toDate}
								style={{ width: 170 }}
							/>
						</div>
					</>
				}
				{role == 'admin' &&
					<div>
						<Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)} className="w-100 custom-dropdown">
							<Dropdown.Toggle
								className="form-control bg-white text-start"
								style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
							>
								Show only chosen columns
							</Dropdown.Toggle>

							<Dropdown.Menu className="w-100">
								{columnOptions.map((col, idx) => (
									<Dropdown.Item
										key={idx}
										onClick={(e) => {
											e.preventDefault();
											toggleColumn(col);
										}}
										className="d-flex justify-content-between align-items-center"
									>
										{col}
										{selectedColumns.includes(col) && <BsCheck />}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>
					</div>
				}


			</div>
		</>
	)
}