import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { get } from '../lib/request'

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
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
// import navigation from '../_nav'
// my own sidebar
import { navigation, bottomNavItems } from '../_new_nav_client'

const AppSidebarCLient = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)


  useEffect(() => {
    setLoading(true)
    get('/client/profile', 'client').then((data) => {
      if (data.data.status) {
        setData(data.data.data)
        
        setLoading(false)
      }
    })
  }, [refresh])

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
        <CSidebarBrand to="/">
          <img
            width={'100%'}
            style={{ aspectRatio: 3 / 2, objectFit: 'contain'}}
            alt="logo"
            className='mx-auto '
            src={logo}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader> */}
      <div className="flex-grow-1 d-flex flex-column">
        <AppSidebarNav items={navigation} />
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
            <h6 className="mb-0">{data.firstname}  {data.lastname}</h6>
            <p className="mb-0">{data.email}</p>
          </div>
        </div>
        <small className="text-secondary mt-3 d-block">Version 1.0.1</small>
        {/* <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        /> */}
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebarCLient)
