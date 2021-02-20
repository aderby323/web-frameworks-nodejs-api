"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var usersrouter_1 = require("./routes/usersrouter");
var postsrouter_1 = require("./routes/postsrouter");
var categoriesrouter_1 = require("./routes/categoriesrouter");
var postcategoriesrouter_1 = require("./routes/postcategoriesrouter");
var commentsrouter_1 = require("./routes/commentsrouter");
var application = express_1.default();
var indexHTML = fs_1.default.readFileSync('src/views/index.html');
application.use(body_parser_1.default.json());
application.options('*', cors_1.default({ credentials: true, origin: true }));
application.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
application.use(cors_1.default({ credentials: true, origin: true }));
application.use(usersrouter_1.userRouter);
application.use(postsrouter_1.postsRouter);
application.use(categoriesrouter_1.categoriesRouter);
application.use(postcategoriesrouter_1.postCategoriesRouter);
application.use(commentsrouter_1.commentsRouter);
application.use('/', function (req, res, next) {
    res.status(200).header('Content-Type', 'text/html');
    res.write(indexHTML);
    res.end();
});
application.listen(3000);
//# sourceMappingURL=index.js.map