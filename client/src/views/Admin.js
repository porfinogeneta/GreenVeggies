import React, { useState, useEffect } from 'react';
import useGET from '../hooks/useGET.js';
import useAuthorizeDELETE from '../hooks/useAuthorizeDELETE.js';
import useAuthorizeUPDATE from '../hooks/useAuthorizeUPDATE.js';

import useAuthorizePULL from '../hooks/useAuthorizePULL.js';
import useAuthorizeGET from '../hooks/useAuthorizeGET.js';
import useAuthorizePOST from '../hooks/useAuthorizePOST.js';
import '../views/styles/admin_styles.css';

function Admin() {
  const { data: initialData, loading, error } = useGET();
  const { deleteData } = useAuthorizeDELETE();
  const { updateData } = useAuthorizeUPDATE();
  const [products, setProducts] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock_quantity: '',
  });
  const [searchQuery, setSearchQuery] = useState('');


    // messages products to accept/reject
    const [notifications, setNotifications] = useState(null);
    const {data: noti, loading: notiLoad, error: notiErr, fetchData} = useAuthorizeGET()
    const {newData, newProducts, loading: nl, error: er, addData} = useAuthorizePOST()


    // look for subscribed notifications on mounted
    useAuthorizePULL()



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
  
    useEffect(() => {
        setProducts(initialData);
    }, [initialData]);

  useEffect(() => {

    // Update form with current values when entering edit mode
    if (editMode !== null) {
      const currentItem = products.find((item) => item.id === editMode);
      setUpdateForm(currentItem);
    } else {
      // Clear the form when exiting edit mode
      setUpdateForm({
        name: '',
        description: '',
        category: '',
        price: '',
        stock_quantity: '',
      });
    }
  }, [editMode, products]);

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

//   const handleDelete = async (id) => {
//     try {
//       await deleteData(id);
//       setProducts((prevProducts) => prevProducts.filter((item) => item.id !== id));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   const handleUpdate = async (id, e) => {
//     e.preventDefault(); // Prevent the default form submission behavior
//     try {
//       await updateData(id, updateForm);
//       setProducts((prevProducts) =>
//         prevProducts.map((item) => (item.id === id ? { ...item, ...updateForm } : item))
//       );
//       setEditMode(null);
//     } catch (error) {
//       console.error("Error updating item:", error);
//     }
//   };

  const toggleEditMode = (id) => {
    setEditMode((prevEditMode) => (prevEditMode === id ? null : id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredProducts = products
    ? products.filter((item) => (item.name.toLowerCase().includes(searchQuery) || 
                                item.price.includes(searchQuery)))
    : [];

  return (
    <div>
        <div>

        
      <h1>Admin panel</h1>
      <input className="admin-input"
        type="text"
        placeholder="Search by name/price..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ul className="admin-list">
          {filteredProducts.map((item) => (
            <span key={item.id}>
              <li className="admin-info">
                𝗡𝗮𝗺𝗲: {item.name}<br></br>𝗣𝗿𝗶𝗰𝗲: {(item.price * 1).toFixed(2)}$<br></br>
                𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: {item.category}<br></br> 𝗤𝘂𝗮𝗻𝘁𝗶𝘁𝘆: {item.stock_quantity}<br></br>
                𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: {item.description}
              </li>
              <button className="admin-button" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
              <button className="admin-button" onClick={() => toggleEditMode(item.id)}>
                Edit
              </button>
              {editMode === item.id && (
                <form className="edit-product" onSubmit={(e) => handleUpdate(item.id, e)}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={updateForm.name}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={updateForm.description}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={updateForm.category}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={updateForm.price}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="stock_quantity"
                    placeholder="Stock Quantity"
                    value={updateForm.stock_quantity}
                    onChange={handleChange}
                  />
                  <button type="submit">Update</button>
                </form>
              )}
            </span>
          ))}
        </ul>
      )}
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
    </div>
  );
}

export default Admin;
