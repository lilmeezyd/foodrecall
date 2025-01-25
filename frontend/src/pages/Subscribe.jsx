import { useState } from 'react'

function Subscribe() {
  const [ email, setEmail ] = useState('')

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log('thanks for subscribing')
    user.Subscribe(userId, token, password)
    setPassword('')
    navigate('/')
  }
  return (
    <div className='form-control'>
      <div className='login'>Subscribe for daily food recall updates</div>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor="email">Email</label>
          <input required onChange={onChange} placeholder='Enter Email' id='email' name='email' value={email} type="email" />
        </div>
        <div className='form-group'>
          <button className='btn'>Subscribe</button>
        </div>
      </form>
    </div>
  )
}

export default Subscribe