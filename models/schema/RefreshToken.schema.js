export default class RefreshToken {
    constructor({ id, token, created_at, user_id }) {
        this.id = id;
        this.token = token;
        this.created_at = created_at || new Date();
        this.user_id = user_id;
    }
}
