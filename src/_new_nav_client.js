import React from 'react'
import CIcon from '@coreui/icons-react'
import { HiMiniUsers } from 'react-icons/hi2'

import { TbReport } from "react-icons/tb";

import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUserPlus,
  cilUser,
  cilTask,
  cilSpreadsheet,
  cilExitToApp
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const navigation = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/client/dashboards',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavGroup,
    name: 'Bookings',
    to: '/base',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'New Booking',
        to: '/client/dashboard/job/add',
      },
      {
        component: CNavItem,
        name: 'All Bookings',
        to: '/client/dashboard/job/all',
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Profile',
  //   to: '/client/dashboard/profile',
  //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW',
  //   // },
  // },
  {
    component: CNavItem,
    name: 'Reports ',
    to: '/client/dashboard/reports/stats',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },

]

const bottomNavItems = [
  {
    component: CNavItem,
    name: 'Profile',
    to: '/client/dashboard/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Logout',
    to: '/logout',
    icon: <CIcon icon={cilExitToApp} customClassName="nav-icon" />,
  },
]

export { navigation, bottomNavItems }
