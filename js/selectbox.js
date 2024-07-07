document.addEventListener("DOMContentLoaded", function() {
    function setupSelect(selectContainerId, selectedOptionId) {
        var selectContainer = document.getElementById(selectContainerId);
        var selectedOption = document.getElementById(selectedOptionId);
        var selectItemsContainer = selectContainer.querySelector('.select-items');
        var selectItems = selectContainer.querySelectorAll('.select-items div');

        selectedOption.addEventListener('click', function() {
            if (selectItemsContainer.classList.contains('show')) {
                // 높이를 현재 값으로 설정한 후 애니메이션을 위해 0으로 줄임
                selectItemsContainer.style.height = selectItemsContainer.scrollHeight + 'px';
                requestAnimationFrame(function() {
                    selectItemsContainer.classList.remove('show');
                    selectItemsContainer.style.height = '0';
                });
            } else {
                // 높이를 자동으로 설정한 후 높이 값을 다시 설정
                selectItemsContainer.classList.add('show');
                selectItemsContainer.style.height = selectItemsContainer.scrollHeight + 'px';
                selectItemsContainer.addEventListener('transitionend', function transitionEnd() {
                    selectItemsContainer.style.height = 'auto';
                    selectItemsContainer.removeEventListener('transitionend', transitionEnd);
                });
            }
        });

        for (var i = 0; i < selectItems.length; i++) {
            selectItems[i].addEventListener('click', function() {
                var selectedValue = this.getAttribute('data-value');
                selectedOption.innerHTML = this.innerHTML;
                selectContainer.querySelector('.select-items').classList.remove('show');
            });
        }

        document.addEventListener('click', function(e) {
            if (!selectContainer.contains(e.target)) {
                selectContainer.querySelector('.select-items').classList.remove('show');
            }
        });
    }

    // 각 셀렉 박스에 대해 함수 호출
    setupSelect('selectFirstWorkGenre', 'selectFirstWorkGenreOption');
    setupSelect('selectFirstWorkGen', 'selectFirstWorkGenOption');
    
    setupSelect('selectFavWorkGenre', 'selectFavWorkGenreOption');
    setupSelect('selectFavWorkGen', 'selectFavWorkGenOption');

    setupSelect('selectFavpokemonGen', 'selectFavpokemonGenOption');
    setupSelect('selectFavpokemonType', 'selectFavpokemonTypeOption');
});
