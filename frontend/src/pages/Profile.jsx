import UserDetails from '../components/UserDetails'
import ChangeNotifications from '../components/ChangeNotifications'
import ChangePassword from '../components/ChangePassword'


function Profile() {    
    
    return (
        <>
            <div className="form-control">
                <div className='form-profile'>
                    <div className='profile-heading'>Profile</div>
                </div>
            </div>
            <div className='profile'>
                <UserDetails />
                <ChangePassword />
                <ChangeNotifications />   
            </div>
        </>
    )
}

export default Profile