import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const ButtonLink = ({ to, className, style, children, product }) => {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    // Check if the product is in the cart when the component mounts
    const existingCart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
    const existingProductIndex = existingCart.findIndex((item) => item.id === product.id);
    setIsInCart(existingProductIndex !== -1);
  }, [product.id]); // Trigger effect whenever the product ID changes

  const addToCart = () => {
    const existingCart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
    const existingProductIndex = existingCart.findIndex((item) => item.id === product.id);

    // If the product already exists in the cart, set isInCart to true
    if (existingProductIndex !== -1) {
      setIsInCart(true);
    } else {
      // Product doesn't exist in the cart, add a new entry with quantity 1
      const updatedCart = [...existingCart, { ...product, quantity: 1 }];
      Cookies.set('cart', JSON.stringify(updatedCart));

      // Optionally, you can navigate to the shopping cart page after adding to the cart
    }
  };

  return (
    <div>
      {isInCart ? (
          <p style={{fontWeight: 777, color: '#117c2c'}}>
          The product is in the cart already
          </p>
      ) : (
        <Link to={to} className={className} style={style} onClick={addToCart}>
          {children}
        </Link>
      )}
    </div>
  );
};

export default ButtonLink;
