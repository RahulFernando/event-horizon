// import Image from "next/image";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function ImageCarousel() {
  return (
    <div className="slider-container">
      <Carousel autoPlay showThumbs={false} interval={4000} infiniteLoop>
        <div>
          <img
            src="/images/office-party.jpg"
            alt="image_1"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <img
            src="/images/wedding.jpg"
            alt="image_2"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <img
            src="/images/birthday-party.jpg"
            alt="image_2"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Carousel>
    </div>
  );
}

export default ImageCarousel;
