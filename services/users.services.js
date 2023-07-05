import { v4 as uuidv4 } from 'uuid';
import { signToken } from '../utils/jwt.js';
import { TokenType } from '../constants/enum.js';
import { hashPassword } from '../utils/crypto.js';
import databaseService from './database.services.js';
import User from '../models/schema/user.schema.js';
import RefreshToken from '../models/schema/RefreshToken.schema.js';
import { USERS_MESSAGES } from '../constants/messages.js';

class UsersService {
    signEmailVerifyToken({ user_id }) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.EmailVerifyToken
            },
            privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN,
            options: {
                expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
            }
        });
    }

    signAccessToken({ user_id }) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.AccessToken
            },
            privateKey: process.env.JWT_SECRET_ACCESS_TOKEN,
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        });
    }

    signRefreshToken({ user_id }) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.RefreshToken
            },
            privateKey: process.env.JWT_SECRET_REFRESH_TOKEN,
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
            }
        });
    }

    signACccessAndRefreshToken({ user_id }) {
        return Promise.all([this.signAccessToken({ user_id }), this.signRefreshToken({ user_id })]);
    }

    signForgotPasswordToken({ user_id, verify }) {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.ForgotPasswordToken,
                verify
            },
            privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
            options: {
                expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
            }
        });
    }

    async register(payload) {
        const user_id = new uuidv4();
        const user = await databaseService.users.create(new User({
            ...payload,
            id: user_id,
            email_verify_token: null,
            password: hashPassword(payload.password),
        }));
        const email_verify_token = await this.signEmailVerifyToken({ user_id : user.id.toString() });
        await databaseService.users.update(
            { email_verify_token },
            { where: { id : user.id } }
        )
        return { email_verify_token };
    }

    async checkEmailExist(email) {
        const user = await databaseService.users.findOne({where:{email}});
        return Boolean(user);
    }

    async login({ user_id }) {
        const [access_token, refresh_token] = await this.signACccessAndRefreshToken({
            user_id
        });
        const isUserLogined = await databaseService.refreshTokens.findOne({where:{user_id}});
        if (isUserLogined) {
            await databaseService.refreshTokens.update(
                { token: refresh_token },
                { where: { user_id } }
            );
        }else{
            await databaseService.refreshTokens.create(new RefreshToken({ user_id, token : refresh_token }));
        }
        return { access_token, refresh_token };
    }

    async verifyEmail(user_id) {
        return await databaseService.users.update(
            { email_verify_token: "",
              verified: true
            },
            { 
                where: { id: user_id } 
            }
          );
    }

    async logout(refresh_token) {
        await databaseService.refreshTokens.destroy({ 
            where: { 
                token: refresh_token 
            },
            force: true
        })
        return {
          message: USERS_MESSAGES.LOGOUT_SUCCESS
        }
      }

    async forgotPassword({ user_id }) {
        const forgot_password_token = await this.signForgotPasswordToken({ user_id });
        await databaseService.users.update({ 
            forgot_password_token
         },{
                where: { id: user_id }
            }
         );
        //Send email to user
        console.log('Forgot password token: ', forgot_password_token);
        return {
            message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
            forgot_password_token
        };
    }

    async resetPassword(user_id, password) {
        databaseService.users.update({ 
            password: hashPassword(password),
            forgot_password_token: ""
         },{
                where: { id: user_id }
         }
        );
        return {
            message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
        };
    }
}
const usersService = new UsersService();
export default usersService;