import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google";

import './index.css'
import App from './App.tsx'
import { store } from './redux/store.ts'
// import { AppProvider } from './context/AppProvider.tsx';

export const authService = import.meta.env.VITE_AUTH_SERVICE;
export const restaurantService = import.meta.env.VITE_RESTAURANT_SERVICE;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* <AppProvider> */}
      <Provider store={store}>
        <App />
      </Provider>
      {/* </AppProvider> */}
    </GoogleOAuthProvider>

  </StrictMode>,
)
