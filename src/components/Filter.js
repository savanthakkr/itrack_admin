import React, { useState, useEffect } from 'react';
import { Offcanvas, Row, Col, Dropdown, Form, Button } from 'react-bootstrap';
import { get } from '../lib/request';

const FilterOffCanvas = ({ show, handleClose, onApplyFilter, role, searchQuery, setSearchQuery }) => {
    const [allClients, setAllClients] = useState([]);
    const [allDrivers, setAllDrivers] = useState([]);
    const status = [
        "Pending",
        "Driver Assigned",
        "Arrival on Pickup",
        "Picked Up",
        "Arrival on Delivery",
        "Delivered",
        "Cancelling",
        "Cancelled",
        "Hold",
    ];
    const serviceCodes = [
        { value: 'ALF', label: 'ALF' },
        { value: 'INTBDL', label: 'INTBDL' },
        { value: 'LOOSE', label: 'LOOSE' },
        { value: 'METRO DELIVERY', label: 'METRO DELIVERY' },
        { value: 'PLA', label: 'PLA' },
        { value: 'PMC', label: 'PMC' },
        { value: 'PAG', label: 'PAG' },
        { value: 'PGA', label: 'PGA' },
        { value: 'ER', label: 'ER' },
        { value: 'HH14', label: 'HH14' },
        { value: 'HH22', label: 'HH22' },
        { value: 'HH34', label: 'HH34' },
        { value: 'INTSFL', label: 'INTSFL' },
        { value: 'WHH14', label: 'WHH14' },
        { value: 'WHH22', label: 'WHH22' },
        { value: 'W-AKE', label: 'W-AKE' },
        { value: 'W-PMC', label: 'W-PMC' },
        { value: 'AKE', label: 'AKE' },
        { value: 'AKH', label: 'AKH' },
        { value: 'AAX', label: 'AAX' }
    ];
    const serviceTypes = [
        { value: 'Per Unit', label: 'Per Unit' },
        { value: 'Per Hour', label: 'Per Hour' },
        { value: 'Flat Rate', label: 'Flat Rate' },
        { value: 'Custom', label: 'Custom' }
    ];

    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        get(`/admin/info/allClients`, "admin").then((res) => {
            if (res.data.status) {
                setAllClients(res.data.data);
            }
        });
        let url = `/admin/info/allDrivers`;
        if (role === "client") {
            url = `/client/driverList`;
        }
        get(url, role).then((res) => {
            if (res.data.status) {
                setAllDrivers(res.data.data);
            }
        });
    }, []);

    useEffect(() => {
        setSelectedOption(searchQuery);
    }, [searchQuery]);

    return (
        <Offcanvas show={show} onHide={handleClose} backdrop="static" placement="end" className="filter-canvas">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Apply Filters</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Row>
                    <Col md={12}>
                        <label htmlFor="statusDropdown" className="form-label fw-semibold">
                            Status
                        </label>
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                className="w-100 mx-auto d-block d-flex justify-content-between align-items-center"
                                id="dropdown-autoclose-false"
                                style={{ textAlign: 'left', color: searchQuery?.currentStatus ? '#000' : '#BDBDBD' }}
                            >
                                <span>
                                    {searchQuery?.currentStatus ? searchQuery?.currentStatus : "Select from the list"}
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                                className="w-100 custom-scroll"
                                style={{ maxHeight: '250px', overflowY: 'auto' }}
                            >
                                {status.map((status, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => setSearchQuery({ ...searchQuery, currentStatus: status })}
                                    >
                                        {status}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                    </Col>
                </Row>

                <Row>
                    <Col md={12} className="mt-3">
                        <label htmlFor="serviceCodeDropdown" className="form-label fw-semibold">
                            Service Code
                        </label>
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                className="w-100 mx-auto d-flex justify-content-between align-items-center"
                                id="serviceCodeDropdown"
                                style={{ textAlign: "left", color: searchQuery?.serviceCode ? "#000" : "#BDBDBD" }}
                            >
                                {searchQuery?.serviceCode ? searchQuery.serviceCode : "Select from the list"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                                className="w-100 custom-scroll"
                                style={{ maxHeight: "250px", overflowY: "auto" }}
                            >
                                {serviceCodes.map((code, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                            setSearchQuery({
                                                ...searchQuery,
                                                serviceCode: code.value, // assuming code has { value, label }
                                            })
                                        }
                                    >
                                        {code.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                {role === "admin" && (
                    <Row>
                        <Col md={12} className='mt-3'>
                            <label htmlFor="statusDropdown" className="form-label fw-semibold">
                                Client
                            </label>
                            <Dropdown className="custom-dropdown">
                                <Dropdown.Toggle variant="outline-secondary" className='w-100 mx-auto d-flex justify-content-between align-items-center' id="dropdown-autoclose-false" style={{ textAlign: 'left', color: searchQuery?.clientName ? '#000' : '#BDBDBD' }}>
                                    {searchQuery?.clientName ? searchQuery?.clientName : "Select from the list"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                    className="w-100 custom-scroll"
                                    style={{ maxHeight: '250px', overflowY: 'auto' }}
                                >
                                    {allClients.map((client, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => setSearchQuery({ ...searchQuery, clientId: client._id, clientName: client.firstname })}
                                        >
                                            {client.firstname} {client.lastname}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col md={12} className="mt-3">
                        <label htmlFor="serviceTypeDropdown" className="form-label fw-semibold">
                            Service Type
                        </label>
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                className="w-100 mx-auto d-flex justify-content-between align-items-center"
                                id="serviceTypeDropdown"
                                style={{ textAlign: "left", color: searchQuery?.serviceType ? "#000" : "#BDBDBD" }}
                            >
                                {searchQuery?.serviceType ? searchQuery.serviceType : "Select from the list"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                                className="w-100 custom-scroll"
                                style={{ maxHeight: "250px", overflowY: "auto" }}
                            >
                                {serviceTypes.map((type, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                            setSearchQuery({
                                                ...searchQuery,
                                                serviceType: type.value, // assuming type has { value, label }
                                            })
                                        }
                                    >
                                        {type.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className='mt-3'>
                        <label htmlFor="statusDropdown" className="form-label fw-semibold">
                            Driver
                        </label>
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle variant="outline-secondary" className='w-100 mx-auto d-flex justify-content-between align-items-center' id="dropdown-autoclose-false" style={{ textAlign: 'left', color: searchQuery?.driverName ? '#000' : '#BDBDBD' }}>
                                {searchQuery?.driverName ? searchQuery?.driverName : "Select from the list"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                                className="w-100 custom-scroll"
                                style={{ maxHeight: '250px', overflowY: 'auto' }}
                            >
                                {allDrivers.map((driver, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                            setSearchQuery({
                                                ...searchQuery,
                                                driverId: driver._id,
                                                driverName: driver.firstname,
                                            })
                                        }
                                    >
                                        {driver.firstname} {driver.lastname}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>

                        </Dropdown>
                    </Col>
                </Row>

                <div className="my-4" />



                <Row className='mx-auto w-100'>
                    <Button className="custom-btn" onClick={() => onApplyFilter(selectedOption)}>Apply Filter</Button>
                </Row>

            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default FilterOffCanvas;
