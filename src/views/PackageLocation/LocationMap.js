import React, { useEffect, useState } from 'react'
import mapImg from '../../assets/images/map-img.png'
import { useParams } from 'react-router-dom'
import { get } from '../../lib/request'
import LocationNavigation from '../../components/Maps/LocationNavigation';
import { Spinner } from 'react-bootstrap';
import { end } from '@popperjs/core';
function LocationMap() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState({
    start: "",
    end: "",
    userLocation: "",
    pickup: "",
    delivered: ""

  })

  function roundCoordinates(lat, lng) {
    return {
      lat: parseFloat(lat.toFixed(7)),
      lng: parseFloat(lng.toFixed(7)),
    };
  }

  useEffect(() => {
    setLoading(true)
    // get(`/admin/job?id=${id}`, "admin").then((res) => {
    //   if (res.data.status) {
    //     setData(res.data.data)
    //     console.log(data);
    //     console.log("skasjhajsh");


    //     let startLoc = res.data.data.pickUpDetails.pickupLocationId.latitude + "," + res.data.data.pickUpDetails.pickupLocationId.longitude
    //     let endLoc = res.data.data.dropOfDetails.dropOfLocationId.latitude + "," + res.data.data.dropOfDetails.dropOfLocationId.longitude
    //     let driverLoc = startLoc
    //     if (res.data.data.driverId) {
    //       driverLoc = res.data.data.driverId.location.latt + "," + res.data.data.driverId.location.long
    //     }
    //     let pickup = res.data.data.pickUpDetails.pickupAddress.latitude + "," + res.data.data.pickUpDetails.pickupAddress.longitude
    //     let delivered = res.data.data.dropOfDetails.deliveryAddress.latitude + "," + res.data.data.dropOfDetails.deliveryAddress.longitude

    //     setMapData({
    //       start: startLoc,
    //       end: endLoc,
    //       userLocation: driverLoc || startLoc,
    //       pickup: pickup,
    //       delivered: delivered
    //     })
    //     setLoading(false)
    //   }
    // })

    const fetchJobDetails = () => {

      get(`/admin/job?id=${id}`, 'admin')
        .then((res) => {
          console.log(res.data.status);

          if (res.data.status) {
            const jobData = res.data.data;
            setData(jobData);
            console.log("job details", jobData);

            const startLoc = `${jobData.pickUpDetails.pickupAddress.latitude},${jobData.pickUpDetails.pickupAddress.longitude}`;
            const endLoc = `${jobData.dropOfDetails.deliveryAddress.latitude},${jobData.dropOfDetails.deliveryAddress.longitude}`;
            const driverLoc = jobData.driverId
              ? `${jobData.driverId.location.latt},${jobData.driverId.location.long}`
              : startLoc;

            const delivered = `${jobData.dropOfDetails.dropOfLocationId.latitude},${jobData.dropOfDetails.dropOfLocationId.longitude}`;
            const pickup = `${jobData.pickUpDetails.pickupLocationId.latitude},${jobData.pickUpDetails.pickupLocationId.longitude}`;

            console.log("pickup", pickup);
            console.log("delivered", delivered);

            const token = localStorage.getItem("admintoken");
            console.log("token", token);
            console.log("job ID", id);

            // Fetch driver location history
            get(`/admin/job/locationHistoryByJobId?id=${id}`, 'admin')
              .then((historyRes) => {
                if (historyRes.data.status) {
                  const locationHistory = historyRes.data.data;
                  console.log("Driver Location History:", historyRes);

                  // Send everything into map data
                  setMapData({
                    start: startLoc,
                    end: endLoc,
                    userLocation: driverLoc,
                    pickup: pickup,
                    delivered: delivered,
                    locationHistory: locationHistory  // 🟢 added history data
                  });
                } else {
                  console.warn("No location history found");

                  // Still set mapData without history
                  setMapData({
                    start: startLoc,
                    end: endLoc,
                    userLocation: driverLoc,
                    pickup: pickup,
                    delivered: delivered,
                    locationHistory: [] // 🟡 empty if no data
                  });
                }

                setLoading(false);
              })
              .catch((err) => {
                console.error("Error fetching location history:", err);
                // Still proceed with map data without location history
                setMapData({
                  start: startLoc,
                  end: endLoc,
                  userLocation: driverLoc,
                  pickup: pickup,
                  delivered: delivered,
                  locationHistory: [] // 🟡 in case of error
                });
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching job details:", error);
          setLoading(false);
        });
    };




    fetchJobDetails();

    const locationInterval = setInterval(() => {
      fetchJobDetails();
    }, 5000);

    return () => clearInterval(locationInterval);
  }
    , [])

  const markerIcons = {
    start: {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: " green",
      fillOpacity: 1.0,
      strokeWeight: 0,
      scale: 1.5,
      info: 'PickedUp Location',
    },
    // end: {
    //   path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    //   fillColor: "green",
    //   fillOpacity: 1.0,
    //   strokeWeight: 0,
    //   scale: 1.5,
    //   info: 'End Location',
    // },
    pickup: {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: "red",
      fillOpacity: 1.0,
      strokeWeight: 0,
      scale: 1.5,
      info: 'Drop-off Location',
    },
    delivered: {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",

      fillColor: "blue",
      fillOpacity: 1.0,
      strokeWeight: 0,
      scale: 1.5,
      info: `Driver's Location`,
    },
  };
  return (
    <>
      <div className='row'>
        <h4 className="w-100 d-flex align-items-center">
          Package Location
        </h4>
      </div>
      <div style={{ height: '100%', width: '100%' , padding: '20px', background:'#fff', marginTop:'10px', marginBottom:'50px'}}>
        {
          loading && mapData ? (<Spinner animation="border" role="status">
          </Spinner>) : (<LocationNavigation
            start={mapData.start}
            end={mapData.end}
            userLocation={mapData.userLocation}
            pickup={mapData.pickup}
            delivered={mapData.delivered}
            history={mapData.locationHistory}
          />
          )}
        <div className="marker-info w-100 d-block pt-3 px-3" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
            {Object.keys(markerIcons).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '24px', height: '24px', marginRight: '10px' }}>
                  <svg viewBox="0 0 24 24" fill={markerIcons[key].fillColor} width="24" height="24">
                    <path d={markerIcons[key].path} />
                  </svg>
                </div>
                <p style={{ margin: 0 }}>{markerIcons[key].info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}

export default LocationMap
