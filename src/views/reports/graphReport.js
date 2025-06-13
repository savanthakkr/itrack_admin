// GraphReport.js
import React from 'react';
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs';
import { Row, Col } from 'react-bootstrap';

export default function GraphReport({ data }) {
    const barChartData = {
        labels: [
            'Unallocated Jobs', 
            'Picked Up Jobs', 
            'Delivered Jobs', 
            'Cancelled Jobs', 
            'Driver Assigned Jobs', 
            'Arrival Jobs', 
            'Total Jobs'
        ],
        datasets: [
            {
                label: 'Job Statistics',
                data: [
                    data.unallocatedJobs, 
                    data.pickedUpJobs, 
                    data.deliveredJobs, 
                    data.cancelledJobs, 
                    data.driverAssignedJobs, 
                    data.arrivalJobs, 
                    data.totalJobs
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const doughnutChartData = {
        labels: [
            'Unallocated Jobs', 
            'Picked Up Jobs', 
            'Delivered Jobs', 
            'Cancelled Jobs', 
            'Driver Assigned Jobs', 
            'Arrival Jobs'
        ],
        datasets: [
            {
                label: 'Job Distribution',
                data: [
                    data.unallocatedJobs, 
                    data.pickedUpJobs, 
                    data.deliveredJobs, 
                    data.cancelledJobs, 
                    data.driverAssignedJobs, 
                    data.arrivalJobs
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    color: '#333', // Darker font color
                },
            },
            title: {
                display: true,
                text: 'Job Statistics Overview',
                font: {
                    size: 16,
                    weight: 'bold',
                    color: '#333', // Darker font color
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#333', // Darker font color
                    font: {
                        size: 12,
                    },
                },
            },
            x: {
                ticks: {
                    color: '#333', // Darker font color
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    return (
        <div className="container">
            <Row>
                <Col md={8}>
                    <div className="bar-chart-container">
                        <CChartBar data={barChartData} options={options} />
                    </div>
                </Col>
                <Col md={4}>
                    <div className="doughnut-chart-container">
                        <CChartDoughnut data={doughnutChartData} options={options} />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
