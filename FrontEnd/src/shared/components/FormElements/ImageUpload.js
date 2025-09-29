import React, { useRef } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const fileInputRef = useRef(null);
  const pickedHandler = (event) => {
    console.log(event.target);
  };

  const pickImageHandler = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className='form-control'>
      <input
        ref={fileInputRef}
        type='file'
        id={props.id}
        style={{ display: 'none' }}
        accept='.jpg, .png, .jpeg'
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          <img src='' alt='Preview' />
        </div>
        <Button type='button' onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
