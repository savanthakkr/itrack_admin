import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { get, postWihoutMediaData } from '../../lib/request';
import swal from 'sweetalert2';
import { BsCircleFill } from 'react-icons/bs';

const AssignClientModal = ({ show, setShow, jobId, setIsRefresh, isReferesh, role, fetchData }) => {
    const [options, setOptions] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);

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
    const handleAssignClient = () => {
        const data = {
            job_id: jobId,
            admin_id: selectedClient._id
        }

        let url = '/admin/assignAdmin';

        postWihoutMediaData(`${url}`, data, "admin")
            .then((response) => {
                if (response.data.status) {
                    swal.fire({
                        icon: 'success',
                        title: 'Job has been transferred successfully!',
                    });
                    handleClose();
                    setIsRefresh(!isReferesh);
                    fetchData();

                }
            })
    }


    const loadOptions = async () => {
        let url = `/admin/info/allAdmin`
        try {
            setLoading(true);
            const response = await get(`${url}`, "admin");
            const newOptions = response.data.data;
            if (newOptions.length > 0) {
                setOptions(newOptions);
                // setPage(prevPage => prevPage + 1);
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
                <Modal.Title>Transfer Job to Client</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2 pb-4">
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="lazy-dropdown" className='w-75 mx-auto d-block  custom-bootstrap-dropdown'>
                        {
                            selectedClient ? `${selectedClient.firstname} ${selectedClient.lastname}` : 'Select from the list'
                        }
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        ref={dropdownRef}
                        className="series-dropdown-list overflow-scroll w-75"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                        onScroll={handleScroll}
                    >

                        {options.map(client => (
                            <Dropdown.Item
                                key={client._id}
                                onClick={() => setSelectedClient(client)}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <span>{client?.companyName}</span>
                                {/* <BsCircleFill color={client.online ? 'green' : 'red'} size={10} /> */}
                            </Dropdown.Item>
                        ))}
                        {loading && <Dropdown.Item disabled>Loading...</Dropdown.Item>}
                        {!loading && !hasMore && <Dropdown.Item disabled>No more clients</Dropdown.Item>}
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                {
                    // selectedClient && 
                    <button className='btn btn-primary'
                        onClick={handleAssignClient}
                    >Confirm Change</button>
                }
                {/* <button className='btn btn-secondary' onClick={handleClose}>Close</button> */}
            </Modal.Footer>
        </Modal>
    );
};

export default AssignClientModal;
