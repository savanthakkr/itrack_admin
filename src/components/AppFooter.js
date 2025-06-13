import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className="ms-auto">
        <span className="me-1">Design & Developed by</span>
        <a href="https://softseekersinfotech.com/" target="_blank" rel="noopener noreferrer">
          SoftSeekers Infotech Private Limited
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
