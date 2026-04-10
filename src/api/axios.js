import axios from 'axios'
//we are using create function of axios
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'

});

//how do i attach the token to every req after veryfing
//in every interceptors.req .. use this  from where ? localstorage or httpcookies
//for axios config is the actual request receird.!!!
instance.interceptors.request.use((config)=>
{
    const token = localStorage.getItem('token');
    if(token)
    {
        config.headers.Authorization=`Bearer ${token}`
    }
    return config
})

export default instance