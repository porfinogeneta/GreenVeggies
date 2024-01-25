import React, { useState, useEffect } from 'react';
import useGET from '../hooks/useGET.js'
import useAuthorizeDELETE from '../hooks/useAuthorizeDELETE.js';
import useAuthorizeUPDATE from '../hooks/useAuthorizeUPDATE.js';

function Admin() {

    // get all products
    const { data: initialData, loading, error } = useGET();
    // hooks methods
    const { deleteData } = useAuthorizeDELETE();
    const {updateData} = useAuthorizeUPDATE();
    const [products, setProducts] = useState(null);

    useEffect(() => {
        setProducts(initialData)
    }, [initialData])
    
    const handleDelete = async (id) => {
        try {
            // hook method
            await deleteData(id);
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


    return (
        <div>
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
    );
    };

export default Admin;
