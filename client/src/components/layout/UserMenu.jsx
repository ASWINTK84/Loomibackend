import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/auth'

const UserMenu = () => {

    const {auth} = useAuth()

  return (
    <div>
        <div style={{display:"flex"}}>
 <div class="site-wrap">

<nav class="site-navuser">

  <div class="name">
    eCommerce App

  </div>
  <div className='name2user'>
    {auth?.user?.name}

  </div>

  <ul >
    <li ><Link style={{textDecoration:"none"}} to={'/dashboard/user/profile'} ><a href="#link">Profile</a></Link></li>
    <li ><Link style={{textDecoration:"none"}} to={'/dashboard/user/orders'} ><a href="#link">My Orders</a></Link></li>
    
     
    
    
  </ul>

  <div class="noteuser">
    <h3 style={{color:"black"}}>User Menu</h3>
    <p>this is the user menu  for the users </p>
  </div>

</nav>


</div>
<div>
    
</div>
    </div>
    </div>
  )
}

export default UserMenu