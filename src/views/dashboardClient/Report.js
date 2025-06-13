
import React, { useEffect, useState } from 'react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { getJobCountByStatus, getTotalDocs } from '../../services/getTotalDocs';
import { Row, Col } from 'react-bootstrap';

export default function Report() {
  const [data, setData] = useState({
    unallocatedJobs: 0,
    pickedUpJobs: 0,
    deliveredJobs: 0,
    cancelledJobs: 0,
    driverAssignedJobs: 0,
    arrivalJobs: 0,
    totalJobs: 0,
    totalClients: 0,
    totalDrivers: 0,
  })
  const fetchJobCounts = async () => {
    try {
      const pendingJobs = await getJobCountByStatus("Pending", "client");
      const pickedUpJobs = await getJobCountByStatus("Picked Up", "client");
      const deliveredJobs = await getJobCountByStatus("Delivered", "client");
      const driverAssignedJobs = await getJobCountByStatus("Driver Assigned", "client");
      const cancelledJobs = await getJobCountByStatus("Cancelled", "client");
      const arrivalJobs = await getJobCountByStatus("Arrival on Pickup", "client");
      setData((prevData) => ({
        ...prevData,
        unallocatedJobs: pendingJobs,
        pickedUpJobs: pickedUpJobs,
        deliveredJobs: deliveredJobs,
        driverAssignedJobs: driverAssignedJobs,
        cancelledJobs: cancelledJobs,
        arrivalJobs: arrivalJobs,
      }));
    } catch (error) {
      console.error("Failed to fetch job counts:", error);
    }
  };
  const fetchDocumentCounts = async () => {
    try {
      const totalJobs = await getTotalDocs("JOB", "client");
      const totalClients = await getTotalDocs("CLIENT", "client");
      const totalDrivers = await getTotalDocs("DRIVER", "client");
      console.log("Jobs:", totalJobs, "Clients:", totalClients, "Drivers:", totalDrivers);

      setData((prevData) => ({
        ...prevData,
        totalJobs: totalJobs ?? 0,
        totalClients: totalClients ?? 0,
        totalDrivers: totalDrivers ?? 0,
      }));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch document counts:", error);
    }
  };
  useEffect(() => {
    fetchJobCounts();
    fetchDocumentCounts();
  }, []);
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-3">Reports</h4>
        </Col>
      </Row>
      <WidgetsDropdown className="mb-4" role="client" data={data} />
    </>
  )
}
