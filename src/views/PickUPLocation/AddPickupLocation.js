
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import LocationSuggestion from '../../components/Maps/LocationSuggestion'
import { postWihoutMediaData } from '../../lib/request';
import sweetAlert from 'sweetalert2';

export default function AddPickupLocation({ isReferesh, setIsRefresh }) {
    const [pickUpLocation, setPickUpLocation] = useState('');
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        mapName: ''

    });

    const addPickUpLocation = () => {
        if (pickUpLocation === '' || location.mapName === '' || location.latitude === 0 || location.longitude === 0) {
            sweetAlert.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            })
            return;

        }
        const payload = {
            customName: pickUpLocation,
            latitude: location.latitude,
            longitude: location.longitude,
            mapName: location.mapName
        }
        postWihoutMediaData("/admin/locations/pickup", payload, "admin").then((response) => {
            if (response.data.status) {
                sweetAlert.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'PickUp Location Added Successfully!',
                })
                setIsRefresh(!isReferesh)
                setLocation({
                    latitude: 0,
                    longitude: 0,
                    mapName: ''
                })
                setPickUpLocation('')

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
        <div className='rounded-5 h-auto'>
            <Row>
                <Form.Group>
                    <Form.Label className='fw-bold' >Enter Custom Name</Form.Label>
                    <Form.Control Code="text" placeholder="Enter Name"
                        onChange={(e) => setPickUpLocation(e.target.value)} value={pickUpLocation}
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
                <Col className='mt-4 mb-3  mx-auto' >

                    <Button className="custom-btn w-100"
                        onClick={addPickUpLocation}
                    >Add Location</Button>
                </Col>
            </Row>
        </div>
    )
}
