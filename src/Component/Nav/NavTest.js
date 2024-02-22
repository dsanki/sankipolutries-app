import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

function NavTest() {

    let history = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isadmin');
        history('/login')
    }

    let location = useLocation();
    useEffect(() => {
        console.log(location.pathname);
    }, [location])

    return (
        <div>
           
            <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">SANKI POULTRIES</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                   


                        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{marginLeft:"144px"}}>
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
                            <form className="form-inline my-2 my-lg-0 pull-right">
                                <NavLink to="/login" className={`btn btn-primary mx-2 logoutbtn ${localStorage.getItem('token') !== null ? "invisible" : "visible"}`} role="button">Login</NavLink>
                            </form>
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

            <Breadcrumbs/>
        </div>
    )
}

export default NavTest
