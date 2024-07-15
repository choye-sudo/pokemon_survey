document.addEventListener("DOMContentLoaded", function() {
    fetchRankings();
});

//타입 이미지 경로
var favtype_img = [
    "../assets/images/checked/normal.png",
    "../assets/images/checked/fire.png",
    "../assets/images/checked/water.png",
    "../assets/images/checked/grass.png",
    "../assets/images/checked/electric.png",
    "../assets/images/checked/ice.png",
    "../assets/images/checked/fighting.png",
    "../assets/images/checked/poison.png",
    "../assets/images/checked/ground.png",
    "../assets/images/checked/flying.png",
    "../assets/images/checked/psychic.png",
    "../assets/images/checked/bug.png",
    "../assets/images/checked/rock.png",
    "../assets/images/checked/ghost.png",
    "../assets/images/checked/dragon.png",
    "../assets/images/checked/dark.png",
    "../assets/images/checked/steel.png",
    "../assets/images/checked/fairy.png"
];

function fetchRankings() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "get_rankings.php", true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var rankings = JSON.parse(xhr.responseText);
                    displayRankings(rankings);
                } catch (e) {
                    console.error("JSON parsing error:", e);
                    console.error("Response text:", xhr.responseText);
                }
            } else {
                console.error("HTTP error:", xhr.status, xhr.statusText);
            }
        }
    };

    xhr.send();
}

function displayRankings(rankings) {
    // 처음 접한 작품
    var firstworkContainer = document.getElementById('firstwork-ranking');
    firstworkContainer.innerHTML = '';
    var firstworkImage = document.createElement('img');
    firstworkImage.src = rankings.firstwork_img_url;
    firstworkImage.alt = rankings.firstwork;
    firstworkContainer.appendChild(firstworkImage);
    var firstworkText = document.createElement('p');
    firstworkText.textContent = rankings.firstwork;
    firstworkContainer.appendChild(firstworkText);

    // 가장 좋아하는 작품
    var favworkContainer = document.getElementById('favwork-ranking');
    favworkContainer.innerHTML = '';
    var favworkImage = document.createElement('img');
    favworkImage.src = rankings.favwork_img_url;
    favworkImage.alt = rankings.favwork;
    favworkContainer.appendChild(favworkImage);
    var favworkText = document.createElement('p');
    favworkText.textContent = rankings.favwork;
    favworkContainer.appendChild(favworkText);

    // 가장 좋아하는 타입
    var favtypeContainer = document.getElementById('favtype-ranking');
    favtypeContainer.innerHTML = '';
    var favtypeImage = document.createElement('img');
    favtypeImage.src = favtype_img[rankings.favtype_img_id-1];//type_index 테이블의 type_id는 1부터 시작
    favtypeImage.alt = rankings.favtype;
    favtypeContainer.appendChild(favtypeImage);
    var favtypeText = document.createElement('p');
    favtypeText.textContent = rankings.favtype;
    favtypeContainer.appendChild(favtypeText);

    // 가장 좋아하는 포켓몬
    var favpokemonContainer = document.getElementById('favpokemon-ranking');
    favpokemonContainer.innerHTML = '';
    var favpokemonImage = document.createElement('img');
    favpokemonImage.src = rankings.favpokemon_img_url;
    favpokemonImage.alt = rankings.favpokemon;
    favpokemonContainer.appendChild(favpokemonImage);
    var favpokemonText = document.createElement('p');
    favpokemonText.textContent = rankings.favpokemon;
    favpokemonContainer.appendChild(favpokemonText);
}