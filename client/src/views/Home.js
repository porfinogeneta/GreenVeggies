// Home.js
import React from 'react';
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import useGET from '../hooks/useGET.js';
import ButtonLink from '../components/ButtonLink.js';
import '../views/styles/home_styles.css';

function Home() {
  const { data, loading, error } = useGET(); // Updated usage, removed unnecessary parameters

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Product List</h1>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
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
            <Row className="product-grid">
              {data.map((item) => (
                <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="mb-3 card">
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <Card.Text>Stock quantity: {item.stock_quantity}</Card.Text>
                      <Card.Text>Price: ${item.price * 1}</Card.Text>
                      <ButtonLink to="/shoppingcart" className="button-link" product={item}>
                        Add to cart
                      </ButtonLink>
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
