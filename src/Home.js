
import React from 'react';
import BannerCarousel from './Component/Carousel/BannerCarousel';


const Home = () => (
  <React.Fragment>
  {/* <p>Welcome to SANKI POULTRIES Online Portal</p> */}
  <BannerCarousel/>
  </React.Fragment>

  // <AliceCarousel
  //     autoPlay
  //     autoPlayControls
  //     autoPlayStrategy="none"
  //     autoPlayInterval={2000}
  //     animationDuration={2000}
  //     animationType="fadeout"
  //     infinite
  //     touchTracking={false}
  //     disableDotsControls
  //     disableButtonsControls
  //     items={items}
  // />
);

export default Home;