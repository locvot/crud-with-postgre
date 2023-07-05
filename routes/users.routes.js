import {Router} from 'express';
import { registerValidator, 
    loginValidator, 
    emailVerifyTokenValidator, 
    accessTokenValidator, 
    refreshTokenValidator, 
    forgotPasswordValidator,
    verifyForgotPasswordTokenValidator,
    resetPasswordValidator } 
    from '../middlewares/users.middlewares.js';
import { wrapRequestHandler } from '../utils/handlers.js';
import { registerController, 
    loginController, 
    verifyEmailController, 
    logoutController,
    forgotPasswordController,
    verifyForgotPasswordController,
    resetPasswordController } 
    from '../controllers/users.controllers.js';

const usersRouter = Router();

/**
 * Description: Register a new user
 * Path: /users/register
 * Method: POST
 * Body: { name : string, email : string, password : string, confirm password : string }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

/**
 * Description: Login a user
 * Path: /users/login
 * Method: POST
 * Body: { email : string, password  :string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController));

/**
 * Description: Verify email when user client click on the link in the email
 * Path: /users/verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController));

/**
 * Description: Logout a user
 * Path: /users/logout
 * Method: POST
 * Header: {Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Submit email to reset password
 * Path: /users/forgot-password
 * Method: POST
 * Body: { email:string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Veirify link in email to reset password
 * Path: /users/verify-forgot-password-token
 * Method: POST
 * Body: { forgot-password-token:string }
 */
usersRouter.post('/verify-forgot-password', verifyForgotPasswordTokenValidator, wrapRequestHandler(verifyForgotPasswordController));

/**
 * Description: Reset password
 * Path: /users/reset-password
 * Method: POST
 * Body: { forgot-password-token:string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController));



export default usersRouter;