import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Form } from 'react-bootstrap';
import React, { useRef, useEffect } from 'react';

export default function LocationSuggestion({ location, setLocation }) {
    const autocompleteRef = useRef(null);

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            const coords = {
                lat: location.lat(),
                lng: location.lng(),
            };
            setLocation({
                latitude: coords.lat,
                longitude: coords.lng,
                mapName: place.formatted_address
            });
        }
    };

    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Inject custom CSS for .pac-container
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .pac-container {
                z-index: 1070 !important; /* Higher than Bootstrap modal */
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
            <div style={{ position: 'relative', zIndex: 1070 }}>
                <Autocomplete
                    onLoad={ref => (autocompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                >
                    <Form.Control
                        type="text"
                        placeholder="Enter a location"
                        value={location.mapName}
                        onChange={(e) => setLocation({ ...location, mapName: e.target.value })} className="custom-form-control"
                        style={{ position: 'relative', zIndex: 1070 }} // Ensure input is above the modal
                    />
                </Autocomplete>
            </div>
        </LoadScript>
    );
}
