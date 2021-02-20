"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
var express_1 = __importDefault(require("express"));
var error_1 = require("../utility/error");
var auth_1 = require("../utility/auth");
var category_1 = require("../models/category");
var categoriesRouter = express_1.default.Router();
exports.categoriesRouter = categoriesRouter;
var auth = new auth_1.Auth();
var categoriesCreated = 0;
categoriesRouter.get("/Categories", function (req, res, next) {
    res.status(200).send(category_1.categoriesArray);
});
categoriesRouter.post("/Categories", function (req, res, next) {
    if (auth_1.Auth.Verify(req.headers)) {
        if (req.body.categoryName == null || Object.keys(req.body.categoryName).length == 0) {
            res.status(406).send(new error_1.Error('Bad data in the entity: No category name', '406'));
        }
        for (var _i = 0, categoriesArray_1 = category_1.categoriesArray; _i < categoriesArray_1.length; _i++) {
            var c = categoriesArray_1[_i];
            if (c.categoryName === req.body.categoryName) {
                res.status(409).send(new error_1.Error('Duplicate category', '409'));
                return;
            }
        }
        var newCategory = new category_1.Category(categoriesCreated++, req.body.categoryName, req.body.categoryDescription);
        category_1.categoriesArray.push(newCategory);
        res.status(201).send(newCategory);
    }
    else {
        res.send(new error_1.Error('Unauthorized Access', '401'));
    }
});
categoriesRouter.get("/Categories/:CategoryId", function (req, res, next) {
    var categoryId = parseInt(req.params.CategoryId);
    var category = category_1.categoriesArray.find(function (x) { return x.categoryId == categoryId; });
    if (category) {
        res.status(200).send(category);
    }
    else {
        res.send(new error_1.Error("Category not found", "404"));
    }
});
categoriesRouter.patch("/Categories/:CategoryId", function (req, res, next) {
    var categoryId = parseInt(req.params.CategoryId);
    if (auth_1.Auth.Verify(req.headers)) {
        for (var _i = 0, categoriesArray_2 = category_1.categoriesArray; _i < categoriesArray_2.length; _i++) {
            var c = categoriesArray_2[_i];
            if (c.categoryId == categoryId) {
                if (req.body.categoryName == null || req.body.categoryDescription == null) {
                    res.send(new error_1.Error('Bad data in the entity: Malformed data', '406'));
                    return;
                }
                c.categoryName = req.body.categoryName;
                c.categoryDescription = req.body.categoryDescription;
                res.status(200).send(c);
                return;
            }
        }
        res.send(new error_1.Error("Category not found", "404"));
    }
    else {
        res.send(new error_1.Error("Unauthorized Access", "401"));
    }
});
categoriesRouter.delete("/Categories/:CategoryId", function (req, res, next) {
    var categoryId = parseInt(req.params.CategoryId);
    if (auth_1.Auth.Verify(req.headers)) {
        for (var i = 0; i < category_1.categoriesArray.length; i++) {
            if (category_1.categoriesArray[i].categoryId == categoryId) {
                category_1.categoriesArray.splice(i, 1);
                res.status(204).send("Category deleted.");
                return;
            }
        }
        res.send(new error_1.Error("Category not found", "404"));
    }
    else {
        res.send(new error_1.Error("Unauthorized Access", "401"));
    }
});
//# sourceMappingURL=categoriesrouter.js.map