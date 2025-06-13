import axiosInstance from "./axiosInstance";
import { getAdminToken, getClientToken } from "./getTokens";


// const admintoken = localStorage.getItem("admintoken") 
// const clientToken = getClientToken();

const get = async (url, role) => {

    let token = "";
    if (role === "admin") {
        token = localStorage.getItem("admintoken");
    } else if (role === "client") {
        token = localStorage.getItem("jdAirTrans-client-token");
    }

    let headers = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }
    try {
        const response = await axiosInstance.get(url, headers);
        return response;
    } catch (error) {
        return error.response;
    }
};

const post = async (url, data, role) => {
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
        const response = await axiosInstance.post(url, data, headers);
        return response;
    } catch (error) {
        console.log("error in axios", error);
        return error.response;
    }

};
const postWihoutMediaData = async (url, data, role) => {
    let token = "";
    if (role === "admin") {
        token = localStorage.getItem("admintoken");
    } else if (role === "client") {
        token = localStorage.getItem("jdAirTrans-client-token");
    }
    let headers = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    try {
        const response = await axiosInstance.post(url, data, headers);
        return response;
    } catch (error) {
        console.log("error in axios", error);
        return error.response;
    }

};

const deleteReq = async (url, role) => {
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
        const response = await axiosInstance.delete(url, headers);
        return response;

    } catch (error) {
        console.log("error in axios", error);
        return error.response;
    }
}

const updateReq = async (url, data, role) => {
    let token = "";
    if (role === "admin") {
        token = localStorage.getItem("admintoken");
    } else if (role === "client") {
        token = localStorage.getItem("jdAirTrans-client-token");
    }

    let headers = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    try {
        const response = await axiosInstance.put(url, data, headers);
        return response;

    } catch (error) {
        console.log("error in axios", error);
        return error.response;
    }
}

const updateImage = async (url, data, role) => {
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
        const response = await axiosInstance.put(url, data, headers);
        return response;

    } catch (error) {
        console.log("error in axios", error);
        return error.response;
    }
}

export { get, post, deleteReq, updateReq, postWihoutMediaData, updateImage };