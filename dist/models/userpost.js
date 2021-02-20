"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsArray = exports.UserPost = void 0;
var UserPost = /** @class */ (function () {
    function UserPost(postID, createdDate, title, content, userID, headerImage, lastUpdated) {
        this.postId = postID;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userID;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }
    return UserPost;
}());
exports.UserPost = UserPost;
var postsArray = [];
exports.postsArray = postsArray;
//# sourceMappingURL=userpost.js.map