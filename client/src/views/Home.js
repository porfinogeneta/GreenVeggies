import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Button } from 'react-bootstrap';
import useGET from '../hooks/useGET.js';
import ButtonLink from '../components/ButtonLink.js';
import '../views/styles/home_styles.css';

function Home() {
  const { data, loading, error } = useGET();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Initially set to 'all'
  const [filteredData, setFilteredData] = useState(data);
  const [showInstructions, setShowInstructions] = useState(false);


  useEffect(() => {
    // Set filteredData to the full data when the component mounts or when the data changes
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    // Apply category filter when selectedCategory changes
    if (selectedCategory === 'all') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => item.category === selectedCategory);
      setFilteredData(filtered);
    }
  }, [selectedCategory, data]);

  function handleSearchChange(event) {
    const query = event.target.value.toLowerCase();

    // Filter the data based on the search query and the selected category
    const filtered = data.filter(
      (item) =>
        (selectedCategory === 'all' || item.category === selectedCategory) &&
        (item.name.toLowerCase().includes(query) || item.price.includes(query))
    );
    
    setSearchQuery(query);
    setFilteredData(filtered);
  }

  function handleFilterByCategory(category) {
    setSearchQuery('');
    setSelectedCategory(category);
  }

  function toggleInstructions() {
    setShowInstructions(!showInstructions);
  }

  return (
    <Container className="mt-5">
      {/* <h1 className="text-center mb-4">Product List</h1>
      <button id="instructionButton" onClick={toggleInstructions}>Click to Show Instructions</button>
      <div id="instructionsContainer" className={`instructionsContainer ${showInstructions ? 'show' : 'hide'}`}>
          <h3>Click the 𝗔𝗱𝗱 𝘁𝗼 𝗰𝗮𝗿𝘁 button to add a product to your cart. You will be redirected to your cart then.<br />
            Once you're there you can adjust the amount of product you wish to buy and finalise your order.<br /><br />
            To search for a specific product, input the 𝗻𝗮𝗺𝗲 of the product you're looking for in the search bar below.<br />
            Alternatively, input the 𝗽𝗿𝗶𝗰𝗲 (as a number) you're interested in - it will show all products of that cost.
          </h3>
        </div> */}
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <div className='search-filter'>
            <input
            className="search-bar"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="filter-buttons">
            <Button
              className={`filter-button ${
                selectedCategory === 'all' ? 'active' : ''
              }`}
              variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
              onClick={() => handleFilterByCategory('all')}
            >
              All
            </Button>
            <Button
              className={`filter-button ${
                selectedCategory === 'Vegetables' ? 'active' : ''
              }`}
              variant={selectedCategory === 'Vegetables' ? 'primary' : 'secondary'}
              onClick={() => handleFilterByCategory('Vegetables')}
            >
              Vegetables
            </Button>
            <Button
              className={`filter-button ${
                selectedCategory === 'Fruits' ? 'active' : ''
              }`}
              variant={selectedCategory === 'Fruits' ? 'primary' : 'secondary'}
              onClick={() => handleFilterByCategory('Fruits')}
            >
              Fruits
            </Button>
            </div>
          </div>

          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              Error: {error.message}
            </Alert>
          ) : (
            <Row className="product-grid-home">
              {filteredData.map((item) => (
                <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="mb-3 card">
                    <Card.Body>
                    {item.image !== null ? (
                      <img src={`https://storage.googleapis.com/greenveggies_images/${item.image}`} alt="Notification Image" 
                      style={{ width: '100%', height: '100%'}}
                      />
                    ) : (
                      <></>
                    )}
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>Category: {item.category}</Card.Text>
                      <Card.Text>Stock quantity: {item.stock_quantity}</Card.Text>
                      <Card.Text>Price: ${(item.price * 1).toFixed(2)}</Card.Text>
                      <ButtonLink to="/shoppingcart" className="button-link-home" product={item}>
                        Add to cart
                      </ButtonLink>
                      <Card.Text className="product-describtion">{item.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
