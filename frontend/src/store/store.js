import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// Change this line to use a named import
import { thunk } from 'redux-thunk'; // Correct import for redux-thunk

const rootReducer = combineReducers({
    
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
