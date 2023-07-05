import { UserVerifyStatus } from '../../constants/enum.js';
export default class User {
    constructor(user) {
        this._id = user._id;
        this.name = user.name || '';
        this.email = user.email;
        this.password = user.password;
        this.email_verify_token = user.email_verify_token || '';
        this.verified = user.verify || UserVerifyStatus.Unverified;
    }
}
