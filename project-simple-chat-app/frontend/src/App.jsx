import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route} from 'react-router-dom'


function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/SignUp' element={<SignUpPage/>}/>
        <Route path='/Login' element={<LoginPage/>}/>
        <Route path='/Profile' element={<ProfilePage/>}/>
        <Route path='/Settings' element={<SettingsPage/>}/>
      </Routes>
    </div>
  )
}

export default App