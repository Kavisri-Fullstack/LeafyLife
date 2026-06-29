import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      transition={Bounce}
      style={{ fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}
    />
  </StrictMode>,
)