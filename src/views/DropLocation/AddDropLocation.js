
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import LocationSuggestion from '../../components/Maps/LocationSuggestion'
import { postWihoutMediaData } from '../../lib/request';
import sweetAlert from 'sweetalert2';

export default function AddDropLocation({ isReferesh, setIsRefresh, setIsAddSection, setAddDropLocationModal, setFetchDrop }) {
    const [dropLocation, setDropLocation] = useState('');
    const [note, setNote] = useState('');
    const [isPickupAddress, setIsPickupAddress] = useState(false);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        mapName: ''

    });

    const addDropLocation = () => {
        if (dropLocation === '' || location.mapName === '' || location.latitude === 0 || location.longitude === 0) {
            sweetAlert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            })
            return;

        }
        const payload = {
            customName: dropLocation,
            latitude: location.latitude,
            longitude: location.longitude,
            mapName: location.mapName,
            note: note,
            addAsPickupAddress: isPickupAddress
        }
        postWihoutMediaData("/admin/locations/dropoff", payload, "admin").then((response) => {
            if (response.data.status) {
                sweetAlert.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Drop Location Added Successfully!',
                });
                setIsAddSection?.(false);
                setIsRefresh?.(!isReferesh);
                setAddDropLocationModal?.(false);
                setFetchDrop?.(true);
                setLocation({
                    latitude: 0,
                    longitude: 0,
                    mapName: ''
                });
                setDropLocation('');

            } else {
                sweetAlert.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.message || 'Something went wrong!',
                })
            }
        })

    }

    return (
        <div className='mx-auto rounded-5 h-auto' >
            <Row>
                <Form.Group>
                    <Form.Label className='fw-bold' >Enter Custom Name</Form.Label>
                    <Form.Control Code="text" placeholder="Enter Name"
                        onChange={(e) => setDropLocation(e.target.value)} value={dropLocation}
                    />
                </Form.Group>

            </Row>
            <Row>
                <Form.Group className='mt-3'>
                    <Form.Label className='fw-bold' >Select Location From Map</Form.Label>

                    <LocationSuggestion location={location} setLocation={setLocation} />
                </Form.Group>

            </Row>
            <Row>
                <Form.Group className='mt-3'>
                    <Form.Label className='fw-bold' >Note</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="Enter your Note Here"
                        onChange={(e) => setNote(e.target.value)} value={note} className="custom-form-control"
                    />
                </Form.Group>
            </Row>
            <Row className="mt-3">
                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        label="Add as Pickup Address"
                        checked={isPickupAddress}
                        className="custom-checkbox"
                        onChange={(e) => setIsPickupAddress(e.target.checked)}
                    />
                </Form.Group>
            </Row>
            <Row>
                <Col className='mt-3 mb-3  mx-auto' >
                    <Button className="custom-btn w-100"
                        onClick={addDropLocation}
                    >Add Location</Button>
                </Col>
            </Row>
        </div>
    )
}
