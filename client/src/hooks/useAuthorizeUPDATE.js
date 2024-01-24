// import {useState, useEffect } from 'react'
import Cookies from 'js-cookie'


const useAuthorizeUPDATE = () => {
    
    const updateData = async (id, body = null) => {
        const accessToken = Cookies.get('accessToken');
        const uid = Cookies.get('authorizeToken');
        try {
            const options = {
                method: 'PUT',
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

            const response = await fetch(`http://localhost:8001/products/${id}`, options)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();

        }catch (error) {
            throw error
        }
        
    }

    return {updateData}

}

export default useAuthorizeUPDATE;