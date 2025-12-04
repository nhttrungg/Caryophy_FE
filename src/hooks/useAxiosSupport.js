import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import AxiosSupport from '../services/axiosSupport';

const useAxiosSupport = () => {
    const token = useSelector(state => state.user.authenticate || "" );
    
    const axiosSupport = useMemo(() => {
        return new AxiosSupport('http://localhost:8080', token);
    }, [token]);

    return axiosSupport;
};

export default useAxiosSupport;