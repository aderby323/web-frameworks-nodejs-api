"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCategoriesRouter = void 0;
var express_1 = __importDefault(require("express"));
var error_1 = require("../utility/error");
var auth_1 = require("../utility/auth");
var postcategory_1 = require("../models/postcategory");
var userpost_1 = require("../models/userpost");
var category_1 = require("../models/category");
var postCategoriesRouter = express_1.default.Router();
exports.postCategoriesRouter = postCategoriesRouter;
var auth = new auth_1.Auth();
postCategoriesRouter.get("/PostCategory/:postId", function (req, res, next) {
    var postId = parseInt(req.params.postId);
    var post = postcategory_1.postCategories.find(function (x) { return x.postId = postId; });
    if (post) {
        res.status(200).send(post);
    }
    else {
        res.status(404).send(new error_1.Error("Post not found", "404"));
    }
});
postCategoriesRouter.get("/PostCategory/Posts/:categoryId", function (req, res, next) {
    var categoryId = parseInt(req.params.CategoryId);
    var posts = [];
    for (var x = 0; x < postcategory_1.postCategories.length; x++) {
        var category = postcategory_1.postCategories[x].categories.find(function (y) { return y.categoryId = categoryId; });
        if (category) {
            posts.push(userpost_1.postsArray[x]);
        }
    }
    if (posts.length > 0) {
        res.status(200).send({ categoryId: categoryId, posts: posts });
    }
    else {
        res.status(404).send(new error_1.Error("Category not found", "404"));
    }
});
postCategoriesRouter.post("/PostCategory/:postId/:CategoryId", function (req, res, next) {
    var _a;
    var postId = parseInt(req.params.postId);
    var categoryId = parseInt(req.params.CategoryId);
    if (auth_1.Auth.Verify(req.headers)) {
        var category = category_1.categoriesArray.find(function (x) { return x.categoryId == categoryId; });
        if (category != undefined && (userpost_1.postsArray.filter(function (x) { return x.postId == postId; }).length > 0)) {
            (_a = postcategory_1.postCategories[postId]) === null || _a === void 0 ? void 0 : _a.categories.push(category);
        }
        else {
            res.status(404).send(new error_1.Error("Category or Post not found", "404"));
        }
    }
    else {
        res.status(401).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
postCategoriesRouter.delete("/PostCategory/:postId/:CategoryId", function (req, res, next) {
    var categoryId = parseInt(req.params.CategoryId);
    var postId = parseInt(req.params.postId);
    if (auth_1.Auth.Verify(req.headers)) {
        for (var _i = 0, postCategories_1 = postcategory_1.postCategories; _i < postCategories_1.length; _i++) {
            var pc = postCategories_1[_i];
            if (pc.postId == postId) {
                for (var x = 0; x < pc.categories.length; x++) {
                    if (pc.categories[x].categoryId == categoryId) {
                        pc.categories.splice(x, 1);
                    }
                }
                res.status(404).send(new error_1.Error("Category not found", "404"));
                return;
            }
            res.status(404).send(new error_1.Error("Post not found", "404"));
        }
    }
    else {
        res.status(401).send(new error_1.Error("Unauthorized Access", "401"));
    }
});
//# sourceMappingURL=postcategoriesrouter.js.map