import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = (props) => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const url = `http://localhost:5000/api/places/user/${userId}`;
      try {
        const responseData = await sendRequest(url);
        setLoadedPlaces(responseData.places);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const onDeletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) => {
      return prevPlaces.filter((place) => place.id !== deletedPlaceId);
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={onDeletePlaceHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
