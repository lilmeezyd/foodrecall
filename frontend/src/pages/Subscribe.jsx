import { useState } from 'react'
import { useAuth } from '../AuthenticationContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Subscribe() {
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const subscribe = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    subscribe.subscribe(firstName, lastName, email)
    navigate('/')
  }
  return (
    <div className='form-control'>
      <div className='login'>Subscribe for food recall updates</div>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor="firstName">First Name</label>
          <input required onChange={(e) => setFirstName(e.target.value)} placeholder='Enter First Name'
            id='firstName' name='firstName' value={firstName} type="firstName" />
        </div>
        <div className='form-group'>
          <label htmlFor="lastName">Last Name</label>
          <input required onChange={(e) => setLastName(e.target.value)} placeholder='Enter Last Name'
            id='lastName' name='lastName' value={lastName} type="lastName" />
        </div>
        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input required onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' id='email' name='email' value={email} type="email" />
        </div>
        <div className='form-group'>
          <button className='btn'>Subscribe</button>
        </div>
      </form>
    </div>
  )
}

export default Subscribe