import { log } from '../logger';

// ======== Interfaces ========

export interface User {
    username:string,
    hash:string,
    firstName: string,
    lastName: string,
    address: string,
    phone: number,
    email: string,
    profilePhoto: string
}

export interface CartItem {
    username: string,
    productId: number,
    quantity: number
}

export interface Product {
    productId: number,
    name: string,
    description: string,
    price: number,
    images: string[],
    username: string
}

export interface Review {
    title: string,
    description: string,
    rating: number,
    username: string,
    productId: number
}

// ======== Helper Interface ========

export interface cartItemProduct {
    productId: number,
    name: string,
    description: string,
    price: number,
    images: string[],
    quantity: number
}

export type UserWithoutHash = Omit<User, 'hash'>;

// ======== Interface helpers ========

// Returns true if the first and second Users are same
export function compareUser(first:User,second:User) {
    return (first.username == second.username);
}

// Returns a sample user with given username
export function generateUserWithUsername(username:string) {
    return {
        username: username,
        hash: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: 0,
        email: '',
        profilePhoto: ''
    }
}

// Returns true if first and second Products are same
export function compareProduct(first:Product,second: Product) {
    return (first.productId == second.productId);
}

// Returns a sample product with the provided id
export function generateProductWithId(productId: number): Product {
    return {
        productId: productId,
        name: '',
        description: '',
        price: 0,
        images: [],
        username: ''
    };
}

// // Returns true if first and second Reviews are same
// export function compareReview(first:Review,second:Review): boolean {
//     const cond_1 = first.username == second.username;
//     const cond_2 = first.productId == second.productId;
//     return (cond_1 && cond_2);
// }

// // Returns a sample Review with given username and productId
// export function generateReviewWithUsernameAndProductId(username:string,productId:number): Review {
//     return {
//         title: '',
//         description: '',
//         rating: 0,
//         username: username,
//         productId: productId
//     };
// }
// Returns true if both the cartItems are same
export function compareCartItem(first:CartItem,second: CartItem) {
    const cond_1 = (first.productId == second.productId);
    const cond_2 = (first.username == second.username);
    return (cond_1 && cond_2);
}

// Returns a sample CartItem with the provided id and username
export function generateCartItemWithUsernameAndProductId(username: string, productId:number): CartItem {
    return {
        username: username,
        productId: productId,
        quantity: 0
    };
}


// ======== field helpers ========

// Checks if the string can be a valid username
export function checkUsername(input:string) {
    const check1 = checkStringSize(input,5,25);
    const check2 = checkStrictChars(input);
    if (!(check1 && check2)) log(1,'CHECK',`bound error for: ${input}`) 
    return check1 && check2;
}

// Checks tiny string constraints are met
export function checkTinyString(inputString:string):boolean {
    const check1 = checkStringSize(inputString,1,25);
    const check2 = checkGeneralChars(inputString);
    if (!(check1 && check2)) log(1,'CHECK',`bound error for (${inputString})`) 
    return check1 && check2;
}
// Checks short string constraints are met
export function checkShortString(inputString:string):boolean {
    const check1 = checkStringSize(inputString,5,25);
    const check2 = checkGeneralChars(inputString);
    if (!(check1 && check2)) log(1,'CHECK',`bound error for (${inputString})`)
    return check1 && check2;
}

// Checks medium string constraints are met
export function checkMediumString(inputString:string):boolean {
    const check1 = checkStringSize(inputString,8,25);
    const check2 = checkGeneralChars(inputString);
    if (!(check1 && check2)) log(1,'CHECK',`bound error for (${inputString})`)
    return check1 && check2;
}

// Checks long string constraints are met
export function checkLongString(inputString:string):boolean {
    const check1 = checkStringSize(inputString,10,500);
    const check2 = checkGeneralChars(inputString);
    if (!(check1 && check2)) log(1,'CHECK',`bound error for (${inputString})`)
    return check1 && check2;
}

// Checks identifier number is valid
export function checkId(input: number):boolean {
    const check1 = 0 <= input;
    const check2 = ((input % 1) == 0);
    if (!(check1 && check2)) log(1,'CHECK',`bound error for (${input})`)
    return check1 && check2;
}

// Checks phone number is valid
export function checkPhoneNumber(input: number):boolean {
    const check1 = 99_999_999 < input;
    const check2 = input < 1_000_000_000_000;
    const check3 = ((input % 1) == 0);
    if (!(check1 && check2 && check3)) log(1,'CHECK',`bound error for (${input})`)
    return check1 && check2 && check3;
}

// Checks rating is valid
export function checkRating(input:number):boolean {
    const check1 = 0 <= input;
    const check2 = input <= 5;
    const check3 = ((input % 0.5) == 0);
    if (!(check1 && check2 && check3)) log(1,'CHECK',`bound error for (${input})`)
    return check1 && check2 && check3;
}

// Checks if email is correctly formatted
export function checkEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!(emailRegex.test(email))) log(1,'CHECK',`bound error for (${email})`)
    return emailRegex.test(email);
}

// Checks if URL is correctly formatted
export function checkURL(url: string): boolean {
    const urlRegex = /^(http|https):\/\/[^ ']+$/;
    if (!(urlRegex.test(url))) log(1,'CHECK',`bound error for (${url})`)
    return urlRegex.test(url);
}

export function checkURLArray(object: string[]) {
    for (let index = 0; index < object.length; index++) {
        if (!checkURL(object[index])) {
            return false;
        }
    }
    return true;
}

// Returns true if all search string is allowed
export function checkSearchString(search: string) {
    const check1 = checkGeneralChars(search);
    const check2 = checkStringSize(search,0,50);
    return check1 && check2;
}

// ======== helpers for Field Helpers ========

// Returns true if all characters are defined in schema
function checkGeneralChars(inputString: string):boolean {
    const validChars = /^[a-zA-Z0-9()_\-,. !@#$%^&*]*$/
    return validChars.test(inputString);
}

// Returns true if all characters are defined in schema
function checkStrictChars(inputString: string):boolean {
    const validChars = /^[a-zA-Z0-9()_\-.!@#$%^&*]*$/
    return validChars.test(inputString);
}

// Returns true if string length is within given size, inclusive 
function checkStringSize(inputString: string,minSize:number,maxSize:number):boolean {
    const check1 = minSize <= inputString.length;
    const check2 = inputString.length <= maxSize;
    return check1 && check2;
}
