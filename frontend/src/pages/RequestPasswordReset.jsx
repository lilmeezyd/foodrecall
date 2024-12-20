import { useState } from 'react'
import { useAuth } from '../AuthenticationContext'

function RequestPasswordReset() {

    const user = useAuth()
    const [ email, setEmail ] = useState('')

    const onChange = (e) => {
        setEmail(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        user.requestPasswordReset(email)
        setEmail('')
    }
  return (
    <div className='form-control'>
      <div className='login'>Request Password Reset</div>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor="Email">Email</label>
          <input required onChange={onChange} placeholder='Enter Email' id='email' name='email' value={email} type="text" />
        </div>
        <div className='form-group'>
          <button className='btn'>Request Password Reset</button>
        </div>
      </form>
    </div>
  )
}

export default RequestPasswordReset