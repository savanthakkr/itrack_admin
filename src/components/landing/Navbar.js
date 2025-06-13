import React from 'react'
import '../../css/navbar.css'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { MdMenu } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }
  return (
    <nav
      className="d-md-flex shadow align-items-center px-5 bg-white justify-content-between  position-fixed w-100 py-2"
      style={isOpen ? { height: '55vh' } : { height: '80px' }}
    >
      <img style={{ cursor: 'pointer' }} src={logo} alt="logo" />
      <div className="d-md-flex mt-md-0 mt-5 flex-md-row flex-column align-items-center ">
        <Link to="/" className="mx-3 fs-6">
          Home
        </Link>{' '}
        <br /> <br />
        <Link to="/" className="mx-3 fs-6 ">
          About
        </Link>{' '}
        <br /> <br />
        <Link to="/" className="mx-3 fs-6">
          Contact
        </Link>{' '}
        <br /> <br />
        <div className="ms-md-4 mt-md-0 mt-4">
          <button onClick={() => navigate('/clientLogin')} className="rounded-5 px-3 py-1 bg-transparent client_btn">Client Login</button>
          <button onClick={() => navigate('/login')} className="rounded-5 text-white px-3 py-2 ms-4 admin_btn">
            Admin Login
          </button>
        </div>
      </div>

      <div onClick={() => handleOpen()} className="menu text-black d-md-none ">
        {isOpen ? <IoClose className="fs-3" /> : <MdMenu className="fs-3" />}
      </div>
    </nav>
  )
}

export default Navbar
