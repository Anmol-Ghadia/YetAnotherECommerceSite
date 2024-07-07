import { createReview, deleteAllCarts, deleteAllProducts, deleteAllReviews, deleteAllUsers, makeProductListing, saveUser } from "../database";
import { log } from "../logger";
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
            description: "Elevate your style with the Premium Leather Handbag, a quintessential accessory for the modern, sophisticated woman. Crafted from the finest leather, this handbag embodies elegance, durability, and functionality. Whether you're heading to a business meeting, a casual outing, or a formal event, the Premium Leather Handbag complements any attire, adding a touch of luxury to your everyday look. The Premium Leather Handbag is more than just an accessory; it's a statement of style and sophistication. Its high-quality materials and exceptional craftsmanship ensure you have a handbag that not only looks stunning but also stands the test of time. Perfect for any occasion and outfit, this handbag is designed to meet the needs of the modern woman who values both fashion and function. Add a touch of luxury to your everyday life with the Premium Leather Handbag. Order yours today and experience the perfect blend of elegance, durability, and practicality",
            price: 299.99,
            images: [
                'https://cdn.pixabay.com/photo/2016/11/23/18/12/bag-1854148_1280.jpg',
                'https://cdn.pixabay.com/photo/2017/10/01/07/28/leather-case-2804478_960_720.png'
            ],
            username: "server_initial"
        },
        {
            productId: 99,
            name: "Smart Fitness Tracker",
            description: "Discover the ultimate tool for achieving your fitness goals with our Smart Fitness Tracker. Designed to empower you with comprehensive health insights, this sleek device monitors your heart rate, steps, calories burned, and sleep patterns with precision. Seamlessly integrated with your smartphone, it provides real-time notifications and data syncing to help you stay motivated and informed throughout your fitness journey. Whether you're hitting the gym, going for a run, or simply monitoring your daily activity levels, our Smart Fitness Tracker is your reliable companion, offering versatility, accuracy, and a stylish addition to your active lifestyle. Stay on top of your health goals with the Smart Fitness Tracker. This sleek, lightweight device monitors your heart rate, steps, calories burned, and sleep patterns. Featuring a vibrant OLED display, it provides real-time stats and notifications from your phone. With a long-lasting battery life and waterproof design, it's perfect for any lifestyle. Track your progress, stay motivated, and achieve your fitness goals with the Smart Fitness Tracker. Stay connected, stay healthy, stay active.",
            price: 129.99,
            images: [
                'https://cdn.pixabay.com/photo/2021/11/03/05/33/fitness-band-6764739_640.jpg',
                'https://cdn.pixabay.com/photo/2019/12/21/10/29/fitness-band-4710206_640.jpg'
            ],
            username: "server_initial"
        },
        {
            productId: 99,
            name: "Professional Espresso Machine",
            description: "Experience the pinnacle of coffee craftsmanship with our Professional Espresso Machine, meticulously designed to satisfy the discerning palate of coffee aficionados and professional baristas alike. Engineered with precision and elegance, this machine embodies the art of espresso making, promising unparalleled quality and consistency with every brew. Crafted from premium materials and equipped with cutting-edge technology, our espresso machine is more than just a kitchen appliance—it's a gateway to a world of rich flavors and aromatic delights. Whether you're starting your day with a velvety smooth cappuccino or impressing guests with a robust espresso, this machine delivers barista-quality results that elevate your coffee experience to new heights.",
            price: 549.99,
            images: [
                'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg',
                'https://cdn.pixabay.com/photo/2017/08/01/00/57/coffee-2562435_1280.jpg'
            ],
            username: "server_initial"
        },
        {
            productId: 99,
            name: "Wireless Noise-Cancelling Headphones",
            description: "Immerse yourself in crystal-clear sound with our wireless noise-cancelling headphones. Perfect for travel and everyday use, these headphones offer up to 30 hours of battery life and intuitive touch controls. Enjoy superior comfort with plush ear cushions and an adjustable headband. Experience superior audio quality and uninterrupted listening with our Wireless Noise-Cancelling Headphones. Designed for discerning audiophiles and frequent travelers, these headphones feature advanced noise cancellation technology that blocks out ambient noise, allowing you to immerse yourself fully in your music, podcasts, or calls without distraction. Enjoy crisp highs, deep lows, and balanced mids through precision-engineered drivers, while the lightweight, ergonomic design ensures all-day comfort. With long battery life and seamless Bluetooth connectivity, our headphones offer convenience and performance wherever you go, making them an essential companion for both work and leisure.",
            price: 199.99,
            images: [
                'https://images.pexels.com/photos/8000600/pexels-photo-8000600.jpeg',
                'https://images.pexels.com/photos/8000616/pexels-photo-8000616.jpeg'
            ],
            username: "server_initial"
        },
        {
            productId: 99,
            name: "Organic Cotton Bedding Set",
            description: "Transform your bedroom into a sanctuary with our organic cotton bedding set. Made from 100% certified organic cotton, this set includes a duvet cover, fitted sheet, and pillowcases. Experience unparalleled softness and comfort while promoting sustainability. This bedding ensemble offers a soft and breathable feel that enhances your sleep experience night after night. Each set includes a cozy duvet cover, fitted sheet, and pillowcases, all dyed with eco-friendly, non-toxic dyes to ensure both safety and environmental responsibility. Elevate your bedroom with the natural elegance of organic cotton, where comfort meets conscientious living, ensuring a restful retreat that you can feel good about.",
            price: 179.99,
            images: [
                'https://cdn.pixabay.com/photo/2023/10/30/09/59/bed-8352408_1280.jpg',
                'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
            ],
            username: "server_initial"
        },
        {
            productId: 99,
            name: "Laptop Backpack with USB Charging Port",
            description: "Explore the perfect blend of functionality and style with our Laptop Backpack featuring a built-in USB charging port. Designed for modern professionals and travelers, this backpack combines spacious storage with convenient tech integration, ensuring you stay organized and connected on the go. Crafted from durable and water-resistant materials, our Laptop Backpack offers ample room for laptops up to 15 inches, tablets, notebooks, and other essentials. Multiple compartments and pockets provide efficient organization, with dedicated slots for pens, keys, and smaller devices, keeping everything easily accessible. The integrated USB charging port allows you to conveniently charge your devices while walking or commuting, utilizing your own power bank (not included) stored inside the backpack. This feature is complemented by a discreet headphone port for easy access to your favorite music or calls while keeping your devices secure. Designed with comfort in mind, padded shoulder straps and a breathable back panel ensure ergonomic support during long commutes or travel. The backpack's sleek, minimalist design fits seamlessly into professional or casual settings, offering versatility for work, school, or weekend getaways. Enhance your daily routine with the Laptop Backpack with USB Charging Port, where practicality meets modern convenience. Whether navigating city streets or embarking on a business trip, this backpack is your reliable companion, providing organized storage, tech-friendly features, and enduring comfort. Ideal for those who value both functionality and contemporary style, it's the essential accessory for today's dynamic lifestyle.",
            price: 89.99,
            images: [
                'https://cdn.pixabay.com/photo/2016/11/22/19/25/man-1850181_1280.jpg',
                'https://images.pexels.com/photos/3178938/pexels-photo-3178938.jpeg'
            ],
            username: "server_initial"
        },
        {
            productId: 99,
            name: "Luxury Cotton Towel Ensemble",
            description: "Introducing our Premium Towel Set of 4, designed to elevate your daily bathing experience with unmatched softness, absorbency, and durability. Crafted from luxurious 100% long-staple cotton, each towel in this set promises exceptional quality and a plush feel that caresses your skin. This set includes four meticulously crafted towels: two generously sized bath towels, perfect for wrapping yourself in luxury after a soothing shower or bath, one hand towel for quick drying and convenience, and one washcloth for gentle facial cleansing or daily use. Available in a variety of sophisticated colors to complement any bathroom decor, our towels feature a dense weave that enhances absorbency while maintaining a lightweight feel that dries quickly between uses. Their reinforced edges ensure longevity, withstanding regular washing and maintaining their softness wash after wash. Indulge in the luxury of our Premium Towel Set of 4, where everyday functionality meets premium quality. Whether treating yourself or looking for a thoughtful gift, these towels provide the perfect balance of comfort, style, and practicality, ensuring a spa-like experience in the comfort of your own home.",
            price: 129.99,
            images: [
                'https://cdn.pixabay.com/photo/2016/08/22/16/23/massage-therapy-1612308_1280.jpg',
                'https://images.pexels.com/photos/6430745/pexels-photo-6430745.jpeg'
            ],
            username: "server_initial"
        },
        {
            "productId": 99,
            "name": "Memory Foam Orthopedic Pillow",
            "description": "Experience unparalleled comfort and support with our Memory Foam Orthopedic Pillow. Designed to contour to the shape of your head and neck, this pillow promotes proper spinal alignment for a restful night's sleep. The hypoallergenic memory foam is infused with cooling gel particles to regulate temperature and keep you cool throughout the night. Ideal for back, side, and stomach sleepers, our pillow provides relief from neck and shoulder pain while enhancing relaxation and sleep quality.",
            "price": 59.99,
            "images": [
                "https://cdn.pixabay.com/photo/2016/12/08/03/53/pillow-1890940_1280.jpg",
                "https://images.pexels.com/photos/1768513/pexels-photo-1768513.jpeg"
            ],
            "username": "server_initial"
        },
        {
            "productId": 102,
            "name": "Professional Chef's Knife Set",
            "description": "Elevate your culinary skills with our Professional Chef's Knife Set. This premium set includes five essential knives crafted from high-carbon stainless steel, ensuring razor-sharp precision and durability. Ergonomically designed handles provide comfort and control, making slicing, dicing, and chopping effortless. Whether you're a seasoned chef or a passionate home cook, our knife set offers unmatched performance and versatility in the kitchen.",
            "price": 149.99,
            "images": [
                "https://loremflickr.com/500/500/knife?random=1",
                "https://loremflickr.com/500/500/knife?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 110,
            "name": "Classic Leather Briefcase",
            "description": "Make a statement with our Classic Leather Briefcase. Handcrafted from genuine leather, this timeless briefcase combines elegance with functionality. Featuring multiple compartments and a padded laptop sleeve, it accommodates essentials for work or travel. The adjustable shoulder strap ensures comfort, while the sleek design and durable hardware exude sophistication. Perfect for professionals who appreciate quality craftsmanship and refined style.",
            "price": 199.99,
            "images": [
                "https://loremflickr.com/500/500/briefcase?random=1",
                "https://loremflickr.com/500/500/briefcase?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 111,
            "name": "Modern Desk Lamp",
            "description": "Illuminate your workspace with our Modern Desk Lamp. Featuring a sleek design and adjustable arm, this lamp provides targeted lighting for reading, studying, or working. The energy-efficient LED bulb offers bright, yet soft illumination without glare. Perfect for home offices or dorm rooms, our desk lamp combines style and functionality to enhance your productivity.",
            "price": 49.99,
            "images": [
                "https://loremflickr.com/500/500/lamp?random=1",
                "https://loremflickr.com/500/500/lamp?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 112,
            "name": "Premium Yoga Mat",
            "description": "Achieve inner peace and comfort with our Premium Yoga Mat. Made from eco-friendly materials, this mat provides superior cushioning and support during yoga and meditation sessions. The non-slip surface ensures stability and prevents injuries, while the lightweight design allows for easy transport. Enhance your practice with our durable and stylish yoga mat, perfect for yogis of all levels.",
            "price": 39.99,
            "images": [
                "https://loremflickr.com/500/500/mat,mat/all?random=1",
                "https://loremflickr.com/500/500/yoga,mat/all?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 113,
            "name": "Digital Air Fryer",
            "description": "Enjoy guilt-free frying with our Digital Air Fryer. Featuring advanced air circulation technology, this fryer cooks crispy and delicious meals with little to no oil. The digital interface offers precise temperature control and preset cooking modes for effortless meal preparation. With a spacious basket and dishwasher-safe parts, our air fryer is perfect for healthy cooking without compromising on taste.",
            "price": 89.99,
            "images": [
                "https://loremflickr.com/500/500/airfryer?random=1",
                "https://loremflickr.com/500/500/airfryer?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 114,
            "name": "Vintage Record Player",
            "description": "Rediscover the rich sound of vinyl with our Vintage Record Player. Combining retro aesthetics with modern technology, this record player features built-in speakers and Bluetooth connectivity for wireless streaming. The belt-driven turntable ensures smooth playback, while the adjustable tonearm allows for precise needle placement. Perfect for music enthusiasts and collectors, our record player adds a nostalgic charm to any space.",
            "price": 249.99,
            "images": [
                "https://loremflickr.com/500/500/recordplayer?random=1",
                "https://loremflickr.com/500/500/recordplayer?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 115,
            "name": "Portable Espresso Maker",
            "description": "Savor rich espresso anytime, anywhere with our Portable Espresso Maker. Compact and lightweight, this espresso maker delivers authentic Italian coffee with a simple pumping mechanism. Compatible with Nespresso capsules, it offers convenience without compromising on flavor. Whether at home or on the go, our espresso maker ensures a perfect cup of espresso with every brew.",
            "price": 79.99,
            "images": [
                "https://loremflickr.com/500/500/espresso?random=1",
                "https://loremflickr.com/500/500/espresso?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 117,
            "name": "Smart Wi-Fi Thermostat",
            "description": "Control your home's temperature with our Smart Wi-Fi Thermostat. Compatible with Alexa and Google Assistant, this thermostat allows remote temperature adjustments via smartphone or voice commands. The intuitive interface provides energy-saving schedules and temperature alerts for efficient heating and cooling. With easy installation and compatibility with most HVAC systems, our smart thermostat offers comfort and convenience for modern living.",
            "price": 129.99,
            "images": [
                "https://loremflickr.com/500/500/thermostat?random=1",
                "https://loremflickr.com/500/500/thermostat?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 118,
            "name": "Outdoor Camping Tent",
            "description": "Experience the great outdoors with our Outdoor Camping Tent. Designed for durability and weather resistance, this tent accommodates up to four people comfortably. The waterproof fabric and sturdy poles ensure stability in various outdoor conditions, while the mesh windows and door provide ventilation and insect protection. Easy to set up and pack away, our camping tent is ideal for family camping trips or weekend getaways.",
            "price": 179.99,
            "images": [
                "https://loremflickr.com/500/500/campingtent?random=1",
                "https://loremflickr.com/500/500/campingtent?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 119,
            "name": "Digital Kitchen Scale",
            "description": "Achieve precise cooking and baking measurements with our Digital Kitchen Scale. Equipped with high-precision sensors, this scale accurately weighs ingredients from grams to pounds. The easy-to-read LCD display and touch-sensitive buttons ensure user-friendly operation. Compact and sleek, it's perfect for kitchens with limited counter space. Enhance your culinary skills with our reliable and versatile kitchen scale.",
            "price": 24.99,
            "images": [
                "https://loremflickr.com/500/500/kitchenscale?random=1",
                "https://loremflickr.com/500/500/kitchenscale?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 120,
            "name": "Automatic Pet Feeder",
            "description": "Ensure your pet is fed on schedule with our Automatic Pet Feeder. Programmable to dispense food at designated times, this feeder accommodates various portion sizes to suit your pet's dietary needs. The built-in voice recorder allows you to record personalized mealtime messages for your furry friend. With a sleek design and easy-to-clean components, our pet feeder provides convenience and peace of mind for pet owners.",
            "price": 59.99,
            "images": [
                "https://loremflickr.com/500/500/petfeeder?random=1",
                "https://loremflickr.com/500/500/petfeeder?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 121,
            "name": "Electric Toothbrush Kit",
            "description": "Upgrade your oral care routine with our Electric Toothbrush Kit. Featuring sonic technology, this toothbrush delivers powerful yet gentle brushing for cleaner teeth and healthier gums. The kit includes multiple brush heads with varying bristle strengths for personalized cleaning. With a long-lasting battery and compact charging base, our electric toothbrush kit ensures convenience and effective dental hygiene.",
            "price": 59.99,
            "images": [
                "https://loremflickr.com/500/500/toothbrush?random=1",
                "https://loremflickr.com/500/500/toothbrush?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 122,
            "name": "Artificial Indoor Plant",
            "description": "Add greenery to your space with our Artificial Indoor Plant. Realistic in appearance, this plant enhances any room without the need for watering or maintenance. The lifelike leaves and textured pot create a natural ambiance, perfect for home or office decor. Enhance your environment with our low-maintenance and stylish artificial plant.",
            "price": 29.99,
            "images": [
                "https://loremflickr.com/500/500/plant?random=1",
                "https://loremflickr.com/500/500/plant?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 123,
            "name": "Digital Camera Bundle",
            "description": "Capture life's moments with our Digital Camera Bundle. This versatile bundle includes a high-resolution digital camera, interchangeable lenses, and accessories for professional-quality photography. With advanced shooting modes and built-in Wi-Fi connectivity, it's easy to share and store your photos. Whether you're a novice or experienced photographer, our camera bundle offers everything you need for creative exploration.",
            "price": 399.99,
            "images": [
                "https://loremflickr.com/500/500/camera?random=1",
                "https://loremflickr.com/500/500/camera?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 124,
            "name": "Portable Solar Charger",
            "description": "Stay charged on the go with our Portable Solar Charger. Harnessing solar energy, this charger powers your devices anytime, anywhere. Compact and lightweight, it's perfect for outdoor adventures and emergencies. With multiple USB ports and a durable design, our solar charger ensures reliable power supply in any environment.",
            "price": 49.99,
            "images": [
                "https://loremflickr.com/500/500/solarcharger?random=1",
                "https://loremflickr.com/500/500/solarcharger?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 125,
            "name": "Gourmet Chocolate Gift Box",
            "description": "Indulge in decadent flavors with our Gourmet Chocolate Gift Box. Handcrafted by master chocolatiers, this assortment features a variety of premium chocolates, each with a unique filling and exquisite taste. Packaged in an elegant box, it's the perfect gift for chocolate lovers and special occasions.",
            "price": 29.99,
            "images": [
                "https://loremflickr.com/500/500/chocolate?random=1",
                "https://loremflickr.com/500/500/chocolate?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 126,
            "name": "Fitness Tracker Watch",
            "description": "Monitor your health and fitness with our Fitness Tracker Watch. Featuring heart rate monitoring, GPS tracking, and activity sensors, this watch provides real-time data to optimize your workouts. With a sleek design and customizable watch faces, it's both functional and stylish for everyday wear.",
            "price": 79.99,
            "images": [
                "https://loremflickr.com/500/500/fitnesstracker?random=1",
                "https://loremflickr.com/500/500/fitnesstracker?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 127,
            "name": "Retro Arcade Gaming Console",
            "description": "Relive classic gaming moments with our Retro Arcade Gaming Console. Pre-loaded with nostalgic games from the 80s and 90s, this console brings arcade excitement to your home. Featuring joystick and button controls, it's perfect for solo play or challenging friends. Rediscover timeless entertainment with our retro gaming console.",
            "price": 149.99,
            "images": [
                "https://loremflickr.com/500/500/arcade?random=1",
                "https://loremflickr.com/500/500/arcade?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 128,
            "name": "Smart Indoor Herb Garden",
            "description": "Grow fresh herbs year-round with our Smart Indoor Herb Garden. Equipped with LED grow lights and automated watering system, this garden kit ensures optimal growing conditions for herbs. The smart app allows you to monitor plant health and receive growth reminders. Enhance your culinary creations with homegrown herbs using our convenient and innovative herb garden.",
            "price": 69.99,
            "images": [
                "https://loremflickr.com/500/500/herbgarden?random=1",
                "https://loremflickr.com/500/500/herbgarden?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 129,
            "name": "Bluetooth Karaoke Microphone",
            "description": "Sing your heart out with our Bluetooth Karaoke Microphone. Featuring wireless connectivity and built-in speakers, this microphone delivers clear audio and echo effects for karaoke fun anywhere. Compatible with karaoke apps and music streaming, it's perfect for parties and performances.",
            "price": 34.99,
            "images": [
                "https://loremflickr.com/500/500/karaoke?random=1",
                "https://loremflickr.com/500/500/karaoke?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 130,
            "name": "Modern Wall Clock",
            "description": "Enhance your decor with our Modern Wall Clock. Featuring a minimalist design and silent quartz movement, this clock adds style and functionality to any room. Available in various colors, it complements both contemporary and classic interiors.",
            "price": 19.99,
            "images": [
                "https://loremflickr.com/500/500/wallclock?random=1",
                "https://loremflickr.com/500/500/wallclock?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 131,
            "name": "Portable Bluetooth Printer",
            "description": "Print photos and documents on the go with our Portable Bluetooth Printer. Compact and lightweight, this printer connects wirelessly to your devices for convenient printing anywhere. With high-resolution printing and long-lasting battery, it's perfect for travelers and professionals.",
            "price": 89.99,
            "images": [
                "https://loremflickr.com/500/500/printer?random=1",
                "https://loremflickr.com/500/500/printer?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 132,
            "name": "Electric Wine Opener Set",
            "description": "Open wine bottles effortlessly with our Electric Wine Opener Set. Featuring a sleek design and rechargeable base, this opener removes corks in seconds with the touch of a button. The set includes a foil cutter and aerator for enhanced wine tasting experience.",
            "price": 39.99,
            "images": [
                "https://loremflickr.com/500/500/wineopener?random=1",
                "https://loremflickr.com/500/500/wineopener?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 133,
            "name": "Adjustable Standing Desk",
            "description": "Promote productivity and health with our Adjustable Standing Desk. Ergonomically designed, this desk allows seamless transition between sitting and standing positions. The spacious work surface and sturdy frame ensure stability and comfort throughout the workday.",
            "price": 299.99,
            "images": [
                "https://loremflickr.com/500/500/standingdesk?random=1",
                "https://loremflickr.com/500/500/standingdesk?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 134,
            "name": "Smart Doorbell Camera",
            "description": "Enhance home security with our Smart Doorbell Camera. Equipped with HD video recording and two-way audio, this camera allows you to monitor visitors from your smartphone. With motion detection alerts and night vision, it ensures peace of mind whether you're at home or away.",
            "price": 179.99,
            "images": [
                "https://loremflickr.com/500/500/doorbell?random=1",
                "https://loremflickr.com/500/500/doorbell?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 135,
            "name": "Memory Foam Mattress Topper",
            "description": "Upgrade your sleep experience with our Memory Foam Mattress Topper. Designed for comfort and support, this topper conforms to your body shape to relieve pressure points and enhance relaxation. With breathable materials and hypoallergenic properties, it provides a restful night's sleep.",
            "price": 129.99,
            "images": [
                "https://loremflickr.com/500/500/mattresstopper?random=1",
                "https://loremflickr.com/500/500/mattresstopper?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 136,
            "name": "Robot Vacuum Cleaner",
            "description": "Keep your floors clean effortlessly with our Robot Vacuum Cleaner. Featuring smart navigation and powerful suction, this vacuum cleans carpets, hardwood, and tile floors with precision. Schedule cleaning sessions and control via smartphone for hands-free convenience.",
            "price": 249.99,
            "images": [
                "https://loremflickr.com/500/500/robotvacuum?random=1",
                "https://loremflickr.com/500/500/robotvacuum?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 137,
            "name": "Wireless Charging Pad",
            "description": "Charge your devices wirelessly with our Wireless Charging Pad. Compatible with Qi-enabled smartphones and accessories, this pad delivers fast and efficient charging without the need for cables. Sleek and compact, it's perfect for home or office use.",
            "price": 29.99,
            "images": [
                "https://loremflickr.com/500/500/wirelesscharger?random=1",
                "https://loremflickr.com/500/500/wirelesscharger?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 138,
            "name": "Personal Blender",
            "description": "Create nutritious smoothies and shakes with our Personal Blender. Compact yet powerful, this blender blends fruits, vegetables, and protein powders into delicious beverages. With detachable travel cups and dishwasher-safe parts, it's ideal for health enthusiasts on the go.",
            "price": 49.99,
            "images": [
                "https://loremflickr.com/500/500/blender?random=1",
                "https://loremflickr.com/500/500/blender?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 139,
            "name": "Portable Bluetooth Speaker",
            "description": "Enjoy high-quality sound anywhere with our Portable Bluetooth Speaker. Featuring stereo sound and deep bass, this speaker delivers immersive audio for music, podcasts, and calls. Compact and waterproof, it's perfect for outdoor adventures and indoor gatherings.",
            "price": 69.99,
            "images": [
                "https://loremflickr.com/500/500/bluetoothspeaker?random=1",
                "https://loremflickr.com/500/500/bluetoothspeaker?random=2"
            ],
            "username": "server_initial"
        },
        {
            "productId": 140,
            "name": "Camping Hammock",
            "description": "Relax outdoors with our Camping Hammock. Made from durable parachute nylon, this hammock offers comfort and support for camping trips or backyard lounging. Lightweight and compact, it's easy to pack and set up anywhere.",
            "price": 39.99,
            "images": [
                "https://loremflickr.com/500/500/hammock?random=1",
                "https://loremflickr.com/500/500/hammock?random=2"
            ],
            "username": "server_initial"
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

    await deleteAllCarts();
    log(0,'INITIALIZE','deleted all carts');
    await sleep(2000);
    await deleteAllReviews();
    log(0,'INITIALIZE','deleted all reviews');
    await sleep(2000);
    await deleteAllProducts();
    log(0,'INITIALIZE','deleted all products');
    await sleep(2000);
    await deleteAllUsers();
    log(0,'INITIALIZE','deleted all users');

    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        await saveUser(user)
        await sleep(1000);
    }
    
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        await makeProductListing(product.username,product.name,product.description,product.price,product.images);
        await sleep(1000);
    }

    for (let index = 0; index < reviews.length; index++) {
        const review = reviews[index];
        await createReview(review.title,review.description,review.rating,review.username,review.productId);
        await sleep(1000);   
    }
    log(0,'INITIALIZE','Initilization completed');
}


function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
