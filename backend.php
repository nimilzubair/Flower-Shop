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

// Your existing code for fetching and returning data
?>


<?php
// Database connection details
$host = "localhost";
$username = "root";
$password = "";
$dbname = "flowershopsqldata";

// Connect to the database
$conn = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch products
$sql = "SELECT Product_ID as id, Pname as name, Price as price, Description as description, image FROM Products";
$result = $conn->query($sql);

// Prepare response
$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Set header for JSON response
header('Content-Type: application/json');
echo json_encode($products);

// Close the connection
$conn->close();
?>
