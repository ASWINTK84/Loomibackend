import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Facebook } from 'react-bootstrap-icons';
import { Twitter } from 'react-bootstrap-icons';
import { Instagram } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';





const Footer = () => {
  return (
    <div className="d-flex flex-column mt-5">
      <div className="flex-grow-1"></div> {/* pushes footer to bottom */}

      <footer className="bg-light shadow py-5 mt-auto">
        <Container>
          <Row className="mb-4">
            <Col md={3}>
              <a href="/" className="d-flex align-items-center  text-dark text-decoration-none">
                <img alt="logo" src="https://www.pinclipart.com/picdir/middle/84-842533_shopping-bag-png-shopping-bag-png-icon-clipart.png" width="30px" />
                <span className="ms-3 h5 fw-bold">eCommerce App</span>
              </a>
              <p style={{ width: '250px' }}>
                
              </p>
              <div className="d-flex mt-4">
                <Button variant="dark" className="me-2 p-2 rounded-circle">
                <Facebook size={25} color="blue" />
                </Button>
                <Button variant="dark" className="me-2 p-2 rounded-circle">
                <Twitter size={25} color="#1DA1F2" />
                </Button>
                <Button variant="dark" className="p-2 rounded-circle">
                <Instagram size={25} color="#E1306C" />
                </Button>
              </div>
            </Col>

            <Col md={3}>
              <h5 className="mb-4 fw-semibold">eCommerce App</h5>
              <ul className="list-unstyled">
                <li><Link style={{textDecoration:"none"}} to={'/policy'}><a href="#link" className="text-dark text-decoration-none">Policy</a></Link></li>
                <li><Link style={{textDecoration:"none"}} to={'/about'}><a href="#link" className="text-dark text-decoration-none">About Us</a></Link></li>
                <li><Link style={{textDecoration:"none"}} to={'/contact'}><a href="#link" className="text-dark text-decoration-none">Contact</a></Link></li>
                <li><Link style={{textDecoration:"none"}}><a href="#link" className="text-dark text-decoration-none">Blog</a></Link></li>
              </ul>
            </Col>

            <Col md={3}>
              <h5 className="mb-4 fw-semibold">Help</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-dark text-decoration-none">Support</a></li>
                <li><Link style={{textDecoration:"none"}}><a href="/" className="text-dark text-decoration-none">Sign Up</a></Link></li>
                <li><Link style={{textDecoration:"none"}}><a href="/" className="text-dark text-decoration-none">Sign In</a></Link></li>
              </ul>
            </Col>

            <Col md={3}>
              <h5 className="mb-4 fw-semibold">Products</h5>
              <ul className="list-unstyled" >
                <li ><Link style={{textDecoration:"none"}}><a href="/" className="text-dark text-decoration-none">Windframe</a></Link></li>
                <li><a href="/" className="text-dark text-decoration-none">Loop</a></li>
                <li><a href="/" className="text-dark text-decoration-none">Contrast</a></li>
              </ul>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <small>&copy; eCommerce App, 2025. All rights reserved.</small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
