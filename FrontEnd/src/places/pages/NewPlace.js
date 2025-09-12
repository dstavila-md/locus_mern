import React, { useCallback } from 'react';

import Input from '../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

import './NewPlace.css';

const NewPlace = () => {
  const titleInputHandler = useCallback((id, value, isValid) => {}, []);
  const descriptionInputHandler = useCallback((id, value, isValid) => {}, []);

  return (
    <form className='place-form'>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        onInput={titleInputHandler}
        errorText='Please enter a valid title'
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_MINLENGTH()]}
        onInput={descriptionInputHandler}
        errorText='Please enter a valid description (at least 5 characters)'
      />
    </form>
  );
};

export default NewPlace;
