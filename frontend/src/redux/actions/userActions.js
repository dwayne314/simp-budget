import axios from 'axios';
import Cookies from 'js-cookie';
import { decodeJWT } from '../../utilities';


export const resetPassword = password => (dispatch, getState) => {

    const passwordResetToken = decodeJWT(Cookies.get('password_reset_token'));

    return axios
        .patch(`/api/users/${passwordResetToken.user_id}/changePassword`,
              password=password)
        .then(response => {

            return {success: true};
        })
        .catch(error => {
            if ([401, 403].indexOf(error.response.status) !== -1) {
                return {success: false, error: 'This password reset link has expired'};
            }
            return {success: false, error: error.response.data.error.session};
        })
}