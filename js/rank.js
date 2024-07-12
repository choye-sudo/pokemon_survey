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
    document.getElementById('firstwork-ranking').textContent = rankings.firstwork;
    document.getElementById('favwork-ranking').textContent = rankings.favwork;
    document.getElementById('favtype-ranking').textContent = rankings.favtype;
    document.getElementById('favpokemon-ranking').textContent = rankings.favpokemon;
}