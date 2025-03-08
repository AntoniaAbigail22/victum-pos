import axios from "axios";

const axiosAPIInstance = axios.create({ 
    //baseURL: 'https://melody-back-sigma.vercel.app/api',
    baseURL: "http://localhost:3000/api",
    headers: { 
        "Accept": "application/json", 
        "Content-Type": "application/json; charset=utf-8;"
    }
});

const Fetcher = async (args) => {
    console.log("🚀 🚀 🚀 🚀 ~ ~ ~ Args Fetcher:")
    console.log("🚀 🚀 🚀 🚀 ~ ~ ~ :", JSON.stringify(args, null, 3))
    let response = {};
    try { 
        response = await axiosAPIInstance(args);
    } catch (error) {
        console.log("🚀 ~ file: Petition.js:11 ~ Fetcher ~ error:", error)
        response = error
        if (error.response) response = error.response;
        else if (error.request) response = error.request;
        else response = error.message;
    } finally { 
        return response; 
    }
}

export default Fetcher;

/*
const headers = {
    'Accept': 'application/json', 
    'Content-Type': 'application/json; charset=utf-8; multipart/form-data',
    //"Accept": "application/json",
    //"Content-Type": "text/json; application/json; charset=utf-8; multipart/form-data",
    //"Access-Control-Allow-Credentials": true,
    //"X-Requested-With": "XMLHttpRequest",
};

export const victumApi = axios.create({
    baseURL: `${SERVER}`,
    headers
});*/
