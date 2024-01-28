import React, { useState, useEffect } from 'react';
import useGET from '../hooks/useGET.js';
import useAuthorizeDELETE from '../hooks/useAuthorizeDELETE.js';
import useAuthorizeUPDATE from '../hooks/useAuthorizeUPDATE.js';
import { Button } from 'react-bootstrap';
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

    const handleUpdate = async (id, e) => {
        e.preventDefault();
        try {
            await updateData(id, updateForm, 'ADMIN')
            // update local state
            setProducts((prevProducts) =>
                prevProducts.map((item) => (item.id === id ? { ...item, ...updateForm } : item))
            );
            setEditMode(null);
        }catch(error) {
            console.error("Error updating item:", error);
        }
    }

    useEffect(() => {
        setProducts(initialData)
    }, [initialData])
  

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
    }, [editMode, products, initialData]);

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
            await handleReject(id)
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }



    const handleLoad = async () => {
        try {
            const res = await fetchData('ADMIN', 'http://localhost:8001/notifications')
            setNotifications(res)

        }catch(error) {
            console.log(error);
        }
    }


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
                  Name: {item.name}<br></br>
                  Category: {item.category}<br></br>
                  Price: {(item.price * 1).toFixed(2)}$<br></br>
                  Quantity: {item.stock_quantity}<br></br>
                  Describtion: {item.description}
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
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={updateForm.description}
                      onChange={handleChange}
                    />
                    <button type="submit">Update</button>
                  </form>
                )}
              </span>
            ))}
          </ul>
        )}
          <div className="mt-4">
          <h2 name="notif">Notifications</h2>
          <Button variant="info" className="info" onClick={handleLoad}>
            Refresh Notifications
          </Button>
          {notiLoad ? (
            <p>Loading notifications...</p>
          ) : notiErr ? (
            <p>Error: {notiErr.message}</p>
          ) : (
            notifications && (
              <ul className="notification-container">
                {notifications.map((notification) => (
                  <li key={notification.id} className="notification-card">
                    Name: {notification.name}<br></br>
                    Category: {notification.category}<br></br>
                    Price: {notification.price}<br></br>
                    Quantity: {notification.stock_quantity}<br></br>
                    {/* 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: {notification.description} */}
                    <button className="notification-button-yes" onClick={() => handleAccept(notification.id)}>
                      Accept
                    </button>
                    <button className="notification-button-no" onClick={() => handleReject(notification.id)}>
                      Reject
                    </button>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    );
  }

export default Admin;