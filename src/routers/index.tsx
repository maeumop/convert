import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/views/login';
import { Forms } from '@/views/forms';
import { FormValidate } from '@/views/formValidate';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/forms',
    element: <Forms />,
  },
  {
    path: '/validate',
    element: <FormValidate />,
  },
]);

export default router;
