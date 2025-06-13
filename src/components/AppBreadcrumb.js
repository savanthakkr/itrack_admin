import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import routes from '../routes'
import routesClient from '../routesClient'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { IoMdArrowRoundBack } from 'react-icons/io'

const AppBreadcrumb = () => {
  const navigate = useNavigate()
  const admintoken = localStorage.getItem('admintoken')
  const clientToken = localStorage.getItem('jdAirTrans-client-token')
  let home = ''
  let currebtRoutes = []
  if (admintoken) {
    currebtRoutes = routes
    home = '/dashboard'
  } else if (clientToken) {
    currebtRoutes = routesClient
    home = '/client/dashboards'
  }

  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, currebtRoutes) => {
    const currentRoute = currebtRoutes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, currebtRoutes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)
  const handleHomeClick = () => {
    navigate(home)
  }
  const handleBackClick = () => {
    navigate(-1)
  }
  return (
    <CBreadcrumb className="my-0">
      <div className="mx-auto">
        <IoMdArrowRoundBack
          onClick={handleBackClick}
          className="cursor-pointer fs-4 fw-bold me-2"
        />
      </div>
      {/* <CBreadcrumbItem onClick={handleHomeClick} className='cursor-pointer' >Home</CBreadcrumbItem> */}
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            className="cursor-pointer"
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
