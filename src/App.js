import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './services/ProtectedRoute';
import {createStoreHook, Provider, useStore} from "react-redux";
import {StrictMode} from "react";
import ClientPage from "./pages/clientPage/ClientPage";
import CreateMerchantForm from "./components/CreateMerchantForm";
import {PersistGate} from "redux-persist/integration/react";
import {combineReducers, createStore} from "redux";
import userReducer from "./redux/reducers/userReducer";
import merchantReducer from "./redux/reducers/merchantReducer";
import {persistor, store} from "./redux/store";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import PaymentPage from "./pages/PaymentPage";
import ShopDetail from "./components/ShopDetail";
import UserProfile from "./components/UserProfile";
import DashboardAdminHome from "./components/admin/DashboardAdminHome";
import Wishlist from "./pages/Wishlist";


function App() {
  return (

          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                  <Routes>
                      <Route path="/" element={<Navigate to="/home" />} />
                      <Route path="/product/:id" element={<ProductDetail/>} />
                      <Route path='/home' element={<HomePage />} />
                      <Route path='/login' element={<Login />} />
                      <Route path='/register' element={<Register />} />
                      <Route path='/merchant/register' element={<CreateMerchantForm />} />
                      <Route path='/cart' element={<Cart />} />
                      <Route path='/shop/:id' element={<ShopDetail/>}></Route>
                      <Route path='/client/profile' element={<UserProfile/>}></Route>
                      {/* client */}
                      <Route
                          path='/client/*'
                          element={
                              <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                                 <ClientPage />
                               </ProtectedRoute>
                          }
                      />
                      <Route path='/payment' element={<PaymentPage/>}></Route>
                      {/* admin */}
                      <Route
                          path='/dashboard/*'
                          element={
                              <ProtectedRoute allowedRoles={[ 'ROLE_MERCHANT']}>
                                  <Dashboard />
                               </ProtectedRoute>
                          }
                      />
                      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                          <DashboardAdminHome />
                      </ProtectedRoute>}/>
                  </Routes>
              </PersistGate>
          </Provider>

  );
}

export default App;
