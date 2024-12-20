import { useState, useEffect } from 'react'
import { useAuth } from '../AuthenticationContext'

function ChangeNotifications() {
    const user = useAuth()
    const { notMessage: message, errorMsg, reset } = user
    const [notifications, setNotifications] = useState(
        {
            fda: false,
            usda: false
        })
    const { fda, usda } = notifications

    useEffect(() => {
        setNotifications(user.profileNotify)
        !!message && setTimeout(() => {
            reset()
        }, 2000)
        return () => {

        }
    }, [user.profileNotify, message, reset])

    const onChangeNotifications = (e) => {
        setNotifications(prevState => ({
            ...notifications, [e.target.name]: e.target.checked
        }))
    }



    const submitNotifications = (e) => {
        e.preventDefault()
        user.changeNotifications(fda, usda)
        //navigate('/')
    }
    const msgClass = errorMsg === true ? 'error-msg' : 'success-msg'
    return (
        <div className="form-control">
            <div className='form-profile'>
                <div className="profile-heading-1">Email Notifications</div>
                <form onSubmit={submitNotifications}>
                    {!!message && <div role='alert' className={`${msgClass} alert`}>{message}</div>}
                    <div>
                        <div className='form-group options-group'>
                            <div>
                                <input
                                    checked={usda}
                                    onChange={onChangeNotifications} type="checkbox" name="usda" id="usda" />
                            </div>
                            <div>
                                <label htmlFor="USDA">USDA</label>
                            </div>
                        </div>
                        <div className="foot-note-notify">
                            Get notifications from the USDA Food Safety and Inspection Service
                        </div>
                    </div>
                    <div>
                        <div className='form-group options-group'>
                            <div>
                                <input
                                    checked={fda}
                                    onChange={onChangeNotifications}
                                    type="checkbox" name="fda" id="fda" />
                            </div>
                            <div>
                                <label htmlFor="FDA">FDA</label>
                            </div>
                        </div>

                        <div className="foot-note-notify">Get notifications from the Food and Drug Administration</div>
                    </div>
                    <div className='form-group'>
                        <button className='btn' id='notice'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangeNotifications