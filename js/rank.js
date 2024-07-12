document.addEventListener("DOMContentLoaded", function() {
    fetchRankings();
});

function fetchRankings() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "get_rankings.php", true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var rankings = JSON.parse(xhr.responseText);
            displayRankings(rankings);
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
    favtypeContainer.textContent = rankings.favtype;

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