import { useState, useCallback, useRef, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const logoutTimer = useRef(null);

  const login = useCallback((userId, token, expirationDate) => {
    setToken(token);
    setUserId(userId);

    const updatedTokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(updatedTokenExpirationDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId,
        token,
        expiration: updatedTokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token) {
      const { userId, token, expiration } = storedData;
      const expirationDate = new Date(expiration);
      const currentDate = new Date();
      if (expirationDate > currentDate) {
        login(userId, token, expirationDate);
      }
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer.current = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer.current);
    }
  }, [token, tokenExpirationDate, logout]);

  return { token, userId, login, logout };
};
