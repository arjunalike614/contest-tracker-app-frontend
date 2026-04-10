import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ContestsPage from './pages/ContestsPage'
import UpsolvingPage from './pages/UpsolvingPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoutes'

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<h1>Contest Tracker</h1>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path ="/register" element ={<RegisterPage/>} />
      <Route path ="/contests" element ={<ProtectedRoute><ContestsPage/></ProtectedRoute>} />
      <Route path ="/upsolving" element = {<ProtectedRoute><UpsolvingPage/></ProtectedRoute>} />
      
      
    </Routes>
    </>
    
  )
}

export default App