document.addEventListener("DOMContentLoaded", function() {
    // DOMContentLoaded 이벤트가 발생하면, 내부 함수를 실행

    /* 입력 내용 유효성 검사 관련 기능 : validateForm() */
    //form 제출 시 유효성 검사 수행
    function validateForm() {
        //필수 입력 필드 (checkbox 제외) 유효성 검사
        var requiredFields = ['username', 'firstwork', 'favwork', 'favpokemon']; //필수 입력 필드 (checkbox 제외) id를 배열로 정의
        for (var i = 0; i < requiredFields.length; i++) {
            // 필수 입력 필드가 비어 있는지 확인 후, 비어있는 경우 경고 메시지를 표시 후 제출 중단
            var field = requiredFields[i];
            var hiddenInput = document.querySelector(`#${field} #${field}-input`);
            if (!hiddenInput.value) {
                alert('모든 항목을 입력해주세요. (검색 기능이 있는 항목의 경우, 꼭 검색 결과를 선택해주세요.)');//검색값을 선택하지 않으면 실제로 데이터베이스에 전달되는 input에 아무 값도 들어있지 않게 됨
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
    window.validateForm = validateForm;
});