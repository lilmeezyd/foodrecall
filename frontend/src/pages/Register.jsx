import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthenticationContext'

function Register() { 
  const initialState = {
    email: '', password1: '', password2: '', firstName: '', lastName: ''
  }
  const [ data, setData ] = useState(initialState)
  const { email, password1, password2, firstName, lastName } = data
  const register = useAuth()

  useEffect(() => {
    !!register.message && setTimeout(() => {
      register.reset()
    }, 2000)
  
    return () => {
      
    }
  }, [register])
  

  const onSubmit = (e) => {
    e.preventDefault()
    register.register(firstName, lastName, email, password1, password2)
    setData(initialState)
    //navigate('/')
  }

  const onChange = (e) => {
    setData((preveState) => ({
      ...preveState, [e.target.name]: e.target.value
    }))
  }
  return (
    <div className='form-control'>
      <div className='login'>Register to get email notifications</div>
      <form onSubmit={onSubmit}>
      {!!register.message && 
      <div className='error-msg alert'>{register.message}</div>}
      <div className='form-group'>
          <label htmlFor="firstName">First Name <span>*</span></label>
          <input onChange={onChange} placeholder='Enter First Name' id='firstName' name='firstName' value={firstName} type="text" />
        </div>
        <div className='form-group'>
          <label htmlFor="lastName">Last Name <span>*</span></label>
          <input onChange={onChange} placeholder='Enter Last Name' id='lastName' name='lastName' value={lastName} type="text" />
        </div>
        <div className='form-group'>
          <label htmlFor="lastName">Email <span>*</span></label>
          <input onChange={onChange} placeholder='Enter Email' id='email' name='email' value={email} type='email' />
        </div>
        <div className='form-group'>
          <label htmlFor="Password">Password <span>*</span></label>
          <input onChange={onChange} placeholder='Enter Password' id='password1' name='password1' value={password1} type="password" />
        </div>
        <div className='form-group'>
          <label htmlFor="Password">Confirm Password <span>*</span></label>
          <input onChange={onChange} placeholder='Confirm Password' id='password2' name='password2' value={password2} type="password" />
        </div>
        <div className='form-group'>
          <button className='btn'>Register</button>
        </div>
      </form>
      <p>Already have an account <Link to='/login'>Login</Link></p>
    </div>
  )
}

export default Register