-- =============================================================================
-- Flyway Migration V2: Seed Categories, Products, and Initial Inventories
-- =============================================================================

-- Categories
INSERT INTO categories (id, name, slug, description, icon_name) VALUES 
(1, 'Electronics', 'electronics', 'Cutting-edge gadgets, audio gear, and personal devices.', 'laptop');
INSERT INTO categories (id, name, slug, description, icon_name) VALUES 
(2, 'Fashion & Apparel', 'fashion', 'Curated clothing, accessories, and everyday modern wear.', 'shirt');
INSERT INTO categories (id, name, slug, description, icon_name) VALUES 
(3, 'Home & Living', 'home-living', 'Modern home accessories, decor, and smart kitchen essentials.', 'home');
INSERT INTO categories (id, name, slug, description, icon_name) VALUES 
(4, 'Books & Media', 'books-media', 'Bestsellers, technical guides, and creative inspiration.', 'book');
INSERT INTO categories (id, name, slug, description, icon_name) VALUES 
(5, 'Sports & Fitness', 'sports-fitness', 'Gear and equipment for active, healthy living.', 'activity');

-- Products
INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(1, 1, 'ELEC-WH1000', 'Aura Wireless Noise-Canceling Headphones', 'Studio-quality sound with adaptive active noise cancellation, 40-hour battery life, and ultra-plush memory foam earcups.', 199.99, '/images/image_1.webp', TRUE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(2, 1, 'ELEC-SW900', 'Pulse GPS Smart Fitness Watch', 'Track workouts, heart rate, sleep quality, and GPS routes with up to 10 days of continuous battery life.', 149.50, '/images/image_1.webp', TRUE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(3, 1, 'ELEC-KB75', 'Zenith 75% Mechanical Keyboard', 'Hot-swappable mechanical switches, custom acoustic foam, and vibrant per-key RGB backlighting.', 89.00, '/images/image_1.webp', FALSE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(4, 2, 'FASH-BAG-VINT', 'Artisan Vintage Leather Weekender (Rare Limited Stock)', 'Handcrafted full-grain leather duffle bag with brass hardware. Only 1 unit remaining in current workshop batch.', 289.00, '/images/image_1.webp', TRUE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(5, 2, 'FASH-HOOD-BLK', 'Minimalist Heavyweight Cotton Hoodie', 'Custom 450 GSM organic French terry cotton with relaxed fit and double-stitched durability.', 74.00, '/images/image_1.webp', FALSE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(6, 2, 'FASH-SUN-01', 'Polarized Classic Tortoise Sunglasses', 'Handmade acetate frames with UV400 scratch-resistant polarized lenses.', 55.00, '/images/image_1.webp', FALSE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(7, 3, 'HOME-MUG-CER', 'Handmade Stoneware Ceramic Coffee Dripper & Mug', 'Artisanal speckled ceramic pour-over set designed for perfect extraction and heat retention.', 38.00, '/images/image_1.webp', TRUE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(8, 3, 'HOME-DIFF-US', 'Aroma Ultrasonic Essential Oil Diffuser', 'Whisper-quiet ambient diffuser with warm LED mood lighting and automatic shut-off safety.', 45.00, '/images/image_1.webp', FALSE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(9, 4, 'BOOK-SYS-DES', 'System Design Interview & Architecture Masterclass', 'Comprehensive guide to building resilient distributed systems and modern web architecture.', 42.50, '/images/image_1.webp', FALSE, TRUE);

INSERT INTO products (id, category_id, sku, title, description, price, image_url, is_featured, is_active) VALUES 
(10, 5, 'SPRT-MAT-PRO', 'Eco-Grip Alignment Yoga Mat', 'Non-slip natural tree rubber mat with laser-etched alignment guides and carrying strap.', 62.00, '/images/image_1.webp', FALSE, TRUE);

-- Inventories
-- Note: Product 4 has deliberately ONLY 1 item to test concurrency & out-of-stock validation!
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (1, 1, 50, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (2, 2, 35, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (3, 3, 20, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (4, 4, 1, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (5, 5, 40, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (6, 6, 25, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (7, 7, 30, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (8, 8, 15, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (9, 9, 100, 0, 0);
INSERT INTO inventories (id, product_id, quantity_available, quantity_reserved, version) VALUES (10, 10, 22, 0, 0);

-- Seed Demo Customer for 1-Click Testing
INSERT INTO customers (id, email, full_name, phone, address_line1, city, postal_code, is_guest) VALUES 
(1, 'john.tester@example.com', 'John Tester', '+1-555-0199', '123 Showcase Boulevard, Suite 400', 'San Francisco', '94105', FALSE);
