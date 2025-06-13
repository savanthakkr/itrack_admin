import React, { useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import { FaCarSide } from 'react-icons/fa'

const TrackDriver = () => {
  const [driverLocation, setDriverLocation] = useState({
    lat: 23.25275,
    lng: 77.45832,
  })

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prevLocation) => ({
        lat: prevLocation.lat + 0.001,
        lng: prevLocation.lng + 0.001,
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <GoogleMapReact defaultCenter={driverLocation} defaultZoom={11}>
        {/* Marker for the driver */}
        <Mark lat={driverLocation.lat} lng={driverLocation.lng} text="Driver" />
      </GoogleMapReact>
    </div>
  )
}

const Mark = ({ text }) => (
  <div style={{ color: 'red', fontSize: '20px' }}>
    <FaCarSide /> {text}
  </div>
) // Custom marker component

export default TrackDriver
