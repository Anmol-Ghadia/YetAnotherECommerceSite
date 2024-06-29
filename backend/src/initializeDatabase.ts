import { deleteAllCarts, deleteAllProducts, deleteAllReviews, deleteAllUsers, makeProductListing, saveUser } from "./database";
import { log } from "./logger";
import { Product, User } from "./schema";

export async function initialize() {
    const user:User = {
        username:'server_initial',
        hash:'',
        firstName: 'server',
        lastName: 'initial',
        address: 'Vancouver, Canada',
        phone: 7788614550,
        email: 'me@aghadia.com',
        profilePhoto: 'https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png'
    }
    const products: Product[] = [
        {
            productId: 0,
            name: "Premium Leather Handbag",
            description: "Crafted from genuine Italian leather, this handbag combines luxury and functionality. Its spacious compartments and elegant design make it a perfect accessory for any occasion. Available in classic black and sophisticated brown.",
            price: 299.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 1,
            name: "Smart Fitness Tracker",
            description: "Track your fitness goals with precision using our latest smart fitness tracker. Featuring advanced sensors for heart rate monitoring, GPS tracking, and sleep analysis. Stay connected with notifications and reminders right on your wrist.",
            price: 129.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 2,
            name: "Professional Espresso Machine",
            description: "Create barista-quality espresso at home with our professional-grade espresso machine. Built with stainless steel and equipped with dual boilers for simultaneous brewing and frothing. Includes advanced features like programmable shot settings and a steam wand for perfect milk frothing.",
            price: 549.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 3,
            name: "Wireless Noise-Cancelling Headphones",
            description: "Immerse yourself in crystal-clear sound with our wireless noise-cancelling headphones. Perfect for travel and everyday use, these headphones offer up to 30 hours of battery life and intuitive touch controls. Enjoy superior comfort with plush ear cushions and an adjustable headband.",
            price: 199.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 4,
            name: "Organic Cotton Bedding Set",
            description: "Transform your bedroom into a sanctuary with our organic cotton bedding set. Made from 100% certified organic cotton, this set includes a duvet cover, fitted sheet, and pillowcases. Experience unparalleled softness and comfort while promoting sustainability.",
            price: 179.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 5,
            name: "Premium Leather Handbag",
            description: "Crafted from genuine Italian leather, this handbag combines luxury and functionality. Its spacious compartments and elegant design make it a perfect accessory for any occasion. Available in classic black and sophisticated brown.",
            price: 299.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 6,
            name: "Smart Fitness Tracker",
            description: "Track your fitness goals with precision using our latest smart fitness tracker. Featuring advanced sensors for heart rate monitoring, GPS tracking, and sleep analysis. Stay connected with notifications and reminders right on your wrist.",
            price: 129.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 7,
            name: "Professional Espresso Machine",
            description: "Create barista-quality espresso at home with our professional-grade espresso machine. Built with stainless steel and equipped with dual boilers for simultaneous brewing and frothing. Includes advanced features like programmable shot settings and a steam wand for perfect milk frothing.",
            price: 549.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 8,
            name: "Wireless Noise-Cancelling Headphones",
            description: "Immerse yourself in crystal-clear sound with our wireless noise-cancelling headphones. Perfect for travel and everyday use, these headphones offer up to 30 hours of battery life and intuitive touch controls. Enjoy superior comfort with plush ear cushions and an adjustable headband.",
            price: 199.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 9,
            name: "Organic Cotton Bedding Set",
            description: "Transform your bedroom into a sanctuary with our organic cotton bedding set. Made from 100% certified organic cotton, this set includes a duvet cover, fitted sheet, and pillowcases. Experience unparalleled softness and comfort while promoting sustainability.",
            price: 179.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 10,
            name: "Laptop Backpack with USB Charging Port",
            description: "Stay organized and powered up on the go with our laptop backpack featuring a built-in USB charging port. Made from durable water-resistant materials, it includes multiple compartments for laptops up to 15 inches, tablets, and accessories. Perfect for business trips and daily commuting.",
            price: 89.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 11,
            name: "Gourmet Stainless Steel Cookware Set",
            description: "Upgrade your kitchen with our premium stainless steel cookware set. Crafted for professional chefs and home cooks alike, this set includes frying pans, saucepans, and a stockpot—all with ergonomic handles and tempered glass lids. Experience superior heat distribution and durability.",
            price: 349.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 12,
            name: "Luxury Spa Robe and Slippers Set",
            description: "Indulge in spa-like comfort at home with our luxury robe and slippers set. Made from plush, absorbent materials, the robe features a shawl collar and deep pockets, while the slippers have non-slip soles for added safety. Perfect for relaxing evenings and weekend retreats.",
            price: 129.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 13,
            name: "Electric Standing Desk with Memory Settings",
            description: "Improve your productivity and well-being with our electric standing desk. Easily transition between sitting and standing positions with the touch of a button. This desk features programmable memory settings for your preferred heights and a spacious work surface with cable management.",
            price: 499.99,
            images: [],
            username: "server_initial"
        },
        {
            productId: 14,
            name: "Premium Quality Bluetooth Speaker",
            description: "Experience rich, immersive sound with our premium Bluetooth speaker. Engineered for audiophiles, it delivers deep bass, clear highs, and balanced midrange. With wireless connectivity and a portable design, it's perfect for home entertainment and outdoor gatherings.",
            price: 179.99,
            images: [],
            username: "server_initial"
        }
    ];

    await deleteAllUsers();
    log(0,'INITIALIZE','deleted all users');
    await deleteAllProducts();
    log(0,'INITIALIZE','deleted all products');
    await deleteAllReviews();
    log(0,'INITIALIZE','deleted all reviews');
    await deleteAllCarts();
    log(0,'INITIALIZE','deleted all carts');
    await saveUser(user)
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        await makeProductListing(product.username,product.name,product.description,product.price,[]);
    }
}
