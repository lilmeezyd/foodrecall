import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthenticationContext'

function Header() {

    const [viewMobile, setViewMobile] = useState(false)
    const [dropDown, setDropDown] = useState(false)
    const user = useAuth()

    let menuRef = useRef()
    //let recallRef = useRef()

    useEffect(() => {
    })
    
    const onSubscribe = () => {
        console.log('Thanks for subscribing')
    }

    const onToggle = () => {
        setViewMobile(prevState => !prevState)
    }
    return (
        <header className='header'>
            <div className="logo">
                <Link to="/">FRA</Link>
            </div>
            <div className='header-div'>
            <ul className="main-menu">
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/fda'>FDA</Link></li>
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/usda'>USDA</Link></li>
            {!!user?.user ? <>
            <li>
                <Link onClick={() => {setViewMobile(false)}} to='/send-updates'>Updates</Link>
            </li>
                <li>
                    Hi, {user?.user?.firstName}
                </li><li>
                    <Link to='/' onClick={() => {
                        setDropDown(false)
                        user.logout()
                    }}>Log Out</Link>
                </li></> : <button className='btn'><Link onClick={() => {
                    setViewMobile(false)}} to='/subscribe'>Subscribe</Link></button>}
                <li>
                    {/*<Link onClick={() => setDropDown(!dropDown)}>Recalls
                        {dropDown ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</Link>*/}
                    {/*dropDown && <ul className='recalls'>
                        <li><Link onClick={() => setDropDown(false)} to='/recalls/fda'>FDA</Link></li>
                        <li><Link onClick={() => setDropDown(false)} to='/recalls/usda'>USDA</Link></li>
                    </ul>*/}
                </li>
                {/*!!user?.user && <li>
                    <Link onClick={() => setDropDown(false)} to='/profile'>Profile</Link>
                </li>*/}
                {/*!user?.user && <li>
                    <Link to='/login' onClick={() => {
                        setDropDown(false)
                    }}>Login</Link>
                </li>*/}
                {/*!user?.user && <li>
                    <Link onClick={() => setDropDown(false)} to='/register'>Register</Link>
                </li>*/}
            </ul>
            </div>
            <div onClick={onToggle} className="burger-housing">
                <div className="burger-container">
                    <div className="burger-line"></div>
                    <div className="burger-line-1"></div>
                    <div className="burger-line-2"></div>
                </div>
            </div>

            {viewMobile &&   <div className='header-div-mobile'>
                {!!user?.user ? <>
                <div>
                    <Link to='/' onClick={() => {
                        setViewMobile(false)
                        setDropDown(false)
                        user.logout()
                    }}>Log Out</Link>
                </div>
                <div>
                    Hi, {user?.user?.firstName}
                </div>
                <div>
                <Link onClick={() => {setViewMobile(false)}} to='/send-updates'>Updates</Link>
            </div></> : <button className='btn'><Link onClick={() => {
                    setViewMobile(false)}} to='/subscribe'>Subscribe</Link></button>}
            <ul ref={menuRef} className="mobile-menu">
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/fda'>FDA</Link></li>
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/usda'>USDA</Link></li>
            </ul></div>}

        </header>
    )
}

export default Header