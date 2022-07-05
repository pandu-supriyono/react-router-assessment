import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { ROUTE_MANIFEST } from './constants';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { LogInPage } from './pages/LogInPage';
import { AuthProvider } from './auth/context/AuthContext';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthenticatedRoute } from './auth/router/AuthenticatedRoute';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTE_MANIFEST.ROOT.path} element={<App />}>
            <Route path={ROUTE_MANIFEST.ROOT.path} element={<HomePage />} />
            <Route path={ROUTE_MANIFEST.HOME.path} element={<HomePage />} />
            <Route
              path={ROUTE_MANIFEST.DASHBOARD.path}
              element={
                <AuthenticatedRoute allowFrom={ROUTE_MANIFEST.HOME.path}>
                  <DashboardPage />
                </AuthenticatedRoute>
              }
            />
            <Route path={ROUTE_MANIFEST.LOG_IN.path} element={<LogInPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
