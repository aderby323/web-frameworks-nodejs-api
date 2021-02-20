import express from 'express';
import { Error } from '../utility/error';
import { Auth } from '../utility/auth';
import { PostComment, postCommentsArray} from '../models/postcomment';
import { postsArray } from '../models/userpost';

const commentsRouter = express.Router();
const auth: Auth = new Auth();
var commentsCreated: number = 0;

commentsRouter.get("/Comments/:postId", (req, res, next) => {
    var comments: PostComment[];
    let postId = req.params.postId;
    if (!(postsArray.find((x) => x.postId == parseInt(postId)))) {
        res.status(404).send(new Error("Post not found", "404"));
        return;
    }
    comments = postCommentsArray.filter((x) => x.postId == postId);
    if (comments.length > 0) {
        res.status(200).send(comments);
    }
    else {
        res.status(200).send({comments: []});
    }
  });

  commentsRouter.post("/Comments/:postId", (req, res, next) => {
    let postId = req.params.postId;
    let comment = req.body.comment;
    if (Auth.Verify(req.headers)) {
        let userId = <string>Auth.Parse(req.headers.authorization?.split(" ")[1]!);
        if (comment == null || comment.split(' ').join('') == '') {
            res.status(406).send(new Error('Bad data in the entity: Comment null or blank','406'));
            return;
        }
        for (var x = 0; x < postsArray.length; x++) {
            if (postsArray[x].postId == parseInt(postId)) {
                var newComment = new PostComment(++commentsCreated, comment, userId, new Date());
                newComment.postId = postId;
                postCommentsArray.push(newComment);
                res.status(200).send(newComment);
            }
        }
    }
    else { res.status(401).send(new Error("Unauthorized Access", "401")); }
    
  });

  commentsRouter.patch("/Comments/:postId/:commentId", (req, res, next) => {
    let postId = req.params.postId;
    let commentId = parseInt(req.params.commentId);
    let comment = req.body.comment;
    if (Auth.Verify(req.headers)) {
        for (var x = 0; x < postCommentsArray.length; x++) {
            if (postCommentsArray[x].commentId == commentId && postCommentsArray[x].postId === postId) {
                postCommentsArray[x].comment = comment;
                res.status(201).send(postCommentsArray[x]);
                return;
            }
        }
        res.status(404).send(new Error("Post or Comment not found", "404"));
    }
    else {res.status(404).send(new Error("Unauthorized Access", "401"));}
  });

  commentsRouter.delete("/Comments/:postId/:commentId", (req, res, next) => {
    let postId = req.params.postId;
    let commentId = parseInt(req.params.commentId);
    if (Auth.Verify(req.headers)) {
        for (var x = 0; x < postCommentsArray.length; x++) {
            if (postCommentsArray[x].commentId == commentId && postCommentsArray[x].postId === postId) {
                postCommentsArray.splice(x, 1);
                res.status(204).send('Comment removed from post');
                return;
            }
        }
        res.status(404).send(new Error("Post or Comment not found", "404"));
    }
    else {res.status(401).send(new Error("Unauthorized Access", "401"));}
  });

export { commentsRouter };