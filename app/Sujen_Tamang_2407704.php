<?php
function connect_database($server,$username, $password, $db){
    $connection = null;
    try{
        $connection = new mysqli($server,$username, $password, $db);
        if ($connection -> connect_error){
            echo '{"error": "Database connection failed"}';
        }
        return $connection;
    }catch(Exception $th){
        return null;
    }
}

function get_weather_data($connection,$cityname){
    try{
        $result = $connection -> query('Select * from '.$cityname.' WHERE city = "'.$cityname.'";');

        if($result){
            $data = $result -> fetch_all(MYSQLI_ASSOC);
            return $data;
        } else{
            return null;
        }
    }catch (Exception $th){
        return null;
    }
}

function insertData($connection, $cityname, $json) {
    // Ensure a valid connection is provided
    if ($connection === null) {
        echo "No valid database connection.";
        return;
    }
    // it will decode the JSON data
    $data = json_decode($json, true);
    // Check if decoding was successfulneeds
    if ($data === null) {
        return;
    }
    // Extract values from the decoded JSON data
    $sanitizedCityName = mysqli_real_escape_string($connection, $cityname);
    $dayOfWeek = date('D');
    $dayAndDate = date('M j, Y');
    $cityname = $data['name'];
    $imgcode = $data['weather'][0]['icon'];
    $humidity =$data['main']['humidity'];
    $pressure =$data['main']['pressure'];
    $wind_speed = $data['wind']['speed'];
    $temperature = $data['main']['temp'];
    function tableExists($connection, $tableName) {
        $result = $connection->query("SHOW TABLES LIKE '$tableName'");
        return $result->num_rows > 0;
    }
    
    if (!tableExists($connection, $sanitizedCityName)) {
        echo "Table does not exist.";
        return;
    }
    $existing_sql = "SELECT * FROM $sanitizedCityName WHERE day_Of_Week = '$dayOfWeek'";
    $existing_result = $connection->query($existing_sql);

    if ($existing_result->num_rows === 0) {
        $sql_insert_data = "INSERT INTO $sanitizedCityName (city, imgcode, day_Of_Week, day_And_Date, windspeed, temperature, pressure, humidity) 
                    VALUES ('$cityname', '$imgcode','$dayOfWeek','$dayAndDate',$wind_speed, $temperature, $pressure, $humidity)";

        if ($connection->query($sql_insert_data) !== TRUE) {
            echo "Error inserting data: " . $connection->error;
        }
    } else {
        $update_sql = "UPDATE $sanitizedCityName 
            SET 
            city = '$cityname',
            imgcode = '$imgcode',
            windspeed = $wind_speed,
            temperature = $temperature,
            pressure = $pressure,
            humidity = $humidity,
            day_And_Date = '$dayAndDate'
            WHERE day_Of_Week = '$dayOfWeek'";
        if ($connection->query($update_sql) !== TRUE) {
            echo "Error updating data: " . $connection->error;
        }
    }
    
}

function fetch_data($cityname) {
    try {
        $url = 'https://api.openweathermap.org/data/2.5/weather?q=' . $cityname . '&appid=64fad0569c784e6fd2f00d51382ed513&units=metric';
        $datastr = file_get_contents($url);
        $data = json_decode($datastr, true);
        return $data;
    } catch (Exception $th) {
        return null;
    }
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$cityname = isset($_GET["cityname"]) ? $_GET["cityname"] : "Balurghat";
$data = fetch_data($cityname);
$json = json_encode($data, true );

$connection = connect_database("localhost", "root", "", "weatherappdata");


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "weatherappdata";

// Create or connect to the database
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Create or select the database
$queryCreateDatabase = 'CREATE DATABASE IF NOT EXISTS $dbname';
if ($connection->query($queryCreateDatabase) === TRUE) {
    // echo "Database created or already exists successfully\n";
} else {
    die("Error creating database: " . $connection->error);
}

// Select the created or existing database
$connection->select_db($dbname);

// Check for errors
if ($connection->error) {
    die("Database selection failed: " . $connection->error);
}

// Create the weatherdata table
$connection ->query('
CREATE TABLE IF NOT EXISTS '.$cityname.' (
    city varchar(50),
    imgcode varchar(50),
    dayOfWeek varchar(20),
    dayAndDate varchar(30),
    windspeed int(10),
    temperature int(10),
    pressure int(10),
    humidity int(10)
);');


insertData($connection, $cityname, $json);

$contents = get_weather_data($connection, $cityname);
echo json_encode($contents);

?>