import { useState, useEffect } from 'react'
import { useAuth } from '../AuthenticationContext'

function UserDetails() {

    const user = useAuth()
    const { detailMessage:message, errorMsg, reset } = user
    const [data, setData] = useState({
        firstName: '',
        lastName: ''
    })
    const { firstName, lastName } = data

    useEffect(() => {
        setData(user.profile)
        !!message && setTimeout(() => {
            reset()
        }, 2000)
        return () => {

        }
    }, [user.profile, message, reset])

    const onChangeDetails = (e) => {
        setData(prevState => ({
            ...prevState, [e.target.name]: e.target.value
        }))
    }

    const submitDetails = (e) => {
        e.preventDefault()
        user.updateDetails(firstName, lastName)
        //navigate('/')
    }

    const msgClass = errorMsg === true ? 'error-msg' : 'success-msg'
    return (
        <div className="form-control">
            <div className='form-profile'>
                <div className="profile-heading-1">Edit Details</div>
                <form onSubmit={submitDetails}>
                    {!!message && <div role='alert' className={`${msgClass} alert`}>{message}</div>}
                    <div className='form-group'>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            onChange={onChangeDetails}
                            placeholder='Enter First Name' id='firstName' name='firstName' value={firstName} type="text" />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            onChange={onChangeDetails}
                            placeholder='Enter Last Name' id='lastName' name='lastName' value={lastName} type="text" />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="lastName">Email</label>
                        <div className='email'>{user.profile.email}</div>
                    </div>
                    <div className='form-group'>
                        <button className='btn' id='details'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserDetails