

export const getAdminToken=()=>{
    const token = localStorage.getItem("admintoken");
    if(token){
        return token
    }else{
        return false
    }
}

export const getClientToken=()=>{
    const token = localStorage.getItem("jdAirTrans-client-token");
    if(token){
        return token
    }else{
        return false
    }
}