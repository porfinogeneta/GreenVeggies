import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add scroll event listener to determine when to show the footer
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

      setIsVisible(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer style={{ ...footerStyle, opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? '0' : '100%'})`, transition: 'opacity 0.5s, transform 0.5s' }}>
      <Container>
        <p>GreenVeggies &copy; {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#113c2c',
  color: '#fff',
  textAlign: 'center',
  padding: '10px',
  position: 'fixed',
  bottom: '0',
  width: '100%',
};

export default Footer;
