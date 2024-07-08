document.addEventListener("DOMContentLoaded", function() {
    // DOMContentLoaded 이벤트가 발생하면, 내부 함수를 실행

    function performSearch(inputId, table) {
        // performSearch 함수는 검색 기능을 수행합니다.
        var keyword = document.getElementById(inputId + 'Keyword').value;
        // inputId에 해당하는 검색어 입력 필드의 값을 가져옵니다.

        var selectedOptionId = inputId + 'GenreOption';
        // 검색 조건으로 선택한 요소의 ID를 지정합니다.
        //장르 옵션만 있는게 아니기 때문에, 수정해야함. 내 생각에는 각 옵션별로도 또 따로 받는 변수를 만들어서, 따오게 하면 될 것 같음
        //이름이 select ~ 아이디 ~ GenreOption 이런 형태여서 일단 html 이름부터 좀 먼저 맞춰주자.

        var selectedOption = document.getElementById(selectedOptionId).getAttribute('data-value');
        // 선택된 옵션의 data-value 값을 가져옵니다.

        if (!selectedOption) {
            alert('먼저 조건을 선택해주세요.');
            return;
        }
        // 선택된 옵션이 없으면 경고 메시지를 표시하고 함수를 종료합니다.

        if (keyword.length < 2) {
            document.getElementById(inputId + 'Results').innerHTML = '';
            return;
        }
        // 검색어 길이가 2자 미만이면 검색 결과를 지우고 함수를 종료합니다.

        var xhr = new XMLHttpRequest();
        // AJAX 요청을 생성합니다.

        xhr.open("GET", `search.php?table=${table}&keyword=${encodeURIComponent(keyword)}&condition=${encodeURIComponent(selectedOption)}`, true);
        // GET 요청을 초기화합니다. 검색어와 조건을 URL 파라미터로 전송합니다.

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById(inputId + 'Results').innerHTML = xhr.responseText;
            }
        };
        // 요청 상태가 완료되었고, 서버 응답이 성공적일 때 검색 결과를 표시합니다.

        xhr.send();
        // 요청을 서버로 보냅니다.
    }

    function selectResult(element, inputId) {
        // selectResult 함수는 검색 결과 중 하나를 선택했을 때 실행됩니다.
        var value = element.getAttribute('data-value');
        // 선택된 결과의 data-value 속성을 가져옵니다.

        var text = element.innerText;
        // 선택된 결과의 텍스트를 가져옵니다.

        document.getElementById(inputId).value = value;
        // 숨겨진 입력 필드에 선택된 값(data-value)을 설정합니다.

        document.getElementById(inputId + 'Keyword').value = text;
        // 검색어 입력 필드에 선택된 결과의 텍스트를 설정합니다.

        document.getElementById(inputId + 'Results').innerHTML = '';
        // 검색 결과를 비웁니다.
    }

    function validateForm() {
        // validateForm 함수는 폼 제출 시 유효성을 검사합니다.
        var requiredFields = ['firstwork', 'favwork', 'favpokemon'];
        // 필수 입력 필드의 ID를 배열로 정의합니다.

        for (var i = 0; i < requiredFields.length; i++) {
            var field = requiredFields[i];
            if (document.getElementById(field).value === '') {
                alert('모든 항목을 선택해주세요.');
                return false;
            }
        }
        // 필수 입력 필드가 비어 있는지 확인하고, 비어 있으면 경고 메시지를 표시하고 제출을 중단합니다.

        var favtypeChecked = document.querySelectorAll('input[name="favtype[]"]:checked');
        // 선택된 타입 체크박스를 모두 가져옵니다.

        if (favtypeChecked.length === 0) {
            alert('최소한 하나의 타입을 선택해주세요.');
            return false;
        }
        // 타입 체크박스가 하나도 선택되지 않은 경우 경고 메시지를 표시하고 제출을 중단합니다.

        var favtypeValues = Array.from(favtypeChecked).map(cb => parseInt(cb.value));
        // 선택된 체크박스 값을 배열로 변환하고 숫자로 변환합니다.

        document.getElementById('favtype').value = JSON.stringify(favtypeValues);
        // 배열을 JSON 문자열로 변환하여 숨겨진 입력 필드에 설정합니다.

        return true;
        // 폼이 유효한 경우 true를 반환하여 제출을 허용합니다.
    }

    window.performSearch = performSearch;
    window.selectResult = selectResult;
    window.validateForm = validateForm;
    // 전역에 필요한 함수를 window 객체에 추가합니다.
});
