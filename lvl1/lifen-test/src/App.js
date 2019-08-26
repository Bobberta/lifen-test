import React from 'react';
import './styles/App.css';
import Header from './components/Header';
import DropArea from './components/DropArea';
import {Provider} from 'react-redux';
import store from './configureStore';


const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <Header />
        <DropArea />
      </Provider>
    </div>
  );
}

export default App;