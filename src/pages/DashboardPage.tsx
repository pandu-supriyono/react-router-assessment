import React from 'react';
import { useAuth } from '../auth/hooks/useAuth';

export function DashboardPage() {
  const user = useAuth();
  return (
    <>
      <h1>Dashboard</h1>
      {user ? (
        <p>Welcome, {user.username}</p>
      ) : (
        <p>
          You are not logged in, but can access this page because you probably
          came from /home
        </p>
      )}
    </>
  );
}

export default DashboardPage;
