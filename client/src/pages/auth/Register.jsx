import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import  axios from "axios";




function Register() {

    
const [name, setname] = useState();
const [email, setemail] = useState();
const [password, setpassword] = useState();
const [phone, setphone] = useState();
const [address, setaddress] = useState();
const [answer, setanswer] = useState()
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
try {
    const res = await axios.post(`/api/v1/auth/register` , {name , password , email , phone , address , answer});
    if(res.data.success){
        toast.success(res.data.message)
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
    <div className='mt-5'>

        
    <Container className="d-flex justify-content-center align-items-center min-vh-100" >
      <Card className="form-card p-4 shadow w-50">
        <Card.Body>
          <h2 className="text-center mb-4">Login / Sign Up</h2>
          <Form onSubmit={handleSubmit}>

            {/* Full Name */}
            <Form.Group className="mb-3" controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" placeholder="Enter  name" name='name' required onChange={(e)=> setname(e.target.value)} />
            </Form.Group>

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

                   {/* phone */}
                   <Form.Group className="mb-3" controlId="formAge">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="number" placeholder="Enter your Phone Num" name="phone" onChange={(e)=> setphone(e.target.value)} />
            </Form.Group>

                   {/* address */}
                   <Form.Group className="mb-3" controlId="formAge">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter your address" name="address"  onChange={(e)=> setaddress(e.target.value)} />
            </Form.Group>

             {/* answer */}
             <Form.Group className="mb-3" controlId="formAge">
              <Form.Label>Answer</Form.Label>
              <Form.Control type="text" placeholder="Which is your favorite place ?" name="answer"  onChange={(e)=> setanswer(e.target.value)} />
            </Form.Group>

            <Row>
              
              <Col>
                <Button variant="success" type="submit" className="w-100">
                  Sign Up
                </Button>
              </Col>  
            </Row>
            <Row>
                <p>
                </p>
            </Row>
            <Row>
                <Col>
               <Link to={'/login'}> login ?</Link>

                </Col>
            </Row>
            
          </Form>
        </Card.Body>
      </Card>
    </Container>

    </div>
  );
}

export default Register;
