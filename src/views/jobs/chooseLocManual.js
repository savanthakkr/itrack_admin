import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Modal, Dropdown } from 'react-bootstrap';
import LocationSuggestion from '../../components/Maps/LocationSuggestion';
import { postWihoutMediaData } from '../../lib/request';
import sweetAlert from 'sweetalert2';

export default function AddLocation({ type, refetch }) {
    const [customLocation, setCustomLocation] = useState('');

    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        mapName: ''
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addPickUpLocation = () => {
        if (customLocation === '' || location.mapName === '' || location.latitude === 0 || location.longitude === 0) {
            sweetAlert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            });
            return;
        }
        const payload = {
            customName: customLocation,
            latitude: location.latitude,
            longitude: location.longitude,
            mapName: location.mapName
        };

        let url = type === 'PickUp' ? "/admin/locations/pickup" : "/admin/locations/dropoff";

        postWihoutMediaData(url, payload, "admin").then((response) => {
            if (response.data.status) {
                refetch();
                setLocation({
                    latitude: 0,
                    longitude: 0,
                    mapName: ''
                });
                setCustomLocation('');
                handleClose();

            } else {
                sweetAlert.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.message || 'Something went wrong!',
                });
            }
        });
    };

    return (
        <>
            <Dropdown.Item
                onClick={handleShow}
                className=' fw-bold text-success text-bg-light'
            > Add New {type} Location</Dropdown.Item>

            <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Add {type} Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label className='fw-bold'>Enter Custom Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Custom Name"
                                        value={customLocation}
                                        onChange={(e) => setCustomLocation(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Form.Label className='fw-bold'>Select Location From Map</Form.Label>

                            <Col>
                                <LocationSuggestion location={location} setLocation={setLocation} />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" onClick={addPickUpLocation} className='text-white'>
                        Add Location
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
