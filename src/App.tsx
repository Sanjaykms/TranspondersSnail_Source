
import { useEffect, useState } from 'react';
import './App.css'
import LoadArea from './components/LoadArea'
import MainArea from './components/MainArea';
import Auth from './components/Auth';
import AuthContextProvider from './components/authContext';

function App() {

  const [isPageLoaded, setIsPageLoaded] = useState(false);

useEffect(() => {
  const handleLoad = () => {
    setIsPageLoaded(true);
  };

  if (document.readyState === 'complete') {
    // Page already loaded
    handleLoad();
  } else {
    // Wait for full load
    window.addEventListener('load', handleLoad);
  }

  return () => {
    window.removeEventListener('load', handleLoad);
  };
}, []);

  return (
    <>
    <AuthContextProvider>
    {
      isPageLoaded ? <Auth /> : <LoadArea />
    }
    </AuthContextProvider>
    </>
  )
}

export default App
