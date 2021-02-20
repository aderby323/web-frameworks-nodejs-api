import express from 'express';
import { User, userArray } from '../models/user';
import EmailValidator from 'email-validator';
import { Error } from '../utility/error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Auth } from '../utility/auth';
import { Token } from '../utility/token';

const userRouter = express.Router();

userRouter.get("/Users", (req, res, next) => {
    if (Auth.Verify(req.headers)) {
        res.status(200).send(userArray);
        return;
    } else { 
        res.status(401).send(new Error('Unauthorized Access','401')) 
    }
});

userRouter.get("/Users/:UserId", (req, res, next) => {
    if (Auth.Verify(req.headers)) {
        for (let x of userArray) {
            if (req.params.UserId == x.userId) {
                res.status(200).send(x);
                return;
            }
        }
        res.status(404).send(new Error('User Not Found', '404'));
    } else {
        res.status(401).send(new Error('Unauthorized Access','401')) 
    }
});

userRouter.post("/Users", (req, res, next) => {
    let userId: string = req.body.userId;
    if (userId == null || userId == '' || userId.split(' ').join('') == '') {
        res.status(406).send(new Error('Bad data in the entity: UserId null or blank','406'));
        return;
    }
    if (!EmailValidator.validate(req.body.emailAddress)) {
        res.status(406).send(new Error('Bad data in the entity: Incorrectly formatted e-mail address','406'));
        return;
    }
    let newUser: User = new User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
    for (let x of userArray) {
        if (newUser.userId == x.userId) {
            res.status(409).send(new Error('Duplicate UserID','409'));
            return;
        }
    }
    userArray.push(newUser);
    console.log(newUser);
    res.status(201).send(newUser);
});

userRouter.patch("/Users/:UserId", (req, res, next) => {
    if (Auth.Verify(req.headers)) {
        if (!userArray.find(y => y.userId == req.params.UserId)) {
            res.send(new Error('User Not Found', '404'));
        }
        let newUser = new User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
        if (!EmailValidator.validate(newUser.emailAddress)) { res.status(406).send(new Error('Bad data in the entity: Incorrectly formatted e-mail address','406')); }
        for (var i = 0; i < userArray.length; i++) {
            var x = userArray[i];
            if (req.body.userId == x.userId) {
                x.firstName = newUser.firstName;
                x.lastName = newUser.lastName;
                x.emailAddress = newUser.emailAddress;
                x.SetHashedPassword(newUser.password!);
                res.status(200).send(newUser);
                return;
            }
        }
        res.status(404).send(new Error('User Not Found', '404'));
    } else { 
        res.status(401).send(new Error('Unauthorized Access','401')) 
    }
});

userRouter.delete("/Users/:UserId", (req, res, next) => {
    if (Auth.Verify(req.headers)) {
        for (var i = 0; i < userArray.length; i++) {
            if (userArray[i].userId == req.params.UserId) {
                userArray.splice(i, 1);
                res.status(204).send(`User ${req.params.UserId} deleted.`);
                return;
            }
        }
        res.status(404).send(new Error('User Not Found', '404'));
    } else {
        res.status(401).send(new Error('Unauthorized Access','401'))
    }
});

userRouter.get("/Users/:UserId/:UserPassword", (req, res, next) => {
    for (var x of userArray) {
        if (req.params.UserId == x.userId) {
            if (x.ValidatePassword(req.params.UserPassword)) {
                res.status(200).send(new Token(Auth.CreateToken(x)));
                return;
            }
        }
    }
    res.status(404).send(new Error('Username or Password incorrect', '401'));    
});

export { userRouter };