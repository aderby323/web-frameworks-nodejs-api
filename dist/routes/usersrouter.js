"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = __importDefault(require("express"));
var user_1 = require("../models/user");
var email_validator_1 = __importDefault(require("email-validator"));
var error_1 = require("../utility/error");
var auth_1 = require("../utility/auth");
var token_1 = require("../utility/token");
var userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get("/Users", function (req, res, next) {
    if (auth_1.Auth.Verify(req.headers)) {
        res.status(200).send(user_1.userArray);
        return;
    }
    else {
        res.status(401).send(new error_1.Error('Unauthorized Access', '401'));
    }
});
userRouter.get("/Users/:UserId", function (req, res, next) {
    if (auth_1.Auth.Verify(req.headers)) {
        for (var _i = 0, userArray_1 = user_1.userArray; _i < userArray_1.length; _i++) {
            var x = userArray_1[_i];
            if (req.params.UserId == x.userId) {
                res.status(200).send(x);
                return;
            }
        }
        res.status(404).send(new error_1.Error('User Not Found', '404'));
    }
    else {
        res.status(401).send(new error_1.Error('Unauthorized Access', '401'));
    }
});
userRouter.post("/Users", function (req, res, next) {
    var userId = req.body.userId;
    if (userId == null || userId == '' || userId.split(' ').join('') == '') {
        res.status(406).send(new error_1.Error('Bad data in the entity: UserId null or blank', '406'));
        return;
    }
    if (!email_validator_1.default.validate(req.body.emailAddress)) {
        res.status(406).send(new error_1.Error('Bad data in the entity: Incorrectly formatted e-mail address', '406'));
        return;
    }
    var newUser = new user_1.User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
    for (var _i = 0, userArray_2 = user_1.userArray; _i < userArray_2.length; _i++) {
        var x = userArray_2[_i];
        if (newUser.userId == x.userId) {
            res.status(409).send(new error_1.Error('Duplicate UserID', '409'));
            return;
        }
    }
    user_1.userArray.push(newUser);
    console.log(newUser);
    res.status(201).send(newUser);
});
userRouter.patch("/Users/:UserId", function (req, res, next) {
    if (auth_1.Auth.Verify(req.headers)) {
        if (!user_1.userArray.find(function (y) { return y.userId == req.params.UserId; })) {
            res.send(new error_1.Error('User Not Found', '404'));
        }
        var newUser = new user_1.User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
        if (!email_validator_1.default.validate(newUser.emailAddress)) {
            res.status(406).send(new error_1.Error('Bad data in the entity: Incorrectly formatted e-mail address', '406'));
        }
        for (var i = 0; i < user_1.userArray.length; i++) {
            var x = user_1.userArray[i];
            if (req.body.userId == x.userId) {
                x.firstName = newUser.firstName;
                x.lastName = newUser.lastName;
                x.emailAddress = newUser.emailAddress;
                x.SetHashedPassword(newUser.password);
                res.status(200).send(newUser);
                return;
            }
        }
        res.status(404).send(new error_1.Error('User Not Found', '404'));
    }
    else {
        res.status(401).send(new error_1.Error('Unauthorized Access', '401'));
    }
});
userRouter.delete("/Users/:UserId", function (req, res, next) {
    if (auth_1.Auth.Verify(req.headers)) {
        for (var i = 0; i < user_1.userArray.length; i++) {
            if (user_1.userArray[i].userId == req.params.UserId) {
                user_1.userArray.splice(i, 1);
                res.status(204).send("User " + req.params.UserId + " deleted.");
                return;
            }
        }
        res.status(404).send(new error_1.Error('User Not Found', '404'));
    }
    else {
        res.status(401).send(new error_1.Error('Unauthorized Access', '401'));
    }
});
userRouter.get("/Users/:UserId/:UserPassword", function (req, res, next) {
    for (var _i = 0, userArray_3 = user_1.userArray; _i < userArray_3.length; _i++) {
        var x = userArray_3[_i];
        if (req.params.UserId == x.userId) {
            if (x.ValidatePassword(req.params.UserPassword)) {
                res.status(200).send(new token_1.Token(auth_1.Auth.CreateToken(x)));
                return;
            }
        }
    }
    res.status(404).send(new error_1.Error('Username or Password incorrect', '401'));
});
//# sourceMappingURL=usersrouter.js.map