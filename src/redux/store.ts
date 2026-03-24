import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseAPi";
import appointmentReducer from "./reducers/appointments/appointmentSlice";
import authReducer from "./reducers/auth/authSlice";
import authModalsReducer from "./reducers/authModals/authModalsSlice";
import contactReducer from "./reducers/contact/contactSlice";
import pdfPreviewReducer from "./reducers/contact/pdfPreviewSlice";
import faqReducer from "./reducers/faq/faqSlice";
import listingCardReducer from "./reducers/listingCard/listingCardSlice";
import listingModalReducer from "./reducers/listingModal/listingModalSlice";
import profileReducer from "./reducers/profile/profileSlice";
import propertyReducer from "./reducers/property/propertySlice";
import smartViewReducer from "./reducers/property/smartViewSlice";
import rentalApplicationReducer from "./reducers/rental-applications/RentalApplicationSlice";
import rentedPropertyReducer from "./reducers/rented-property/RentedPropertySlice";
import shortTermReducer from "./reducers/shortTermModal/shortTermSlice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  authModals: authModalsReducer,
  property: propertyReducer,
  profile: profileReducer,
  listingModal: listingModalReducer,
  appointment: appointmentReducer,
  rentalApplication: rentalApplicationReducer,
  rentedProperty: rentedPropertyReducer,
  listingCard: listingCardReducer,
  faq: faqReducer,
  contact: contactReducer,
  pdfPreview: pdfPreviewReducer,
  shortTerm: shortTermReducer, // Ensure this is correctly imported and used
  smartView: smartViewReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "smartView"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'baseApi/executeQuery/fulfilled', 'baseApi/executeMutation/fulfilled'],
        ignoredPaths: ['baseApi.queries', 'baseApi.mutations'],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
