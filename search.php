<?php
// 데이터베이스 연결 정보 설정
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pokemon_database";

// 데이터베이스에 연결
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}// 연결 확인, 실패 시 에러 메시지 출력

// GET 요청에서 테이블, 검색어, 조건 값을 가져옴
$table = isset($_GET['table']) ? $_GET['table'] : '';//테이블
$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';//검색어
$option_genre = isset($_GET['select-genre']) ? $_GET['select-genre'] : '';//조건-장르
$option_gen = isset($_GET['select-gen']) ? $_GET['select-gen'] : '';//조건-세대
$option_type = isset($_GET['select-type']) ? $_GET['select-type'] : '';//조건-포켓몬 타입

//테이블 및 컬럼 설정
$columns = [
    'pokemon_works' => ['work_name', 'genre_id', 'gen', 'work_img_url'],
    'genres' => ['genre_id', 'genre_name'],
    'pokemons' => ['pokemon_name', 'pokemon_num', 'gen', 'pokemon_img_url'],
    'types' => ['type_id', 'type_name'],
    'pokemons_types' => ['pokemon_name', 'type_id']
];
if (!array_key_exists($table, $columns)) {
    echo "Invalid table.";
    $conn->close();
    exit();
}// get으로 받은 테이블명이 유효한지 확인, 유효하지 않으면 에러 메시지 출력 후 종료

//SQL 쿼리 작성
$sql = "SELECT " . implode(", ", $columns[$table]) . " FROM $table";

//pokemons 테이블을 탐색해야 하는 경우, join 추가
if ($table == 'pokemons' && $option_type != '') {
    $sql .= " JOIN pokemons_types ON pokemons.pokemon_name = pokemons_types.pokemon_name";
    $sql .= " JOIN types ON pokemons_types.type_id = types.type_id";
}

$sql .= " WHERE " . $columns[$table][0] . " LIKE ?";

if($option_genre!=''){
    switch($option_genre){
        case 'genre_videogame':
            $sql .= " AND genre_id = 1";
            break;
        case 'genre_anime':
            $sql .= " AND genre_id = 2";
            break;
        case 'genre_cartoon':
            $sql .= " AND genre_id = 3";
            break;
        case 'genre_movie':
            $sql .= " AND genre_id = 4";
            break;
        case 'genre_etc':
            $sql .= " AND genre_id = 5";
            break;
        default :
            break;
    }
}
if($option_gen!=''){
    switch($option_gen){
        case 'gen_1':
            $sql .= " AND gen = 1";
            break;
        case 'gen_2':
            $sql .= " AND gen = 2";
            break;
        case 'gen_3':
            $sql .= " AND gen = 3";
            break;
        case 'gen_4':
            $sql .= " AND gen = 4";
            break;
        case 'gen_5':
            $sql .= " AND gen = 5";
            break;
        case 'gen_6':
            $sql .= " AND gen = 6";
            break;
        case 'gen_7':
            $sql .= " AND gen = 7";
            break;
        case 'gen_8':
            $sql .= " AND gen = 8";
            break;
        case 'gen_9':
            $sql .= " AND gen = 9";
            break;
        default :
            break;
    }
}
if($option_type!=''){
    switch($option_type){
        case 'normal':
            $sql .= " AND type_id = 1";
            break;
        case 'fire':
            $sql .= " AND type_id = 2";
            break;
        case 'water':
            $sql .= " AND type_id = 3";
            break;
        case 'grass':
            $sql .= " AND type_id = 4";
            break;
        case 'electric':
            $sql .= " AND type_id = 5";
            break;
        case 'ice':
            $sql .= " AND type_id = 6";
            break;
        case 'fighting':
            $sql .= " AND type_id = 7";
            break;
        case 'poison':
            $sql .= " AND type_id = 8";
            break;
        case 'ground':
            $sql .= " AND type_id = 9";
            break;
        case 'flying':
            $sql .= " AND type_id = 10";
            break;
        case 'psychic':
            $sql .= " AND type_id = 11";
            break;
        case 'bug':
            $sql .= " AND type_id = 12";
            break;
        case 'rock':
            $sql .= " AND type_id = 13";
            break;
        case 'ghost':
            $sql .= " AND type_id = 14";
            break;
        case 'dragon':
            $sql .= " AND type_id = 15";
            break;
        case 'dark':
            $sql .= " AND type_id = 16";
            break;
        case 'steel':
            $sql .= " AND type_id = 17";
            break;
        case 'fairy':
            $sql .= " AND type_id = 18";
            break;
        default :
            break;
    }
}

// SQL 쿼리를 준비하고, 검색어를 바인딩
$stmt = $conn->prepare($sql);
$searchTerm = '%' . $keyword . '%';
$stmt->bind_param("s", $searchTerm);

// 쿼리를 실행하고 결과를 가져옴
$stmt->execute();
$result = $stmt->get_result();

$results = [];
// 결과가 있을 경우 각 결과를 배열로 저장
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $results[] = ['text' => $row[$columns[$table][0]], 'value' => $row[$columns[$table][1]]];
    } 
} 
// 결과가 없을 경우 "No results found"를 배열로 저장
else {
    $results[] = ['text' => 'No results found', 'value' => ''];
}

echo json_encode($results);// 결과를 JSON 형식으로 인코딩하여 반환

$stmt->close();
$conn->close();
// 연결 종료
?>
