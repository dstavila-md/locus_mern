import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Denis',
      image:
        'https://uploads.builtforbackroads.com/uploads/2022/02/2022.02.15-HONDA-CIVIC-2017_2-1536x1024.jpg',
      placeCount: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
