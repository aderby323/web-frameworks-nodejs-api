import express from "express";
import { UserPost, postsArray } from "../models/userpost";
import { Error } from "../utility/error";
import { Auth } from "../utility/auth";
import { PostCategory, postCategories } from '../models/postcategory';
import { PostComment, postCommentsArray } from '../models/postcomment';

const postsRouter = express.Router();

var postsCreated = 0;

postsRouter.get("/Posts", (req, res, next) => {
  res.status(200).send(postsArray);
});

postsRouter.post("/Posts", (req, res, next) => {
  let postCategory = new PostCategory();
  if (Auth.Verify(req.headers)) {
    if (req.body.title != null && req.body.content != null && Object.keys(req.body.title).length != 0 && Object.keys(req.body.content).length != 0) {
      console.log(Auth.Parse(req.headers.authorization?.split(" ")[1]!));
      let newPost: UserPost = new UserPost(
        ++postsCreated,
        new Date(),
        req.body.title,
        req.body.content,
        <string>Auth.Parse(req.headers.authorization?.split(" ")[1]!),
        req.body.headerImage,
        new Date()
      );
      postsArray.push(newPost);
      postCategory.postId = postsCreated;
      postCategories.push(postCategory);
      res.status(201).send(newPost);
    } else {
      res.status(406).send(new Error("Bad data in the entity. Missing title or content", "406"));
    }
  } else {
    res.status(401).send(new Error("Unauthorized Access", "401"));
  }
});

postsRouter.get("/Posts/:PostId", (req, res, next) => {
  let postId = parseInt(req.params.PostId);
  let post = postsArray.find((x) => x.postId == postId);
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(404).send(new Error("Post not found", "404"));
  }
});

postsRouter.patch("/Posts/:PostId", (req, res, next) => {
  let postId = parseInt(req.params.PostId);
  if (Auth.Verify(req.headers)) {
    for (let post of postsArray) {
      if (post.postId == postId) {
          post.title = req.body.title;
          post.content = req.body.content;
          post.headerImage = req.body.headerImage;
        res.status(200).send(post);
        return;
      }
    }
    res.status(404).send(new Error("Post not found", "404"));
  } else {
    res.status(401).send(new Error("Unauthorized Access", "401"));
  }
});

postsRouter.delete("/Posts/:PostId", (req, res, next) => {
    let postId = parseInt(req.params.PostId); 
    if (Auth.Verify(req.headers)) {
        for (var i = 0; i < postsArray.length; i++) {
            if (postsArray[i].postId == postId) {
                postsArray.splice(i, 1);
                postCategories.splice(i, 1);
                res.status(204).send(`Post deleted.`);
                return;
            }
        }
      res.status(404).send(new Error("Post not found", "404"));
    } 
    else {
      res.status(401).send(new Error("Unauthorized Access", "401"));
    }
});

postsRouter.get("/Posts/User/UserId", (req, res, next) => {
    let userPosts: UserPost[] = postsArray.filter(x => x.userId == req.params.UserId);
    if (userPosts.length > 0) {
        res.status(200).send(userPosts);
    }
    else {
        res.status(401).send(new Error("User or Post not found", "404"));
    }
  });

export { postsRouter };
