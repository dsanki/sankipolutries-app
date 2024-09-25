import React,{Component, useState} from 'react'
import AliceCarousel from "react-alice-carousel";
import img1 from './image/kp1.png';
import img2 from './image/2.jpg';
import img3 from './image/3.jpg';
import img4 from './image/4.mp4';
import img5 from './image/5.jpg';
import img6 from './image/6.jpg';


import "react-alice-carousel/lib/alice-carousel.css";

// function Home() {
//   return (
//         <div className="mt-5 d-flex justify-content-left">
//            Welcome to Home page
//         </div>
//   )
// }

// export default Home

const items = [
  <div className="item">
    <img src={img1} className="media" width="100%"/>
  </div>,
   <div className="item">
    <img src={img2} className="media" />
  </div>,
    <div className="item">
    <img src={img3} className="media" />
  </div>,
   <div className="item">
    <img src={img4} className="media" />
  </div>,
   <div className="item">
   <img src={img5} className="media" />
 </div>,
  <div className="item">
   <img src={img6} className="media" />
 </div>
];

function Home() {  const [index, setIndex] = useState(0);

  const [mainIndex, setMainIndex] = useState(0);

  const slideNext = () => {
    if (mainIndex < items.length - 1) {
      setMainIndex(mainIndex + 1);
    }
  };

  const slidePrev = () => {
    if (mainIndex > 0) {
      setMainIndex(mainIndex - 1);
    }
  };

  return (
    <div className="carousel">
    <AliceCarousel
      activeIndex={mainIndex}
      disableDotsControls
      disableButtonsControls
      items={items}
    />
    <p className="index">{`${mainIndex + 1}/${items.length}`}</p>
    <div className="caption-container">
      <p className="caption">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </p>
    </div>

    <div className="btn-prev" onClick={slidePrev}>
      &lang;
    </div>
    <div className="btn-next" onClick={slideNext}>
      &rang;
    </div>
  </div>
   
  );
}

export default Home;


