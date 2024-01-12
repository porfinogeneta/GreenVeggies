import { Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useGET from '../hooks/useGET'
import Cookies from 'js-cookie'

const PrivateRoutes = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // sime authentiacting api request
    const fetchData = async () => {
        const accessToken = Cookies.get('accessToken')
        const uid = Cookies.get('authorizeToken')
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'uid': 'UID ' + uid,
                    'Role': 'Role: ' + 'ADMIN' // role changing
                    },
            }

            // fetch data from a server at given url
            const response = await fetch('http://localhost:8001/', options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(response);
            const result = await response.json()
            setData(result)
            console.log(result);
        }catch (error) {
            setError(error.name)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        
        fetchData()
    }, [])

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return  <Navigate to="/login" />
    }

    return data ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes