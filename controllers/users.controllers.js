import usersService from "../services/users.services.js";
import databaseService from "../services/database.services.js";
import { USERS_MESSAGES } from "../constants/messages.js";

export const registerController = async (req, res, next) => {
    const result = await usersService.register(req.body);
    return res.json({
        message: USERS_MESSAGES.REGISTER_SUCCESS,
        result
    });
};

export const loginController = async (req, res) => {
    const user = req.user;
    const user_id = user.id;
    const result = await usersService.login({ user_id: user_id.toString() });
    return res.json({
        message: USERS_MESSAGES.LOGIN_SUCCESS,
        result
    });
};

export const verifyEmailController = async (req, res, next) => {
    const { user_id } = req.decoded_email_verify_token;
    const user = await databaseService.users.findOne({where:{ id : user_id }});
    // Not found -> return status NOT_FOUND with message: User not found
    if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: USERS_MESSAGES.USER_NOT_FOUND
        });
    }
    // Verified -> return status OK with message: Already verified
    if (user.email_verify_token === '') {
        return res.json({
            message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        });
    }
    const result = await usersService.verifyEmail(user_id);
    return res.json({
        message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
        result
    });
};

export const logoutController = async (req, res) => {
    const { refresh_token } = req.body;
    const result = await usersService.logout(refresh_token);
    return res.json(result);
};

export const forgotPasswordController = async (req, res, next) => {
    const { id } = req.user;
    const result = await usersService.forgotPassword({ user_id: id.toString() });
    return res.json(result);
};

export const verifyForgotPasswordController = async (req, res, next) => {
    return res.json({
        message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    });
};

export const resetPasswordController = async (req, res, next) => {
    const { user_id } = req.decoded_forgot_password_token;
    const { password } = req.body;
    const result = await usersService.resetPassword(user_id, password);
    return res.json(result);
};