import React from 'react'
import Navbar from '../../components/landing/Navbar'
import '../../css/Homepage/hero.css'
import Services from '../../components/landing/Services'
import HowDo from '../../components/landing/HowDo'
import p_Frame1 from '../../assets/p_Frame1.png'
import p_Frame2 from '../../assets/p_Frame2.png'
import p_Frame3 from '../../assets/p_Frame3.png'
import Feedback from '../../components/landing/Feedback'
import Footer from '../../components/landing/Footer'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}

        <div className="hero d-flex flex-column align-items-center justify-content-center ">
          <div className="overlay"></div>
          <div className="position-relative text-white d-flex flex-column align-items-center justify-content-center ">
            <h4>MANAGE FROM ONE CENTER!</h4>
            <h1>From Your Country to 220 Countries ..</h1>
            <p>You can send fast, high quality and reasonable prices.</p>
            <button className="px-5 py-2 rounded-pill border-0 text-white " onClick={()=>navigate("/clientLogin")}>Client Login</button>
          </div>
        </div>

        {/* Services */}

        <div className="services pt-5 bg-white ">
          <Services />
        </div>

        {/* Quotes */}

        <div className="quotes d-flex flex-column align-items-center justify-content-center ">
          <h1 className="text-center text-white ">
            Lorem Ipsum is simply dummy text of the printing and <br /> typesetting industry. Lorem
            Ipsum has been the industry's <br /> standard dummy text ever since the 1500s
          </h1>
          <p className="text-center mt-5 text-white">
            Lorem ipsum dolor sit amet consectetur. Purus mattis vel in odio viverra cras dui.
            Fringilla sapien amet at <br /> suspendisse amet facilisis. Elit pellentesque sed arcu
            enim id montes sem in. Morbi tortor habitant diam <br /> ornare aliquet enim lorem.
          </p>
        </div>

        {/* How Do */}

        <div className="how_do pt-5 bg-white text-black ">
          <HowDo />
        </div>

        {/* Privileges */}

        <div className="privileges ">
          <h1 className="text-center d-block mx-auto  text-white ">Privileges</h1>
          <p className="text-center mt-5 text-white">
            Become a member now and get the best quality service at the most affordable prices.
          </p>

          <div className="row px-5 mt-5">
            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center mt-md-0 mt-4 ">
              <img src={p_Frame1} alt="" />
              <h6 className="mt-3 text-white">Fast service</h6>
              <p className="text-center text-white">
                Lorem ipsum dolor sit amet <br /> consectetur. Purus mattis vel <br /> in odio
                viverra cras dui.
              </p>
            </div>
            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center mt-md-0 mt-4 ">
              <img src={p_Frame2} alt="" />
              <h6 className="mt-3 text-white">Membership</h6>
              <p className="text-center text-white">
                Lorem ipsum dolor sit amet <br /> consectetur. Purus mattis vel <br /> in odio
                viverra cras dui.
              </p>
            </div>
            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center mt-md-0 mt-4 ">
              <img src={p_Frame3} alt="" />
              <h6 className="mt-3 text-white">Functional Interface</h6>
              <p className="text-center text-white">
                Lorem ipsum dolor sit amet <br /> consectetur. Purus mattis vel <br /> in odio
                viverra cras dui.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Feedback */}

        <div className="feedback pt-5 bg-white text-black ">
          <Feedback />
        </div>

        {/* Footer */}

        <Footer />
      </main>
    </>
  )
}

export default Landing
