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
    serviceCodeId: "",
    serviceType: "",
    serviceTypeId: "",
    jobId: "",
    clientName: "",
    driverName: "",
    transferJob: false,
    companyName: "",
    is_invoices: ""
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
    driverName: "",
    serviceCode: "",
    serviceCodeId: "",
    serviceType: "",
    serviceTypeId: "",
    transferJob: false,
    companyName: "",
    is_invoices: ""
  },
  data: [],
  invoiceData: [],
  jobsCount: 0,
  invoiceCount: 0,
  role: localStorage.getItem('role'),
  loggedInUser: {
    firstName: localStorage.getItem('firstname'),
    lastName: localStorage.getItem('lastname'),
    email: localStorage.getItem('email'),
    logoKey: localStorage.getItem('logo'),
    user: localStorage.getItem('user')
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
    case 'getJobData':
      return { ...state, data: payload };
    case 'getInvoiceData':
      return { ...state, invoiceData: payload };
    case 'setRole':
      return { ...state, role: payload };
    case 'setUserInfo':
      return { ...state, loggedInUser: payload };
    case 'setJobCount':
      return { ...state, jobsCount: payload };
    case 'setInvoiceCount':
      return { ...state, invoiceCount: payload };
    default:
      return state;
  }
};

// Create store
const store = createStore(changeState);

export default store;
