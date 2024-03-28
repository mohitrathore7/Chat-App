import React from 'react'
import { LogOut } from 'react-feather'
import { useAuth } from '../utils/authContext'

const Header = () => {

  const { user,handleLogout } = useAuth()

  return (
    <div id="header--wrapper">
        {user ? (
            <>
              Welcome { user.name }
              <LogOut onClick={handleLogout} className='header--link' />
            </>
        ) : (
            <button>Login</button>
        )}
    </div>
  )
}

export default Header