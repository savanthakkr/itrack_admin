import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  OverlayView,
} from '@react-google-maps/api';

const LocationNavigation = ({ userLocation, pickup, delivered, history }) => {
  const [directions, setDirections] = useState(null);
  const [markers, setMarkers] = useState({});
  const [driverPosition, setDriverPosition] = useState(null);
  const [animatedDriverPosition, setAnimatedDriverPosition] = useState(null);
  const [lastDriverPosition, setLastDriverPosition] = useState(null);
  const [driverRotation, setDriverRotation] = useState(0);
  const [icons, setIcons] = useState({});
  const [mapRef, setMapRef] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const calculateBearing = (startLat, startLng, endLat, endLng) => {
    const toRad = deg => deg * Math.PI / 180;
    const toDeg = rad => rad * 180 / Math.PI;
    const dLng = toRad(endLng - startLng);
    const y = Math.sin(dLng) * Math.cos(toRad(endLat));
    const x =
      Math.cos(toRad(startLat)) * Math.sin(toRad(endLat)) -
      Math.sin(toRad(startLat)) * Math.cos(toRad(endLat)) * Math.cos(dLng);
    const bearing = toDeg(Math.atan2(y, x));
    return (bearing + 360) % 360;
  };

  const haversineDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = value => (value * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const parseCoordinates = str => {
    const coords = str?.split(',').map(n => parseFloat(n.trim()));
    if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1]))
      return null;
    return coords;
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB2hzpy55dNKYbAmb4f7eFi-mAzk0v6Szo', // Replace here
  });

  useEffect(() => {
    if (!isLoaded) return;
    setIcons({
      delivered: {
        url: 'https://img.icons8.com/ios-filled/50/FF0000/marker.png',
        scaledSize: new window.google.maps.Size(36, 36),
      },
    });

    setIcons({
      pickup: {
        url: 'https://img.icons8.com/ios-filled/50/228B22/marker.png',
        scaledSize: new window.google.maps.Size(36, 36),
      },
    });
  }, [isLoaded]);

  useEffect(() => {
    if (history?.length > 0) {
      const uniqueHistory = history.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            t => t.latitude === item.latitude && t.longitude === item.longitude
          )
      );
      const filtered = [uniqueHistory[0]];
      for (let i = 1; i < uniqueHistory.length; i++) {
        const prev = filtered[filtered.length - 1];
        const curr = uniqueHistory[i];
        const distance = haversineDistance(
          prev.latitude,
          prev.longitude,
          curr.latitude,
          curr.longitude
        );
        if (distance > 30) filtered.push(curr);
      }
      setFilteredHistory(filtered);
    }
  }, [history]);

  useEffect(() => {
    const coords = parseCoordinates(userLocation);
    if (coords) {
      if (!driverPosition) {
        setDriverPosition({ lat: coords[0], lng: coords[1] });
        setAnimatedDriverPosition({ lat: coords[0], lng: coords[1] });
      } else {
        setLastDriverPosition(driverPosition);
        setDriverPosition({ lat: coords[0], lng: coords[1] });
      }
    }
  }, [userLocation]);

  useEffect(() => {
    if (!lastDriverPosition || !driverPosition) return;

    const rotation = calculateBearing(
      lastDriverPosition.lat,
      lastDriverPosition.lng,
      driverPosition.lat,
      driverPosition.lng
    );
    setDriverRotation(rotation);

    let progress = 0;
    let animationFrame;

    const animate = () => {
      progress += 0.02;
      if (progress >= 1) {
        setAnimatedDriverPosition(driverPosition);
        setLastDriverPosition(driverPosition);
        return;
      }

      const lat =
        lastDriverPosition.lat +
        (driverPosition.lat - lastDriverPosition.lat) * progress;
      const lng =
        lastDriverPosition.lng +
        (driverPosition.lng - lastDriverPosition.lng) * progress;

      setAnimatedDriverPosition({ lat, lng });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [driverPosition]);

  useEffect(() => {
    if (!isLoaded || !pickup || !delivered) return;

    const pickupCoords = parseCoordinates(pickup);
    const deliveredCoords = parseCoordinates(delivered);

    if (!pickupCoords || !deliveredCoords) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: pickupCoords[0], lng: pickupCoords[1] },
        destination: { lat: deliveredCoords[0], lng: deliveredCoords[1] },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend({ lat: pickupCoords[0], lng: pickupCoords[1] });
          bounds.extend({ lat: deliveredCoords[0], lng: deliveredCoords[1] });
          setMapBounds(bounds);
          if (mapRef) {
            setTimeout(() => {
              mapRef.fitBounds(bounds);
            }, 300);
          }
        }
      }
    );

    setMarkers({
      pickup: { lat: pickupCoords[0], lng: pickupCoords[1] },
      delivered: { lat: deliveredCoords[0], lng: deliveredCoords[1] },
    });
  }, [isLoaded, pickup, delivered, mapRef]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={markers.pickup || { lat: 28.6139, lng: 77.209 }}
        zoom={13}
        onLoad={map => {
          setMapRef(map);
          if (mapBounds) {
            map.fitBounds(mapBounds);
          }
        }}
        options={{
          disableDefaultUI: true,
        }}
      >
        {markers.pickup && (
          <Marker
            position={markers.pickup}
            // icon={{
            //   path: window.google.maps.SymbolPath.CIRCLE,
            //   scale: 10,
            //   fillColor: '#228B22',
            //   fillOpacity: 1,
            //   strokeWeight: 1,
            //   strokeColor: '#ffffff',
            // }}
            icon={icons.pickup}
          />
        )}

        {markers.delivered && (
          <Marker position={markers.delivered} icon={icons.delivered} />
        )}

        {animatedDriverPosition && (
          <OverlayView
            position={animatedDriverPosition}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                transform: `translate(-50%, -50%) rotate(${driverRotation}deg)`,
                transition: 'transform 0.3s linear',
              }}
            >
              <img
                src="/Location_dot_blue.png" // Swiggy-style scooter
                style={{ width: 15, height: 15 }}
                alt="driver"
              />
            </div>
          </OverlayView>
        )}

        {filteredHistory.map((point, index) => (
          <Marker
            key={`history-dot-${index}`}
            position={{ lat: point.latitude, lng: point.longitude }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 3,
              fillColor: '#007BFF',
              fillOpacity: 0.8,
              strokeWeight: 0,
            }}
          />
        ))}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 3,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationNavigation;















// import React, { useState, useEffect, useRef } from 'react';
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Marker,
//   DirectionsRenderer,
// } from '@react-google-maps/api';

// const containerStyle = {
//   width: '100%',
//   height: '500px',
// };

// const LocationNavigation = ({ pickup, delivered, userLocation }) => {
//   const [directions, setDirections] = useState(null);
//   const [mapCenter, setMapCenter] = useState(null);
//   const [driverPosition, setDriverPosition] = useState(null);
//   const mapRef = useRef(null);
//   const driverMarkerRef = useRef(null);

//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: 'AIzaSyB2hzpy55dNKYbAmb4f7eFi-mAzk0v6Szo',
//   });

//   // Parse coordinates from string to { lat, lng }
//   const parseCoordinates = (str) => {
//     const coords = str.split(',').map((n) => parseFloat(n.trim()));
//     if (coords.length !== 2 || coords.some(isNaN)) return null;
//     return { lat: coords[0], lng: coords[1] };
//   };

//   // Fetch directions between pickup and delivery
//   useEffect(() => {
//     if (!isLoaded) return;

//     const pickupCoords = parseCoordinates(pickup);
//     const deliveredCoords = parseCoordinates(delivered);

//     if (!pickupCoords || !deliveredCoords) return;

//     const directionsService = new window.google.maps.DirectionsService();

//     directionsService.route(
//       {
//         origin: pickupCoords,
//         destination: deliveredCoords,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           setDirections(result);
//         } else {
//           console.error('Error fetching directions:', status);
//         }
//       }
//     );
//   }, [isLoaded, pickup, delivered]);

//   // Update driver's position
//   useEffect(() => {
//     if (!isLoaded) return;

//     const coords = parseCoordinates(userLocation);
//     if (!coords) return;

//     setDriverPosition(coords);
//     setMapCenter(coords);

//     // Smoothly pan the map to the new driver position
//     if (mapRef.current) {
//       mapRef.current.panTo(coords);
//     }

//     // Animate marker movement
//     if (driverMarkerRef.current) {
//       driverMarkerRef.current.setPosition(coords);
//     }
//   }, [isLoaded, userLocation]);

//   if (loadError) return <div>Error loading Google Maps</div>;
//   if (!isLoaded) return <div>Loading Map...</div>;

//   return (
//     <div className="LocationNavigation">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={mapCenter || { lat: 0, lng: 0 }}
//         zoom={15}
//         onLoad={(map) => (mapRef.current = map)}
//       >
//         {/* Pickup Marker */}
//         {pickup && (
//           <Marker
//             position={parseCoordinates(pickup)}
//             label="P"
//             icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 8,
//               fillColor: 'green',
//               fillOpacity: 1,
//               strokeWeight: 1,
//             }}
//           />
//         )}

//         {/* Delivery Marker */}
//         {delivered && (
//           <Marker
//             position={parseCoordinates(delivered)}
//             label="D"
//             icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 8,
//               fillColor: 'blue',
//               fillOpacity: 1,
//               strokeWeight: 1,
//             }}
//           />
//         )}

//         {/* Driver Marker */}
//         {driverPosition && (
//           <Marker
//             position={driverPosition}
//             icon={{
//               url: 'https://cdn-icons-png.flaticon.com/512/2554/2554978.png',
//               scaledSize: new window.google.maps.Size(50, 50),
//             }}
//             onLoad={(marker) => {
//               driverMarkerRef.current = marker;
//             }}
//           />
//         )}

//         {/* Route Directions */}
//         {directions && (
//           <DirectionsRenderer
//             directions={directions}
//             options={{
//               suppressMarkers: true,
//               polylineOptions: {
//                 strokeColor: '#FF0000',
//                 strokeOpacity: 0.8,
//                 strokeWeight: 4,
//               },
//             }}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default LocationNavigation;
