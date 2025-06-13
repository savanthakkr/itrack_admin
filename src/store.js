import { legacy_createStore as createStore } from 'redux';

// Initial state with searchQuery added
const initialState = {
  sidebarShow: true,
  theme: 'light',
  searchQuery: {
    AWB: "",
    clientId: "",
    driverId: "",
    fromDate: "",
    toDate: "",
    currentStatus: "",
    serviceCode: "",
    jobId: "",
    clientName: "",
    driverName: ""
  },
  searchQuery2: {
    AWB: "",
    clientId: "",
    driverId: "",
    fromDate: "",
    toDate: "",
    currentStatus: "",
    jobId: "",
    clientName: "",
    driverName: ""
  }
};

// Reducer function
const changeState = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'set':
      // Destructure the action to remove the type property
      let { type: _, ...restPayload } = action;
      return { ...state, ...restPayload };
    case 'updateSearchQuery':
      return { ...state, searchQuery: { ...state.searchQuery, ...payload } };
    case 'updateSearchQuery2':
      return { ...state, searchQuery2: { ...state.searchQuery2, ...payload } };
    default:
      return state;
  }
};

// Create store
const store = createStore(changeState);

export default store;
