<?php
// 오류 보고 설정
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 데이터베이스 연결 정보 설정
$servername = "pokedb.c5gwy6uo2j33.us-west-2.rds.amazonaws.com"; // 로컬 환경 : localhost:3306
$username = "root";
$password = "dPdmsdk?0928";
$dbname = "pokemon_database";

// 데이터베이스에 연결
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// 가장 많은 사람이 선택한 처음 접한 작품
$firstworkQuery = "SELECT first_work, work_img_url, COUNT(first_work) as count FROM survey_results JOIN pokemon_works ON survey_results.first_work = pokemon_works.work_name GROUP BY first_work ORDER BY count DESC LIMIT 1";
$firstworkResult = $conn->query($firstworkQuery);
if (!$firstworkResult) {
    die(json_encode(["error" => "Query failed: " . $conn->error]));
}
$firstworkData = $firstworkResult->fetch_assoc();
$firstwork = $firstworkData['first_work'];
$firstwork_img_url = $firstworkData['work_img_url'];

// 가장 많은 사람이 선택한 가장 좋아하는 작품
$favworkQuery = "SELECT fav_work, work_img_url, COUNT(fav_work) as count FROM survey_results JOIN pokemon_works ON survey_results.fav_work = pokemon_works.work_name GROUP BY fav_work ORDER BY count DESC LIMIT 1";
$favworkResult = $conn->query($favworkQuery);
if (!$favworkResult) {
    die(json_encode(["error" => "Query failed: " . $conn->error]));
}
$favworkData = $favworkResult->fetch_assoc();
$favwork = $favworkData['fav_work'];
$favwork_img_url = $favworkData['work_img_url'];

// 가장 많은 사람이 선택한 가장 좋아하는 타입
$favtypeQuery = "SELECT fav_type FROM survey_results";
$favtypeResult = $conn->query($favtypeQuery);
if (!$favtypeResult) {
    die(json_encode(["error" => "Query failed: " . $conn->error]));
}
$typeCounts = [];
while ($row = $favtypeResult->fetch_assoc()) {
    $favtypes = json_decode($row['fav_type'], true);
    foreach ($favtypes as $type) {
        if (isset($typeCounts[$type])) {
            $typeCounts[$type]++;
        } else {
            $typeCounts[$type] = 1;
        }
    }
}
arsort($typeCounts); // typeCounts 내림차순 정렬
$favtypeId = key($typeCounts); // 가장 많은 사람이 선택한 타입 id
$favtypenameQuery = "SELECT type_name FROM type_index WHERE type_id = $favtypeId"; // 가장 많은 사람이 선택한 타입 id를 활용, 타입 이름을 가져오는 쿼리 작성
$favtypenameResult = $conn->query($favtypenameQuery);
if (!$favtypenameResult) {
    die(json_encode(["error" => "Query failed: " . $conn->error]));
}
$favtype = $favtypenameResult->fetch_assoc()['type_name'];

// 가장 많은 사람이 선택한 가장 좋아하는 포켓몬
$favpokemonQuery = "SELECT fav_pokemon, pokemon_img_url, COUNT(fav_pokemon) as count FROM survey_results JOIN pokemons ON survey_results.fav_pokemon = pokemons.pokemon_name GROUP BY fav_pokemon ORDER BY count DESC LIMIT 1";
$favpokemonResult = $conn->query($favpokemonQuery);
if (!$favpokemonResult) {
    die(json_encode(["error" => "Query failed: " . $conn->error]));
}
$favpokemonData = $favpokemonResult->fetch_assoc();
$favpokemon = $favpokemonData['fav_pokemon'];
$favpokemon_img_url = $favpokemonData['pokemon_img_url'];

// 결과를 배열로 저장
$rankings = [
    'firstwork' => $firstwork,
    'firstwork_img_url' => $firstwork_img_url,
    'favwork' => $favwork,
    'favwork_img_url' => $favwork_img_url,
    'favtype' => $favtype,
    'favtype_img_id' => $favtypeId,
    'favpokemon' => $favpokemon,
    'favpokemon_img_url' => $favpokemon_img_url
];

echo json_encode($rankings); // 결과를 JSON 형식으로 인코딩하여 반환

$conn->close(); // 연결 종료
?>