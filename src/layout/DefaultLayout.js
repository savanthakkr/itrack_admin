import React,{useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { AppHeader, AppSidebar, AppSidebarClient, AppContent } from '../components/index'
const HEADER_HEIGHT = 60;
const SIDEBAR_WIDTH = 250
const DefaultLayout = () => {
  const location = useLocation()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const isClient = location.pathname.includes('/client/dashboard')
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // mobile breakpoint
    };

    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="d-flex flex-column min-vh-100" style={{ height: '100vh' }}>
    {/* HEADER */}
    <header
      style={{
        flexShrink: 0,
        height: HEADER_HEIGHT,
        width: '100%',
        background: '#eee',
        boxSizing: 'border-box',
        zIndex: 1040,
      }}
    >
      <AppHeader />
    </header>

    {/* MAIN: sidebar + content */}
    <main
      style={{
        flexGrow: 1,
        display: 'flex',
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
    >
      {/* Sidebar with fixed width */}
      <aside
        style={{
          width:!isMobileView && sidebarShow ? `${SIDEBAR_WIDTH}px` : '0px',
          backgroundColor: '#f8f9fa',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {isClient ? <AppSidebarClient /> : <AppSidebar />}
      </aside>

      {/* Content fills remaining space */}
      <section
        style={{
          flexGrow: 1,
          width: !isMobileView && sidebarShow ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
          overflowY: 'auto',
          padding: '1rem',
          boxSizing: 'border-box',
          minWidth: 0, 
          backgroundColor:'#F1F6F9'
        }}
      >
        <AppContent />
      </section>
    </main>
  </div>
  )
}

export default DefaultLayout







// import React from 'react'
// import { AppContent, AppSidebar, AppSidebarClient, AppFooter, AppHeader } from '../components/index'
// import { useLocation } from 'react-router-dom'

// const DefaultLayout = () => {
//   const [pathname, setPathname] = React.useState('')

//   const location = useLocation()
//   React.useEffect(() => {
//     setPathname(location.pathname)
//   }, [location])

  

//   return (
//     <div>
//       {pathname.includes('/client/dashboard') ? <AppSidebarClient /> : <AppSidebar />}
//       <div className="wrapper d-flex flex-column min-vh-100">
//         <AppHeader />
//         <div className="body flex-grow-1">
//           <AppContent />
//         </div>
//         {/* <AppFooter /> */}
//       </div>
//     </div>
//   )
// }

// export default DefaultLayout
