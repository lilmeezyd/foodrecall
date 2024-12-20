import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthenticationContext'
import chevronDown from '../static/chevron-down.svg'
import chevronUp from '../static/chevron-up.svg'

function Header() {

    const [viewMobile, setViewMobile] = useState(false)
    const [dropDown, setDropDown] = useState(false)
    const user = useAuth()

    let menuRef = useRef()
    //let recallRef = useRef()

    useEffect(() => {
     /* let handler = (e) => {
        if(viewMobile && !menuRef.current.contains(e.target)) {
            console.log(menuRef.current)
            setViewMobile(false)
        }
      }*/
/*
      let handler1 = (e) => {
        if(dropDown && !recallRef.current.contains(e.target)) {
            //setDropDown(false)
        }
      }
*/
      //document.addEventListener("mousedown", handler)
      //document.addEventListener("mousedown", handler1)
    
      //return () => {
        //document.removeEventListener("mousedown", handler)
        //document.removeEventListener("mousedown1", handler1)
      //}
    })
    

    const onToggle = () => {
        setViewMobile(prevState => !prevState)
    }
    return (
        <header className='header'>
            <div className="logo">
                <Link to="/">FRA</Link>
            </div>
            <ul className="main-menu">
            <li><Link to='/recalls/fda'>FDA</Link></li>
            <li><Link to='/recalls/usda'>USDA</Link></li>
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
                {/*!!user?.user && <li>
                    <Link to='/' onClick={() => {
                        setDropDown(false)
                        user.logout()
                    }}>Log Out</Link>
                </li>*/}
                {/*!!user?.user && <li>
                    Hi, {user?.profile?.firstName}
                </li>*/}
            </ul>
            <div onClick={onToggle} className="burger-housing">
                <div className="burger-container">
                    <div className="burger-line"></div>
                    <div className="burger-line-1"></div>
                    <div className="burger-line-2"></div>
                </div>
            </div>

            {viewMobile && <ul ref={menuRef} className="mobile-menu">
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/fda'>FDA</Link></li>
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/usda'>USDA</Link></li>
                {/*<li>
                    <Link onClick={() => setDropDown(!dropDown)}>Recalls
                        {dropDown ? <img src={chevronUp} alt="chevron-up" /> : <img src={chevronDown} alt="chevron-down" />}</Link>
                    {dropDown && <ul className='recalls'>
                        <li><Link onClick={() => {
                            setViewMobile(false)
                            setDropDown(false)
                        }} to='/recalls/fda'>FDA</Link></li>
                        <li><Link onClick={() => {
                            setViewMobile(false)
                            setDropDown(false)
                        }} to='/recalls/usda'>USDA</Link></li>
                    </ul>}
                </li>*/}
                {/*!!user?.user && <li>
                    <Link onClick={() => {
                        setViewMobile(false)
                        setDropDown(false)
                    }} to='/profile'>Profile</Link>
                </li>*/}

                {/*!user?.user && <li>
                    <Link to='/login' onClick={() => {
                        setViewMobile(false)
                        setDropDown(false)
                    }}>Login</Link>
                </li>*/}
                {/*!user?.user && <li>
                    <Link onClick={() => {
                        setViewMobile(false)
                        setDropDown(false)
                    }} to='/register'>Register</Link>
                </li>*/}
                {/*!!user?.user && <li>
                    Hi, {user?.profile?.firstName}
                </li>*/}
                {/*!!user?.user && <li>
                    <Link to='/' onClick={() => {
                        setViewMobile(false)
                        setDropDown(false)
                        user.logout()
                    }}>Log Out</Link>
                </li>*/}
            </ul>}

        </header>
    )
}

export default Header