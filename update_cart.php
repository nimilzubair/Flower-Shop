<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Replace '*' with your specific domain for better security, e.g., "http://127.0.0.1:5503"
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Your existing checkout logic here

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$dbname = "flowershopsqldata";
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Retrieve the JSON request
$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'];
$name = $data['name'];
$price = $data['price'];
$quantity = $data['quantity'];
$image = $data['image'];

// Get Product_ID from product name
$product_query = "SELECT Product_ID FROM Products WHERE Pname = ?";
$stmt = $conn->prepare($product_query);
$stmt->bind_param("s", $name);
$stmt->execute();
$product_result = $stmt->get_result();
if ($product_result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Product not found"]);
    exit;
}
$product_row = $product_result->fetch_assoc();
$product_id = $product_row['Product_ID'];

// Assume a single user (replace with dynamic User_ID logic if needed)
$user_id = 1;

// Check for an existing cart or create a new one
$cart_query = "SELECT Cart_ID FROM cart WHERE User_ID = ?";
$stmt = $conn->prepare($cart_query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$cart_result = $stmt->get_result();

if ($cart_result->num_rows === 0) {
    $stmt = $conn->prepare("INSERT INTO cart (User_ID) VALUES (?)");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $cart_id = $stmt->insert_id;
} else {
    $cart_row = $cart_result->fetch_assoc();
    $cart_id = $cart_row['Cart_ID'];
}

// Perform actions based on the `action`
if ($action === 'add') {
    $stmt = $conn->prepare("INSERT INTO cart_products (Cart_ID, Product_ID, Quantity) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + ?");
    $stmt->bind_param("iiii", $cart_id, $product_id, $quantity, $quantity);
} elseif ($action === 'update') {
    $stmt = $conn->prepare("UPDATE cart_products SET Quantity = ? WHERE Cart_ID = ? AND Product_ID = ?");
    $stmt->bind_param("iii", $quantity, $cart_id, $product_id);
} elseif ($action === 'remove') {
    $stmt = $conn->prepare("DELETE FROM cart_products WHERE Cart_ID = ? AND Product_ID = ?");
    $stmt->bind_param("ii", $cart_id, $product_id);
} else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

// Execute query and respond
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => ucfirst($action) . " action completed"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}

$conn->close();
?>
