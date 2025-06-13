import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get } from '../../lib/request'
import LocationNavigation from '../../components/Maps/LocationNavigation';
import { Spinner } from 'react-bootstrap';
function LocationMapClient() {
  let trackPermission = localStorage.getItem("clientTrackPermission");
  const navigate = useNavigate()

  console.log(trackPermission);
  console.log("jkshjashjahsajhsahs");
  if (trackPermission != "true") {
    navigate("/client/dashboard")
  }


  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState({
    start: "",
    end: "",
    userLocation: ""

  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await get(`/client/job?id=${id}`, "client");

        if (res.data.status) {
          const job = res.data.data;

          const startLoc = `${job.pickUpDetails.pickupAddress.latitude},${job.pickUpDetails.pickupAddress.longitude}`;
          const endLoc = `${job.dropOfDetails.deliveryAddress.latitude},${job.dropOfDetails.deliveryAddress.longitude}`;
          const driverLoc = job.driverId
            ? `${job.driverId.location.latt},${job.driverId.location.long}`
            : startLoc;

          const delivered = `${job.dropOfDetails.dropOfLocationId.latitude},${job.dropOfDetails.dropOfLocationId.longitude}`;
          const pickup = `${job.pickUpDetails.pickupLocationId.latitude},${job.pickUpDetails.pickupLocationId.longitude}`;

          // 🔐 Get token from localStorage or auth context
          const token = localStorage.getItem("clientToken"); // or whatever your token key is

          const locationHistoryRes = await get(
            `/client/locationHistoryByJob?jobId=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          let locationHistory = [];
          console.log(locationHistoryRes);
          console.log("locationHistoryRes");
          if (locationHistoryRes.data.status) {
            locationHistory = locationHistoryRes.data.data || [];

            // Remove duplicates
            locationHistory = locationHistory.filter((loc, index, self) =>
              index === self.findIndex((l) => l.lat === loc.lat && l.lng === loc.lng)
            );
          }


          setMapData({
            start: startLoc,
            end: endLoc,
            userLocation: driverLoc || startLoc,
            pickup: pickup,
            delivered: delivered,
            history: locationHistory,
          });
        }
      } catch (err) {
        console.error("Error fetching job/location history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  console.log("data", data)
  console.log("datadatadatadata")

  const markerIcons = {
    // start: {
    //   path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    //   fillColor: "red",
    //   fillOpacity: 1.0,
    //   strokeWeight: 0,
    //   scale: 1.5,
    //   info: 'Start Location',
    // },
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
      fillColor: "green",
      fillOpacity: 1.0,
      strokeWeight: 0,
      scale: 1.5,
      info: 'Picked Up Location',
    },
    delivered: {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: "red",
      fillOpacity: 1.0,
      strokeWeight: 0,
      scale: 1.5,
      info: 'Drop-off Location',
    },
    driver: {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: "blue", 
      fillOpacity: 1.0,
      strokeWeight: 0,
      scale: 1.5,
      info: 'Driver Location',
    },
  };


  return (
    <>
      <div className="w-100 d-flex align-items-center">
        <h5>Package Location</h5>

      </div>
      <div style={{ height: '100%', width: '100%', padding: '20px', background: '#fff', marginTop: '10px' }}>
        {
          loading && mapData ? <Spinner animation="border" role="status">
          </Spinner> : <LocationNavigation
            start={mapData.start}
            end={mapData.end}
            userLocation={mapData.userLocation}
            pickup={mapData.pickup}
            delivered={mapData.delivered}
            history={mapData.history}
          />
        }
      </div>
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
    </>
  )
}

export default LocationMapClient
