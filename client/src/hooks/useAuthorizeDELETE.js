// import {useState, useEffect } from 'react'
import Cookies from 'js-cookie'


const useAuthorizeDELETE = () => {
    // const [data, setData] = useState([])
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState(null)

    
    const deleteData = async (id) => {
        const accessToken = Cookies.get('accessToken');
        const uid = Cookies.get('authorizeToken');

        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'uid': 'UID ' + uid,
                    'Role': 'Role: ' + 'ADMIN' // role changing
                    },
            }

        await fetch(`http://localhost:8001/products/${id}`, options)
        
        }catch (error) {
            throw error
        }
        
    }
     // result from useEffect
    return {deleteData}

}

export default useAuthorizeDELETE;