import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

import { useForm } from '../../shared/hooks/form-hook';

import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const { userId } = useContext(AuthContext);
  const [formState, inputChangeHandler] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
      address: { value: '', isValid: false },
    },
    false
  );

  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    const url = 'http://localhost:5000/api/places';
    const method = 'POST';
    const body = JSON.stringify({
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      address: formState.inputs.address.value,
      creator: userId,
    });
    const headers = { 'Content-Type': 'application/json' };

    try {
      await sendRequest(url, method, body, headers);
      //Redirect user to another page
      history.push('/');
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className='place-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputChangeHandler}
          errorText='Please enter a valid title'
        />
        <Input
          id='description'
          element='textarea'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputChangeHandler}
          errorText='Please enter a valid description (at least 5 characters)'
        />
        <Input
          id='address'
          element='input'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputChangeHandler}
          errorText='Please enter a valid address'
        />
        <Button type='Submit' disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
