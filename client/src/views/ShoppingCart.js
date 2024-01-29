import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';
import '../views/styles/shoppingcart_styles.css';
import useAuthorizeUPDATE from '../hooks/useAuthorizeUPDATE';
import useAuthorizeDELETE from '../hooks/useAuthorizeDELETE';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [editedItemId, setEditedItemId] = React.useState(null);
  const [editedQuantity, setEditedQuantity] = React.useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false); 

  // hooks
  const {updateData} = useAuthorizeUPDATE();
  const {deleteData} = useAuthorizeDELETE()

  React.useEffect(() => {
    // Retrieve cart items from cookies
    const itemsFromCookie = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
    setCartItems(itemsFromCookie);
  }, []); // Run only once on component mount

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    Cookies.set('cart', JSON.stringify(updatedCart));
    setEditedItemId(null); // Reset edited item after saving changes
    setEditedQuantity(0);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    updateCart(updatedCart);
  };

  const handleEditQuantity = (productId, currentQuantity) => {
    setEditedItemId(productId);
    setEditedQuantity(currentQuantity);
  };

  const handleSaveQuantity = (productId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
        if (editedQuantity > 0 && editedQuantity <= item.stock_quantity) {
          return { ...item, quantity: editedQuantity };
        } else {
          alert("Invalid quantity. Please enter a value between 0 and the available quantity.");
        }
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const handleOrder = async () => {
    // console.log('Ordering products:', cartItems);
    try {
      // lists for updates products and the ones to delete
      const toUpdate = []
      const toDelete = []
      cartItems.forEach((item) => {
        if (item.stock_quantity - item.quantity > 0){
          toUpdate.push(updateData(item.id, {col_name: 'stock_quantity', col_val: item.stock_quantity - item.quantity}, 'USER'))
        }else {
          toDelete.push(deleteData('products', item.id))
        }
      })

      await Promise.all(toUpdate, toDelete)
      updateCart([]);
      setOrderPlaced(true);
    }catch(err) {
      console.log(err);
    }
    
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Shopping Cart</h1>
      <Row className="product-grid-cart">
        {cartItems.map((item, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <Card className={`mb-3 card ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <Card.Body>
                <Card.Title className="card-title">{item.name}</Card.Title>
                <Card.Text>Available: {item.stock_quantity}</Card.Text>
                <Card.Text>Ordered: {item.quantity}</Card.Text>
                <Card.Text>Price: ${item.price}</Card.Text>
                <Card.Text>Total Price: ${(item.price * item.quantity).toFixed(2)}</Card.Text>
                {editedItemId === item.id ? (
                  <>
                    <input
                      type="number"
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(parseInt(e.target.value, 10))}
                    />
                    <button className="button-link" onClick={() => handleSaveQuantity(item.id)}>Save</button>
                  </>
                ) : (
                  <button className="button-link" onClick={() => handleEditQuantity(item.id, item.quantity)}>Edit order</button>
                )}
                <button className="button-link" onClick={() => handleRemoveItem(item.id)}>
                  Remove from cart
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-3">
      {!orderPlaced && (
          <button className="order-button" onClick={handleOrder}>
            Order products
          </button>
      )}
        {orderPlaced && <p id="thank-you"> Thank you for your purchase!
        <br></br>Your products will be waiting for you to pick up in the store</p>}
      </div>
    </Container>
  );
};

export default ShoppingCart;
