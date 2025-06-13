import axiosInstance from "../lib/axiosInstance";
import { getAdminToken } from "../lib/getTokens";

const adminToken = getAdminToken()


export const getTotalDocs = async (collection,role) => {
    let headers = {}
    if (role === "admin") {
        headers = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    }
    try {
        const response = await axiosInstance.get(`/admin/info/count?collectionName=${collection}`,headers);
        return response.data.data;
    } catch (error) {
        console.error("error while getting toatal docs",error.message);
        return 0;
    }
}

export const getJobCountByStatus = async (status,role) => {
    let headers = {}
    let token = ''
    let url = ''
    if (role === "admin") {
        token = localStorage.getItem("admintoken")
        url = "/admin/info/jobCountByStatus?status="
    }else if(role==="client"){
        token = localStorage.getItem('jdAirTrans-client-token')
        url = "/client/jobCountByStatus?status="
    }
    headers = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }
    try {
        const response = await axiosInstance.get(`${url}${status}`,headers);
        return response.data.data;
    } catch (error) {
        console.error("error while getting job count by status",error.message);
        return 0;
    }
}

