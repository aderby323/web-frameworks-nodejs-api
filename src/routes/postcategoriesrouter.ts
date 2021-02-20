import express from 'express';
import { Error } from '../utility/error';
import { Auth } from '../utility/auth';
import { PostCategory, postCategories } from '../models/postcategory';
import { UserPost, postsArray } from '../models/userpost';
import { categoriesArray } from '../models/category';

const postCategoriesRouter = express.Router();
const auth: Auth = new Auth();

postCategoriesRouter.get("/PostCategory/:postId", (req, res, next) => {
    let postId = parseInt(req.params.postId);
    let post = postCategories.find((x) => x.postId = postId);
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(404).send(new Error("Post not found", "404"));
    }
  });
  
  postCategoriesRouter.get("/PostCategory/Posts/:categoryId", (req, res, next) => {
    let categoryId = parseInt(req.params.CategoryId);
    let posts: UserPost[] = [];
    for (var x = 0; x < postCategories.length; x++) {
        var category = postCategories[x].categories.find((y) => y.categoryId = categoryId);
        if (category) {
            posts.push(postsArray[x]);
        }
    }

    if (posts.length > 0) {
      res.status(200).send({categoryId: categoryId, posts});
    } else {
      res.status(404).send(new Error("Category not found", "404"));
    }
  });
  

  postCategoriesRouter.post("/PostCategory/:postId/:CategoryId", (req, res, next) => {
      let postId = parseInt(req.params.postId);
      let categoryId = parseInt(req.params.CategoryId);
    if (Auth.Verify(req.headers)) {
        let category = categoriesArray.find(x => x.categoryId == categoryId);
        if (category != undefined && (postsArray.filter(x => x.postId == postId).length > 0)) {
          postCategories[postId]?.categories.push(category);
        }
        else {
          res.status(404).send(new Error("Category or Post not found", "404"));
        }
    }
    else {
      res.status(401).send(new Error("Unauthorized Access", "401"));
    }
    });
  
  postCategoriesRouter.delete("/PostCategory/:postId/:CategoryId", (req, res, next) => {
      let categoryId = parseInt(req.params.CategoryId);
      let postId = parseInt(req.params.postId);
      if (Auth.Verify(req.headers)) {
        for (var pc of postCategories) {
            if (pc.postId == postId) {
                for (var x = 0; x < pc.categories.length; x++) {
                    if (pc.categories[x].categoryId == categoryId) {
                        pc.categories.splice(x,1);
                    }
                }
                res.status(404).send(new Error("Category not found", "404"));
                return;
            }
            res.status(404).send(new Error("Post not found", "404"));
        }
      }
      else {
        res.status(401).send(new Error("Unauthorized Access", "401"));
      }
  });

export { postCategoriesRouter };