package com.myshop.config;

import com.myshop.entity.*;
import com.myshop.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final ReviewRepository reviewRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CouponRepository couponRepository,
                           ReviewRepository reviewRepository,
                           CartRepository cartRepository,
                           WishlistRepository wishlistRepository,
                           AddressRepository addressRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
        this.reviewRepository = reviewRepository;
        this.cartRepository = cartRepository;
        this.wishlistRepository = wishlistRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Initializing MYSHOP sample data...");

        seedUsers();
        seedCategories();
        seedProducts();
        seedCoupons();
        seedReviews();

        logger.info("MYSHOP sample data initialized successfully!");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@myshop.com")) {
            User admin = new User(
                    "admin@myshop.com",
                    passwordEncoder.encode("Admin@123"),
                    "System Administrator",
                    "+91 9876543210",
                    Role.ROLE_ADMIN
            );
            User savedAdmin = userRepository.save(admin);
            cartRepository.save(new Cart(savedAdmin));
            wishlistRepository.save(new Wishlist(savedAdmin));
            logger.info("Created Admin user: admin@myshop.com / Admin@123");
        }

        if (!userRepository.existsByEmail("user@myshop.com")) {
            User demoUser = new User(
                    "user@myshop.com",
                    passwordEncoder.encode("User@123"),
                    "Sahasra Rao",
                    "+91 9123456789",
                    Role.ROLE_USER
            );
            User savedUser = userRepository.save(demoUser);
            cartRepository.save(new Cart(savedUser));
            wishlistRepository.save(new Wishlist(savedUser));

            // Default Address for Demo User
            Address address = new Address(
                    savedUser,
                    "Sahasra Rao",
                    "+91 9123456789",
                    "Plot No. 42, Tech Boulevard, Jubilee Hills",
                    "Hyderabad",
                    "Telangana",
                    "500033",
                    true
            );
            addressRepository.save(address);
            logger.info("Created Demo user: user@myshop.com / User@123");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                    new Category("Fashion", "fashion", "Apparel, trendsetting outfits, and everyday essentials.", "Shirt", "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80"),
                    new Category("Electronics", "electronics", "Premium audio, visual devices, and personal computing.", "Tv", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"),
                    new Category("Footwear", "footwear", "Running shoes, sneakers, and elegant formal shoes.", "Footprints", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"),
                    new Category("Accessories", "accessories", "Luxury watches, leather wallets, bags, and eyewear.", "Watch", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"),
                    new Category("Home & Living", "home-living", "Minimalist decor, cozy lighting, and kitchenware.", "Home", "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"),
                    new Category("Beauty", "beauty", "Organic skincare, wellness kits, and fragrances.", "Sparkles", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"),
                    new Category("Sports", "sports", "Fitness gear, workout gear, yoga essentials, and apparel.", "Activity", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"),
                    new Category("Gadgets", "gadgets", "Smart home devices, chargers, drones, and wearables.", "Zap", "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80")
            );
            categoryRepository.saveAll(categories);
            logger.info("Seeded 8 categories");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            Category fashion = categoryRepository.findBySlug("fashion").orElse(null);
            Category electronics = categoryRepository.findBySlug("electronics").orElse(null);
            Category footwear = categoryRepository.findBySlug("footwear").orElse(null);
            Category accessories = categoryRepository.findBySlug("accessories").orElse(null);
            Category home = categoryRepository.findBySlug("home-living").orElse(null);
            Category beauty = categoryRepository.findBySlug("beauty").orElse(null);
            Category sports = categoryRepository.findBySlug("sports").orElse(null);
            Category gadgets = categoryRepository.findBySlug("gadgets").orElse(null);

            List<Product> products = Arrays.asList(
                    // Electronics
                    new Product(
                            "AuraPulse ANC Wireless Headphones",
                            "Flagship active noise-canceling headphones with 40-hour battery life, custom 40mm titanium drivers, spatial audio, and memory foam ear cushions for sublime all-day comfort.",
                            4499.0, 7999.0, electronics,
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
                            4.8, 142, 6, "audio,wireless,deal,anc", "AuraSound", null, "Midnight Black,Silver Mist,Graphite",
                            true, true
                    ),
                    new Product(
                            "SonicBoom 360 Portable Waterproof Speaker",
                            "Ultra-rugged IP67 waterproof Bluetooth speaker delivering room-filling 360-degree sound, punchy bass radiators, and 24 hours of non-stop playback with built-in powerbank.",
                            2499.0, 4299.0, electronics,
                            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
                            4.6, 98, 14, "audio,portable,speaker,waterproof", "SonicBoom", null, "Teal Green,Obsidian Black,Sunset Orange",
                            false, true
                    ),
                    new Product(
                            "AeroPro 4K Mechanical Gaming Keyboard",
                            "Aircraft-grade aluminum chassis with hot-swappable custom lubricated switches, per-key RGB backlighting, detachable magnetic wrist rest, and braided cable.",
                            3799.0, 5999.0, electronics,
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
                            4.7, 76, 12, "keyboard,gaming,mechanical,rgb", "AeroTech", null, "Matte Black,Retro White",
                            false, true
                    ),
                    new Product(
                            "Lumix Pro Studio USB-C Condenser Mic",
                            "Studio-quality 192kHz/24-bit recording condenser microphone with tap-to-mute sensor, cardioid pattern, zero-latency monitoring, and integrated pop filter.",
                            3199.0, 4999.0, electronics,
                            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
                            4.5, 62, 8, "audio,streaming,mic,podcast", "Lumix", null, "Dark Slate",
                            false, false
                    ),

                    // Footwear
                    new Product(
                            "Velocity Nitro Ultra Running Shoes",
                            "Engineered breathable mesh upper with responsive dual-density foam midsole, carbon-fiber composite stability plate, and high-traction rubber outsole designed for marathon comfort.",
                            3299.0, 5499.0, footwear,
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
                            4.9, 210, 4, "running,shoes,nitro,deal", "Velocity Athletics", "UK 7,UK 8,UK 9,UK 10,UK 11", "Crimson Red,Volt Yellow,Core Black",
                            true, true
                    ),
                    new Product(
                            "UrbanStrider Minimalist Leather Low-Tops",
                            "Handcrafted Italian calfskin leather sneakers with recycled rubber cupsole, ergonomic arch support, and timeless Scandinavian silhouette.",
                            2899.0, 4499.0, footwear,
                            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
                            4.7, 85, 15, "sneakers,leather,casual,minimal", "UrbanStrider", "UK 7,UK 8,UK 9,UK 10", "Chalk White,Camel Tan,Shadow Grey",
                            false, true
                    ),
                    new Product(
                            "Apex Trail Waterproof Hiking Boots",
                            "Rugged outdoor performance boots engineered with seam-sealed waterproof membranes, reinforced toe cap, Vibram Megagrip lugged outsole, and cushioned EVA midsole.",
                            4199.0, 6999.0, footwear,
                            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
                            4.8, 64, 9, "hiking,boots,outdoor,waterproof", "Apex Outdoor", "UK 8,UK 9,UK 10,UK 11", "Forest Khaki,Charcoal Black",
                            false, false
                    ),

                    // Fashion
                    new Product(
                            "Classic Cotton T-Shirt",
                            "Premium 100% combed ring-spun organic cotton crewneck t-shirt with reinforced ribbed collar, breathable pre-shrunk fabric, and a clean minimalist tailored fit.",
                            799.0, 1299.0, fashion,
                            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80",
                            4.7, 185, 25, "shirt,tshirt,cotton,casual,fashion,deal", "Avenue Minimal", "S,M,L,XL,XXL", "Pure White,Obsidian Black,Navy Blue,Olive Green",
                            true, true
                    ),
                    new Product(
                            "Oversized Casual Shirt",
                            "Contemporary drop-shoulder relaxed button-up shirt crafted from washed poplin cotton with chest patch pocket, mother-of-pearl buttons, and a curved hem drape.",
                            1499.0, 2499.0, fashion,
                            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
                            4.6, 92, 16, "shirt,oversized,casual,cotton,streetwear", "Koto Studio", "S,M,L,XL", "Sage Green,Sky Blue,Natural Ivory,Washed Black",
                            false, true
                    ),
                    new Product(
                            "Merino Wool Oversized Streetwear Hoodie",
                            "Heavyweight 450 GSM pure combed cotton and merino blend featuring a double-lined hood, relaxed drop-shoulder cut, kangaroo pocket, and ribbed cuffs.",
                            1899.0, 3299.0, fashion,
                            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
                            4.6, 128, 5, "hoodie,streetwear,winter,deal", "Koto Studio", "S,M,L,XL,XXL", "Oatmeal Beige,Washed Olive,Charcoal",
                            true, true
                    ),
                    new Product(
                            "Tailored Linen Blend Resort Shirt",
                            "Breezy, lightweight organic European flax linen shirt featuring a Cuban camp collar, mother-of-pearl buttons, and a relaxed tailored drape.",
                            1299.0, 2199.0, fashion,
                            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
                            4.5, 94, 20, "shirt,linen,resort,summer,casual", "Avenue Minimal", "S,M,L,XL", "Sage Green,Sky Blue,Natural Ivory",
                            false, true
                    ),
                    new Product(
                            "Selvedge Japanese Denim Jacket",
                            "14oz raw sanforized selvedge denim woven on vintage shuttle looms. Finished with custom brass hardware, dual chest pockets, and interior slip pockets.",
                            2999.0, 4999.0, fashion,
                            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
                            4.8, 88, 7, "denim,jacket,classic,selvedge", "Heritage Denim", "M,L,XL", "Deep Indigo,Vintage Washed",
                            false, true
                    ),

                    // Accessories
                    new Product(
                            "Chronos Bauhaus Automatic Watch",
                            "Precision Japanese automatic movement with 42-hour power reserve, scratch-resistant sapphire crystal, 316L surgical stainless steel casing, and Horween leather strap.",
                            5999.0, 9999.0, accessories,
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
                            4.9, 180, 5, "watch,luxury,automatic,deal", "Chronos Atelier", null, "Silver / White,Rose Gold / Black",
                            true, true
                    ),
                    new Product(
                            "Vanguard Polarized Aviator Sunglasses",
                            "Ultralight titanium frame with polarized anti-glare TAC lenses, 100% UV400 protection, hydrophobic coating, and spring-loaded hinges.",
                            1499.0, 2499.0, accessories,
                            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
                            4.6, 73, 18, "sunglasses,eyewear,polarized,titanium", "Vanguard Vision", null, "Gunmetal / Smoke,Gold / Amber",
                            false, true
                    ),
                    new Product(
                            "Nomad Full-Grain Leather Weekender Bag",
                            "Spacious 45L travel duffel crafted from vegetable-tanned full-grain buffalo leather. Features a dedicated shoe compartment, brass zippers, and padded shoulder strap.",
                            4799.0, 7999.0, accessories,
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
                            4.8, 59, 11, "leather,bag,travel,weekender", "Nomad Goods", null, "Cognac Brown,Dark Espresso",
                            false, false
                    ),

                    // Home & Living
                    new Product(
                            "AromaMist Ultrasonic Ceramic Diffuser",
                            "Sculptural ceramic ultrasonic essential oil diffuser with ambient warm-glow LED illumination, whisper-quiet operation, and dual timer modes.",
                            1699.0, 2799.0, home,
                            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                            4.7, 88, 3, "home,diffuser,aromatherapy,deal", "Zenith Living", null, "Matte White,Terracotta,Slate Grey",
                            true, true
                    ),
                    new Product(
                            "Nordic Ergonomic Adjustable Desk Lamp",
                            "Architectural aluminum desk light with seamless touch dimmer, color temperature control (2700K-6500K), USB-C fast charging base, and glare-free asymmetric optics.",
                            2199.0, 3499.0, home,
                            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80",
                            4.6, 52, 14, "lamp,desk,lighting,nordic", "Nordic Elements", null, "Brushed Brass,Matte Black",
                            false, true
                    ),
                    new Product(
                            "Artisan Japanese Stoneware Pour-Over Set",
                            "Hand-thrown ceramic dripper and 600ml glass carafe with walnut wood accents, stainless steel micro-mesh filter, and precision flow channels.",
                            1499.0, 2299.0, home,
                            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
                            4.8, 41, 16, "coffee,ceramics,pourover,kitchen", "Kurasu Kobo", null, "Matte Black,Sand Glaze",
                            false, false
                    ),

                    // Beauty
                    new Product(
                            "Radiance Renewal Squalane Botanical Face Oil",
                            "100% plant-derived squalane infused with rosehip seed oil, bakuchiol, and vitamin C. Locks in moisture, promotes cell turnover, and imparts a glass-skin glow.",
                            1199.0, 1999.0, beauty,
                            "https://images.unsplash.com/photo-1608248597359-25f0a2d590e2?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
                            4.7, 104, 22, "skincare,serum,glow,organic", "PureBotanica", "30ml,50ml", null,
                            false, true
                    ),
                    new Product(
                            "Artisan Cedar & Amber Eau De Parfum",
                            "Complex niche fragrance opening with crisp bergamot and pink pepper, flowing into smoky Virginia cedarwood, and settling into rich warm amber and tonka bean.",
                            2899.0, 4499.0, beauty,
                            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
                            4.9, 87, 8, "perfume,fragrance,cedar,luxury", "Maison Noire", "50ml,100ml", null,
                            false, true
                    ),

                    // Sports
                    new Product(
                            "AeroGrip Pro High-Density Yoga Mat",
                            "Eco-friendly 6mm natural tree rubber yoga mat with polyurethane grip top layer, laser-etched alignment system, and odor-resistant closed-cell construction.",
                            1599.0, 2699.0, sports,
                            "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
                            4.7, 115, 17, "yoga,fitness,mat,workout", "PranaFit", null, "Forest Green,Midnight Navy,Plum",
                            false, true
                    ),
                    new Product(
                            "TitanFlex Adjustable Smart Dumbbell Set",
                            "Quick-turn dial weight adjustment from 2.5kg to 24kg per dumbbell. Space-saving compact engineering with non-slip knurled grip handles and storage trays.",
                            6999.0, 11999.0, sports,
                            "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                            4.8, 48, 5, "fitness,gym,dumbbells,deal", "TitanFit", "Pair (24kg each)", "Matte Black",
                            true, true
                    ),

                    // Gadgets
                    new Product(
                            "HaloFit Smart Watch Series X with AMOLED",
                            "1.43-inch Always-On Retina AMOLED display, continuous PPG heart rate and SpO2 sensors, GPS tracking, 110+ sports modes, and 12-day battery life with IP68 rating.",
                            3499.0, 5999.0, gadgets,
                            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
                            4.7, 165, 5, "smartwatch,amoled,fitness,deal", "HaloTech", null, "Space Gray,Starlight Silver,Rose Gold",
                            true, true
                    ),
                    new Product(
                            "VoltCharge 3-in-1 Foldable Magnetic Station",
                            "Ultra-slim aircraft aluminum fast wireless charging station for Phone, Watch, and Earbuds simultaneously with 15W Qi2 certified magnetic charging.",
                            1999.0, 3299.0, gadgets,
                            "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?auto=format&fit=crop&w=800&q=80",
                            4.6, 92, 19, "charger,wireless,magsafe,portable", "VoltLabs", null, "Space Gray,Alpine White",
                            false, true
                    ),
                    new Product(
                            "SkyHawk 4K HDR Foldable Mini Drone",
                            "Under 249g pocket drone featuring a 3-axis mechanical gimbal, 4K/60fps HDR video, 10km HD transmission range, and 31 minutes max flight time per battery.",
                            14999.0, 22999.0, gadgets,
                            "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
                            4.9, 39, 4, "drone,camera,4k,aerial,deal", "SkyHawk Robotics", null, "Arctic White",
                            true, true
                    ),
                    new Product(
                            "ErgoDesk Carbon Fiber Smart Standing Desk Converter",
                            "Dual-tier pneumatic gas spring sit-stand workstation converter with wide monitor deck, ergonomic keyboard tray, and integrated cable routing.",
                            5499.0, 8999.0, home,
                            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
                            4.7, 33, 9, "desk,standing,ergonomic,office", "ErgoWork", null, "Carbon Black,Walnut",
                            false, false
                    ),
                    new Product(
                            "AeroGlow RGB Smart Ambience Light Bar Pair",
                            "Synchronized dual LED smart light bars with sound-reactive music visualizer mode, 16 million colors, app control, and desktop mount stands.",
                            1699.0, 2999.0, gadgets,
                            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
                            4.5, 68, 25, "rgb,lighting,gaming,smart", "LumiSync", null, "Matte Black",
                            false, true
                    )
            );

            productRepository.saveAll(products);
            logger.info("Seeded 25 rich realistic products with smart scores and deal radar!");
        }
    }

    private void seedCoupons() {
        if (couponRepository.count() == 0) {
            List<Coupon> coupons = Arrays.asList(
                    new Coupon("MYSHOP10", 10, 500.0, 499.0, "Get 10% instant discount on orders above ₹499 (Max ₹500)"),
                    new Coupon("SAVE20", 20, 1000.0, 999.0, "Special 20% savings on orders above ₹999 (Max ₹1000)"),
                    new Coupon("WELCOME15", 15, 400.0, 299.0, "Welcome gift: 15% OFF for new shoppers (Max ₹400)"),
                    new Coupon("FREESHIP", 100, 99.0, 399.0, "Free delivery on your order above ₹399")
            );
            couponRepository.saveAll(coupons);
            logger.info("Seeded sample coupons: MYSHOP10, SAVE20, WELCOME15, FREESHIP");
        }
    }

    private void seedReviews() {
        if (reviewRepository.count() == 0) {
            User demoUser = userRepository.findByEmail("user@myshop.com").orElse(null);
            if (demoUser != null) {
                List<Product> topProducts = productRepository.findAll();
                if (!topProducts.isEmpty()) {
                    Product p1 = topProducts.get(0);
                    Review r1 = new Review(p1, demoUser, 5.0, "Outstanding build quality and crystal clear sound. The active noise canceling cancels out airplane drone completely!");
                    reviewRepository.save(r1);

                    if (topProducts.size() > 4) {
                        Product p2 = topProducts.get(4);
                        Review r2 = new Review(p2, demoUser, 5.0, "Best running shoes I have owned. Super lightweight with unmatched springy cushioning. Highly recommend!");
                        reviewRepository.save(r2);
                    }
                }
                logger.info("Seeded sample verified reviews");
            }
        }
    }
}
