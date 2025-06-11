import React from 'react'
import { Link } from 'react-router-dom';


const AdminMenu = () => {

    const navTabs = document.querySelectorAll("#nav-tabs > a");
  






    
  return (
    <div style={{display:"flex"}}>
 <div class="site-wrap">

<nav class="site-nav">

  <div class="name">
    eCommerce App

  </div>
  <div className='name2'>
    Admin Panel

  </div>

  <ul >
    <li ><Link style={{textDecoration:"none"}} to={'/dashboard/admin/create-category'} ><a href="#link">Create Category</a></Link></li>
    <li ><Link style={{textDecoration:"none"}} to={'/dashboard/admin/create-product'} ><a href="#link">Create Product</a></Link></li>
    <li ><Link style={{textDecoration:"none"}} to={'/dashboard/admin/product'} ><a href="#link"> Products</a></Link></li>
    <li ><Link style={{textDecoration:"none"}} to={'/dashboard/admin/users'} ><a href="#link">Users</a></Link></li>
    {/* <li ><a href="#0"></a></li> */}
     
    
    
  </ul>

  <div class="note">
    <h3>Admin menu</h3>
    <p>this is the admin menu only for the admins </p>
  </div>

</nav>


</div>
<div>
    
</div>
    </div>
  )
}

export default AdminMenu