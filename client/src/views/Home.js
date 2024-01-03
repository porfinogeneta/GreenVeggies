import React, { useState, useEffect } from 'react';
import useGET from '../hooks/useGET.js'
import ButtonLink from '../components/ButtonLink.js'

function Home() {

    const {data, loading, error} = useGET('http://localhost:8000/products')
    
    

    return (
        <div>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>Error: {error.message}</p>
        ) : (
            <ul>
            {data.map(item => (
                <span key={item.id}>
                    <li > {item.name}{item.description}</li>
                    <ButtonLink to="/buy">Go to Some Page!</ButtonLink>
                </span>
                
            ))}
            </ul>
        )}
        </div>
    );
    };

export default Home;
