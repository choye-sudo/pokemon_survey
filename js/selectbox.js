/* 하나의 selectbox에 대해, 드롭다운 적용 및 유저 선택 항목 값을 .select-selected 요소에 전달 */
//inputBoxID : 각 유저 입력란 전체를 감싼 요소의 ID값
function setupSelect(inputBoxID) {
    //html 요소 가져오기
    var inputBox = document.getElementById(inputBoxID);//전체 유저 입력란 (선택란+입력란) 요소를 가져옴
    var selectBoxs = inputBox.querySelectorAll('.select-box');//해당 입력란 내의 select-box 클래스 요소를 전부 가져옴

    //각 select-box 별로 selected-item 및 select-item-list, select-item 클래스 요소 가져오기
    for(let i = 0; i<selectBoxs.length; i++) {
        let selectBox = selectBoxs[i];
        let selectedItem = selectBox.querySelector('.selected-item');
        let selectItemList = selectBox.querySelector('.select-item-list');
        let selectItems = selectItemList.querySelectorAll('.select-item');//select-item-list 클래스 요소 하위의 select-item 클래스 요소 전부 가져옴

        //드롭다운 애니메이션 적용
        selectedItem.addEventListener('click', function() {
            if (selectItemList.classList.contains('show')) {
                // 높이를 현재 값으로 설정한 후 애니메이션을 위해 0으로 줄임
                selectItemList.style.height = selectItemList.scrollHeight + 'px';
                requestAnimationFrame(function() {
                    selectItemList.classList.remove('show');
                    selectItemList.style.height = '0';
                });
            } else {
                // 높이를 자동으로 설정한 후 높이 값을 다시 설정
                selectItemList.classList.add('show');
                selectItemList.style.height = selectItemList.scrollHeight + 'px';
                selectItemList.addEventListener('transitionend', function transitionEnd() {
                    selectItemList.style.height = 'auto';
                    selectItemList.removeEventListener('transitionend', transitionEnd);
                });
            }
        });

        //유저가 선택한 항목이 selected-item 클래스 요소에 표시되도록 하고, data-value 속성을 전달한 후 selectbox를 닫음
        selectItems.forEach(function(selectItem) {
            selectItem.addEventListener('click', function() {
                let selectedValue = this.getAttribute('data-value');
                selectedItem.innerHTML = this.innerHTML;
                selectedItem.setAttribute('data-value', selectedValue);
                selectItemList.classList.remove('show');
            });
        });

        //selectbox 바깥을 클릭하면 selectbox를 닫음
        document.addEventListener('click', function(e) {
            if (!selectBox.contains(e.target)) {
                selectBox.querySelector('.select-item-list').classList.remove('show');
            }
        });
    }
}

// setupSelect 함수를 window 객체에 할당
window.setupSelect = setupSelect;
