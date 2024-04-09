import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/views/login';
import { Forms } from '@/views/forms';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/forms',
    element: <Forms />,
  }
]);

export default router;