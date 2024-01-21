import React from 'react';
import { Link } from 'react-router-dom';

const ButtonLink = ({ to, className, style, children }) => {
  return (
    <Link to={to} className={className} style={style}>
      {children}
    </Link>
  );
};

export default ButtonLink;
