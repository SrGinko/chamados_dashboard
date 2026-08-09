import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// @ts-ignore
import "../styles/index.css"
// @ts-ignore
import '../styles/cardStyle.css'
// @ts-ignore
import '../styles/tema.css'
// @ts-ignore
import '../styles/modalStyle.css'
// @ts-ignore
import '../styles/dropDown.css'


const root = createRoot(document.getElementById('root')!)
root.render(<App />)