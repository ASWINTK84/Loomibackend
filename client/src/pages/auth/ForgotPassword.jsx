import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import {  Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


const ForgotPassword = () => {

       

const [email, setemail] = useState();
const [newPassword, setnewPassword] = useState();
const [answer, setanswer] = useState()
const navigate = useNavigate();




const handleSubmit = async (e) => {
    e.preventDefault();
try {
    const res = await axios.post(`/api/v1/auth/forgot-password` , { newPassword , email ,answer });
    if(res && res.data.success){
        console.log("Login Response: ", res);
        toast.success(res.data.message )
       
       
        navigate('/login')
    }else{
        toast.error(res.data.message)
    }
} catch (error) {
    console.log(error);
    toast.error("something went wrong")
}
}




  return (
    <div>
           
    <Container className="d-flex justify-content-center align-items-center min-vh-100" >
      <Card className="form-card p-4 shadow w-25">
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          <Form onSubmit={handleSubmit}>


            {/* Email */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email" required  onChange={(e)=> setemail(e.target.value)} />
            </Form.Group>


            {/* Password */}
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="new Password" required name="newPassword" onChange={(e)=> setnewPassword(e.target.value)} />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Answer</Form.Label>
              <Form.Control type="text" placeholder="which is your favorite place" name="answer" required  onChange={(e)=> setanswer(e.target.value)} />
            </Form.Group>

                 
                  

            <Row>
              
              <Col>
                <Button variant="success" type="submit" className="">
                  Reset
                </Button>
                <p> </p>
                 
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

export default ForgotPassword