import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import SpotList from './components/SpotList';
import SpotDetail from './components/SpotDetail';
import CreateSpotForm from './components/CreateSpotForm';
import ManageSpots from './components/ManageSpots';
import UpdateSpotForm from './components/UpdateSpotForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotList />,
      },
      {
        path: '/spots/:id',
        element: <SpotDetail />,
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />,
      },
      {
        path: '/spots/manage',
        element: <ManageSpots />,
      },
      {
        path: '/spots/current',
        element: <ManageSpots />,
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
