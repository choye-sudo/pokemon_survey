document.addEventListener("DOMContentLoaded", function() {
    // DOMContentLoaded 이벤트가 발생하면, 내부 함수를 실행

    /* 검색 관련 기능 : search(), displaySearchResults(), searchResultSelect() */
    //데이터베이스에 검색어 및 검색 조건 전송 및 검색 결과 수신
    function search(inputBoxID) { //inputBoxID : 각 유저 입력란 전체를 감싼 요소의 ID값
        //검색할 데이터베이스 테이블 결정
        var table = '';
        switch(inputBoxID){
            case 'firstwork':
                table = 'pokemon_works';
                break;
            case 'favwork':
                table = 'pokemon_works';
                break;
            case 'searchwork':
                table = 'pokemon_works';
                break;
            case 'favpokemon':
                table = 'pokemons';
                break;
            default:
                console.error('Unexpected inputBoxID:', inputBoxID);
                return;
        }

        //html 요소 가져오기
        var inputBox = document.getElementById(inputBoxID);//전체 유저 입력란 (선택란+입력란) 요소를 가져옴
        var selectedItems = inputBox.querySelectorAll('.selected-item');// selected-item 클래스 요소(선택된 조건이 담김)를 가져옴
        var selectedOptions = {};//조건의 종류명과 조건 값 가져옴
        selectedItems.forEach(function(item) {
            var name = item.getAttribute('name');
            var value = item.getAttribute('data-value');
            if (name && value) {
                selectedOptions[name] = value;
            }
        });//반복문을 통해 선택된 조건의 종류명과 선택된 조건 값을 전부 가져옴
        var keyword = inputBox.querySelector('.search-keyword').value; // 검색어 입력란에 입력된 값을 가져옴

        //검색어 길이가 2자 미만이면 검색 결과를 지우고 함수 종료
        if (keyword.length < 2) {
            inputBox.querySelector('.search-results').innerHTML = '';//search-results에 아무 결과도 나오지 않게 처리
            return;
        }

        //AJAX 요청
        var xhr = new XMLHttpRequest();
        var params = `table=${table}&keyword=${encodeURIComponent(keyword)}&${Object.keys(selectedOptions).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(selectedOptions[key])}`).join('&')}`;
        xhr.open("GET", `search.php?${params}`, true);//get으로 문장 전달

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var results = JSON.parse(xhr.responseText); // 서버로부터 검색 결과를 JSON 형식으로 받음
                displaySearchResults(inputBoxID, results);
            }
        };

        xhr.send(); // 요청을 서버로 보냅니다.
    }
   
    // 데이터베이스로부터 검색 결과 표시
    function displaySearchResults(inputBoxID, results){
        var resultsBox = document.getElementById(inputBoxID).querySelector('.search-results');
        resultsBox.innerHTML = ''; // 기존 검색 결과 리스트 삭제
        results.forEach(function(result) {
            var resultElement = document.createElement('div'); //search-results 클래스 요소의 하위 요소로 넣어줄 div 요소 선언
            resultElement.classList.add('search-result-item'); //해당 div요소에 search-result-item 클래스 속성 추가
            resultElement.textContent = result.text; //해당 요소의 text 컨텐츠로 데이터베이스에서 받은 text 컨텐츠 삽입
            resultElement.addEventListener('click', function() { //해당 요소 클릭 시 검색 결과 선택 함수 호출
                searchResultSelect(inputBoxID, result.text, result.value);
            });
            resultsBox.appendChild(resultElement);//search-results 클래스 요소의 하위 요소로 search-result-item 클래스 div요소 넣어줌
        });
    }

    // 검색 결과 선택
    function searchResultSelect(inputBoxID, resultText, resultValue){
        var inputBox = document.getElementById(inputBoxID);
        inputBox.querySelector('.search-keyword').value = resultText; //입력 창에 선택 결과 text를 넣어줌
        inputBox.querySelector('input[type="hidden"]').value = resultValue; //데이터베이스에 전달될 input 요소의 값에 선택 결과 값 넣어줌
        inputBox.querySelector('.search-results').innerHTML = ''; // 검색 결과 리스트 내 요소를 지워서 리스트 닫음
    }

    

    /* 입력 내용 유효성 검사 관련 기능 : validateForm() */
    //form 제출 시 유효성 검사 수행
    function validateForm() {
        //필수 입력 필드 (checkbox 제외) 유효성 검사
        var requiredFields = ['firstwork', 'favwork', 'favpokemon']; //필수 입력 필드 (checkbox 제외) id를 배열로 정의
        for (var i = 0; i < requiredFields.length; i++) {
            // 필수 입력 필드가 비어 있는지 확인 후, 비어있는 경우 경고 메시지를 표시 후 제출 중단
            var field = requiredFields[i];
            var hiddenInput = document.querySelector(`#${field} input[type="hidden"]`);
            if (!hiddenInput.value) {
                alert('모든 항목을 검색을 통해 선택해주세요.');//검색값을 선택하지 않으면 실제로 데이터베이스에 전달되는 input에 아무 값도 들어있지 않게 됨
                return false;
            }
        }
        
        //필수 입력 체크박스 유효성 검사
        var favtypeChecked = document.querySelectorAll('input[name="favtype[]"]:checked'); // 선택된 타입 체크박스를 모두 가져옴
        //체크박스가 하나도 선택되지 않은 경우, 경고 메시지 표시 후 제출 중단
        if (favtypeChecked.length === 0) {
            alert('최소한 하나의 타입을 선택해주세요.');
            return false;
        }
        var favtypeValues = Array.from(favtypeChecked).map(checkbox => parseInt(checkbox.value)); // 선택된 체크박스 값을 배열로 변환한 후, 숫자로 변환
        document.getElementById('favtype').value = JSON.stringify(favtypeValues);// 배열을 JSON 문자열로 변환하여 숨겨진 입력 필드에 설정

        // 폼이 유효한 경우 true를 반환하여 제출 허용
        return true;
    }



    // 전역에 필요한 함수를 window 객체에 추가
    window.search = search;
    window.displaySearchResults = displaySearchResults;
    window.searchResultSelect = searchResultSelect;
    window.validateForm = validateForm;


    
    //실시간 검색 관련
    document.querySelectorAll('.search-keyword').forEach(function(input) {
        input.addEventListener('input', function() {
            search(this.closest('.userinput').id);
        });
    });
    


    //selectbox 호출
    setupSelect('firstwork');
    setupSelect('favwork');
    setupSelect('favpokemon');
});