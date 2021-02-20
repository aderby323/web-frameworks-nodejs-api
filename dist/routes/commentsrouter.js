"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
var express_1 = __importDefault(require("express"));
var error_1 = require("../utility/error");
var auth_1 = require("../utility/auth");
var postcomment_1 = require("../models/postcomment");
var userpost_1 = require("../models/userpost");
var commentsRouter = express_1.default.Router();
exports.commentsRouter = commentsRouter;
var auth = new auth_1.Auth();
var commentsCreated = 0;
commentsRouter.get("/Comments/:postId", function (req, res, next) {
    var comments;
    var postId = req.params.postId;
    if (!(userpost_1.postsArray.find(function (x) { return x.postId == parseInt(postId); }))) {
        res.status(404).send(new error_1.Error("Post not found", "404"));
        return;
    }
    comments = postcomment_1.postCommentsArray.filter(function (x) { return x.postId == postId; });
    if (comments.length > 0) {
        res.status(200).send(comments);
    }
    else {
        res.status(200).send({ comments: [] });
    }
});
commentsRouter.post("/Comments/:postId", function (req, res, next) {
    var _a;
    var postId = req.params.postId;
    var comment = req.body.comment;
    if (auth_1.Auth.Verify(req.headers)) {
        var userId = auth_1.Auth.Parse((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (comment == null || comment.split(' ').join('') == '') {
            res.status(406).send(new error_1.Error('Bad data in the entity: Comment null or blank', '406'));
            return;
        }
        for (var x = 0; x < userpost_1.postsArray.length; x++) {
            if (userpost_1.postsArray[x].postId == parseInt(postId)) {
                var newComment = new postcomment_1.PostComment(++commentsCreated, comment, userId, new Date());
                newComment.postId = postId;
                postcomment_1.postCommentsArray.push(newComment);
                res.status(200).send(newComment);
            }
        }
    }
    else {
        res.status(401).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
commentsRouter.patch("/Comments/:postId/:commentId", function (req, res, next) {
    var postId = req.params.postId;
    var commentId = parseInt(req.params.commentId);
    var comment = req.body.comment;
    if (auth_1.Auth.Verify(req.headers)) {
        for (var x = 0; x < postcomment_1.postCommentsArray.length; x++) {
            if (postcomment_1.postCommentsArray[x].commentId == commentId && postcomment_1.postCommentsArray[x].postId === postId) {
                postcomment_1.postCommentsArray[x].comment = comment;
                res.status(201).send(postcomment_1.postCommentsArray[x]);
                return;
            }
        }
        res.status(404).send(new error_1.Error("Post or Comment not found", "404"));
    }
    else {
        res.status(404).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
commentsRouter.delete("/Comments/:postId/:commentId", function (req, res, next) {
    var postId = req.params.postId;
    var commentId = parseInt(req.params.commentId);
    if (auth_1.Auth.Verify(req.headers)) {
        for (var x = 0; x < postcomment_1.postCommentsArray.length; x++) {
            if (postcomment_1.postCommentsArray[x].commentId == commentId && postcomment_1.postCommentsArray[x].postId === postId) {
                postcomment_1.postCommentsArray.splice(x, 1);
                res.status(204).send('Comment removed from post');
                return;
            }
        }
        res.status(404).send(new error_1.Error("Post or Comment not found", "404"));
    }
    else {
        res.status(401).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
//# sourceMappingURL=commentsrouter.js.map