//체크되지 않은 이미지 경로
var uncheckedImagePaths = [
    
];
//체크된 이미지 경로
var checkedImagePaths = [
    
];

// 각 체크박스에 대한 이벤트 리스너 추가
var checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
var labels = document.querySelectorAll('.checkbox-container label');
checkboxes.forEach(function(checkbox, index) {
    checkbox.addEventListener('change', function() {
        var img = labels[index].querySelector('img'); // 해당 체크박스의 라벨 내 이미지 요소 선택

        // 체크 여부에 따라 이미지 변경
        if (this.checked) {
            img.src = checkedImagePaths[index];
        } else {
            img.src = uncheckedImagePaths[index];
        }
    });
});