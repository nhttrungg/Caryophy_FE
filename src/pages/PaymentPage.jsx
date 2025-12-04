import ClientHeader from "./clientPage/ClientHeader";
import HomeHeader from "../components/HomeHeader";
import React from "react";
import {useSelector} from "react-redux";
import HomeFooter from "../components/HomeFooter";
import CompletePaymentForm from "../components/CompletePaymentForm";

const PaymentPage = ()=>{
    const {id: userId} = useSelector(state=>state.user);
    const {items,total} = useSelector(state=>state.cart);
     return <>
         {!userId && <HomeHeader/>}
         <div className="p-6">
             <CompletePaymentForm
                 selectedVariants={items}
                 total={total}
                 onSubmit={()=>{

                 }}
             />
         </div>
         <div className="hidden sm:block">
             <HomeFooter/>
         </div>
     </>

}

export default PaymentPage;