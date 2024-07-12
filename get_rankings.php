<?php
// 데이터베이스 연결 정보 설정
$servername = "localhost:3306";
$username = "root";
$password = "dPdmsdk?0928";
$dbname = "pokemon_database";

// 데이터베이스에 연결
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 가장 많은 사람이 선택한 처음 접한 작품
$firstworkQuery = "SELECT firstwork, COUNT(firstwork) as count FROM survey_results GROUP BY firstwork ORDER BY count DESC LIMIT 1";
$firstworkResult = $conn->query($firstworkQuery);
$firstwork = $firstworkResult->fetch_assoc()['firstwork'];

// 가장 많은 사람이 선택한 가장 좋아하는 작품
$favworkQuery = "SELECT favwork, COUNT(favwork) as count FROM survey_results GROUP BY favwork ORDER BY count DESC LIMIT 1";
$favworkResult = $conn->query($favworkQuery);
$favwork = $favworkResult->fetch_assoc()['favwork'];

// 가장 많은 사람이 선택한 가장 좋아하는 타입
$favtypeQuery = "SELECT favtype, COUNT(favtype) as count FROM survey_results GROUP BY favtype ORDER BY count DESC LIMIT 1";
$favtypeResult = $conn->query($favtypeQuery);
$favtype = $favtypeResult->fetch_assoc()['favtype'];

// 가장 많은 사람이 선택한 가장 좋아하는 포켓몬
$favpokemonQuery = "SELECT favpokemon, COUNT(favpokemon) as count FROM survey_results GROUP BY favpokemon ORDER BY count DESC LIMIT 1";
$favpokemonResult = $conn->query($favpokemonQuery);
$favpokemon = $favpokemonResult->fetch_assoc()['favpokemon'];

// 결과를 배열로 저장
$rankings = [
    'firstwork' => $firstwork,
    'favwork' => $favwork,
    'favtype' => $favtype,
    'favpokemon' => $favpokemon
];

echo json_encode($rankings); // 결과를 JSON 형식으로 인코딩하여 반환

$conn->close(); // 연결 종료
?>