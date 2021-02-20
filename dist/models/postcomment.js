"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCommentsArray = exports.PostComment = void 0;
var PostComment = /** @class */ (function () {
    function PostComment(commentNumber, comment, userID, commentDate) {
        this.postId = '';
        this.commentId = commentNumber;
        this.comment = comment;
        this.userId = userID;
        this.commentDate = commentDate;
    }
    return PostComment;
}());
exports.PostComment = PostComment;
var postCommentsArray = [];
exports.postCommentsArray = postCommentsArray;
//# sourceMappingURL=postcomment.js.map