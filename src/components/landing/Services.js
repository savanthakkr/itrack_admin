import React from 'react'
import Frame1 from '../../assets/Frame1.png'
import Frame2 from '../../assets/Frame2.png'
import Frame3 from '../../assets/Frame3.png'
import Frame4 from '../../assets/Frame4.png'

const Services = () => {
  return (
    <section>
      <h3>Our services</h3>

      <div className="row mt-5">
        <div className="col-md-6 d-flex gap-4 mt-md-0 mt-4 ">
          <img src={Frame1} height={50} width={50} alt="" />
          <div>
            <h6>Free Domestic Transfer</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur. <br /> Purus mattis vel in odio viverra cras
              dui. <br />
              Fringilla sapien amet at suspendisse amet facilisis.{' '}
            </p>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end gap-4 mt-md-0 mt-4 ">
          <img src={Frame2} height={50} width={50} alt="" />
          <div>
            <h6>Free Consulting</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur. <br /> Purus mattis vel in odio viverra cras
              dui. <br />
              Fringilla sapien amet at suspendisse amet facilisis.{' '}
            </p>
          </div>
        </div>
        <div className="col-md-6 d-flex gap-4 mt-5 mt-md-0 mt-4 ">
          <img src={Frame3} height={50} width={50} alt="" />
          <div>
            <h6>Express Service</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur. <br /> Purus mattis vel in odio viverra cras
              dui. <br />
              Fringilla sapien amet at suspendisse amet facilisis.{' '}
            </p>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end mt-md-0 mt-4  gap-4 mt-5">
          <img src={Frame4} height={50} width={50} alt="" />
          <div>
            <h6>FBA Forwarding Service</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur. <br /> Purus mattis vel in odio viverra cras
              dui. <br />
              Fringilla sapien amet at suspendisse amet facilisis.{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
