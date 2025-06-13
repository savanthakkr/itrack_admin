
import React from 'react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { getJobCountByStatus } from '../../services/getTotalDocs'
import { getTotalDocs } from '../../services/getTotalDocs'
import { useState, useEffect } from "react";
import GraphReport from './graphReport';
import { Row, Col } from 'react-bootstrap';

export default function Report() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        unallocatedJobs: 0,
        pickedUpJobs: 0,
        deliveredJobs: 0,
        cancelledJobs: 0,
        driverAssignedJobs: 0,
        arrivalJobs: 0,
        toatalJobs: 0,
        totalClients: 0,
        totalDrivers: 0,

    })
    const fetchJobCounts = async () => {
        try {
            const pendingJobs = await getJobCountByStatus("Pending", "admin");
            const pickedUpJobs = await getJobCountByStatus("Picked Up", "admin");
            const deliveredJobs = await getJobCountByStatus("Delivered", "admin");
            const driverAssignedJobs = await getJobCountByStatus("Driver Assigned", "admin");
            const cancelledJobs = await getJobCountByStatus("Cancelled", "admin");
            const arrivalJobs = await getJobCountByStatus("Arrival on Pickup", "admin");


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
            const totalJobs = await getTotalDocs("JOB", "admin");
            const totalClients = await getTotalDocs("CLIENT", "admin");
            const totalDrivers = await getTotalDocs("DRIVER", "admin");
            setData((prevData) => ({
                ...prevData,
                totalJobs: totalJobs,
                totalClients: totalClients,
                totalDrivers: totalDrivers,
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
            {
                loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <WidgetsDropdown className="mb-4" role="admin" data={data} />
                        <Row className="align-items-center">
                            <Col>
                                <h4 className="mt-4 mb-0">Job Statistics Overview</h4>
                            </Col>
                        </Row>
                        <div className="mt-5">
                            < GraphReport data={data} />
                        </div>
                    </>
                )
            }

        </>
    )
}
