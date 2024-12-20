import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../AuthenticationContext'
import { useNavigate } from 'react-router-dom'

function ResetPassword() {
  const [ password, setPassword ] = useState('')
  const {search} = useLocation()
 const token = !!search && search.slice(1).split('&')[0].split('=')[1]
 const userId = !!search && search.slice(1).split('&')[1].split('=')[1]
 const user = useAuth()
 const navigate = useNavigate()

  const onChange = (e) => {
    setPassword(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    user.resetPassword(userId, token, password)
    setPassword('')
    navigate('/')
  }
  return (
    <div className='form-control'>
      <div className='login'>Password Reset</div>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor="Password">Password</label>
          <input required onChange={onChange} placeholder='Enter Password' id='password' name='password' value={password} type="password" />
        </div>
        <div className='form-group'>
          <button className='btn'>Reset Password</button>
        </div>
      </form>
    </div>
  )
}

export default ResetPassword