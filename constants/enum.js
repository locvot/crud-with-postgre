export var UserVerifyStatus;
(function (UserVerifyStatus) {
    UserVerifyStatus[UserVerifyStatus["Unverified"] = 0] = "Unverified";
    UserVerifyStatus[UserVerifyStatus["Verified"] = 1] = "Verified";
    UserVerifyStatus[UserVerifyStatus["Banned"] = 2] = "Banned"; 
})(UserVerifyStatus || (UserVerifyStatus = {}));
export var TokenType;
(function (TokenType) {
    TokenType[TokenType["AccessToken"] = 0] = "AccessToken";
    TokenType[TokenType["RefreshToken"] = 1] = "RefreshToken";
    TokenType[TokenType["ForgotPasswordToken"] = 2] = "ForgotPasswordToken";
    TokenType[TokenType["EmailVerifyToken"] = 3] = "EmailVerifyToken";
})(TokenType || (TokenType = {}));