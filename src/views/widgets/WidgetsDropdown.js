import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { getJobCountByStatus } from '../../services/getTotalDocs'
import { getTotalDocs } from '../../services/getTotalDocs'
import { CCard, CCardBody } from '@coreui/react'

const CustomWidget = ({ title, value, color }) => {
  return (
    <CCol sm={6} xl={4} xxl={3}>
      <CCard style={{ backgroundColor: color, color: '#fff' }}>
        <CCardBody className="d-flex flex-column align-content-between">
          <div className="fs-6">{title}</div>
          <div className="fs-2 fw-bold mt-3">{value}</div>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

const WidgetsDropdown = ({ data }) => {
  console.log('data', data);
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  return (
    <CRow xs={{ gutter: 4 }}>
      <CustomWidget title="Unallocated Jobs" value={data?.unallocatedJobs} color="#3E86F3" />
      <CustomWidget title="Picked up Jobs" value={data?.pickedUpJobs} color="#04A0B1" />
      <CustomWidget title="Delivered Jobs" value={data?.deliveredJobs} color="#EAA000" />
      <CustomWidget title="Cancelled Jobs" value={data?.cancelledJobs} color="#FD4043" />
      <CustomWidget title="Total Jobs" value={data?.totalJobs} color="#255696" />
      <CustomWidget title="Driver Assigned Jobs" value={data?.driverAssignedJobs} color="#02A432" />
      <CustomWidget title="Total Clients" value={data?.totalClients} color="#EA498F" />
      <CustomWidget title="Total Drivers" value={data?.totalDrivers} color="#8222F9" />
       {/* <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {data?.unallocatedJobs}{' '}
            </>
          }
          title="Unallocated Jobs"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {
                data?.pickedUpJobs
              }{' '}

            </>
          }
          title="Picked up Jobs"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {
                data?.deliveredJobs
              }{' '}

            </>
          }
          title="Delivered Jobs"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              {
                data?.cancelledJobs
              }{' '}

            </>
          }
          title="Cancelled Jobs"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="success"
          value={
            <>
              {
                data?.driverAssignedJobs
              }{' '}

            </>
          }
          title="Driver Assigned Jobs"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {
                data?.totalJobs
              }{' '}

            </>
          }
          title="Total Jobs"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {
                data?.totalClients
              }{' '}

            </>
          }
          title="Total Clients"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {
                data?.totalDrivers
              }{' '}

            </>
          }
          title="Total Drivers"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol> */}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
