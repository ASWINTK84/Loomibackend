import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import {  Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../../context/auth';

const Login = () => {
 
    

const [email, setemail] = useState();
const [password, setpassword] = useState();
// const [auth, setauth] = useState()
const {auth , setauth} = useAuth()
const navigate = useNavigate();
const location = useLocation()



const handleSubmit = async (e) => {
    e.preventDefault();
try {
    const res = await axios.post(`/api/v1/auth/login` , { password , email });
    if(res && res.data.success){
        console.log("Login Response: ", res);
        toast.success(res.data.message )
        setauth({
            ...auth ,
            user: res.data.user ,
            token: res.data.token
        })
        localStorage.setItem('auth' , JSON.stringify(res.data))
        navigate(location.state ||'/')
    }else{
        toast.error(res.data.message)
    }
} catch (error) {
    console.log(error);
    toast.error("something went wrong")
}
}



  return (
    <div >

        
    <Container className="d-flex justify-content-center align-items-center min-vh-100" >
      <Card className="form-card p-4 shadow w-25">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>


            {/* Email */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email" required  onChange={(e)=> setemail(e.target.value)} />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required name="password" onChange={(e)=> setpassword(e.target.value)} />
            </Form.Group>

                 
                  

            <Row>
              
              <Col>
                <Button variant="success" type="submit" className="">
                  Login
                </Button>
                <p> </p>
                 <Button variant="primary" type="button" className="" onClick={()=>{navigate('/forgot-password')}}>
                  forgot password
                </Button>
              </Col>
              
            </Row>
            <Row>
                <Col>
               
                </Col>
            </Row>
            <Row>
                <Col>
               <Link to={'/register'}> sign Up ?</Link>

                </Col>
            </Row>
            
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </div>
        
  )
}

export default Login