import axios from "axios";

const api = axios.create({
    baseUrl: process.env.REACT_APP_SERVER_URL
})
export function makeRequest(url, options) {
  return axios(url, options)
    .then((res) => res.data)
    .catch((error) => Promise.reject(error?.response?.data?.message ?? "Error"));
}
