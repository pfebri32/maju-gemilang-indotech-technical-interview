import { combineReducers, createStore } from 'redux';

// Reducers
import FavoriteReducer from './reducers/FavoriteReducer';

const RootReducer = combineReducers({
  favorites: FavoriteReducer,
});
const Store = createStore(RootReducer);

export default Store;
