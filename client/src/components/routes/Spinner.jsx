import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

const Spinners = ({path="login"}) => {
    const [count, setcount] = useState(3)
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
      const interval = setInterval(() => {
        setcount((prevValue) => --prevValue) 
      }, 1000)
      count === 0 && navigate(`/${path}` , {
        state:location.pathname
      })
      return ()=> clearInterval(interval)
    }, [count , navigate , location , path])
    
  return (
    <div >
        <h3>redirecting you in {count} second</h3>
        <Spinner animation="border" variant="danger" style={{textAlign:"center"}} ></Spinner>
    </div>
  )
}

export default Spinners