import React, { useEffect, useState } from 'react';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UsersList from '../components/UsersList';

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setLoadedUsers(data.users);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    sendRequest();

    // fetch('http://localhost:5000/api/users')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={errorHandler} />}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
