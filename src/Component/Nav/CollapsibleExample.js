import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'


function CollapsibleExample() {
    let history = useNavigate();
    let location = useLocation();
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" sticky="top">
      <Container>
        <Navbar.Brand href="#home">SANKI Poultries</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home" className={`nav-link ${location.pathname === "/clientlist" ? "active" : ""}`} style={{ fontSize: '25px' }}>Home</Nav.Link>
           
           
           
            <Nav.Link href="/customerlist">Customers</Nav.Link>
            <Nav.Link href="/medicine">Medicine</Nav.Link>
            <NavDropdown title="Chicks" id="collapsible-nav-dropdown2">
              <NavDropdown.Item href="/chicksmaster">Chicks Register</NavDropdown.Item>
              <NavDropdown.Item href="/mortalitylist">Mortality Tracker </NavDropdown.Item>
            
            </NavDropdown>
            <NavDropdown title="Egg" id="collapsible-nav-dropdown1">
              <NavDropdown.Item href="/eggdailytracker">Egg Production</NavDropdown.Item>
              <NavDropdown.Item href="/eggsale">Egg Sale
              </NavDropdown.Item>
            
            </NavDropdown>


            <NavDropdown title="Configurations" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="/carton">Carton</NavDropdown.Item>
              <NavDropdown.Item href="/clientlist">
              Clients
              </NavDropdown.Item>
              <NavDropdown.Item href="/shedlotmap">Shed Lot Map</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;