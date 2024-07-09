document.addEventListener("DOMContentLoaded", function() {
    // DOMContentLoaded 이벤트가 발생하면, 내부 함수를 실행

    /* 검색 기능 */
    //inputBoxID : 각 유저 입력란 전체를 감싼 요소의 ID값
    function search(inputBoxID) {
        //firstwork-search-keyword(키워드), firstwork-search-results(검색 결과 띄울 요소), firstwork-input(데이터베이스 보낼 데이터)
        // 검색조건 선택 안되어있는 경우에도 검색은 가능하게? 검색어 입력 중에 조건 선택하는 경우는 어떻게 해야하지? 입력한 값 지워버리기?
        // 검색어 입력 2자 이상부터 검색결과 띄워줌

        // inputBoxID를 통해서 어디 테이블로 가야할지 확인하고 설정 해줄 수 있음.
        // if문을 통해서 테이블 결정
        // 검색조건은 selected-item의 data-value값을 전부 가져와서 쿼리문에 반영하면 된다

        //검색할 데이터베이스 테이블 결정
        var table = '';
        switch(inputBoxID){
            case 'firstwork':
                table = 'pokemon_works';
                break;
            case 'favwork':
                table = 'pokemon_works';
                break;
            case 'favpokemon':
                table = 'pokemons';
                break;
        }

        //html 요소 가져오기
        var inputBox = document.getElementById(inputBoxID);//전체 유저 입력란 (선택란+입력란) 요소를 가져옴
        var keyword = inputBox.querySelector('.search-keyword').value; // 검색어 입력란에 입력된 값을 가져옴
        var selectedItems = inputBox.querySelectorAll('.selected-item');// selected-item 클래스 요소(선택된 조건이 담김)를 가져옴
        var dataValues = [];
        selectedItems.forEach(function(item) {
            dataValues.push(item.getAttribute('data-value'));
        });//반복문을 통해 선택된 조건 값을 가져옴

        // 검색어 길이가 2자 미만이면 검색 결과를 지우고 함수 종료
        if (keyword.length < 2) {
            inputBox.querySelector('.search-results').innerHTML = '';//search-results에 아무 결과도 나오지 않게 처리
            return;
        }


        // AJAX 요청을 생성
        var xhr = new XMLHttpRequest();

        xhr.open("GET", `search.php?table=${table}&keyword=${encodeURIComponent(keyword)}&condition=${encodeURIComponent(selectedOption)}`, true);
        // GET 요청을 초기화합니다. 검색어와 조건을 URL 파라미터로 전송합니다.(php로 전달해 주는거임)

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById(inputId + 'Results').innerHTML = xhr.responseText;
            }
        };
        // 요청 상태가 완료되었고, 서버 응답이 성공적일 때 검색 결과를 표시합니다.

        xhr.send();
        // 요청을 서버로 보냅니다.
    }

    //이거 어느곳에서도 호출을 하고있지 않음...
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

    //정규표현식 넣을 수 있는지 한번 보기!!
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

    window.search = search;
    window.selectResult = selectResult;
    window.validateForm = validateForm;
    // 전역에 필요한 함수를 window 객체에 추가합니다.
});