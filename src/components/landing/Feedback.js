import React, { useRef, useState } from 'react'
import testi_img from '../../assets/testi_img.png'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'

const Feedback = () => {
  return (
    <section>
      <h3 className="text-center fw-semibold d-block mx-auto ">customer feedback</h3>
      <p className="mt-5 text-center text-secondary ">Hear from our great client</p>

      <div className="testimonial mx-auto mt-5 p-5 bg-white shadow rounded-4 ">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.right',
            prevEl: '.left',
          }}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="d-flex align-items-center flex-md-row flex-column  gap-5 ">
              <img src={testi_img} alt="" />
              <div className="position-relative ">
                <p>
                  Lorem ipsum dolor sit amet consectetur. Purus mattis vel in odio viverra cras dui.
                  Fringilla sapien amet at suspendisse amet facilisis. Elit pellentesque sed arcu
                  enim id montes sem in. Morbi tortor habitant diam ornare aliquet enim lorem.
                </p>
                <h4 className="fw-bold mt-4">Name</h4>
                <p>Esty Seller</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="d-flex align-items-center  flex-md-row flex-column gap-5 ">
              <img src={testi_img} alt="" />
              <div className="position-relative ">
                <p>
                  Lorem ipsum dolor sit amet consectetur. Purus mattis vel in odio viverra cras dui.
                  Fringilla sapien amet at suspendisse amet facilisis. Elit pellentesque sed arcu
                  enim id montes sem in. Morbi tortor habitant diam ornare aliquet enim lorem.
                </p>
                <h4 className="fw-bold mt-4">Name</h4>
                <p>Esty Seller</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="d-flex align-items-center  flex-md-row flex-column gap-5 ">
              <img src={testi_img} alt="" />
              <div className="position-relative ">
                <p>
                  Lorem ipsum dolor sit amet consectetur. Purus mattis vel in odio viverra cras dui.
                  Fringilla sapien amet at suspendisse amet facilisis. Elit pellentesque sed arcu
                  enim id montes sem in. Morbi tortor habitant diam ornare aliquet enim lorem.
                </p>
                <h4 className="fw-bold mt-4">Name</h4>
                <p>Esty Seller</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="navigation d-flex align-items-center gap-4 ">
          <div className="left shadow  d-flex align-items-center justify-content-center ">
            <FaAngleLeft />
          </div>
          <div className="right shadow  d-flex align-items-center justify-content-center ">
            <FaAngleRight />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feedback
