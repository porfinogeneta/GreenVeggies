// import {useState, useEffect } from 'react'
import Cookies from 'js-cookie'


const useAuthorizeUPDATE = () => {
    
    const updateData = async (id, body = null, role) => {
        const accessToken = Cookies.get('accessToken');
        const uid = Cookies.get('authorizeToken');
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'uid': 'UID ' + uid,
                    'Role': 'Role: ' + role // role changing
                    }
            }
            if (body){
                options.body = JSON.stringify(body)
            }

            
            let response = null
            if (role == 'ADMIN'){
                response = await fetch(`http://localhost:8001/products/${id}`, options)
            }else {
                response = await fetch(`http://localhost:8001/products/order_change/${id}`, options)
            }
            

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