import React, {useState, useEffect} from 'react'
import './../../style.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

function NavSticky() {
    let history = useNavigate();
    const [scroll, setScroll] = useState(false);
    const [scrollclass, setScrollClass] = useState(false);
    const navfunc=()=>{
        var navbar = document.querySelector('.header-inner');
        if(window.scrollY  >10){
            setScrollClass('');
           // navbar.removeClass('navbar-scroll');
          }else{
            setScrollClass('navbar-scroll');
           // navbar.addClass('navbar-scroll');
          }
        
    }

    // useEffect(() => {
    //     console.log(window.scrollY);
    //     // window.addEventListener("scroll", () => {
    //     //   setScroll(window.scrollY > 10);
    //     // });
    //     navfunc();
    //   });
    let location = useLocation();
    useEffect(() => {
        window.addEventListener("scroll", () => {
          setScroll(window.scrollY > 10);
        });
      });



    return (
        <div>
            <header className="header">
            <div className={`header-inner ${scroll ? "navbar-scroll":""}`}>
                {/* <div className={`header-inner ${scrollclass}`}> */}
                    <div className="container-fluid px-lg-5">
                        <nav className="navbar navbar-expand-lg my-navbar">
                            <a className="navbar-brand" href="#"><span className="logo"/>
                                {/* <img src="img/logo5.png" className="img-fluid" style="width:30px; margin:-3px 0px 0px 0px;">Vishweb design</span> */}
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"><i className="fas fa-bars" style={{margin:"5px 0px 0px 0px"}}></i></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                            {
                        localStorage.getItem('token') !== null &&
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                                    <a className={`nav-link ${location.pathname === "/" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/">Home
                                        <span className="sr-only">(current)</span></a>
                                </li>

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '20px' }}>
                                        Birds Module
                                    </a>
                                    <ul className="dropdown-menu">
                                        
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/chicksmaster" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/chicksmaster">Chicks Master
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                       
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/mortalitylist" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/mortalitylist">Mortality Tracker
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/birdsale" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/birdsale">Bird sale
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '20px' }}>
                                        Egg Module
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/eggdailytracker" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/eggdailytracker">Egg Daily Tracker
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                       
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/eggsale" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/eggsale">Egg sale
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                       
                                    </ul>
                                </li>


                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '20px' }}>
                                        Dropdown
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/rawmaterials" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/rawmaterials">Raw materials
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/clientlist" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/clientlist">Client Master
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/shedlotmap" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/shedlotmap">Shed Lot Map
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/carton" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/carton">Carton Master
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                       

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/customerlist" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/customerlist">Customers
                                                <span className="sr-only">(current)</span></a>
                                        </li>



                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/medicine" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/medicine">Medicine
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                    </ul>
                                </li>

                            </ul>
                        }

                                {/* <ul className="navbar-nav m-auto">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="#">Products<span className="sr-only">(current)</span></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Downloads</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Enterprice</a>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Pricing
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <a className="dropdown-item" href="#">Action</a>
                                            <a className="dropdown-item" href="#">Another action</a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item" href="#">Something else here</a>
                                        </div>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Blog</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Resources</a>
                                    </li>
                                </ul> */}
                                <form className="form-inline my-2 my-lg-0">
                                    <button className="header-btn my-2 my-sm-0" type="submit">Subscribe free</button>
                                </form>
                            </div>
                        </nav>

                    </div>
                </div>


            </header>
        </div>
    )
}

export default NavSticky
