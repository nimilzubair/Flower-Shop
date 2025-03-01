-- Table: Admin
CREATE TABLE Admin (
    Admin_ID INT PRIMARY KEY,
    AName VARCHAR(255),
    AEmail VARCHAR(255),
    Role VARCHAR(50)
);

-- Table: Users
CREATE TABLE Users (
    User_ID INT PRIMARY KEY,
    Cname VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    Phone VARCHAR(15),
    Street VARCHAR(255),
    City VARCHAR(100),
    Zip VARCHAR(10)
);

-- Table: Category
CREATE TABLE Category (
    Category_ID INT PRIMARY KEY,
    Category_Name VARCHAR(255)
);

-- Table: Products
CREATE TABLE Products (
    Product_ID INT PRIMARY KEY,
    Pname VARCHAR(255),
    Price DECIMAL(10, 2),
    Description VARCHAR(255),
    Quantity INT,
    Discount DECIMAL(5, 2),
    Admin_ID INT,
    Category_ID INT,
    image varchar(500),
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID),
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID)
);

-- Table: Cart
CREATE TABLE Cart (
    Cart_ID INT PRIMARY KEY,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);

-- Table: Orders
CREATE TABLE Orders (
    Order_ID INT PRIMARY KEY,
    Order_Date DATE,
    TotalPrice DECIMAL(10, 2),
    User_ID INT,
    Admin_ID INT,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID),
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID)
);

-- Table: Inventory
CREATE TABLE Inventory (
    Inventory_ID INT PRIMARY KEY,
    QuantityInStock INT,
    LastRestockDate DATE,
    Product_ID INT,
    Admin_ID INT,
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID),
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID)
);

-- Table: Payments
CREATE TABLE Payments (
    Payment_ID INT PRIMARY KEY,
    PaymentStatus VARCHAR(50),
    PaymentMethod VARCHAR(50),
    Order_ID INT,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
);

-- Table: Category_Product (Many-to-many relationship between Category and Products)
CREATE TABLE Category_Product (
    Category_ID INT,
    Product_ID INT,
    PRIMARY KEY (Category_ID, Product_ID),
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID)
);

-- Table: Cart_Products
CREATE TABLE Cart_Products (
    Cart_ID INT,
    Product_ID INT,
    Quantity INT,
    PRIMARY KEY (Cart_ID, Product_ID),
    FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID)
);

-- Table: Order_Products
CREATE TABLE Order_Products (
    Order_ID INT,
    Product_ID INT,
    Quantity INT,
    PRIMARY KEY (Order_ID, Product_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID),
    FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID)
);

-- Insert data into Admin table
INSERT INTO Admin (Admin_ID, AName, AEmail, Role)
VALUES 
(1, 'Manager', 'manager@example.com', 'Manager');

-- Insert data into Category table
INSERT INTO Category (Category_ID, Category_Name)
VALUES (1, 'fresh flowers');
INSERT INTO Category (Category_ID, Category_Name)
VALUES (2, 'separate flowers');
INSERT INTO Category (Category_ID, Category_Name)
VALUES (3, 'accessories');

--products insert
-- Insert data into Products table
INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (1, 'Blooming Bliss', 200, 'A delightful bouquet of blooms', 50, 0.00, 1, 1, 'imagesforjsonfile/sunflower.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (2, 'Spring Splendor', 350, 'A vibrant collection of spring flowers', 30, 0.00, 1, 2, 'imagesforjsonfile/prod11.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (3, 'Charming Carnation', 150, 'A charming arrangement of carnations', 40, 0.00, 1, 2, 'imagesforjsonfile/prod3.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (4, 'Vibrant Bloss', 400, 'A stunning bouquet of vibrant flowers', 25, 0.00, 1, 1, 'imagesforjsonfile/prod8.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (5, 'Heavenly Hydrangeas', 100, 'Elegant hydrangeas for every occasion', 35, 0.00, 1, 3, 'imagesforjsonfile/prod5.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (6, 'Peaceful Peonies', 450, 'Soft and serene peonies', 20, 0.00, 1, 1, 'imagesforjsonfile/prod6.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (7, 'Sunny Sunflowers', 375, 'Bright and cheerful sunflowers', 30, 0.00, 1, 2, 'imagesforjsonfile/prod7.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (8, 'Mystical Roses', 800, 'Luxurious bouquet of roses', 15, 0.00, 1, 1, 'imagesforjsonfile/prod4.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (9, 'Elegant Liss', 550, 'Graceful and sophisticated lilies', 20, 0.00, 1, 3, 'imagesforjsonfile/prod9.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (10, 'Spring Splash', 500, 'A refreshing mix of spring flowers', 25, 0.00, 1, 1, 'imagesforjsonfile/prod10.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (11, 'Delicate Dais', 450, 'A tender bouquet of daisies', 20, 0.00, 1, 2, 'imagesforjsonfile/prod11.avif');

INSERT INTO Products (Product_ID, Pname, Price, Description, Quantity, Discount, Admin_ID, Category_ID, image)
VALUES (12, 'Splendid Joys', 600, 'An exquisite floral arrangement', 18, 0.00, 1, 1, 'imagesforjsonfile/prod12.avif');


USE flowershopsqldata;
INSERT INTO Inventory (Inventory_ID, QuantityInStock, LastRestockDate, Product_ID, Admin_ID)
VALUES 
(1, 50, '2024-11-30', 1, 1), -- Blooming Bliss
(2, 30, '2024-11-29', 2, 1), -- Spring Splendor
(3, 40, '2024-11-28', 3, 1), -- Charming Carnation
(4, 25, '2024-11-27', 4, 1), -- Vibrant Bloss
(5, 35, '2024-11-26', 5, 1), -- Heavenly Hydrangeas
(6, 20, '2024-11-25', 6, 1), -- Peaceful Peonies
(7, 30, '2024-11-24', 7, 1), -- Sunny Sunflowers
(8, 15, '2024-11-23', 8, 1), -- Mystical Roses
(9, 20, '2024-11-22', 9, 1), -- Elegant Liss
(10, 25, '2024-11-21', 10, 1), -- Spring Splash
(11, 20, '2024-11-20', 11, 1), -- Delicate Dais
(12, 18, '2024-11-19', 12, 1); -- Splendid Joys

