import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CarouselImage1 from '../../image/100.JPG';
import CarouselImage2 from '../../image/101.JPG';
import CarouselImage3 from '../../image/102.JPG';
import CarouselImage4 from '../../image/103.JPG';
import CarouselImage5 from '../../image/104.JPG';
import CarouselImage6 from '../../image/105.JPG';
// import CarouselImage7 from '../../image/106.JPG';

function BannerCarousel() {

    const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <React.Fragment>
<div id="carouselExampleIndicators" className="carousel slide">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src={CarouselImage1} className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src={CarouselImage2} className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img  src={CarouselImage3}className="d-block w-100" alt="..."/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
    </React.Fragment>
  );
}

export default BannerCarousel
