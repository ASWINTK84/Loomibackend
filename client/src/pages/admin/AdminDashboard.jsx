import React from 'react'
import AdminMenu from '../../components/layout/AdminMenu'
import { useAuth } from '../../context/auth'


const AdminDashboard = () => {

  


  return (
    <div>

      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>  <AdminMenu/> </div>
          <div className='col-md-9'> 
           
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard