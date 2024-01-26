import React, { useEffect } from 'react';
import { useState } from 'react';
// import useAuthorizePOST from '../hooks/useAuthorizePOST';
import useModerationPOST from '../hooks/useModerationPOST';
import useGET from '../hooks/useGET';

function Farmer() {

    const {data: products, loading: productsLoad, error: productsError} = useGET()
  
    const {loading, error, postMessage} = useModerationPOST();

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
            await postMessage(product)
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
            <div>PRODUCTS FROM VENDOR</div>
            {productsLoad ? (
            <p>Loading...</p>
            ) : productsError ? (
                <p>Error: {error.message}</p>
            ) : (
                <ul>
                {productsList.map(item => (
                    <span key={item.id}>
                        <li > {item.name}{item.description}</li>
                    </span>
                    
                ))}
                </ul>
            )}
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>Error: {error.message}</p>
        ) : (
            <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={product.name} onChange={handleChange} />
          </label>
          <br />
    
          <label>
            Description:
            <textarea name="description" value={product.description} onChange={handleChange} />
          </label>
          <br />
    
          <label>
            Category:
            <input type="text" name="category" value={product.category} onChange={handleChange} />
          </label>
          <br />
    
          <label>
            Price:
            <input type="number" name="price" value={product.price} onChange={handleChange} />
          </label>
          <br />
    
          <label>
            Stock Quantity:
            <input type="number" name="stock_quantity" value={product.stock_quantity} onChange={handleChange} />
          </label>
          <br />
    
          <button type="submit">Add Product</button>
        </form>
      )}
        </div>
        )
        
    
}

export default Farmer;