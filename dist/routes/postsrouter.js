"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
var express_1 = __importDefault(require("express"));
var userpost_1 = require("../models/userpost");
var error_1 = require("../utility/error");
var auth_1 = require("../utility/auth");
var postcategory_1 = require("../models/postcategory");
var postsRouter = express_1.default.Router();
exports.postsRouter = postsRouter;
var postsCreated = 0;
postsRouter.get("/Posts", function (req, res, next) {
    res.status(200).send(userpost_1.postsArray);
});
postsRouter.post("/Posts", function (req, res, next) {
    var _a, _b;
    var postCategory = new postcategory_1.PostCategory();
    if (auth_1.Auth.Verify(req.headers)) {
        if (req.body.title != null && req.body.content != null && Object.keys(req.body.title).length != 0 && Object.keys(req.body.content).length != 0) {
            console.log(auth_1.Auth.Parse((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]));
            var newPost = new userpost_1.UserPost(++postsCreated, new Date(), req.body.title, req.body.content, auth_1.Auth.Parse((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]), req.body.headerImage, new Date());
            userpost_1.postsArray.push(newPost);
            postCategory.postId = postsCreated;
            postcategory_1.postCategories.push(postCategory);
            res.status(201).send(newPost);
        }
        else {
            res.status(406).send(new error_1.Error("Bad data in the entity. Missing title or content", "406"));
        }
    }
    else {
        res.status(401).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
postsRouter.get("/Posts/:PostId", function (req, res, next) {
    var postId = parseInt(req.params.PostId);
    var post = userpost_1.postsArray.find(function (x) { return x.postId == postId; });
    if (post) {
        res.status(200).send(post);
    }
    else {
        res.status(404).send(new error_1.Error("Post not found", "404"));
    }
});
postsRouter.patch("/Posts/:PostId", function (req, res, next) {
    var postId = parseInt(req.params.PostId);
    if (auth_1.Auth.Verify(req.headers)) {
        for (var _i = 0, postsArray_1 = userpost_1.postsArray; _i < postsArray_1.length; _i++) {
            var post = postsArray_1[_i];
            if (post.postId == postId) {
                post.title = req.body.title;
                post.content = req.body.content;
                post.headerImage = req.body.headerImage;
                res.status(200).send(post);
                return;
            }
        }
        res.status(404).send(new error_1.Error("Post not found", "404"));
    }
    else {
        res.status(401).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
postsRouter.delete("/Posts/:PostId", function (req, res, next) {
    var postId = parseInt(req.params.PostId);
    if (auth_1.Auth.Verify(req.headers)) {
        for (var i = 0; i < userpost_1.postsArray.length; i++) {
            if (userpost_1.postsArray[i].postId == postId) {
                userpost_1.postsArray.splice(i, 1);
                postcategory_1.postCategories.splice(i, 1);
                res.status(204).send("Post deleted.");
                return;
            }
        }
        res.status(404).send(new error_1.Error("Post not found", "404"));
    }
    else {
        res.status(401).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
postsRouter.get("/Posts/User/UserId", function (req, res, next) {
    var userPosts = userpost_1.postsArray.filter(function (x) { return x.userId == req.params.UserId; });
    if (userPosts.length > 0) {
        res.status(200).send(userPosts);
    }
    else {
        res.status(401).send(new error_1.Error("User or Post not found", "404"));
    }
});
//# sourceMappingURL=postsrouter.js.map