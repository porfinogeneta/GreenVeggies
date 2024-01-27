import {useState } from 'react'
import Cookies from 'js-cookie'


const useAuthorizeGET = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async (role, link) => {
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
                    'Role': 'Role: ' + role // role changing
                    }
            } 

            const response = await fetch(link, options) 

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json()
            return result
        }catch (error) {
            setError(error)
        }finally {
            setLoading(false)
        }
        
    }

     // result from useEffect
    return {loading, error, fetchData}

}

export default useAuthorizeGET;