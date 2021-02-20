import { Category } from "./category";

export class PostCategory {

    categories: Category[];
    postId: number;

    constructor() {
        this.categories = [];
        this.postId = 0;
    }
}

var postCategories: PostCategory[] = [];

export { postCategories };