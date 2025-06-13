import React from 'react'
import arrow from '../../assets/arrow.png'

const HowDo = () => {
  return (
    <section>
      <h3>How do I ship with company name?</h3>

      <p className="mt-5">Send your overseas cargo with company name, save both time and prices.</p>

      <div className="row mt-5">
        <div className="col-md-6 d-flex align-items-center gap-4 ">
          <img src={arrow} height={20} width={20} alt="" />
          <h6 className="m-0">Sign Up and Create a Shipping Label</h6>
        </div>
        <div className="col-md-6 d-flex align-items-center gap-4 ps-md-5 mt-md-0 mt-4">
          <img src={arrow} height={20} width={20} alt="" />
          <h6 className="m-0"> Get Your Shipment to Kargopass</h6>
        </div>
        <div className="col-md-6 d-flex align-items-center gap-4 mt-md-5 mt-4 ">
          <img src={arrow} height={20} width={20} alt="" />
          <h6 className="m-0"> Payment options </h6>
        </div>
        <div
          className="col-md-6 d-flex align-items-center gap-4 mt-md-5 mt-4  ps-md-5 "
        >
          <img src={arrow} height={20} width={20} alt="" />
          <h6 className="m-0"> Cargo Tracking</h6>
        </div>
      </div>
    </section>
  )
}

export default HowDo
