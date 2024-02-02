import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';

export default function NavComponent(props) {

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


        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            {
                localStorage.getItem('token') !== null &&


                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="nav nav-pills">
                        <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                            <a className={`nav-link ${location.pathname === "/" ? "active" : ""}`} style={{fontSize:'20px'}} href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === "/lotList" ? "active" : ""}`} style={{fontSize:'20px'}} href="/lotList">Lot Master <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === "/carton" ? "active" : ""}`} style={{fontSize:'20px'}} href="/carton">Carton Master <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${location.pathname === "/chicksmaster" ? "active" : ""}`} style={{fontSize:'20px'}} href="/chicksmaster">Chicks Master <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>

                </div>
            }
            <form className="form-inline my-2 my-lg-0 pull-right">
                <NavLink to="/login" className={`btn btn-primary mx-2 ${localStorage.getItem('token') !== null ? "invisible" : "visible"}`} role="button">Login</NavLink>
            </form>
            {localStorage.getItem('username') !== null &&
                <label className="custom-file-label" style={{
                color: "lightblue"}}
            > Welcome <strong>{localStorage.getItem('username')}</strong></label>
            }
            <button
                onClick={() => {
                    handleLogout();
                }
                }

                className={`btn btn-primary mx-2 ${localStorage.getItem('token') !== null ? "visible" : "invisible"}`} role="button">Logout</button>


        </nav>

        //     <Navbar bg="dark" expand="lg">
        //         <Navbar.Toggle aria-controls="basic-navbar-nav" />
        //         <Navbar.Collapse id="basic-navbar-nav">
        //         <Nav>
        //             <NavLink className={`d-inline p-2 bg-dark text-white`} to="/">
        //                 Home
        //             </NavLink>
        //             <NavLink className="d-inline p-2 bg-dark text-white" to="/carton">
        //                 Carton
        //             </NavLink>

        //             <NavLink className="d-inline p-2 bg-dark text-white" to="/lotList">
        //                 Lot Master
        //             </NavLink>
        //             <NavLink className="d-inline p-2 bg-dark text-white" to="/chicksmaster">
        //                 Chicks Master
        //             </NavLink>

        //             <form class="form-inline my-2 my-lg-0">
        //             <NavLink to="/login" className="btn btn-primary mx-1" role="button">Login</NavLink>
        // </form>

        //         </Nav>
        //         </Navbar.Collapse >

        //     </Navbar >
    )
}