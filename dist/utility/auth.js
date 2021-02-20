"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Auth = /** @class */ (function () {
    function Auth() {
    }
    Auth.Verify = function (headers) {
        if (headers.authorization != null && headers.authorization.split(' ')[0] == 'Bearer') {
            try {
                var token = headers.authorization.split(' ')[1];
                var currentUser = jsonwebtoken_1.default.verify(token, Auth.sequenceKey);
                if (currentUser) {
                    return true;
                }
            }
            catch (exception) {
                console.log(exception);
            }
        }
        return false;
    };
    Auth.Parse = function (token) {
        if (token != null) {
            var userdata = jsonwebtoken_1.default.decode(token, { json: true });
            token = userdata["userData"].userId;
            return token;
        }
        else {
            return false;
        }
    };
    Auth.CreateToken = function (user) {
        return jsonwebtoken_1.default.sign({ userData: user.toJSON(user) }, Auth.sequenceKey, { expiresIn: '1h' });
    };
    Auth.sequenceKey = 'B45E162EB1FBAB659F7918D36CAB566E932E76FED81BD79A6A811FA28E0C6F5C';
    return Auth;
}());
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map