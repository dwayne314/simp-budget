import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions';

const Logout = (props) => {
    const dispatch = useDispatch();


    dispatch(logout());
    props.history.push('/');

    return null;
};


export default Logout;
