import axios from 'axios';


const getLocationByCordinates = async (latitude, longitude) => {
 
    if (!latitude || !longitude) {
      return ""
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return 'No location found';
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      return 'Error fetching location data';
    }
}

export default getLocationByCordinates;