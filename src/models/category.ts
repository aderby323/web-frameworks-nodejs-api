export class Category {

    categoryId: number;
    categoryName: string;
    categoryDescription: string;

    constructor(categoryID: number, name: string, description: string) {
        this.categoryId = categoryID;
        this.categoryName = name;
        this.categoryDescription = description;
    }
}

var categoriesArray: Category[] = [];

export { categoriesArray }