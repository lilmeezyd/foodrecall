import { useState, useEffect } from 'react'
import { useAuth } from '../AuthenticationContext'

function ChangePassword() {
    const user = useAuth()
    const { passMessage: message, errorMsg, reset } = user
    const [passwords, setPasswords] = useState({
        oldPassword: '', newPassword: '', confirmPassword: ''
    })
    const { oldPassword, newPassword, confirmPassword } = passwords

    useEffect(() => {
        !!message && setTimeout(() => {
            reset()
        }, 2000)
        return () => {

        }
    }, [message, reset])

    const onChangePassword = (e) => {
        setPasswords(prevState => ({
            ...prevState, [e.target.name]: e.target.value
        }))
    }
    const submitPassword = (e) => {
        e.preventDefault()
        user.newPassword(oldPassword, newPassword, confirmPassword)
        setPasswords({
            oldPassword: '', newPassword: '', confirmPassword: ''
        })
        //navigate('/')
    }
    const msgClass = errorMsg === true ? 'error-msg' : 'success-msg'
    return (
        <div className="form-control">
            <div className='form-profile'>
                <div className="profile-heading-1">Change Password</div>
                <form onSubmit={submitPassword}>
                    {!!message && <div role='alert' className={`${msgClass} alert`}>{message}</div>}
                    <div className='form-group'>
                        <label htmlFor="oldPassword">Old Password</label>
                        <input
                            onChange={onChangePassword}
                            placeholder='Enter Old Password' id='oldPassword' name='oldPassword' value={oldPassword} type="password" />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            onChange={onChangePassword}
                            placeholder='Enter New Password' id='newPassword' name='newPassword' value={newPassword} type="password" />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            onChange={onChangePassword}
                            placeholder='Confirm New Password' id='confirmPassword' name='confirmPassword' value={confirmPassword} type="password" />
                    </div>
                    <div className='form-group'>
                        <button className='btn' id='password'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword