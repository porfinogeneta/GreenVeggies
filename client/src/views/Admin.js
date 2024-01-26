import React, { useState, useEffect } from 'react';
import useGET from '../hooks/useGET.js';
import useAuthorizeDELETE from '../hooks/useAuthorizeDELETE.js';
import useAuthorizeUPDATE from '../hooks/useAuthorizeUPDATE.js';
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

  const handleDelete = async (id) => {
    try {
      await deleteData(id);
      setProducts((prevProducts) => prevProducts.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdate = async (id, e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      await updateData(id, updateForm);
      setProducts((prevProducts) =>
        prevProducts.map((item) => (item.id === id ? { ...item, ...updateForm } : item))
      );
      setEditMode(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

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

  return (
    <div>
      <h1>Admin panel</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ul className="admin-list">
          {products.map((item) => (
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
    </div>
  );
}

export default Admin;
