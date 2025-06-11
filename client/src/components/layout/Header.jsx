import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Cart } from 'react-bootstrap-icons';
import { Bag } from 'react-bootstrap-icons';
import { useAuth } from '../../context/auth';
import { toast } from 'react-toastify';



const Header = () => {
    const { auth, setauth } = useAuth()
    const navigate = useNavigate()
    const handleLogout = ()=>{
        setauth({
            ...auth ,
            user:"" ,
            token:"",
        })
        localStorage.removeItem("auth")
        toast.success('LogOut successful')
              navigate('/login')
    }
  return (
    <div style={{borderBottom:"0px solid gray",  }}>
         <Navbar expand="lg" className="bg-body-tertiary" style={{fontFamily:"monospace" }}>
      <Container>
        <Navbar.Brand href="#home"><Bag size={40} color="black" /> eCommerce App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
        <Link to={'/'}><Nav.Link  className='active' href="#home">Home</Nav.Link></Link>  
          
        
          <Link state={{}} to={'/catagory'}><Nav.Link  href="#link">Catagory</Nav.Link></Link> 
          <Link to={'/cart'}><Nav.Link href="#link">Cart <Cart size={20} color="black" /></Nav.Link></Link> 
          {
            !auth.user ? (
                <>
                  <Link to={'/register'}><Nav.Link  href="#link">Register</Nav.Link></Link>  
                   <Link to={'/login'}><Nav.Link  href="#link">Login</Nav.Link></Link> 
                </>
             ) : ( <NavDropdown title={auth?.user?.name } id="basic-nav-dropdown">
                <>
                <Link to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}><Nav.Link  href="#link">Dashboard</Nav.Link></Link> 
                   <Nav.Link onClick={handleLogout} href="#link">LogOut</Nav.Link>
               </>  
             
            </NavDropdown>) 
           } 

           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default Header