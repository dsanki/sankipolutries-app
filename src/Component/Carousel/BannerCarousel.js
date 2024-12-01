import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CarouselImage1 from '../../image/kpf/00001.png';
import CarouselImage2 from '../../image/kpf/00002.png';
import CarouselImage3 from '../../image/kpf/00003.png';
import CarouselImage4 from '../../image/kpf/00004.png';
import CarouselImage5 from '../../image/kpf/00005.png';
import CarouselImage6 from '../../image/kpf/00006.png';
import CarouselImage7 from '../../image/kpf/00007.png';
import CarouselImage8 from '../../image/kpf/00008.png';
import CarouselImage9 from '../../image/kpf/00009.png';
import CarouselImage10 from '../../image/kpf/00010.png';
// import CarouselImage11 from '../../image/00011.jpg';
// import CarouselImage12 from '../../image/000012.jpg';
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
          <button type="button" data-bs-target="#carouselExampleIndicators"
           data-bs-slide-to="0" className="active"
            aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" 
          data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" 
          data-bs-slide-to="2" aria-label="Slide 3"></button>

          <button type="button" data-bs-target="#carouselExampleIndicators" 
          data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" 
          data-bs-slide-to="4" aria-label="Slide 5"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="6" aria-label="Slide 7"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="7" aria-label="Slide 8"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="8" aria-label="Slide 9"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="9" aria-label="Slide 10"></button>
         <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="10" aria-label="Slide 11"></button>
           {/* <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="11" aria-label="Slide 12"></button> */}
        </div>
        <div className="carousel-inner">
          {/**/}
          <div className="carousel-item active">
            <img src={CarouselImage1} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage2} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage3} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage4} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage5} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage6} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage7} className="d-block w-100" alt="..." />
          </div> 

          <div className="carousel-item">
            <img src={CarouselImage8} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage9} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage10} className="d-block w-100" alt="..." />
          </div>
          {/* <div className="carousel-item">
            <img src={CarouselImage11} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={CarouselImage12} className="d-block w-100" alt="..." />
          </div> */}

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
