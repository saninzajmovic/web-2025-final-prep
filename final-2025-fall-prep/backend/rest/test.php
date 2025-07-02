<?php
echo "PHP is working!";
echo "<br>";
echo "Current directory: " . __DIR__;
echo "<br>";
echo "File exists check:";
echo "<br>";
echo "index.php exists: " . (file_exists('index.php') ? 'YES' : 'NO');
echo "<br>";
echo "dao/ExamDao.php exists: " . (file_exists('dao/ExamDao.php') ? 'YES' : 'NO');
echo "<br>";
echo "routes/ExamRoutes.php exists: " . (file_exists('routes/ExamRoutes.php') ? 'YES' : 'NO');
echo "<br>";
echo "services/ExamService.php exists: " . (file_exists('services/ExamService.php') ? 'YES' : 'NO');

// Test autoload
echo "<br><br>Testing autoload:";
if (file_exists('../vendor/autoload.php')) {
    echo "<br>Vendor autoload found!";
    require '../vendor/autoload.php';
    echo "<br>Autoload loaded successfully!";
} else {
    echo "<br>ERROR: Vendor autoload NOT found!";
}
?>