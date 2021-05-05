import { Provider } from 'react-redux';
import './App.css';

// Requirements
import Store from './Store';

// Pages
import HomePage from './pages/HomePage';

function App() {
  return (
    <Provider store={Store}>
      <HomePage />
    </Provider>
  );
}

export default App;
