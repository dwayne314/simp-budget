import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions';

const Logout = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout());
        props.history.push('/');
    });
    
    return null;
};


export default Logout;
