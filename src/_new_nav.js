import React from 'react'
import CIcon from '@coreui/icons-react'
import { HiMiniUsers } from 'react-icons/hi2'
import { FaTruckMoving } from 'react-icons/fa6'
import { FaBoxOpen } from 'react-icons/fa'
import { FaServer, } from 'react-icons/fa'
import { MdAddLocationAlt } from "react-icons/md";
import { FaLocationPinLock } from "react-icons/fa6";
import { GrLogout } from "react-icons/gr";
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
  cilTruck,
  cilTask,
  cilStorage,
  cilLocationPin,
  cilSpreadsheet,
  cilExitToApp
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _new_nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavGroup,
    name: 'Client',
    to: '/base',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Client',
        to: '/client/add',
      },
      {
        component: CNavItem,
        name: 'All Client',
        to: '/client/all',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Driver',
    to: '/base',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Drivers',
        to: '/driver/add',
      },
      {
        component: CNavItem,
        name: 'All Drivers',
        to: '/driver/all',
      },
    ],
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
        to: '/job/add',
      },
      {
        component: CNavItem,
        name: 'All Bookings',
        to: '/job/all',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Service Type',
    to: '/service/type',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Service Code',
    to: '/service/code',
    icon: <CIcon icon={cilStorage}  customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Pick Up location',
    to: '/location/pickup',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Drop location',
    to: '/location/drop',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports ',
    to: '/reports/stats',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavGroup,
  //   name: 'Driver',
  //   to: '/base',
  //   icon: <HiMiniUsers size={22} icon={cilUserPlus} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Accordion',
  //       to: '/base/accordion',
  //     },
  //   ],
  // },
]

const bottomNavItems = [
  {
    component: CNavItem,
    name: 'Logout',
    to: '/logout',
    icon: <CIcon icon={cilExitToApp} customClassName="nav-icon" />,
  }
]


export {_new_nav,bottomNavItems}
