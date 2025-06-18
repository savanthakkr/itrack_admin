import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/images/Logos/logo.png'

// sidebar nav config
// import navigation from '../_nav'
// my own sidebar
import { bottomNavItems, getNavItems } from '../_new_nav'
import UpdateLogoModal from './Modals/UpdateLogo'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoUrl, setLogoUrl] = useState(logo);

  // Function to upload and update logo
  const handleLogoSave = (file) => {
    const newUrl = URL.createObjectURL(file);
    setLogoUrl(newUrl);
  };

  const role = useSelector(state => state.role);
  const userInfo = useSelector(state => state.loggedInUser);
  const navItems = getNavItems(role);

  return (
    <CSidebar
      className="border-end"
      // colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" >
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <img
            width={'100%'}
            style={{ aspectRatio: 3 / 2, objectFit: 'contain',cursor:'pointer'}}
            alt="logo"
            className='mx-auto '
            src={logoUrl}
            onClick={() => setShowLogoModal(true)}
          />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader> */}

      <UpdateLogoModal
        show={showLogoModal}
        setShow={setShowLogoModal}
        currentLogoUrl={logoUrl}
        onSave={handleLogoSave}
      />

      <div className="flex-grow-1 d-flex flex-column">
        <AppSidebarNav items={navItems} />
      </div>
      <div className="border-top">
        <AppSidebarNav items={bottomNavItems} />
      </div>
      <CSidebarFooter className="border-top d-flex flex-column mt-auto">
        <div className="d-flex flex-row align-items-center">
          <div className="profile-icon me-2">
            <p className="mb-0">RR</p>
          </div>
          <div>
            <h6 className="mb-0">{userInfo?.firstName + " " + userInfo?.lastName}</h6>
            <p className="mb-0">{userInfo?.email}</p>
          </div>
        </div>
        <small className="text-secondary mt-3 d-block">Version 1.0.1</small>
        {/* <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        /> */}
      </CSidebarFooter>

      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
