/* eslint-disable prettier/prettier */
import axios from 'axios'

const axiosInstance = axios.create({
  // baseURL: 'https://itrack.api.redoq.host/',
  // baseURL: 'https://huss-backend.vercel.app/',
  // baseURL: 'https://jdbackend-ddgkg6ejd7ghhgdy.australiaeast-01.azurewebsites.net/',
  // baseURL:'https://dev.itrack.api.aws.redoq.host/',
  baseURL:'http://localhost:5000/',
  timeout: 9000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
