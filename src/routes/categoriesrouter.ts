import express from 'express';
import { Error } from '../utility/error';
import { Auth } from '../utility/auth';
import { categoriesArray, Category } from '../models/category';

const categoriesRouter = express.Router();
const auth: Auth = new Auth();

var categoriesCreated: number = 0;

categoriesRouter.get("/Categories", (req, res, next) => {
    res.status(200).send(categoriesArray);
});

categoriesRouter.post("/Categories", (req, res, next) => {
    if(Auth.Verify(req.headers)) {
        if (req.body.categoryName == null || Object.keys(req.body.categoryName).length == 0) {
            res.status(406).send(new Error('Bad data in the entity: No category name','406'));
        }
        for (let c of categoriesArray) {
            if (c.categoryName === req.body.categoryName) {
                res.status(409).send(new Error('Duplicate category','409'));
                return;
            }
        }
        let newCategory = new Category(categoriesCreated++,req.body.categoryName, req.body.categoryDescription);
        categoriesArray.push(newCategory);
        res.status(201).send(newCategory);
    }
    else {
        res.send(new Error('Unauthorized Access','401'))
    }
});

categoriesRouter.get("/Categories/:CategoryId", (req, res, next) => {
    let categoryId = parseInt(req.params.CategoryId);
    let category = categoriesArray.find((x) => x.categoryId == categoryId);
    if (category) {
      res.status(200).send(category);
    } else {
      res.send(new Error("Category not found", "404"));
    }
  });
  
  categoriesRouter.patch("/Categories/:CategoryId", (req, res, next) => {
    let categoryId = parseInt(req.params.CategoryId);
    if (Auth.Verify(req.headers)) {
      for (let c of categoriesArray) {
        if (c.categoryId == categoryId) {
            if (req.body.categoryName == null || req.body.categoryDescription == null) {
                res.send(new Error('Bad data in the entity: Malformed data','406'));
                return;
            }
            c.categoryName = req.body.categoryName;
            c.categoryDescription = req.body.categoryDescription;
          res.status(200).send(c);
          return;
        }
      }
      res.send(new Error("Category not found", "404"));
    } else {
      res.send(new Error("Unauthorized Access", "401"));
    }
  });
  
  categoriesRouter.delete("/Categories/:CategoryId", (req, res, next) => {
      let categoryId = parseInt(req.params.CategoryId); 
      if (Auth.Verify(req.headers)) {
          for (var i = 0; i < categoriesArray.length; i++) {
              if (categoriesArray[i].categoryId == categoryId) {
                  categoriesArray.splice(i, 1);
                  res.status(204).send(`Category deleted.`);
                  return;
              }
          }
        res.send(new Error("Category not found", "404"));
      } 
      else {
        res.send(new Error("Unauthorized Access", "401"));
      }
  });

export { categoriesRouter };