# Database Schema

## Constraints

Valid Characters for username include: 
```ts
const validChars = /^[a-zA-Z0-9()_\-.!@#$%^&\*]*$/
```
Valid Characters for more general cases such as descriptions include: 
```ts
const validChars = /^[a-zA-Z0-9()_\-,. !@#$%^&\*]*$/
```
Number of characters allowed in each string are specified as follows

1. (tiny) firstName,LastName => [1-25]
1. (short) username => [5-25]
1. (medium) name (product), title (review), password => [8-25]
1. (long) address ,description (product), description (review) => [10-500]

Special Types

1. email
1. url
1. search string => chars allowed [0-50]

All the ids such as `username`, `productId` are integers starting from 0 and going above

`phoneNumber` is anywhere from 9 to 12 digits, so [0-9] only

`rating` is number from 0 to 5 with a step value of 0.5. Example: 0, 2, 5, 0.5, 3.5 

## Model

### User

```ts
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
```

### CartItem

```ts
interface CartItem {
    username: string,
    productId: number,
    quantity: number
}
```

### Product

```ts
interface Product {
    productId: number;
    name: string;
    description: string;
    price: number;
    images: string[],
    username: string
}
```

### Review

```ts
interface Review {
    title: string,
    description: string,
    rating: number,
    username: string,
    productId: number
} 
```