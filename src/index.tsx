import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { Provider } from 'react-redux';
import { setupStore } from './store/store';
import 'normalize.css';


const store = setupStore();

async function enableMocking() {
  if (process.env.NODE_ENV === "development" && process.env.REACT_APP_MOCKING === 'true') {
    const { worker } = await import("./mocks/browser");

    return worker.start();
  }
  return Promise.resolve();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
});
