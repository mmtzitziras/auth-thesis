/* eslint-disable no-unused-vars */
import Navbar from './Navbar'
import './LandingPage.css'


export default function LandingPage() {
  return (
    
      <div >
        <div className='landing-page-navbar'>
            <Navbar/>
        </div>
        <div className="landing-page-container">
             <a className="pulsingButton" href="/meeting">START</a>
        </div>
        <div></div>
        
      </div>
    
  )
}

