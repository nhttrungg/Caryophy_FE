import React, {useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import useAxiosSupport from "../hooks/useAxiosSupport";
import {setMerchant} from "../redux/reducers/merchantReducer";

const ProtectedRoute = ({children, allowedRoles}) => {
    const dispatch = useDispatch();
    const role = useSelector(state => state.user.role);
    const id = useSelector(state => state.user.id);
    const axiosSupport = useAxiosSupport();
    let check = false;

    useEffect(() => {
        const fetchMerchantData = async () => {
            for (let i = 0; i < role.length; i++) {
                if (allowedRoles.includes(role[i].authority)) {
                    if (role[i].authority === 'ROLE_MERCHANT') {
                        try {
                            const response = await axiosSupport.getMerchantByUserId(id);
                            dispatch(setMerchant({
                                ...response,
                                id: response.id
                            }));
                        } catch (error) {
                            console.error("Error fetching merchant data:", error);
                        }
                    }
                    break;
                }
            }
        };

        fetchMerchantData();
    }, [role, id, allowedRoles, axiosSupport, dispatch]);
    for (let i = 0; i < role.length; i++) {
        if (allowedRoles.includes(role[i].authority)) {
            if (role[i].authority === 'ROLE_MERCHANT') {
                check = true;
                break;
            }else if(role[i].authority === 'ROLE_USER') {
                check = true;
                break;
            }else if(role[i].authority === 'ROLE_ADMIN') {
                check = true;
                break;
            }
        }
    }
    return check ? children : <Navigate to="/login"/>;
}

export default ProtectedRoute;
