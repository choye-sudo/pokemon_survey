<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pokemon_database";

// 데이터베이스 연결 정보 설정

$conn = new mysqli($servername, $username, $password, $dbname);

// 데이터베이스에 연결

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// 연결 확인, 실패 시 에러 메시지 출력

$table = isset($_GET['table']) ? $_GET['table'] : '';
$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
$condition = isset($_GET['condition']) ? $_GET['condition'] : '';
// GET 요청에서 테이블, 검색어, 조건 값을 가져옴

$columns = [
    'pokemon_works' => ['work_id', 'work_name'],
    'pokemons' => ['pokemon_name', 'pokemon_name'],
    'types' => ['type_id', 'type_name']
];
// 테이블과 컬럼 설정

if (!array_key_exists($table, $columns)) {
    echo "Invalid table.";
    $conn->close();
    exit();
}
// 테이블이 유효한지 확인, 유효하지 않으면 에러 메시지 출력 후 종료

$columnId = $columns[$table][0];
$columnName = $columns[$table][1];
// 컬럼 ID와 이름을 설정

$sql = "SELECT $columnId, $columnName FROM $table WHERE $columnName LIKE ?";
// SQL 쿼리 작성

if ($table === 'pokemon_works') {
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
// 테이블이 'pokemon_works'일 경우 조건에 따라 필터링 추가

$stmt = $conn->prepare($sql);
$searchTerm = '%' . $conn->real_escape_string($keyword) . '%';
$stmt->bind_param("s", $searchTerm);
// SQL 쿼리를 준비하고, 검색어를 바인딩

$stmt->execute();
$result = $stmt->get_result();
// 쿼리를 실행하고 결과를 가져옴

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<div data-value='" . $row[$columnId] . "' onclick='selectResult(this, \"$table\")'>" . $row[$columnName] . "</div>";
    }
} else {
    echo "No results found.";
}
// 결과가 있을 경우 각 결과를 div로 출력하고, 클릭 시 selectResult 함수 호출. 결과가 없을 경우 "No results found." 출력

$stmt->close();
$conn->close();
// 연결 종료
?>
