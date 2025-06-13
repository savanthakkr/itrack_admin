import axiosInstance from '../lib/axiosInstance'

export const clientToken = () => localStorage.getItem('jdAirTrans-client-token')

export const clientUrl = {
  login: '/client/login',
  serviceType: '/client/serviceType',
  serviceCode: '/client/serviceCode',
  pickups: '/client/pickups',
  dropoffs: '/client/dropoffs',
  getClient: '/profile',
  getJobById: '/job',
}

export const get_req = async (url, params = null, isAuth = false) => {
  let headers = {}

  if (params !== null) headers.params = params

  if (isAuth)
    headers.headers = {
      Authorization: `Bearer ${clientToken()}`,
      'Content-Type': 'multipart/form-data',
    }

  try {
    const response = await axiosInstance.get(url, headers)
    return response
  } catch (error) {
    throw error.response
  }
}
