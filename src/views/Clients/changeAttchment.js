import { useState } from "react";
import { Button, Modal, Row, Col, Card } from "react-bootstrap"
import { updateImage } from "../../lib/request";
import sweetAlert from 'sweetalert2';

export default function ChangeAttchment({ id, isRefresh, setIsRefresh }) {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleFile = (e) => {
        // multiple files
        const files = e.target.files; // Get all selected files
        const fileList = Array.from(files); // Convert FileList to array
        setFile(fileList);        
    }
    const handleSave = async () => {
        const formData = new FormData();
        file.map((file, index) => {
            formData.append(`attachments`, file);
        })
        formData.append('id', id);
        const res = await updateImage(`/admin/job/attachment?ID=${id}`, formData, "admin").then((res) => {
            if (res.data.status) {
                sweetAlert.fire({
                    title: 'Success',
                    text: 'Attachment Updated Successfully',
                    icon: 'success'
                })
                setIsRefresh(!isRefresh);
                handleClose();
            }
        });

    }


    return (
        <>
            <Button variant='primary' className='rounded-2 text-white fs-6 m-2'
                onClick={handleShow}
            >Change Attachment </Button>
            <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Change Attachment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Card className='p-2'>
                                <input type='file' onChange={handleFile} multiple />
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}
