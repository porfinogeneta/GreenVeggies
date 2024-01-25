import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import useAuthorizePOST from '../hooks/useAuthorizePOST';
import useGET from '../hooks/useGET';
import '../views/styles/farmer_styles.css';

function Farmer() {

    const {data: products, loading: productsLoad, error: productsError} = useGET()
  
    const {newData, loading, error, addData} = useAuthorizePOST();

    const [productsList, setProductsList] = useState(null)

    useEffect(() => {
        setProductsList(products)
    }, [products])

    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock_quantity: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: value
        }));
      };
      // on form submitted add product
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // wait till product is added
            await addData(product)
            // update local state
            setProductsList((prevProducts) => [...prevProducts, product]);
            // console.log('Product submitted:', product);
            // Reset the form after submission
            setProduct({
            name: '',
            description: '',
            category: '',
            price: '',
            stock_quantity: ''
            });
        }catch(error){
            productsError = error
        }
        
      };
    
      return (
        <div>
          <h2>PRODUCTS FROM VENDOR</h2>
          {productsLoad ? (
            <p>Loading...</p>
          ) : productsError ? (
            <p>Error: {error.message}</p>
          ) : (
            <ul className="product-list">
              {productsList.map((item) => (
                <span key={item.id}>
                  <li className="sub-list">
                    {' '}
                    𝗡𝗮𝗺𝗲: {item.name}<br></br>
                    𝗗𝗲𝘀𝗰𝗿𝗶𝗯𝘁𝗶𝗼𝗻: {item.description}<br></br>
                    𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: {item.category}<br></br>
                    𝗤𝘂𝗮𝗻𝘁𝗶𝘁𝘆: {item.stock_quantity}<br></br>
                    𝗣𝗿𝗶𝗰𝗲: {item.price * 1}$
                  </li>
                </span>
              ))}
            </ul>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <Form onSubmit={handleSubmit}>
              <h2>Add a new product by filling the form below</h2>
              <Form.Group controlId="formName">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" name="name" value={product.name} onChange={handleChange} />
              </Form.Group>
    
              <Form.Group controlId="formDescription">
                <Form.Label>Description:</Form.Label>
                <Form.Control as="textarea" name="description" value={product.description} onChange={handleChange} />
              </Form.Group>
    
              <Form.Group controlId="formCategory">
                <Form.Label>Category:</Form.Label>
                <Form.Control type="text" name="category" value={product.category} onChange={handleChange} />
              </Form.Group>
    
              <Form.Group controlId="formPrice">
                <Form.Label>Price:</Form.Label>
                <Form.Control type="number" name="price" value={product.price} onChange={handleChange} />
              </Form.Group>
    
              <Form.Group controlId="formStockQuantity">
                <Form.Label>Stock Quantity:</Form.Label>
                <Form.Control type="number" name="stock_quantity" value={product.stock_quantity} onChange={handleChange} />
              </Form.Group>
    
              <Button variant="primary" type="submit">
                Add Product
              </Button>
            </Form>
          )}
        </div>
      );
    }

export default Farmer;