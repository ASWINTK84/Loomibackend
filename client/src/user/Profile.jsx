import React from 'react'
import UserMenu from '../components/layout/UserMenu'
import { Card } from "react-bootstrap";
import { useAuth } from '../context/auth';

const Profile = () => {


    const {auth} = useAuth()


  return (
    <div >
        <div className='container-fluid '>
        <div className='row'>
          <div className='col-md-3'> <UserMenu/>  </div>
          <div className='col-md-9 mt-3'>

          <div style={{alignContent:"center", textAlign:"center" }}>
            <Card style={{ width: '63rem' ,alignItems:"center"}}>
      <Card.Img style={{width:"15rem" , }} variant="top" src="https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" />
      <Card.Body style={{ marginBottom:"90px",}}>
        <Card.Title><h2>{auth?.user?.name}</h2></Card.Title>
        <Card.Text>
        {auth?.user?.email}
        </Card.Text>
        <Card.Text>
        {auth?.user?.phone}
        </Card.Text>
        <Card.Text>
        {auth?.user?.address}
        </Card.Text>
        <Card.Text>
          
        </Card.Text>
      </Card.Body>
    </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile