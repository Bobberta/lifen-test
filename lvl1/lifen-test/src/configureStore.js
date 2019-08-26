import documentsReducer from './reducers/documents';
import { createStore } from 'redux';

export default createStore(
    documentsReducer, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);