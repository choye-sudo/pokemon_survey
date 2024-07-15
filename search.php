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
}// 연결 확인, 실패 시 에러 메시지 출력

// GET 요청에서 테이블, 검색어, 조건 값을 가져옴
$table = isset($_GET['table']) ? $_GET['table'] : '';//테이블
$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';//검색어
$option_genre = isset($_GET['select-genre']) ? $_GET['select-genre'] : '';//조건-장르
$option_gen = isset($_GET['select-gen']) ? $_GET['select-gen'] : '';//조건-세대
$option_type = isset($_GET['select-type']) ? $_GET['select-type'] : '';//조건-포켓몬 타입

//테이블 및 컬럼 설정
$columns = [
    'pokemon_works' => ['pokemon_works.work_name', 'pokemon_works.genre_id', 'pokemon_works.gen', 'pokemon_works.work_img_url'],
    'pokemons' => ['pokemons.pokemon_name', 'pokemons.pokemon_num', 'pokemons.gen', 'pokemons.pokemon_img_url']
];
if (!array_key_exists($table, $columns)) {
    echo json_encode(['error' => 'Invalid table.']);
    $conn->close();
    exit();
}// get으로 받은 테이블명이 유효한지 확인, 유효하지 않으면 에러 메시지 출력 후 종료

//SQL 쿼리 작성
$sql = "SELECT " . implode(", ", $columns[$table]);

// Join 추가
if ($table == 'pokemon_works') {
    $sql .= ", genres.genre_name FROM $table JOIN genres ON pokemon_works.genre_id = genres.genre_id";
} else if ($table == 'pokemons') {
    $sql .= ", type_index.type_name FROM $table JOIN pokemons_types ON pokemons.pokemon_name = pokemons_types.pokemon_name";
    $sql .= " JOIN type_index ON pokemons_types.type_id = type_index.type_id";
} else {
    $sql .= " FROM $table";
}

$sql .= " WHERE " . $columns[$table][0] . " LIKE ?";

if($option_genre!=''){
    switch($option_genre){
        case 'genre_videogame':
            $sql .= " AND pokemon_works.genre_id = 1";
            break;
        case 'genre_anime':
            $sql .= " AND pokemon_works.genre_id = 2";
            break;
        case 'genre_cartoon':
            $sql .= " AND pokemon_works.genre_id = 3";
            break;
        case 'genre_movie':
            $sql .= " AND pokemon_works.genre_id = 4";
            break;
        case 'genre_etc':
            $sql .= " AND pokemon_works.genre_id = 5";
            break;
        default :
            break;
    }
}
if($option_gen!=''){
    switch($option_gen){
        case 'gen_1':
            $sql .= " AND " . $columns[$table][2] . " = 1";
            break;
        case 'gen_2':
            $sql .= " AND " . $columns[$table][2] . " = 2";
            break;
        case 'gen_3':
            $sql .= " AND " . $columns[$table][2] . " = 3";
            break;
        case 'gen_4':
            $sql .= " AND " . $columns[$table][2] . " = 4";
            break;
        case 'gen_5':
            $sql .= " AND " . $columns[$table][2] . " = 5";
            break;
        case 'gen_6':
            $sql .= " AND " . $columns[$table][2] . " = 6";
            break;
        case 'gen_7':
            $sql .= " AND " . $columns[$table][2] . " = 7";
            break;
        case 'gen_8':
            $sql .= " AND " . $columns[$table][2] . " = 8";
            break;
        case 'gen_9':
            $sql .= " AND " . $columns[$table][2] . " = 9";
            break;
        default :
            break;
    }
}
if($option_type!=''){
    switch($option_type){
        case 'normal':
            $sql .= " AND type_index.type_id = 1";
            break;
        case 'fire':
            $sql .= " AND type_index.type_id = 2";
            break;
        case 'water':
            $sql .= " AND type_index.type_id = 3";
            break;
        case 'grass':
            $sql .= " AND type_index.type_id = 4";
            break;
        case 'electric':
            $sql .= " AND type_index.type_id = 5";
            break;
        case 'ice':
            $sql .= " AND type_index.type_id = 6";
            break;
        case 'fighting':
            $sql .= " AND type_index.type_id = 7";
            break;
        case 'poison':
            $sql .= " AND type_index.type_id = 8";
            break;
        case 'ground':
            $sql .= " AND type_index.type_id = 9";
            break;
        case 'flying':
            $sql .= " AND type_index.type_id = 10";
            break;
        case 'psychic':
            $sql .= " AND type_index.type_id = 11";
            break;
        case 'bug':
            $sql .= " AND type_index.type_id = 12";
            break;
        case 'rock':
            $sql .= " AND type_index.type_id = 13";
            break;
        case 'ghost':
            $sql .= " AND type_index.type_id = 14";
            break;
        case 'dragon':
            $sql .= " AND type_index.type_id = 15";
            break;
        case 'dark':
            $sql .= " AND type_index.type_id = 16";
            break;
        case 'steel':
            $sql .= " AND type_index.type_id = 17";
            break;
        case 'fairy':
            $sql .= " AND type_index.type_id = 18";
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

// 결과가 있는지 확인한 후 연관 배열(키-값 쌍)로 저장
$results = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $results[] = $row;
    } 
} 
// 결과가 없을 경우 "No results found"를 배열로 저장
else {
    $results[] = ['error' => 'No results found'];
}

echo json_encode($results);// 결과를 JSON 형식으로 인코딩하여 반환

$stmt->close();
$conn->close();
// 연결 종료
?>
