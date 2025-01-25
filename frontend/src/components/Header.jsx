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
    
    const onSubscribe = () => {
        console.log('Thanks for subscribing')
    }

    const onToggle = () => {
        setViewMobile(prevState => !prevState)
        console.log('toggled view!')
    }
    return (
        <header className='header'>
            <div className="logo">
                <Link to="/">FRA</Link>
            </div>
            <div className='header-div'>
                <button className='btn'><Link onClick={() => {
                    console.log('Thanks for subscribing')
                    setViewMobile(false)}} to='/subscribe'>Subscribe</Link></button>
            <ul className="main-menu">
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/fda'>FDA</Link></li>
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/usda'>USDA</Link></li>
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
            </div>
            <div onClick={onToggle} className="burger-housing">
                <div className="burger-container">
                    <div className="burger-line"></div>
                    <div className="burger-line-1"></div>
                    <div className="burger-line-2"></div>
                </div>
            </div>

            {viewMobile &&   <div className='header-div-mobile'>
                <button className='btn'><Link onClick={() => {
                    console.log('Thanks for subscribing')
                    setViewMobile(false)}} to='/subscribe'>Subscribe</Link></button>
            <ul ref={menuRef} className="mobile-menu">
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/fda'>FDA</Link></li>
            <li><Link onClick={() => {setViewMobile(false)}} to='/recalls/usda'>USDA</Link></li>
            </ul></div>}

        </header>
    )
}

export default Header