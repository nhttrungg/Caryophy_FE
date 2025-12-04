import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, Route, Routes, useNavigate} from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/reducers/userReducer";
import {Swiper, SwiperSlide} from "swiper/react";
import useAxiosSupport from "../../hooks/useAxiosSupport";
import {Navigation, Pagination} from "swiper/modules";
import ClientMainContent from "./ClientMainContent";
import DashboardLayout from "../../components/DashboardLayout";
import DashboardHome from "../../components/DashboardHome";
import ProductsDashBoard from "../ProductsDashBoard";
import OrderDashboard from "../OrderDashboard";
import ProductDetailAdmin from "../../components/ProductDetailAdmin";
import OrderDetail from "../OrderDetail";
import UserOrderList from "../../components/UserProfile";
import ClientPageLayout from "./ClientPageLayout";
import UserProfile from "../../components/UserProfile";
import ProductDetail from "../../components/ProductDetail";
import Cart from "../../components/Cart";
import CompletePayment from "../../components/CompletePayment";
import CompletePaymentForm from "../../components/CompletePaymentForm";
import PaymentPage from "../PaymentPage";
import ProductListingPage from "./ProductListingPage";
import Wishlist from "../Wishlist";

export default function ClientPage() {

  return (
     <Routes>
         <Route element={<ClientPageLayout />}>
             <Route index element={<Navigate to="home" replace />} />
             <Route path="/home" element={<ClientMainContent />} />
             <Route path="/details/:id" element={<ProductDetail />} />
             <Route path="/cart" element={<Cart/>} />
             <Route path="/payment" element={<PaymentPage />} />
             <Route path='/wishlist' element={<Wishlist />}></Route>
             <Route path="/user/profile" element={
                     <div className="pt-16">
                         <UserProfile />
                     </div>
             }/>
             <Route path='/products' element={
                 <div className="pt-16">
                     <ProductListingPage />
                 </div>}>
             </Route>
         </Route>
     </Routes>
  );
}
