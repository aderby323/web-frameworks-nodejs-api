"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userArray = exports.User = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var email_validator_1 = __importDefault(require("email-validator"));
var User = /** @class */ (function () {
    function User(userID, firstName, lastName, emailAddress, password) {
        this.userId = userID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = this.SetHashedPassword(password);
    }
    User.prototype.ValidatePassword = function (password) {
        return bcrypt_1.default.compareSync(password, this.password);
    };
    User.prototype.ValidateEmailAddress = function (email) {
        return email_validator_1.default.validate(email);
    };
    User.prototype.SetHashedPassword = function (password) {
        return bcrypt_1.default.hashSync(password, 10);
    };
    User.prototype.toJSON = function (user) {
        user = new User(this.userId, this.firstName, this.lastName, this.emailAddress, '.');
        delete user.password;
        return user;
    };
    return User;
}());
exports.User = User;
var userArray = [];
exports.userArray = userArray;
//# sourceMappingURL=user.js.map