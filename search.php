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

// GET 요청에서 테이블, 조건 및 검색어 가져오기
$table = isset($_GET['table']) ? $_GET['table'] : '';
$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
$condition = isset($_GET['condition']) ? $_GET['condition'] : '';

// 테이블과 컬럼 설정
$columns = [
    'pokemon_works' => ['work_id', 'work_name'],
    'pokemons' => ['pokemon_name', 'pokemon_name'],
    'types' => ['type_id', 'type_name']
];

if (!array_key_exists($table, $columns)) {
    echo "Invalid table.";
    $conn->close();
    exit();
}

$columnId = $columns[$table][0];
$columnName = $columns[$table][1];

// SQL 쿼리 작성
$sql = "SELECT $columnId, $columnName FROM $table WHERE $columnName LIKE ?";

if ($table === 'pokemon_works') {
    // 예시: 선택한 장르에 따라 추가 필터링
    if ($condition === 'genre_videogame') {
        $sql .= " AND genre_id = 1";
    } elseif ($condition === 'genre_anime') {
        $sql .= " AND genre_id = 2";
    } elseif ($condition === 'genre_cartoon') {
        $sql .= " AND genre_id = 3";
    } elseif ($condition === 'genre_movie') {
        $sql .= " AND genre_id = 4";
    } elseif ($condition === 'genre_etc') {
        $sql .= " AND genre_id = 5";
    }
}

$stmt = $conn->prepare($sql);
$searchTerm = '%' . $conn->real_escape_string($keyword) . '%';
$stmt->bind_param("s", $searchTerm);

// 쿼리 실행 및 결과 확인
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<div data-value='" . $row[$columnId] . "' onclick='selectResult(this, \"$inputId\")'>" . $row[$columnName] . "</div>";
    }
} else {
    echo "No results found.";
}

// 연결 종료
$stmt->close();
$conn->close();
?>
