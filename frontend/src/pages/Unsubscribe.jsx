import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../AuthenticationContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Unsubscribe() {
    const { search } = useLocation()
    const userId = !!search && search.split('=')[1]
    const subscribe = useAuth()
    const navigate = useNavigate()


    const onSubmit = async (e) => {
        e.preventDefault()
        subscribe.unsubscribe(userId)
        navigate('/')

    }
    return (
        <div className='form-control'>
            <div className='login'>Unsubscribe from food recall updates list</div>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <button className='btn'>Unsubscribe</button>
                </div>
            </form>
        </div>
    )
}

export default Unsubscribe