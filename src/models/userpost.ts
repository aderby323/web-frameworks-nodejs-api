export class UserPost {

    postId: number;
    createdDate: Date;
    title: string;
    content: string;
    userId: string;
    headerImage: string;
    lastUpdated: Date;

    constructor(postID: number, createdDate: Date, title: string, 
        content: string, userID: string, headerImage: string, lastUpdated: Date) {

        this.postId = postID;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userID;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }
}

var postsArray: UserPost[] = [];

export { postsArray };