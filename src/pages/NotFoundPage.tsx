import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_MANIFEST } from '../constants';

export function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <Link to={ROUTE_MANIFEST.ROOT.path}>Go back to homepage</Link>
    </>
  );
}

export default NotFoundPage;
