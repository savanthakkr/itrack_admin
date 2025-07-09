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
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import { useSelector } from 'react-redux'
const getNavItems = (role) => {
  const navItems = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      display: role === 'Admin' || role === 'Allocator' ? 'true' : 'false'
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
      display: role === 'Admin' ? 'true' : 'false',
      items: [
        {
          component: CNavItem,
          name: 'Add Client',
          to: '/client/add',
          display: role === 'Admin' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Client',
          to: '/client/all',
          display: role === 'Admin' ? 'true' : 'false'
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Driver',
      to: '/base',
      icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
      display: role === 'Admin' ? 'true' : 'false',
      items: [
        {
          component: CNavItem,
          name: 'Add Drivers',
          to: '/driver/add',
          display: role === 'Admin' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Drivers',
          to: '/driver/all',
          display: role === 'Admin' ? 'true' : 'false'
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Bookings',
      to: '/base',
      icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
      display: role === 'Admin' || role === 'Accountant' || role === 'Allocator' ? 'true' : 'false',
      items: [
        {
          component: CNavItem,
          name: 'New Booking',
          to: '/job/add',
          display: role === 'Admin' || role === 'Accountant' || role === 'Allocator' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Bookings',
          to: '/job/all',
          display: role === 'Admin' || role === 'Allocator' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Bookings',
          to: '/accountant/job/all',
          display: role === 'Accountant' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Invoices',
          to: '/invoices',
          display: role === 'Admin' || role === 'Accountant' ? 'true' : 'false'
        },
      ],
    },
    {
      component: CNavItem,
      name: 'Service Type',
      to: '/service/type',
      icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
      display: role === 'Admin' ? 'true' : 'false',
    },
    {
      component: CNavItem,
      name: 'Service Code',
      to: '/service/code',
      icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
      display: role === 'Admin' ? 'true' : 'false',
    },
    {
      component: CNavItem,
      name: 'Pick Up location',
      to: '/location/pickup',
      icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
      display: role === 'Admin' ? 'true' : 'false',
    },
    {
      component: CNavItem,
      name: 'Drop location',
      to: '/location/drop',
      icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
      display: role === 'Admin' ? 'true' : 'false',
    },
    {
      component: CNavGroup,
      name: 'Admin',
      to: '/base',
      icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
      display: role === 'Super Admin' ? 'true' : 'false',
      items: [
        {
          component: CNavItem,
          name: 'Add Admin',
          to: '/admin/add',
          display: role === 'Super Admin' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Admin',
          to: '/admin/all',
          display: role === 'Super Admin' ? 'true' : 'false'
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Accountant',
      to: '/base',
      icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
      display: role === 'Admin' ? 'true' : 'false',
      items: [
        {
          component: CNavItem,
          name: 'Add Accountant',
          to: '/accountant/add',
          display: role === 'Admin' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Accountant',
          to: '/accountant/all',
          display: role === 'Admin' ? 'true' : 'false'
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Allocator',
      to: '/base',
      icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
      display: role === 'Admin' ? 'true' : 'false',
      items: [
        {
          component: CNavItem,
          name: 'Add Allocator',
          to: '/allocator/add',
          display: role === 'Admin' ? 'true' : 'false'
        },
        {
          component: CNavItem,
          name: 'All Allocator',
          to: '/allocator/all',
          display: role === 'Admin' ? 'true' : 'false'
        },
      ],
    },
    {
      component: CNavItem,
      name: 'Reports ',
      to: '/reports/stats',
      icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
      display: role === 'Admin' || role === 'Accountant' ? 'true' : 'false',
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
  ];

  return navItems
    .filter(item => item.display)
    .map(item => ({
      ...item,
      items: item.items?.filter(sub => sub.display),
    }));
};

const bottomNavItems = [
  {
    component: CNavItem,
    name: 'Logout',
    to: '/logout',
    icon: <CIcon icon={cilExitToApp} customClassName="nav-icon" />,
    display: "true"
  }
]


export { getNavItems, bottomNavItems }
