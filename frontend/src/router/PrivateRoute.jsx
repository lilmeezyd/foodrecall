import {useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthenticationContext'


function PrivateRoute() {
    const user = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
      if(!user?.user) return navigate('/')
    
    })
    
    
  return (
    <Outlet />
  )
}

export default PrivateRoute