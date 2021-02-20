export class PostComment {
    
    commentId: number;
    comment: string;
    userId: string;
    postId: string = '';
    commentDate: Date;

    constructor(commentNumber: number, comment: string, userID: string, commentDate: Date) {
        
        this.commentId = commentNumber;
        this.comment = comment;
        this.userId = userID;
        this.commentDate = commentDate;
    }
}

var postCommentsArray: PostComment[] = [];

export { postCommentsArray };