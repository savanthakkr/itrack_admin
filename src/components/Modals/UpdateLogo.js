import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Image, Alert } from 'react-bootstrap';
import { updateImage, updateReq } from '../../lib/request';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const UpdateLogoModal = ({ show, setShow, currentLogoUrl, onSave, setRefresh, refresh }) => {
    let imgSrc = process.env.Image_Src;
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentLogoUrl);
    const [error, setError] = useState('');
    const fileInputRef = useRef();
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const userId = useSelector((state) => state.loggedInUser.user)
    const role = useSelector((state) => state.role);

    useEffect(() => {
        if (localStorage.getItem('logoKey')) {
            setPreviewUrl(imgSrc + localStorage.getItem('logoKey'));
        }
    }, [])

    // Close modal
    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(currentLogoUrl);
        setError('');
        setShow(false);
    };

    // Validate file and set preview
    const handleFile = (file) => {
        setError('');
        if (!validTypes.includes(file.type)) {
            setError('Only PNG and JPG files are allowed.');
            setSelectedFile(null);
            setPreviewUrl(currentLogoUrl);
            return;
        }
        if (file.size > maxSize) {
            setError('File size must be less than 5MB.');
            setSelectedFile(null);
            setPreviewUrl(currentLogoUrl);
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle file selected via dialog
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFile(file);
            e.dataTransfer.clearData();
        }
    };

    // Prevent default drag behaviors
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Save selected file
    const handleSave = () => {
        if (!selectedFile) return;

        // setError('');
        // setShow(false);
        let formData = new FormData();
        formData.append('logo', selectedFile);
        if (role === 'Client') {
            updateImage(`/client/logo`, formData, 'client').then((data) => {
                console.log('data', data.data);
                if (data.data.status) {
                    setRefresh(!refresh)
                    setShow(false)
                    setSelectedFile(null);
                    onSave(selectedFile);
                    localStorage.setItem('logoKey', data?.data?.data?.logoKey);
                    Swal.fire({
                        icon: 'success',
                        title: 'Logo Updated Successfully!',
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went worng.',
                    })
                }
            })
        } else {
            updateImage(`/super-admin/admin/image-update?ID=${userId.toString()}`, formData, 'admin').then((data) => {
                if (data.data.status) {
                    setRefresh(!refresh)
                    setShow(false)
                    setSelectedFile(null);
                    onSave(selectedFile);
                    localStorage.setItem('logoKey', data?.data?.data?.imageKey);
                    Swal.fire({
                        icon: 'success',
                        title: 'Logo Updated Successfully!',
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went worng.',
                    })
                }
            })
        }
    };

    // Open file dialog
    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>View Logo</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center mb-3">
                    <Image
                        src={previewUrl}
                        alt="Logo Preview"
                        rounded
                        fluid
                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                    />
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                {/* Drag and drop area with upload button beside text */}
                <h6>Update Logo</h6>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border border-dashed py-2 px-3 mb-1 d-flex align-items-center justify-content-start"
                    style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                    onClick={openFileDialog}
                >
                    <Button
                        className="me-3 custom-btn"
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation(); // prevent triggering drag-drop area click
                            openFileDialog();
                        }}
                    >
                        Upload
                    </Button>
                    <div>
                        <p className="mb-0 text-secondary">or drag file here</p>
                    </div>

                </div>
                <small className="text-muted">Please ensure that the file size does not exceed 5MB and that it is in either PNG or JPG format.</small>

            </Modal.Body>


            <Modal.Footer>
                <Button variant="primary" onClick={handleSave} disabled={!selectedFile}>
                    Confirm Change
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateLogoModal;
