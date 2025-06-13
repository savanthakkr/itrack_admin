import React from 'react'
import { Link } from 'react-router-dom'
import footer_img from '../../assets/footer_img.png'
import '../../css/Homepage/hero.css'

const Footer = () => {
  return (
    <section className="footer">
      <div className="row w-100 ">
        <div className="col-md-4 d-flex flex-column mt-md-0 mt-5">
          <h4 className="fw-bold mb-4 text-white">Links</h4>
          <Link to="/" className="text-white">
            Home
          </Link>{' '}
          <br />
          <Link to="/" className="text-white">
            About
          </Link>{' '}
          <br />
          <Link to="/" className="text-white">
            Contact Us
          </Link>
        </div>
        <div className="col-md-4 d-flex flex-column mt-md-0 mt-5">
          <h4 className="fw-bold mb-4 text-white">Legal</h4>
          <Link to="/" className="text-white">
            Conditions of Carriage
          </Link>{' '}
          <br />
          <Link to="/" className="text-white">
            Terms and conditions
          </Link>{' '}
          <br />
          <Link to="/" className="text-white">
            Privacy Policy
          </Link>
        </div>
        <div className="col-md-4 d-flex flex-column mt-md-0 mt-5">
          <h4 className="fw-bold mb-4 text-white">ADDRESS</h4>
          <p className="text-white">Address goes here</p>
          <p className="text-white">Contact : 0850 888 72 77</p>
        </div>
      </div>
      <div className="line"></div>

      <div className="row w-100 mt-5">
        <div className="col-md-6">
          <p className="text-white">© 2019 All Rights Reserved Design by SSI</p>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end ">
          <img src={footer_img} height={20} alt="" />
        </div>
      </div>
    </section>
  )
}

export default Footer
