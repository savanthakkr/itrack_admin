import axiosInstance from "../lib/axiosInstance";
import { getAdminToken, getClientToken } from "../lib/getTokens";

const clientToken = getClientToken();

export const getSeachFilterResult = async (data, role) => {
    let token = '';
    let url = '';
    if (role === "admin") {
        token = localStorage.getItem("admintoken");
        url = `/admin/info/jobFilter?AWB=${data.AWB}&clientId=${data.clientId}&driverId=${data.driverId}&fromDate=${data.fromDate}&toDate=${data.toDate}&currentStatus=${data.currentStatus}&uid=${data.jobId}`

    } else if (role === "client") {
        token = localStorage.getItem("jdAirTrans-client-token");
        url = `/client/jobFilter?AWB=${data.AWB}&driverId=${data.driverId}&fromDate=${data.fromDate}&toDate=${data.toDate}&currentStatus=${data.currentStatus}&uid=${data.jobId}`
    }

    let headers = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }
    try {
        const response = await axiosInstance.get(url,headers);
        if (response.data.status) {
            return response.data.data;
        }else{
            return [];
        }
    } catch (error) {
        console.error("error while getting toatal docs", error.message);
        return 0;
    }
}
