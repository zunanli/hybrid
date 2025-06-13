import { useEffect } from 'react';
import { HybridSDK } from '@hybrid/web-sdk';

function App() {
  useEffect(() => {
    const initSDK = async () => {
      const sdk = HybridSDK.getInstance({
        apiUrl: 'http://localhost:3008',
        platform: 'IOS',
        version: '1.0.0',
      });

      try {
        const packageInfo = await sdk.init();
        if (packageInfo) {
          console.log('Package info:', packageInfo);
        } else {
          console.log('No package info available');
        }
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
      }
    };

    void initSDK();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h1>Hybrid SDK Demo</h1>
        <p>Check the console for SDK initialization details</p>
      </div>
    </div>
  );
}

export default App;
