import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';
import '../views/styles/shoppingcart_styles.css';
import useAuthorizeUPDATE from '../hooks/useAuthorizeUPDATE';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [editedItemId, setEditedItemId] = React.useState(null);
  const [editedQuantity, setEditedQuantity] = React.useState(0);

  // hooks
  const {updateData} = useAuthorizeUPDATE();

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
    console.log('Ordering products:', cartItems);
    try {
      const quantity_updates = cartItems.map(item => updateData(item.id, {col_name: 'stock_quantity', col_val: item.stock_quantity - item.quantity}, 'USER'))
      await Promise.all(quantity_updates)
      updateCart([]);
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
                <Card.Text>𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲: {item.stock_quantity}</Card.Text>
                <Card.Text>𝗢𝗿𝗱𝗲𝗿𝗲𝗱: {item.quantity}</Card.Text>
                <Card.Text>Price: ${item.price}</Card.Text>
                <Card.Text>𝗧𝗼𝘁𝗮𝗹 𝗣𝗿𝗶𝗰𝗲: ${(item.price * item.quantity).toFixed(2)}</Card.Text>
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
        <button className="order-button" onClick={handleOrder}>
          Order products
        </button>
      </div>
    </Container>
  );
};

export default ShoppingCart;
