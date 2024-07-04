//체크되지 않은 이미지 경로
var uncheckedImagePaths = [
    "../assets/images/unchecked/normal.png",
    "../assets/images/unchecked/fire.png",
    "../assets/images/unchecked/water.png",
    "../assets/images/unchecked/grass.png",
    "../assets/images/unchecked/electric.png",
    "../assets/images/unchecked/ice.png",
    "../assets/images/unchecked/fighting.png",
    "../assets/images/unchecked/poison.png",
    "../assets/images/unchecked/ground.png",
    "../assets/images/unchecked/flying.png",
    "../assets/images/unchecked/psychic.png",
    "../assets/images/unchecked/bug.png",
    "../assets/images/unchecked/rock.png",
    "../assets/images/unchecked/ghost.png",
    "../assets/images/unchecked/dragon.png",
    "../assets/images/unchecked/dark.png",
    "../assets/images/unchecked/steel.png",
    "../assets/images/unchecked/fairy.png"
];
//체크된 이미지 경로
var checkedImagePaths = [
    "../assets/images/checked/normal.png",
    "../assets/images/checked/fire.png",
    "../assets/images/checked/water.png",
    "../assets/images/checked/grass.png",
    "../assets/images/checked/electric.png",
    "../assets/images/checked/ice.png",
    "../assets/images/checked/fighting.png",
    "../assets/images/checked/poison.png",
    "../assets/images/checked/ground.png",
    "../assets/images/checked/flying.png",
    "../assets/images/checked/psychic.png",
    "../assets/images/checked/bug.png",
    "../assets/images/checked/rock.png",
    "../assets/images/checked/ghost.png",
    "../assets/images/checked/dragon.png",
    "../assets/images/checked/dark.png",
    "../assets/images/checked/steel.png",
    "../assets/images/checked/fairy.png"
];

// 각 체크박스에 대한 이벤트 리스너 추가
var checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
var labels = document.querySelectorAll('.checkbox-container label');

checkboxes.forEach(function(checkbox, index) {
    var img = labels[index].querySelector('img'); // 해당 체크박스 라벨 내 이미지 요소 선택
    img.src = uncheckedImagePaths[index];//초기 이미지를 unchecked로 설정
    checkbox.addEventListener('change', function() {
        // 체크 여부에 따라 이미지 변경
        if (this.checked) {
            img.src = checkedImagePaths[index];
        } else {
            img.src = uncheckedImagePaths[index];
        }
    });
});