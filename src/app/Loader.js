import React from 'react'
import Lottie from 'lottie-react'
import loder from '../assets/loader.json'

export default function Loader ({visible}) {
    const sts = (visible === true) ? 'block'  : 'none'; 

    return(
        <div className='loadr-outer' style={{display:sts}} >
        <div className='loadr-ovr' ></div>
        <div className='loadr-body'>
        <Lottie animationData={loder} 
        style={{height:'100px', width:'100px'}} autoPlay={true} loop={true} />
        </div>
        </div>
    )
}