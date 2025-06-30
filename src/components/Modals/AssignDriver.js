import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { get, postWihoutMediaData } from '../../lib/request';
import swal from 'sweetalert2';
import { BsCircleFill } from 'react-icons/bs';

const AssignDriverModal = ({ show, setShow, jobId, setIsRefresh, isReferesh, role }) => {
    const [options, setOptions] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const dropdownRef = useRef(null);

    // Close modal
    const handleClose = () => setShow(false);

    // Load more options when scrolling
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;

        if (scrollHeight - scrollTop === clientHeight && !loading && hasMore) {
            loadOptions();
        }
    };

    // handle assign driver 
    const handleAssignDriver = () => {
        const data = {
            job_id: jobId,
            driver_id: selectedDriver._id
        }
        let url = ''
        if (role === "client") {
            url = `/client/assignDriver`
        } else {
            url = `/admin/job/driver`
        }
        postWihoutMediaData(`${url}`, data, role || "admin")
            .then((response) => {
                if (response.data.status) {
                    swal.fire({
                        icon: 'success',
                        title: 'Driver assigned successfully!',
                    });
                    handleClose();
                    setIsRefresh(!isReferesh);

                }
            })
    }


    const loadOptions = async () => {
        let url = ''
        if (role === "client") {
            url = "/client/driverList"
        } else {
            url = `/admin/info/allDrivers?page=${page}&limit=10`
        }
        try {
            setLoading(true);
            const response = await get(`${url}`, role || "admin");
            const newOptions = response.data.data;
            if (newOptions.length > 0) {
                setOptions(prevOptions => [...prevOptions, ...newOptions]);
                setPage(prevPage => prevPage + 1);
                setLoading(false);
            } else {
                setHasMore(false); // No more data available
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Load initial options
        loadOptions();
    }, []); // Run once on component mount

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Change Driver</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2 pb-4">
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="lazy-dropdown" className='w-100 mx-auto d-block  custom-bootstrap-dropdown'>
                        {
                            selectedDriver ? `${selectedDriver.firstname} ${selectedDriver.lastname}` : 'Select from the list'
                        }
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        ref={dropdownRef}
                        className="series-dropdown-list overflow-scroll w-100"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                        onScroll={handleScroll}
                    >

                        {options.map(driver => (
                            <Dropdown.Item
                                key={driver._id}
                                onClick={() => setSelectedDriver(driver)}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>{driver.firstname} {driver.lastname}</span>
                                <BsCircleFill color={driver.online ? 'green' : 'red'} size={10} />
                            </Dropdown.Item>
                        ))}
                        {loading && <Dropdown.Item disabled>Loading...</Dropdown.Item>}
                        {!loading && !hasMore && <Dropdown.Item disabled>No more drivers</Dropdown.Item>}
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                {
                    // selectedDriver && 
                    <button className='btn btn-primary'
                        onClick={handleAssignDriver}
                    >Confirm Change</button>
                }
                {/* <button className='btn btn-secondary' onClick={handleClose}>Close</button> */}
            </Modal.Footer>
        </Modal>
    );
};

export default AssignDriverModal;
