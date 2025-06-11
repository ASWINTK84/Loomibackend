import React from 'react'
import UserMenu from '../components/layout/UserMenu'

const Dashboard = () => {
  return (
    <div>
        <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>  <UserMenu/> </div>
          <div className='col-md-9'>  content </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard