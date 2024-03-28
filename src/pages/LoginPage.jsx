import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/authContext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../index.css'

const LoginPage = () => {

  const { user,handleUserLogin } = useAuth()
  let navigation = useNavigate()
  const [credentials, setCredentials] = useState({ email: "", password: "" })

  useEffect(() => {
    if (user) {
      navigation('/')
    }
  }, [])

  const handleInputChange = (e) => {
    let name = e.target.name
    let value = e.target.value

    setCredentials({ ...credentials, [name]: value })
   
  }


  return (
    <div className='auth--container'>
      <div className='form--wrapper'>
        <form onSubmit={(e) => handleUserLogin(e,credentials)}>
          <div className="field--wrapper">
            <label>
              Email
            </label>
            <input value={credentials.email} onChange={(e) => { handleInputChange(e) }} type="email" name="email" placeholder='enter your email' required />
          </div>
          <div className="field--wrapper">
            <label>
              Password
            </label>
            <input value={credentials.password} onChange={(e) => { handleInputChange(e) }} type="password" name="password" placeholder='enter the password' required />
          </div>
          <div className='field--wrapper'>
             <input type='submit' value='login' className='btn btn--lg'/>
          </div>
        </form>
         <p>Dont have a account ? Create one <Link to='/register'>Here</Link></p>
      </div>
    </div>
  )
}

export default LoginPage