import bcrypt from 'bcrypt';
import emailValidator from 'email-validator';

export class User {

    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password?: string;

    constructor(userID: string, firstName: string, lastName: string,
        emailAddress: string, password: string) {
            this.userId = userID;
            this.firstName = firstName;
            this.lastName = lastName;
            this.emailAddress = emailAddress;
            this.password = this.SetHashedPassword(password);
    }

    ValidatePassword(password: string) {
        return bcrypt.compareSync(password, this.password!);
    }

    ValidateEmailAddress(email: string) {
        return emailValidator.validate(email);
    }

    SetHashedPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    toJSON(user: User) {
        user = new User(this.userId, this.firstName, this.lastName, this.emailAddress, '.');
        delete user.password;
        return user;
    }
}

var userArray: User[] = [];
export { userArray };