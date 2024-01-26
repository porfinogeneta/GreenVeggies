import {useState } from 'react'
import Cookies from 'js-cookie'


const useAuthorizeGET = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        const accessToken = Cookies.get('accessToken');
        const uid = Cookies.get('authorizeToken');
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'uid': 'UID ' + uid,
                    'Role': 'Role: ' + 'ADMIN' // role changing
                    }
            } 

            const response = await fetch(`http://localhost:8001/notifications`, options) 

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(response);
            const result = await response.json()
            return result
            setData(result)
        }catch (error) {
            setError(error)
        }finally {
            setLoading(false)
        }
        
    }

     // result from useEffect
    return {data, loading, error, fetchData}

}

export default useAuthorizeGET;