import React from 'react'
import UserMenu from '../components/layout/UserMenu'

const Orders = () => {
  return (
    <div>
        <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'> <UserMenu/>  </div>
          <div className='col-md-3'> All orders </div>
        </div>
      </div>
    </div>
  )
}

export default Orders