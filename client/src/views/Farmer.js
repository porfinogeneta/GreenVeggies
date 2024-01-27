import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
// import useAuthorizePOST from '../hooks/useAuthorizePOST';
import useModerationPOST from '../hooks/useModerationPOST';
import useAuthorizeGET from '../hooks/useAuthorizeGET';
import '../views/styles/farmer_styles.css';
import Cookies from 'js-cookie'

function Farmer() {
  const uid = Cookies.get('authorizeToken');
    
    const {loading: productsLoad, error: productsError, fetchData} = useAuthorizeGET()
  
    const {loading, error, postMessage} = useModerationPOST();

    const [productsList, setProductsList] = useState(null)

    useEffect(() => {
      const fetchDataAndSetState = async () => {
        try {
          const products = await fetchData('FARMER', `http://localhost:8001/products/farmer/70powABQsAOf57JTUcObV8xRyg82`);
          setProductsList(products);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchDataAndSetState();
        
    }, [uid])

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
          const uid = Cookies.get('authorizeToken');
            // wait till product is added
            await postMessage({...product, farmer_id: uid})
            // update local state
            // setProductsList((prevProducts) => [...prevProducts, product]);
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
            console.log(error);
            // productsError = error
        }
        
      };
    
      return (
        <div>
          <h1>Farmer panel</h1>
          <h2>Products from vendor</h2>
          {productsLoad ? (
            <p>Loading...</p>
          ) : productsError ? (
            <p>Error: {error.message}</p>
          ) : (
            <ul className="product-list">
              {productsList !== null ? productsList.map((item) => (
                <span key={item.id}>
                  <li className="sub-list">
                    {' '}
                    𝗡𝗮𝗺𝗲: {item.name}<br></br>
                    𝗗𝗲𝘀𝗰𝗿𝗶𝗯𝘁𝗶𝗼𝗻: {item.description}<br></br>
                    𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: {item.category}<br></br>
                    𝗤𝘂𝗮𝗻𝘁𝗶𝘁𝘆: {item.stock_quantity}<br></br>
                    𝗣𝗿𝗶𝗰𝗲: {(item.price * 1).toFixed(2)}$
                  </li>
                </span>
              )): (<>No products</>)}
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