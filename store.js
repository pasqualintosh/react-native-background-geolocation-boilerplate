import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import backgroundTrackingReducer from "./src/domains/background_tracking/Reducers";

import thunk from "redux-thunk";
import { Platform, AsyncStorage } from "react-native";

import { persistStore, persistCombineReducers } from "redux-persist";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

// con stateReconciler: hardSet i dati vengono completamente sovrascriti da quelli salvati prima e non avviene il merge
const persistConfig = {
  version: 1,
  key: "root",
  storage: AsyncStorage,
  whitelist: ["tracking"],
  stateReconciler: hardSet
};

const persistedReducer = persistCombineReducers(persistConfig, {
  tracking: backgroundTrackingReducer
});

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  compose(applyMiddleware(thunk))
);
const persistor = persistStore(store, null, () => {
  store.getState();
});

export { store, persistor };
