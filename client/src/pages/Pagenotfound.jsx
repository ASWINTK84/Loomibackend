import React from 'react'
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'




const Pagenotfound = () => {
    const navigate = useNavigate();
    const handleGoHome =()=>{
        navigate('/')
    }
  return (
    <div>
         <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3"> <span className="text-danger">Oops!</span> Page not found.</p>
        <p className="lead">
          The page you’re looking for doesn’t exist.
        </p>
        <Button variant="primary" onClick={handleGoHome}>Go Home</Button>
      </Container>
    </div>
    </div>
  )
}

export default Pagenotfound