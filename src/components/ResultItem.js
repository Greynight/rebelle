import React from 'react';
import { ImageItem } from './ImageItem';

export const ResultItem = (props) => {
  return (
    <div>
      <h3>{props.title}</h3>
      <h3>{props.brand}</h3>
      {props.images.map(image => <ImageItem key={image} src={image} />)}
    </div>
  );
};
