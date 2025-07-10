import { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Dropdown, Spinner } from 'react-bootstrap';
import { get, updateReq } from '../../lib/request';
import sweetAlert from 'sweetalert2'
import Select from 'react-select';

function formatDateForInput(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
}

export default function EditJob({ show, handleClose, job, setIsRefresh, isReferesh, role }) {

    const [editFormData, setEditFormData] = useState({
        AWB: job.AWB,
        pieces: job.pieces,
        weight: job.weight,
        serviceTypeId: job.serviceTypeId._id,
        custRefNumber: job.custRefNumber,
        serviceCodeId: job.serviceCodeId._id,
        readyTime: formatDateForInput(job.pickUpDetails.readyTime),
        cutOffTime: formatDateForInput(job.dropOfDetails.cutOffTime),
        status: job.status,
        note: job.note
    });
    
    const [serviceTypes, setServiceTypes] = useState([]);
    const [serviceCode, setServiceCode] = useState([]);
    const [dropDownData, setDropDownData] = useState({
        serviceType: {
            text: job.serviceTypeId.text,
            _id: job.serviceTypeId._id
        },
        serviceCode: {
            text: job.serviceCodeId.text,
            _id: job.serviceCodeId._id
        },

    })
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)


    // handle change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    }

    // handle save
    const handleSave = () => {
        const data = {
            AWB: editFormData.AWB,
            pieces: editFormData.pieces,
            weight: editFormData.weight,
            serviceTypeId: dropDownData.serviceType._id,
            custRefNumber: editFormData.custRefNumber,
            serviceCodeId: dropDownData.serviceCode._id,
            readyTime: editFormData.readyTime,
            cutOffTime: editFormData.cutOffTime,
            status: editFormData.status,
            note: editFormData.note
        }

        updateReq(`/${role || "admin"}/job/?id=${job._id}`, data, role || "admin").then((response) => {
            if (response.data.status) {
                sweetAlert.fire({
                    title: 'Success',
                    text: 'Job Updated Successfully',
                    icon: 'success'
                })
                setIsRefresh(!isReferesh)
                handleClose()
            }
        }).catch((error) => {
            console.error(error)
            sweetAlert.fire({
                title: 'Error',
                text: 'Job Updated Failed',
                icon: 'error'
            })
        })
    }


    // getting service type and service code

    useEffect(() => {
        setLoading(true)
        setLoading2(true)
        // get service type
        let url = ""
        if (role === "client") {
            url = "/client/serviceType"
        } else {
            url = "/client/service/type"

        }
        get(`${url}`, role || 'admin')
            .then((response) => {
                setServiceTypes(response.data.data)
                setLoading(false)
            })
            .catch((error) => {
                console.error(error)
            })
        // get service code
        let url2 = ""
        if (role === "client") {
            url2 = "/client/serviceCode"
        } else {
            url2 = "/client/service/code"

        }
        get(`${url2}`, role || 'admin')
            .then((response) => {
                setServiceCode(response.data.data)
                setLoading2(false)
            })
            .catch((error) => {
                console.error(error)
            })


    }, [])

    const serviceTypeOptions =
        serviceTypes
            ?.map((serviceType) => ({
                value: serviceType._id,
                label: serviceType.text,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) || [];

    const handleServiceTypeChange = (selectedOption) => {
        setDropDownData({
            ...dropDownData,
            serviceType: {
                text: selectedOption.label,
                _id: selectedOption.value,
            },
        });

    };

    const serviceCodeOptions =
        serviceCode?.map((code) => ({
            value: code._id,
            label: code.text,
        })).sort((a, b) => a.label.localeCompare(b.label)) || [];

    const handleServiceCodeChange = (selectedOption) => {
        setDropDownData({
            ...dropDownData,
            serviceCode: {
                _id: selectedOption?.value,
                text: selectedOption?.label,
            },
        });
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Job</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-0">
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>AWB</Form.Label>
                                <Form.Control type="text" placeholder="AWB"
                                    value={editFormData.AWB}
                                    name="AWB"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Pieces</Form.Label>
                                <Form.Control type="number" placeholder="Pieces"
                                    value={editFormData.pieces}
                                    name="pieces"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Weight</Form.Label>
                                <Form.Control type="number" placeholder="Weight"
                                    value={editFormData.weight}
                                    name="weight"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Service Type</Form.Label>
                                <Select
                                    className="w-100"
                                    classNamePrefix="custom-select"
                                    isSearchable
                                    isLoading={loading}
                                    options={serviceTypeOptions}
                                    value={
                                        dropDownData.serviceType._id
                                            ? {
                                                value: dropDownData.serviceType._id,
                                                label: dropDownData.serviceType.text,
                                            }
                                            : null
                                    }
                                    onChange={handleServiceTypeChange}
                                    placeholder="Select Service Type"
                                />
                                {/* <Dropdown data-bs-theme="primary">
                                    <Dropdown.Toggle
                                        id="dropdown-button-dark-example1"
                                        variant="secondary"
                                        className="w-100"
                                    >
                                        {dropDownData.serviceType.text}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='w-100'>
                                        {
                                            loading ? <Spinner animation="border" variant="primary" /> : serviceTypes?.map((serviceType) => (
                                                <Dropdown.Item key={serviceType._id}
                                                    onClick={() => setDropDownData({ ...dropDownData, serviceType: { text: serviceType.text, _id: serviceType._id } })}
                                                >{serviceType.text}</Dropdown.Item>
                                            ))
                                        }

                                    </Dropdown.Menu>
                                </Dropdown> */}
                            </Form.Group>
                        </Row>


                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Service Code</Form.Label>
                                <Select
                                    className="w-100 custom-select"
                                    classNamePrefix="custom-select"
                                    options={serviceCodeOptions}
                                    value={
                                        dropDownData.serviceCode._id
                                            ? {
                                                value: dropDownData.serviceCode._id,
                                                label: dropDownData.serviceCode.text,
                                            }
                                            : null
                                    }
                                    onChange={handleServiceCodeChange}
                                    placeholder="Select Service Code"
                                    isSearchable
                                    isLoading={loading2}
                                />
                                {/* <Dropdown data-bs-theme="primary">
                                    <Dropdown.Toggle
                                        id="dropdown-button-dark-example1"
                                        variant="secondary"
                                        className="w-100"
                                    >
                                        {dropDownData.serviceCode.text}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='w-100'>
                                        {
                                            loading2 ? <Spinner animation="border" variant="primary" /> : serviceCode?.map((serviceCode) => (
                                                <Dropdown.Item key={serviceCode._id}
                                                    onClick={() => setDropDownData({ ...dropDownData, serviceCode: { text: serviceCode.text, _id: serviceCode._id } })}
                                                >{serviceCode.text}</Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown> */}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Customer Reference No</Form.Label>
                                <Form.Control type="text" placeholder="Enter Customer Reference No"
                                    value={editFormData.custRefNumber}
                                    name="custRefNumber"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Row>
                        {/* <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Ready Time</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Ready Time"
                                    value={editFormData.readyTime}
                                     
                                    name="readyTime"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Cut-Off Time</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Cut-Off Time"
                                    value={editFormData.cutOffTime}
                                    name="cutOffTime"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Row> */}


                        {/* <Row className="mb-3">

                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Status</Form.Label>
                                <Form.Select>
                                    <option value="Delivered">Picking Up</option>
                                    <option value="Pending">Picked Up</option>
                                    <option value="In Transit">On The Way</option>
                                    <option value="In Transit">Delivered</option>
                                </Form.Select>
                            </Form.Group>
                        </Row> */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Note</Form.Label>
                                <Form.Control as="textarea" placeholder="Enter Note"
                                    rows={4} // Number of visible rows in the textarea
                                    value={editFormData.note}
                                    name="note"
                                    onChange={handleEditChange}
                                />

                            </Form.Group>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleSave}>Confirm Change</button>
                    {/* <button className="btn btn-secondary" onClick={handleClose}>Close</button> */}
                </Modal.Footer>

            </Modal>
        </>
    )
}
