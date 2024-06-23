export {
    User,CartItem,Product,Review,
    checkRating,checkPhoneNumber,
    checkId,checkLongString,
    checkMediumString,
    checkShortString,
    checkEmail,
    checkURL
}

interface User {
    username:string,
    hash:string,
    firstName: string,
    lastName: string,
    address: string,
    phone: number,
    email: string,
    profilePhoto: string
}

interface CartItem {
    username: string,
    productId: number,
    quantity: number
}

interface Product {
    productId: number;
    name: string;
    description: string;
    price: number;
    images: string[],
    username: string
}

interface Review {
    reviewId: number,
    title: string,
    description: string,
    rating: number,
    username: string,
    productId: number
}

// Checks long string constraints are met
function checkShortString(inputString:string):boolean {
    const check1 = checkStringSize(inputString,5,25);
    const check2 = checkChars(inputString);
    return check1 && check2;
}

// Checks long string constraints are met
function checkMediumString(inputString:string):boolean {
    const check1 = checkStringSize(inputString,8,25);
    const check2 = checkChars(inputString);
    return check1 && check2;
}

// Checks long string constraints are met
function checkLongString(inputString:string):boolean {
    const check1 = checkStringSize(inputString,10,500);
    const check2 = checkChars(inputString);
    return check1 && check2;
}

// Checks identifier number is valid
function checkId(input: number):boolean {
    const check1 = 0 <= input;
    const check2 = ((input % 1) == 0);
    return check1 && check2;
}

// Checks phone number is valid
function checkPhoneNumber(input: number):boolean {
    const check1 = 99_999_999 < input;
    const check2 = input < 1_000_000_000_000;
    const check3 = ((input % 1) == 0);
    return check1 && check2 && check3;
}

// Checks rating is valid
function checkRating(input:number):boolean {
    const check1 = 0 <= input;
    const check2 = input <= 5;
    const check3 = ((input % 0.5) == 0);
    return check1 && check2 && check3;
}

// Checks if email is correctly formatted
function checkEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Checks if URL is correctly formatted
function checkURL(url: string): boolean {
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
}

// Returns true if all characters are defined in schema
function checkChars(inputString: string):boolean {
    const validChars = /^[a-zA-Z0-9()_\-,.]*$/
    return validChars.test(inputString);
}

// Returns true if string length is within given size, inclusive 
function checkStringSize(inputString: string,minSize:number,maxSize:number):boolean {
    const check1 = minSize <= inputString.length;
    const check2 = inputString.length <= maxSize;
    return check1 && check2;
}
