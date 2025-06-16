import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { get } from '../lib/request'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { Button } from 'react-bootstrap'
import SearchBar from './SearchBar'
import logo from '../assets/images/Logos/logo.png'
import UpdateLogoModal from './Modals/UpdateLogo'


const AppHeader = () => {
  const navigate = useNavigate()
  let imgSrc = process.env.Image_Src
  const headerRef = useRef()
  const searchQuery = useSelector((state) => state.searchQuery)
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [logoUrl, setLogoUrl] = useState(logo)
  const [showLogoModal, setShowLogoModal] = useState(false)
  const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)

  // Function to upload and update logo
  const handleLogoSave = (file) => {
    const newUrl = URL.createObjectURL(file);
    setLogoUrl(newUrl);
  };
  useEffect(() => {
    setColorMode('light')
    const token = localStorage.getItem('jdAirTrans-client-token');
    console.log(token);
    console.log("sjaksjasjasjkajska");
    
    
  }, [])

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const handleLogout = () => {
    let currentPathname = window.location.href
    console.log('currentPathname', currentPathname)
    if (currentPathname.includes('/client/dashboard')) {
      localStorage.removeItem('jdAirTrans-client-token')
      localStorage.removeItem('clientDriverAssign')
      localStorage.removeItem('clientTrackPermission')
      sessionStorage.removeItem('selectedItem')

      navigate('/')
    } else {
      localStorage.removeItem('admintoken')
      sessionStorage.removeItem('selectedItem')

      navigate('/')
    }
  }

  useEffect(() => {
    setLoading(true)
    if (localStorage.getItem('jdAirTrans-client-token') != null) {
      get('/client/profile', 'client').then((data) => {
      if (data.data.status) {
        setData(data.data.data)
        setLogoUrl(imgSrc + data.data.data.logoKey)
        setLoading(false)
      }
    })
    }
    
  }, [refresh])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const onSearch = (newData) => {
    setMessage('')
    if (newData.length === 0) {
      setMessage('No data found')
    }
    setData(newData)
  }

  const handleClear = () => {
    setMessage('')
    setIsReferesh(!isReferesh)
    setSearchQuery({
      AWB: '',
      clientId: '',
      driverId: '',
      fromDate: '',
      toDate: '',
      currentStatus: '',
      jobId: '',
      clientName: '',
      driverName: '',
      serviceType:'',
      serviceCode:''
    })
  }

  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery',
      payload: query,
    })
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef} style={{ height: '60px', zIndex: 1030 }}>
      <CContainer className="px-4 d-flex justify-content-between align-items-center"
        fluid
        style={{ height: '100%' }}>
        <div className="d-flex align-items-center">
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          {/* Logo after toggler */}
          <img
            src={logoUrl}
            alt="logo"
            style={{
              cursor: 'pointer',
              width: '80px', // adjust size as needed
              aspectRatio: '3 / 2',
              objectFit: 'contain',
              marginLeft: '1rem',
            }}
            onClick={() => setShowLogoModal(true)}
          />
        </div>
        <UpdateLogoModal
        show={showLogoModal}
        setShow={setShowLogoModal}
        currentLogoUrl={logoUrl}
        onSave={handleLogoSave}
      />
        <CHeaderNav className="w-50 w-lg-100">
          <SearchBar
            onSearch={(results) => setSearchResults(results)}
            role="admin"
            handleClear={handleClear}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {/* <Button variant="primary" className="me-2" onClick={handleLogout}>
            Logout
          </Button> */}

          {/* <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown> */}
          <li className="nav-item py-1"></li>
          {/* <AppHeaderDropdown /> */}
        </CHeaderNav>
      </CContainer>
      {/* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
