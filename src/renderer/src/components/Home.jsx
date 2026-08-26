import React from 'react'
import logo from '../assets/images/logo.png'
import borderSmall from '../assets/images/borderSmall.png'
import borderLarge from '../assets/images/borderLarge.png'
import legacyWall from '../assets/images/legacyWall.png'
import legacyWallBg from '../assets/legacyWallBg.webm'

const Home = ({ handlePageState }) => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-20 bg-cover bg-center">
      <video
        src={legacyWallBg}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-10"
      ></video>
      <div className=" flex flex-col gap-9 justify-center items-center">
        <img src={logo} alt="logo" className="h-30 w-35" />
        <img src={borderSmall} alt="borderSmall" />
        <img src={legacyWall} alt="title" className="h-20 w-180" />
        <img src={borderSmall} alt="borderSmall" />
        <p className="text-[#FFE17E] tracking-widest text-center text-2xl uppercase">
          A journey through the milestones that shaped India’s standards.
        </p>
      </div>
      <button
        className="bg-gradient-to-t from-[#E29715] from-0% to-[#FFFBB2] to-100% text-[#3A1825] font-bold px-7 py-3 rounded-md uppercase cursor-pointer z-20"
        onClick={() => {
          handlePageState('list')
        }}
      >
        Start Now
      </button>
    </div>
  )
}

export default Home
