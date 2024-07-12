<?php
// 데이터베이스 연결 정보
$servername = "localhost:3306";
$username = "root";
$password = "dPdmsdk?0928";
$dbname = "pokemon_database";

// 데이터베이스 연결
$conn = new mysqli($servername, $username, $password, $dbname);

// 연결 확인
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 폼에서 전송된 데이터 가져오기
$username = $_POST['username'];
$firstwork = $_POST['firstwork'];
$favwork = $_POST['favwork'];
$favpokemon = $_POST['favpokemon'];
$favtype = $_POST['favtype']; // JSON 형태로 전송된 값

// SQL 쿼리 작성
$sql = "INSERT INTO survey_results (user_name, first_work, fav_work, fav_pokemon, fav_type) 
VALUES (?, ?, ?, ?, ?)";

// Prepared statement 사용
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $username, $firstwork, $favwork, $favpokemon, $favtype);

// 쿼리 실행 및 결과 확인
if ($stmt->execute() === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

// 연결 종료
$stmt->close();
$conn->close();
?>
