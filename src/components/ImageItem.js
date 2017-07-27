import React from 'react';

export const ImageItem = (props) => {
  const url = 'https://cdn.rebelle.com';
  const prefix = props.src.slice(0, 2);

  return <img
    className="item-image"
    src={`${url}/${prefix}/${props.src}`}
    alt="Item" />;
};
