
import React, { useState } from 'react'
import { Button, Container, Form, Row, Col } from 'react-bootstrap'
import LocationSuggestion from '../../components/Maps/LocationSuggestion'
import { postWihoutMediaData, updateReq } from '../../lib/request';
import sweetAlert from 'sweetalert2';

export default function UpdatePickupLocation({ isReferesh, setIsRefresh, selectedLocation }) {
    const [isDeliveryAddress, setIsDeliveryAddress] = useState(false);
    const [pickUpLocation, setPickUpLocation] = useState(
        selectedLocation.customName
    );
    const [note, setNote] = useState(
        selectedLocation.note
    );
    const [location, setLocation] = useState({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        mapName: selectedLocation.mapName

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
        updateReq(`/admin/locations/pickup?id=${selectedLocation._id}`, payload, "admin").then((response) => {
            if (response.data.status) {
                sweetAlert.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'PickUp Location Updated Successfully!',
                })
                setIsRefresh(!isReferesh)


            } else {
                sweetAlert.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            }
        })

    }

    return (
        <div className='rounded-5 h-auto p-0' >
            <Row>
                <Form.Group>
                    <Form.Label className='fw-bold'>Enter Custom Name</Form.Label>
                    <Form.Control Code="text" placeholder="Enter Name"
                        onChange={(e) => setPickUpLocation(e.target.value)} value={pickUpLocation} className="custom-form-control"
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
                        label="Add as Delivery Address"
                        checked={isDeliveryAddress}
                        className="custom-checkbox"
                        onChange={(e) => setIsDeliveryAddress(e.target.checked)}
                    />
                </Form.Group>
            </Row>
            <Row>
                <Col className='mt-4 mb-3  mx-auto' >
                    <Button className="custom-btn w-100" variant="primary"
                        onClick={addPickUpLocation}
                    >Confirm Change</Button>
                </Col>
            </Row>
            {/* <Row>
                <Button variant="primary" className='mt-5 w-25 mx-auto '
                    onClick={addPickUpLocation}
                >Update Location</Button>
            </Row> */}
        </div>
    )
}
