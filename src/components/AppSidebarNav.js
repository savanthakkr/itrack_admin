import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CBadge, CNavLink, CSidebarNav, CNavItem } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const navigate = useNavigate()
  const handleLogout = () => {
    let currentPathname = window.location.href
    if (currentPathname.includes('/client/dashboard')) {
      localStorage.removeItem('jdAirTrans-client-token')
      localStorage.removeItem('clientDriverAssign')
      localStorage.removeItem('clientTrackPermission')
      sessionStorage.removeItem('selectedItem')
      localStorage.removeItem('role')
      localStorage.removeItem('email')
      localStorage.removeItem('firstname')
      localStorage.removeItem('lastname')

      navigate('/')
    } else {
      localStorage.removeItem('admintoken')
      sessionStorage.removeItem('selectedItem')
      localStorage.removeItem('role')
      localStorage.removeItem('email')
      localStorage.removeItem('firstname')
      localStorage.removeItem('lastname')
      navigate('/')
    }

  }
  const navLink = (name, icon, badge, indent = false) => {



    return (
      <>
        {/* {icon
          ? icon
          : indent && (
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
          )} */}
        {!indent && icon}
        &nbsp; &nbsp; {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    if (item.display === 'true') {
      const { component, name, badge, icon, to, ...rest } = item
      const isLogout = name?.toLowerCase() === 'logout'
      const Component = component
      return (
        <Component as="div" key={index}>
          {isLogout ? (
            <CNavLink role="button" onClick={handleLogout}>
              {navLink(name, icon, badge, indent)}
            </CNavLink>
          ) : (
            <CNavLink {...(to && { as: NavLink, to })} {...rest}>
              {navLink(name, icon, badge, indent)}
            </CNavLink>
          )}
          {/* {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )} */}
        </Component>
      )
    } else {
      return;
    }
  }

  const navGroup = (item, index) => {
    if (item.display === 'true') {
      const { component, name, icon, items, to, ...rest } = item
      const Component = component
      return (
        <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
          {item.items?.map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index, true),
          )}
        </Component>
      )
    } else {
      return;
    }
  }

  return (
    <>
      <CSidebarNav as={SimpleBar}>
        {items &&
          items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
        {/* <CNavItem as="div" className="mt-auto border-top border-bottom">
        <CNavLink role="button" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-3" />
          &nbsp; &nbsp; Logout
        </CNavLink>
      </CNavItem> */}
        {/* <div className="nav-item">
        <div className="d-flex flex-row align-items-center my-3">
          <div className="profile-icon me-2">
            <p className="mb-0">RR</p>
          </div>
          <div>
            <h6 className="mb-0">Name</h6>
            <p className="mb-0">email@gmail.com</p>
          </div>
        </div>
        <small className="text-secondary">Version 1.0.1</small>
      </div> */}

      </CSidebarNav>

    </>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
