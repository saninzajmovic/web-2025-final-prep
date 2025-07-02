<?php

class ExamDao {

    private $conn;

    /**
     * constructor of dao class
     */
    public function __construct(){
        try {
          /** TODO
           * List parameters such as servername, username, password, schema. Make sure to use appropriate port
           */
          $host = 'localhost';
          $dbName = 'webfinal';
          $username = 'root';
          $password = 'root';

          /** TODO
           * Create new conn
           */
          $this->conn = new PDO(
            "mysql:host=" . $host . ";dbname=" . $dbName,
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
          );
          echo "Connected successfully";
        } catch(PDOException $e) {
          echo "conn failed: " . $e->getMessage();
        }
    }

    /** TODO
     * Implement DAO method used to get customer information
     */
    public function get_customers(){
      $stmt = $this->conn->prepare("SELECT * FROM customers");
      $stmt->execute();
      return $stmt->fetchAll();
    }

    /** TODO
     * Implement DAO method used to get customer meals
     */
    public function get_customer_meals($customer_id) {
      $stmt = $this->conn->prepare("SELECT * FROM meals WHERE customer_id = :customer_id");
      $stmt->bindParam(':customer_id', $customer_id);
      $stmt->execute();
      return $stmt->fetchAll();
    }

    /** TODO
     * Implement DAO method used to save customer data
     */
    public function add_customer($data){
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $stmt = $this->conn->prepare("INSERT INTO customers ($columns) VALUES ($placeholders)");
        
        if($stmt->execute($data)) {
            // Get the newly inserted customer
            $customer_id = $this->conn->lastInsertId();
            $stmt = $this->conn->prepare("SELECT * FROM customers WHERE id = :id");
            $stmt->bindParam(':id', $customer_id);
            $stmt->execute();
            return $stmt->fetch();
        }
        return false;
    }

    /** TODO
     * Implement DAO method used to get foods report
     */
    public function get_foods_report($page = 1, $perPage = 10) {
      $offset = ($page - 1) * $perPage;
      
      $stmt = $this->conn->prepare("
          SELECT 
              f.id,
              f.name,
              f.brand,
              f.image_url as image,
              MAX(CASE WHEN n.name = 'Energy' THEN fn.quantity ELSE 0 END) as energy,
              MAX(CASE WHEN n.name = 'Protein' THEN fn.quantity ELSE 0 END) as protein,
              MAX(CASE WHEN n.name = 'Fat' THEN fn.quantity ELSE 0 END) as fat,
              MAX(CASE WHEN n.name = 'Fiber' THEN fn.quantity ELSE 0 END) as fiber,
              MAX(CASE WHEN n.name = 'Carbohydrates' THEN fn.quantity ELSE 0 END) as carbs
          FROM foods f
          LEFT JOIN food_nutrients fn ON f.id = fn.food_id
          LEFT JOIN nutrients n ON fn.nutrient_id = n.id
          GROUP BY f.id, f.name, f.brand, f.image_url
          LIMIT :limit OFFSET :offset
      ");
      
      $stmt->bindValue(':limit', (int)$perPage, PDO::PARAM_INT);
      $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
      $stmt->execute();
      
      return $stmt->fetchAll();
    }
}
?>
