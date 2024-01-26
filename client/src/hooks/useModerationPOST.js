// import {useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useState } from 'react'


const useModerationPOST = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const postMessage = async (body = null) => {
        setLoading(true)
        // console.log(body);
        const accessToken = Cookies.get('accessToken');
        const uid = Cookies.get('authorizeToken');
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'uid': 'UID ' + uid,
                    'Role': 'Role: ' + 'FARMER' // role changing
                    }
            }
            if (body){
                options.body = JSON.stringify(body)
            }

            const response = await fetch(`http://localhost:8001/farmer/create`, options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await response.json();

        }catch (error) {
            setError(error)
        }finally {
            setLoading(false)
        }
        
    }

    return {loading, error, postMessage}

}

export default useModerationPOST;