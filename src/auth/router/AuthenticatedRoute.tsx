import { useLocation } from 'react-router-dom';
import { ROUTE_MANIFEST } from '../../constants';
import { useAuth } from '../hooks/useAuth';

export interface AuthenticatedRouteOptions {
  children: JSX.Element;
  redirectTo?: string;
  allowFrom?: string | string[];
}

export function AuthenticatedRoute({
  children,
  redirectTo = ROUTE_MANIFEST.LOG_IN.path,
  allowFrom,
}: AuthenticatedRouteOptions) {
  const location = useLocation() as unknown as {
    state?: {
      from: Location;
    };
  };

  const allowedPrevious = Array.isArray(allowFrom) ? allowFrom : [allowFrom];

  const currentPathAllowed = allowFrom
    ? allowedPrevious.some((path) => {
        return path === location.state?.from;
      })
    : false;

  useAuth(
    currentPathAllowed
      ? undefined
      : {
          redirect: {
            type: 'unauthenticated',
            to: redirectTo,
          },
        }
  );

  return children;
}

export default AuthenticatedRoute;
