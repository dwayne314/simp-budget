import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { postVerifyEmail } from '../../redux/actions';


const VerifyEmail = (props) => {
    // Send a post request to verify the token and redirect to home
    const dispatch = useDispatch();

    const token = new URLSearchParams(props.location.search).get('token');

    useEffect(() => {
        const execVerifyEmail = async () => {
            await dispatch(postVerifyEmail(token));
            props.history.push('/accounts');
        };        
        execVerifyEmail();
    }, [props.history, dispatch, token]);

    return "";
};

export default VerifyEmail;
