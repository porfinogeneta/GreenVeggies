import {useEffect } from 'react'
import Cookies from 'js-cookie'

// hook for retrieving messages that the admin is subscribing
const useAuthorizePULL = () => {
    useEffect(() => {
        const pullMessage = async (body = null) => {
            console.log(body);
            const accessToken = Cookies.get('accessToken');
            const uid = Cookies.get('authorizeToken');
            try {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                        'uid': 'UID ' + uid,
                        'Role': 'Role: ' + 'ADMIN' // role changing
                        }
                }
                if (body){
                    options.body = JSON.stringify(body)
                }
    
                const response = await fetch(`http://localhost:8001/admin/pull`, options)
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const result = await response.json()
                return result
            }catch (error) {
                console.log(error);
            }
            
        }

        pullMessage()
    }, [])

}

export default useAuthorizePULL;