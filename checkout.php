<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5503");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$username = "root";
$password = "";
$dbname = "flowershopsqldata";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['fname'], $data['lname'], $data['cart'])) {
    echo json_encode(["success" => false, "message" => "Invalid input."]);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$fname = $conn->real_escape_string($data['fname']);
$lname = $conn->real_escape_string($data['lname']);
$street = $conn->real_escape_string($data['street']);
$city = $conn->real_escape_string($data['city']);
$zip = $conn->real_escape_string($data['zip']);
$paymentMethod = $conn->real_escape_string($data['paymentMethod']);
$cart = $data['cart'];

// Create or get user
$userQuery = "INSERT INTO Users (Cname, Email, Street, City, Zip)
              VALUES ('$fname $lname', '$email', '$street', '$city', '$zip')
              ON DUPLICATE KEY UPDATE Street='$street', City='$city', Zip='$zip'";

if (!$conn->query($userQuery)) {
    echo json_encode(["success" => false, "message" => "Error saving user data."]);
    exit;
}

$userId = $conn->insert_id ?: $conn->query("SELECT User_ID FROM Users WHERE Email='$email'")->fetch_assoc()['User_ID'];

// Create order
$orderQuery = "INSERT INTO Orders (Order_Date, TotalPrice, User_ID)
               VALUES (NOW(), 0, $userId)";

if (!$conn->query($orderQuery)) {
    echo json_encode(["success" => false, "message" => "Error creating order."]);
    exit;
}

$orderId = $conn->insert_id;

// Add products to order and deduct from inventory
$totalPrice = 0;
foreach ($cart as $item) {
    $productId = $conn->real_escape_string($item['name']);
    $quantity = (int)$item['quantity'];
    $price = (float)$item['price'];

    $totalPrice += $quantity * $price;

    // Add product to order
    $orderProductQuery = "INSERT INTO Order_Products (Order_ID, Product_ID, Quantity)
                          VALUES ($orderId, '$productId', $quantity)";
    $conn->query($orderProductQuery);

    // Deduct from inventory
    $inventoryUpdateQuery = "UPDATE Inventory 
                             SET QuantityInStock = QuantityInStock - $quantity 
                             WHERE Product_ID = '$productId'";
    $conn->query($inventoryUpdateQuery);
}

// Update total price
$conn->query("UPDATE Orders SET TotalPrice=$totalPrice WHERE Order_ID=$orderId");

// Add payment details
$conn->query("INSERT INTO Payments (Order_ID, PaymentMethod, PaymentStatus)
              VALUES ($orderId, '$paymentMethod', 'Pending')");

echo json_encode(["success" => true, "message" => "Order placed successfully."]);
$conn->close();
?>
