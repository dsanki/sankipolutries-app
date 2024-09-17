import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom';


function Breadcrumbs() {
  const [path, setPath] = useState("");
  const location = useLocation();

  let currentLink = '';
  let _crumbs = location.pathname.split('/').filter(crumb => crumb !== '');
  const crumbs = _crumbs
    .map((crumb, i) => {
      if ((_crumbs.length - 1) - i > 0) {
      }
      currentLink = +`/${crumb}`;
      return (

        <li><a href={currentLink}>{crumb}</a></li>
        // <div className='crumb' key={crumb}>
        //     <Link to={currentLink}>{crumb}</Link>

        // </div>
      )
    })
  return (

    // <div className="breadcrumbs">
    //    {crumbs}
    // </div>
    <section id="breadcrumbs" className="breadcrumbs">
      <div className="containerx">
        <div className="d-flex justify-content-between align-items-center">
          <ol> {crumbs}</ol>
        </div>
      </div>
    </section>

  )
}


export default Breadcrumbs