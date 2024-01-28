import {useState, useEffect } from 'react'

const useGET = (method = 'GET', body = null, fetching = true) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                      },
                } 
                if (body){
                    options.body = JSON.stringify(body)
                }

                const response = await fetch(`http://localhost:8001/products`, options)

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // console.log(response);
                const result = await response.json()
                setData(result)
            }catch (error) {
                setError(error)
            }finally {
                setLoading(false)
            }
            
        }

        fetchData()
    }, []);
     // result from useEffect
    return {data, loading, error}

}

export default useGET;