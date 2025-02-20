import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
//  import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

function Navigation() {

    let history = useNavigate();
    const [companydetails, setCompanyDetails] = useState(JSON.parse(localStorage.getItem('companydetails')));
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isadmin');
        localStorage.removeItem('companyid');
        localStorage.removeItem('companydetails');
        history('/login')
    }
    
    let location = useLocation();
    useEffect(() => {
      setCompanyDetails(JSON.parse(localStorage.getItem('companydetails')));
    }, [location])

    return (
        <div>

            <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary">
                <div className="container-fluid">
                    {
                        companydetails != null && companydetails.CompanyName != "" ?

                            <a className="navbar-brand" href="/">
                                {companydetails.CompanyName.toUpperCase()}</a> : ""

                    }
                    {/* <a className="navbar-brand" href="/">{(companydetails!=typeof('undefined')?(companydetails["CompanyName"]).toUpperCase():"")}</a> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {
                            localStorage.getItem('token') !== null &&
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                        aria-expanded="false" style={{ fontSize: '20px' }}>
                                        Purchase
                                    </a>
                                    <ul className="dropdown-menu">

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/chicksmaster" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/chicksmaster">Chicks
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/chicksfeed" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/chicksfeed">Feed
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/medicine" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/medicine">Medicine/Vaccine
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/carton" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/carton">Packaging
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/rawmaterials" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/rawmaterials">Raw materials
                                                <span className="sr-only">(current)</span></a>
                                        </li>     

                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" 
                                    aria-expanded="false" style={{ fontSize: '20px' }}>
                                        Sales
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/eggsaleinvoicelist" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/eggsaleinvoicelist">Egg Sales
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/birdsale" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/birdsale">Bird sale
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                        {/* <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/birdsale" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/customerlist?type=2">Bird sale
                                                <span className="sr-only">(current)</span></a>
                                        </li> */}

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/gunnybag" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/gunnybag">Gunny Bag
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/manure" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/manure">Manure
                                                <span className="sr-only">(current)</span></a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" 
                                    aria-expanded="false" style={{ fontSize: '20px' }}>
                                        Trackers
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/eggdailytracker" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/eggdailytracker">Egg Daily Tracker
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/mortalitylist" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/mortalitylist">Mortality Tracker
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/vaccinationtracker" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/vaccinationtracker">Vaccination Tracker
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/shedmedicinetracker" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/shedmedicinetracker">Medicine Tracker
                                                <span className="sr-only">(current)</span></a>
                                        </li>



                                    </ul>
                                </li>


                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" 
                                    aria-expanded="false" style={{ fontSize: '20px' }}>
                                        Others Modules
                                    </a>
                                    <ul className="dropdown-menu">


                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/shedlotmap" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/shedlotmap">Shed Lot Map
                                                <span className="sr-only">(current)</span></a>
                                        </li>


                                        <li><hr className="dropdown-divider" /></li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/stock" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/stock">Stock
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/customerlist" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/customerlist">Customers
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        {/* <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/test" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/test">test
                                                <span className="sr-only">(current)</span></a>
                                        </li> */}
                                        {
                                            localStorage.getItem('isadmin') == 'true' ?
                                                <li className="nav-item">
                                                    <a className={`nav-link ${location.pathname === "/companyselection" ? "active" : ""}`} 
                                                    style={{ fontSize: '17px' }} href="/companyselection">Company Selection
                                                        <span className="sr-only">(current)</span></a>
                                                </li> : ""
                                        }

                                        {
                                            localStorage.getItem('isadmin') == 'true' ?
                                                <li className="nav-item">
                                                    <a className={`nav-link ${location.pathname === "/registration" ? "active" : ""}`} 
                                                    style={{ fontSize: '17px' }} href="/registration">Add User
                                                        <span className="sr-only">(current)</span></a>
                                                </li> : ""
                                        }

                                        {/* <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/eggstockinventory" ? "active" : ""}`} style={{ fontSize: '20px' }} href="/eggstockinventory">Egg Stock Inventory
                                                <span className="sr-only">(current)</span></a>
                                        </li> */}

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/paymentout" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/paymentout">Payment out
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/paymenthistory" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/paymenthistory">Payment history
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                        <li className="nav-item">
                                            <a className={`nav-link ${location.pathname === "/unit" ? "active" : ""}`} 
                                            style={{ fontSize: '17px' }} href="/unit">Unit
                                                <span className="sr-only">(current)</span></a>
                                        </li>

                                    </ul>
                                </li>

                            </ul>
                        }
                        {
                            location.pathname !== "/login" && <form className="form-inline my-2 my-lg-0 pull-right">
                                <NavLink to="/login" className={`btn btn-primary mx-2 logoutbtn ${localStorage.getItem('token') !== null ? "invisible" : "visible"}`} role="button">Login</NavLink>
                            </form>
                        }

                        {localStorage.getItem('username') !== null &&
                            <label className="custom-file-label" style={{
                                color: "#fff"
                            }}
                            > Welcome <strong>{localStorage.getItem('username')}</strong></label>
                        }
                        <button
                            onClick={() => {
                                handleLogout();
                            }
                            }

                            className={`btn btn-primary mx-2 logoutbtn ${localStorage.getItem('token') !== null ? "visible" : "invisible"}`} role="button">Logout</button>
                    </div>

                </div>
            </nav>

            {/* <Breadcrumbs/> */}
        </div>
    )
}

export default Navigation
