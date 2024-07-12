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
            inputBox.querySelector('.search-results').style.display = 'none'; // 검색 결과 리스트를 숨김
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

        if (results[0] && results[0].error) {
            resultsBox.innerHTML = '<div class="search-result-item">결과가 없습니다.</div>';
            resultsBox.style.display = 'block'; //검색 결과 리스트를 보임
            return;
        }

        //포켓몬(favpokemon) 검색 결과 데이터 관련해서만 그룹화 처리 진행
        if (inputBoxID === 'favpokemon') {
            var groupedResults = {};   
            results.forEach(function(result) {
                var key = result.pokemon_name;
                if (!groupedResults[key]) {
                    groupedResults[key] = {
                        data: result,
                        types: []
                    };
                }
                groupedResults[key].types.push(result.type_name);
            });
    
            // 그룹화된 결과를 사용하여 HTML 요소 생성
            Object.keys(groupedResults).forEach(function(key) {
                var resultElement = document.createElement('div'); //search-results 클래스 요소의 하위 요소로 넣어줄 div 요소 선언
                resultElement.classList.add('search-result-item'); //해당 div요소에 search-result-item 클래스 속성 추가
    
                var result = groupedResults[key].data;
                var types = groupedResults[key].types.join(', ');
    
                var imgElement = document.createElement('img');
                imgElement.src = result.pokemon_img_url || 'default_image_url'; // 이미지가 없는 경우 대체 이미지를 표출
                imgElement.alt = result.pokemon_name;
                imgElement.classList.add('pokemon-img');
                resultElement.appendChild(imgElement);
    
                var textElement = document.createElement('div');
                textElement.classList.add('pokemon-info');
                var genText = result.gen ? result.gen : ' - ';
                textElement.innerHTML = `${result.pokemon_name} | ${result.pokemon_num} | ${genText} | ${types}`;
                resultElement.appendChild(textElement);
    
                // 결과 선택 이벤트 추가
                resultElement.addEventListener('click', function() { //해당 요소 클릭 시 검색 결과 선택 함수 호출
                    searchResultSelect(inputBoxID, result);
                });
                resultsBox.appendChild(resultElement); // 각 결과를 resultsBox에 추가
            });
        } 
        // 포켓몬 이외의(firstwork, favwork) 검색 결과 데이터는 그룹화 없이 처리
        else {    
            results.forEach(function(result) {
                var resultElement = document.createElement('div'); //search-results 클래스 요소의 하위 요소로 넣어줄 div 요소 선언
                resultElement.classList.add('search-result-item'); //해당 div요소에 search-result-item 클래스 속성 추가
    
                var imgElement = document.createElement('img');
                imgElement.src = result.work_img_url || 'default_image_url'; // 이미지가 없는 경우 대체 이미지를 표출
                imgElement.alt = result.work_name || 'No image available';
                imgElement.classList.add('work-img');
                resultElement.appendChild(imgElement);
    
                var textElement = document.createElement('div');
                textElement.classList.add('work-info');
                var genText = result.gen ? result.gen : ' - ';
                textElement.innerHTML = `${result.work_name} | ${result.genre_name} | ${genText}`;
                resultElement.appendChild(textElement);
    
                // 결과 선택 이벤트 추가
                resultElement.addEventListener('click', function() { //해당 요소 클릭 시 검색 결과 선택 함수 호출
                    searchResultSelect(inputBoxID, result);
                });
    
                resultsBox.appendChild(resultElement); // 각 결과를 resultsBox에 추가
            });
        }
        resultsBox.style.display = 'block';//검색 결과 리스트를 보임

        //검색 결과 리스트 바깥을 클릭한 경우
        document.addEventListener('click', function(e) {
            if (!resultsBox.contains(e.target)) {
                resultsBox.innerHTML = ''; // 검색 결과 리스트 내 요소를 지워서 리스트 닫음
                resultsBox.style.display = 'none'; // 검색 결과 리스트를 숨김
            }
        });

    }

    // 검색 결과 선택
    function searchResultSelect(inputBoxID, result){
        var inputBox = document.getElementById(inputBoxID);
        var keywordInput = inputBox.querySelector('.search-keyword'); //입력창이 있는 input 요소
        var hiddenInput = inputBox.querySelector('input[type="hidden"]'); //데이터베이스에 전달될 input 요소
        var resultsBox = inputBox.querySelector('.search-results');
        if (result.pokemon_name) {
            keywordInput.value = result.pokemon_name; //입력 창에 선택 결과 text를 넣어줌
            hiddenInput.value = result.pokemon_name; //데이터베이스에 전달될 input 요소의 값에 선택 결과 값 넣어줌
        } else if (result.work_name) {
            keywordInput.value = result.work_name; //입력 창에 선택 결과 text를 넣어줌
            hiddenInput.value = result.work_name; //데이터베이스에 전달될 input 요소의 값에 선택 결과 값 넣어줌
        }
        resultsBox.innerHTML = ''; // 검색 결과 리스트 내 요소를 지워서 리스트 닫음
        resultsBox.style.display = 'none'; // 검색 결과 리스트를 숨김
    }



    // 전역에 필요한 함수를 window 객체에 추가
    window.search = search;
    window.displaySearchResults = displaySearchResults;
    window.searchResultSelect = searchResultSelect;


    
    //실시간 검색 관련
    document.querySelectorAll('.search-keyword').forEach(function(input) {
        input.addEventListener('input', function() {
            search(this.closest('.userinput').id);
        });
    });
});