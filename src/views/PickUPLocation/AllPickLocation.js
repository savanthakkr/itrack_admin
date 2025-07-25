import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  Table,
  Form,
  Spinner
} from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useColorModes } from '@coreui/react'
import { deleteReq, get } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import AddPickupLocation from './AddPickupLocation'
import { getFormattedDAndT, utcToMelbourne } from '../../lib/getFormatedDate'
import UpdatePickupLocation from './UpdatePickupLocation'
import { CButton } from '@coreui/react'
import { BsThreeDotsVertical } from 'react-icons/bs'

function AllPickupLocation() {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const [loading, setLoading] = useState(false)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isAddSection, setIsAddSection] = useState(false)
  const [isUpdateSection, setUpdateSection] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddPickUpLocation = () => {
    setUpdateSection(false)
    setIsAddSection(!isAddSection)
  }

  const handleUpdatePickUpLocation = (location) => {
    setSelectedLocation(location)
    setIsAddSection(false)
    setUpdateSection(!isUpdateSection)
  }

  const handleDelete = (id) => {
    sweetAlert
      .fire({
        title: 'Are you sure you want to delete this pickup location?',
        text: 'Once deleted you can’t revert this action',
        imageUrl: 'src/assets/images/delete_modal_icon.png',
        imageWidth: 60,
        imageHeight: 60,
        imageAlt: 'Delete Icon',
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteReq(`/admin/locations/pickup?id=${id}`, 'admin').then((response) => {
            if (response.data.status) {
              sweetAlert.fire('Deleted!', 'Your record has been deleted.', 'success')
              setIsRefresh(!isReferesh)
              setUpdateSection(false)
            } else {
              sweetAlert.fire('Oops...', 'Something went wrong!', 'error')
            }
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your record is safe :)', 'error')
        }
      })
  }

  useEffect(() => {
    setLoading(true)
    get('/admin/locations/pickup', 'admin')
      .then((response) => {
        const locations = response?.data?.data || []
        setData(locations)
        setFilteredData(locations)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [isReferesh])

  // Filter the data whenever search term changes
  useEffect(() => {
    const filtered = data.filter((item) =>
      item?.customName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.mapName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.latitude?.toString().includes(searchTerm) ||
      item?.longitude?.toString().includes(searchTerm)
    )
    setFilteredData(filtered)
  }, [searchTerm, data])

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">Pick Up Location</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn" onClick={handleAddPickUpLocation}>
            Add Pick Up Location
          </CButton>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="mt-3 client-rates-table">
            {/* <Row className="mb-3 justify-content-between">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button variant="primary" onClick={handleAddPickUpLocation}>
                  <IoMdAdd /> Add PickUp Location
                </Button>
              </Col>
            </Row> */}

            <Modal show={isAddSection} onHide={() => setIsAddSection(false)} centered dialogClassName="custom-modal-sm custom-modal">
              <Modal.Header closeButton>
                <Modal.Title>Add Pickup Location</Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0">
                <AddPickupLocation isReferesh={isReferesh} setIsRefresh={setIsRefresh} setIsAddSection={setIsAddSection} />
              </Modal.Body>
            </Modal>

            <Modal show={isUpdateSection} onHide={() => setUpdateSection(false)} centered dialogClassName="custom-modal-sm custom-modal">
              <Modal.Header closeButton>
                <Modal.Title>Update Pickup Location</Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0">
                <UpdatePickupLocation
                  isReferesh={isReferesh}
                  setIsRefresh={setIsRefresh}
                  selectedLocation={selectedLocation}
                  setUpdateSection={setUpdateSection}
                />
              </Modal.Body>
            </Modal>

            <Table
              className="table-bordered custom-table"
              responsive
              hover
              style={{ minWidth: 1600 }}
            >
              <thead>
                <tr>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '70px' }}>#</th>
                  <th className="text-start px-4">Custom Name</th>
                  <th className="text-start px-4">Map Name</th>
                  <th className="text-start px-4">Latitude</th>
                  <th className="text-start px-4">Longitude</th>
                  <th className="text-start px-4">Date</th>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: 'auto' }}>Status</th>
                  <th className="text-start px-4" style={{ width: 'auto', minWidth: '70px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center">
                      <Spinner animation="border" className="mx-auto d-block" />
                    </td>
                  </tr>
                ) : filteredData?.length > 0 ? (
                  filteredData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-start px-4">{index + 1}</td>
                      <td className="text-start px-4">{item.customName}</td>
                      <td className="text-start px-4">{item.mapName}</td>
                      <td className="text-start px-4">{item.latitude}</td>
                      <td className="text-start px-4">{item.longitude}</td>
                      <td className="text-start px-4">
                        {item?.createdDateTime ? utcToMelbourne(item?.createdDateTime) : ''}
                      </td>
                      <td className="text-start px-4">
                        <div
                          className="rounded-5"
                          style={{
                            color: '#CD6200',
                            backgroundColor: '#FEF2E5',
                            width: 'fit-content',
                            padding: '4px 15px',
                          }}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="text-center action-dropdown-menu">
                        <div className="dropdown">
                          <button
                            className="btn btn-link p-0 border-0"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDotsVertical size={18} />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button
                                className="dropdown-item" onClick={() => handleUpdatePickUpLocation(item)}
                              >
                                Edit Details
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item" onClick={() => handleDelete(item._id)}
                              >
                                Delete Pickup Location
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                      {/* <td className="text-start px-4 cursor-pointer">
                        <FaRegEdit size={22} color="#624DE3" onClick={() => handleUpdatePickUpLocation(item)} />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <RiDeleteBin5Line size={22} color="#A30D11" onClick={() => handleDelete(item._id)} />
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

          </div>
        </Col>
      </Row>
    </>
  )
}

export default AllPickupLocation
