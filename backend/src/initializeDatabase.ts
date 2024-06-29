import { createReview, deleteAllCarts, deleteAllProducts, deleteAllReviews, deleteAllUsers, makeProductListing, saveUser } from "./database";
import { log } from "./logger";
import { Product, Review, User } from "./schema";

export async function initialize() {
    const users:User[] = [
        {
            username:'server_initial',
            hash:'',
            firstName: 'server',
            lastName: 'initial',
            address: 'Vancouver, Canada',
            phone: 7788614550,
            email: 'me@aghadia.com',
            profilePhoto: 'https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png'
        },
        {
            username:'Alice_1',
            hash:'',
            firstName: 'Alice',
            lastName: 'Smith',
            address: 'Toronto, Canada',
            phone: 7788652350,
            email: 'alice@example.com',
            profilePhoto: 'https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png'
        },
        {
            username: "Hattie_82",
            hash: "",
            firstName: "Sofia",
            lastName: "Williams",
            address: "South Ozone Park, Solomon Islands",
            phone: 987456123,
            email: "Sofia_Williams@example.com",
            profilePhoto: "https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png"
          },
          {
            username: "Barbara_19",
            hash: "",
            firstName: "Timothy",
            lastName: "Garcia",
            address: "Port Lavadia, Latvia",
            phone: 987452123,
            email: "Timothy_Garcia@example.com",
            profilePhoto: "https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png"
          },
          {
            username: "Emily_72",
            hash: "",
            firstName: "Ella",
            lastName: "Rodriguez",
            address: "West Sylvan, Mayotte",
            phone: 987452198,
            email: "Ella_Rodriguez@example.com",
            profilePhoto: "https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png"
          },
          {
            username: "Eddie99",
            hash: "",
            firstName: "Travis",
            lastName: "Allen",
            address: "East Rikkita, Ghana",
            phone: 127452120,
            email: "Travis_Allen@example.com",
            profilePhoto: "https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png"
          },
          {
            username: "William_26",
            hash: "",
            firstName: "Nora",
            lastName: "Scott",
            address: "North Perry, Slovakia",
            phone: 727452121,
            email: "Nora_Scott@example.com",
            profilePhoto: "https://cdn.pixabay.com/photo/2023/07/15/11/54/vulture-8128674_1280.png"
          }
    ]
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

    const reviews: Review[] = [
        {
            title: "Great product, highly recommend!",
            description: "This product exceeded my expectations. It's well-built and offers great value for money. I would definitely recommend it to anyone looking for a reliable product.",
            rating: 5,
            username: "William_26",
            productId: 0
          },
          {
            title: "Solid performance and quality build",
            description: "I've been using this product for a while now, and I'm impressed with its performance and build quality. It's sturdy and does exactly what it's supposed to do.",
            rating: 4,
            username: "Eddie99",
            productId: 0
          },
          {
            title: "Excellent value for money",
            description: "For the price, this product is unbeatable. It's packed with features and functions smoothly. I'm glad I made this purchase.",
            rating: 5,
            username: "Emily_72",
            productId: 0
          },
          {
            title: "Good product, meets expectations",
            description: "The product does what it promises. It's reliable and works well for my needs. Overall, I'm satisfied with its performance.",
            rating: 4,
            username: "Barbara_19",
            productId: 1
          },
          {
            title: "Impressed with the features",
            description: "I'm pleasantly surprised by the features this product offers. It's user-friendly and has everything I was looking for. Definitely a great buy.",
            rating: 5,
            username: "Hattie_82",
            productId: 1
          },
          {
            title: "Could be better, but overall satisfied",
            description: "While the product has its shortcomings, it still manages to deliver. There are areas for improvement, but I'm satisfied with its performance so far.",
            rating: 3,
            username: "Alice_1",
            productId: 2
          }
    ]

    await deleteAllUsers();
    log(0,'INITIALIZE','deleted all users');
    await deleteAllProducts();
    log(0,'INITIALIZE','deleted all products');
    await deleteAllReviews();
    log(0,'INITIALIZE','deleted all reviews');
    await deleteAllCarts();
    log(0,'INITIALIZE','deleted all carts');

    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        await saveUser(user)
    }
    
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        await makeProductListing(product.username,product.name,product.description,product.price,[]);
    }

    for (let index = 0; index < reviews.length; index++) {
        const review = reviews[index];
        await createReview(review.title,review.description,review.rating,review.username,review.productId);        
    }
}
