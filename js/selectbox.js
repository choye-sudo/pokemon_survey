document.addEventListener("DOMContentLoaded", function() {
    function setupSelect(selectContainerId, selectedOptionId) {
        var selectContainer = document.getElementById(selectContainerId);
        var selectedOption = document.getElementById(selectedOptionId);
        var selectItems = selectContainer.querySelectorAll('.select-items div');

        selectedOption.addEventListener('click', function() {
            var selectItems = selectContainer.querySelector('.select-items');
            if (selectItems.style.display === 'block') {
                selectItems.style.display = 'none';
            } else {
                selectItems.style.display = 'block';
            }
        });

        for (var i = 0; i < selectItems.length; i++) {
            selectItems[i].addEventListener('click', function() {
                var selectedValue = this.getAttribute('data-value');
                selectedOption.innerHTML = this.innerHTML;
                selectContainer.querySelector('.select-items').style.display = 'none';
            });
        }

        document.addEventListener('click', function(e) {
            if (!selectContainer.contains(e.target)) {
                selectContainer.querySelector('.select-items').style.display = 'none';
            }
        });
    }

    // 각 셀렉 박스에 대해 함수 호출
    setupSelect('selectFirstwork', 'selectFirstworkOption');
    setupSelect('selectFavwork', 'selectFavworkOption');
    setupSelect('selectFavpokemon', 'selectFavpokemonOption');
    setupSelect('selectFavtrainer', 'selectFavtrainerOption');
});
