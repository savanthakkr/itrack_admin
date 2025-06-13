const getStatusStyles = (status) => {
    switch (status) {
        case 'Pending':
            return { color: '#F47C13', backgroundColor: '#FFF2DA' }; 
        case 'Driver Assigned':
            return { color: '#C716B5', backgroundColor: '#FFD0FA' }; 
        case 'Arrival on Pickup':
            return { color: '#AA3AEB', backgroundColor: '#EED0FF' }; 
        case 'Picked Up':
            return { color: '#11808C', backgroundColor: '#A8ECFF' }; 
        case 'Arrival on Delivery':
            return { color: '#443FE2', backgroundColor: '#D2D0FF' }; 
        case 'Delivered':
            return { color: '#29A93D', backgroundColor: '#BAFFC5' }; 
        case 'Halt':
            return { color: '#FF4500', backgroundColor: '#FFE5E5' }; // Orange Red
        case 'Cancelled':
            return { color: '#E92C2C', backgroundColor: '#FFDADA' }; 
        case 'Cancelling':
            return { color: '#FEA33C', backgroundColor: '#FFF6DA' }; 
        case 'Hold':
            return { color: '#F39428', backgroundColor: '#FFE4D5' }; 
        default:
            return { color: '#000000', backgroundColor: '#FFFFFF' }; // Default Black on White
    }
};

export default getStatusStyles;