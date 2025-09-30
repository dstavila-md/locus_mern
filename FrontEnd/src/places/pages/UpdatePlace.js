import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import './UpdatePlace.css';
import './PlaceForm.css';

import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UpdatePlace = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, sendLoadedPlace] = useState(null);
  const placeId = useParams().placeId;
  const { userId, token } = useContext(AuthContext);
  const history = useHistory();
  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: '' },
    },
    true
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );

        if (responseData && responseData.place) {
          setFormData(
            {
              title: { value: responseData.place.title, isValid: true },
              description: {
                value: responseData.place.description,
                isValid: true,
              },
            },
            true
          );
          sendLoadedPlace(responseData.place);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    const url = `http://localhost:5000/api/places/${placeId}`;
    const method = 'PATCH';
    const body = JSON.stringify({
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
    });
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    };
    try {
      await sendRequest(url, method, body, headers);
      history.push(`/${userId}/places`);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className='center'>
        <Card>
          <h2> Could not find a place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title'
            onInput={inputChangeHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (min 5 characters)'
            onInput={inputChangeHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
