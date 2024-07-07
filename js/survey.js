document.addEventListener("DOMContentLoaded", function() {
    function performSearch(inputId, table) {
        var keyword = document.getElementById(inputId + 'Keyword').value;
        var selectedOption = document.querySelector(`#${inputId} .select-selected`).dataset.value;

        if (!selectedOption) {
            alert('먼저 조건을 선택해주세요.');
            return;
        }

        if (keyword.length < 2) {
            document.getElementById(inputId + 'Results').innerHTML = '';
            return;
        }

        // AJAX 요청 생성
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `search.php?table=${table}&keyword=${encodeURIComponent(keyword)}&condition=${encodeURIComponent(selectedOption)}`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 서버에서 받은 결과를 화면에 표시
                document.getElementById(inputId + 'Results').innerHTML = xhr.responseText;
            }
        };
        xhr.send();
    }

    function selectResult(element, inputId) {
        var value = element.getAttribute('data-value');
        var text = element.innerText;

        document.getElementById(inputId).value = value;
        document.getElementById(inputId + 'Keyword').value = text;
        document.getElementById(inputId + 'Results').innerHTML = '';
    }

    function validateForm() {
        var requiredFields = ['firstwork', 'favwork', 'favpokemon'];
        for (var i = 0; i < requiredFields.length; i++) {
            var field = requiredFields[i];
            if (document.getElementById(field).value === '') {
                alert('모든 항목을 선택해주세요.');
                return false;
            }
        }

        // 타입 체크박스 선택 여부 확인
        var favtypeChecked = document.querySelectorAll('input[name="favtype[]"]:checked');
        if (favtypeChecked.length === 0) {
            alert('최소한 하나의 타입을 선택해주세요.');
            return false;
        }

        // 선택된 타입을 JSON 형태로 변환
        var favtypeValues = Array.from(favtypeChecked).map(cb => parseInt(cb.value));
        document.getElementById('favtype').value = JSON.stringify(favtypeValues);

        return true;
    }

    // 전역에 필요한 함수를 window 객체에 추가
    window.performSearch = performSearch;
    window.selectResult = selectResult;
    window.validateForm = validateForm;
});
