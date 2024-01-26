import React, { useState, useEffect } from 'react';
import useGET from '../hooks/useGET.js'
import useAuthorizeDELETE from '../hooks/useAuthorizeDELETE.js';
import useAuthorizeUPDATE from '../hooks/useAuthorizeUPDATE.js';
// import useAuthorizePULL from '../hooks/useAuthorizePULL.js';
import useAuthorizePULL from '../hooks/useAuthorizePULL.js';
import useAuthorizeGET from '../hooks/useAuthorizeGET.js';
import useAuthorizePOST from '../hooks/useAuthorizePOST.js';

function Admin() {

    // get all products
    const { data: initialData, loading, error } = useGET();
    // hooks methods
    const { deleteData } = useAuthorizeDELETE();
    const {updateData} = useAuthorizeUPDATE();
    // messages products to accept/reject
    const [notifications, setNotifications] = useState(null);
    const {data: noti, loading: notiLoad, error: notiErr, fetchData} = useAuthorizeGET()
    const {newData, newProducts, loading: nl, error: er, addData} = useAuthorizePOST()

    const [products, setProducts] = useState(null);

    // look for subscribed notifications on mounted
    // useAuthorizePULL()



    useEffect(() => {
        setProducts(initialData)
    }, [initialData])
    
    const handleDelete = async (id) => {
        try {
            // hook method
            await deleteData('products', id);
            // update local state
            setProducts((prevProducts) => prevProducts.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const body = {col_name: 'category', col_val: 'koń'}
            await updateData(id, body)
            // update local state
            setProducts((prevProducts) => 
                prevProducts.map(item => 
                    item.id === id ? { ...item, [body.col_name]: body.col_val } : item)
                );
        }catch(error) {
            console.error("Error updating item:", error);
        }
    }

    const handleReject = async (id) => {
        try {
            // hook method
            await deleteData('notifications', id);
            // update local state
            setNotifications((prevNotifications) => prevNotifications.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
        
    }

    const handleAccept = async (id) => {
        try {
            const new_product = notifications.find(pr => pr.id == id)
            // hook method
            await addData(new_product);
            // update local state
            setNotifications((prevNotifications) => prevNotifications.filter(item => item.id !== id));
            setProducts((prevProducts) => [...prevProducts, new_product])
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }



    const handleLoad = async () => {
        try {
            const res = await fetchData()
            setNotifications(res)

        }catch(error) {
            console.log(error);
        }
    }


    return (
        <div>
            <div>
                <h2>Products</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    <ul>
                        {products.map(item => (
                            <span key={item.id}>
                                <li > {item.name} {item.description} {item.category}</li>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                                <button onClick={() => handleUpdate(item.id)}>Update</button>
                            </span>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <h2>Notifications</h2>
                <button onClick={handleLoad}>Refresh notifications</button>
                {notiLoad ? (
                    <p>Loading notifications...</p>
                ) : notiErr ? (
                    <p>Error: {notiErr.message}</p>
                ) : (
                    notifications && (
                        <ul>
                            {notifications.map((notification) => (
                                <div>
                                    <li key={notification.id}>{notification.name}</li>
                                    <button onClick={() => handleAccept(notification.id)}>Accept</button>
                                    <button onClick={() => handleReject(notification.id)}>Reject</button>
                                </div>
                                
                            ))}
                        </ul>
                    )
                )}   
            </div>
        </div>
    );
    };

export default Admin;
