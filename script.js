// 로컬 스토리지에서 제품 정보를 불러옵니다.
let products = JSON.parse(localStorage.getItem("products")) || {};

// 제품 목록을 화면에 업데이트
function updateProductList() {
    const productList = document.getElementById("productList");
    const productNames = document.getElementById("productNames");

    // 기존 목록을 초기화
    productList.innerHTML = "";
    productNames.innerHTML = "";  // 자동완성 목록 초기화

    // 제품 목록을 화면에 표시
    for (let productName in products) {
        const listItem = document.createElement("li");
        listItem.textContent = productName;  // 개수 부분을 제외하고 제품명만 표시
        // listItem.textContent = `${productName}: ${products[productName].quantity}개`; // 개수 부분 포함하여 제품명 표시

        // 삭제 버튼 추가
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => deleteProduct(productName);

        listItem.appendChild(deleteBtn);
        productList.appendChild(listItem);

        // 자동완성용 datalist에 추가
        const option = document.createElement("option");
        option.value = productName;
        productNames.appendChild(option);
    }
}

// 제품 등록
function addProduct() {
    const productName = document.getElementById("productName").value;
    const initialQuantity = document.getElementById("initialQuantity").value;

    if (!productName || !initialQuantity) {
        showFeedback("제품명과 수량을 모두 입력해주세요.");
        return;
    }

    if (products[productName]) {
        showFeedback("이미 등록된 제품입니다.");
        return;
    }

    if (isNaN(initialQuantity) || initialQuantity <= 0) {
        showFeedback("초기 수량은 1 이상이어야 합니다.");
        return;
    }

    products[productName] = { quantity: parseInt(initialQuantity) };
    localStorage.setItem("products", JSON.stringify(products));

    // 입력 필드 초기화
    document.getElementById("productName").value = "";
    document.getElementById("initialQuantity").value = "";

    showFeedback(`${productName} 제품이 등록되었습니다.`);
    updateProductList();
}

// 재고 업데이트
function updateStock() {
    const productName = document.getElementById("updateProductName").value;
    const quantityChange = document.getElementById("updateQuantity").value;

    if (!productName || !quantityChange) {
        showFeedback("제품명과 변경할 수량을 입력해주세요.");
        return;
    }

    if (!products[productName]) {
        showFeedback("해당 제품이 등록되어 있지 않습니다.");
        return;
    }

    if (isNaN(quantityChange) || quantityChange === "0") {
        showFeedback("변경할 수량은 0이 아니어야 합니다.");
        return;
    }

    // 재고가 음수가 되지 않도록 확인
    if (products[productName].quantity + parseInt(quantityChange) < 0) {
        showFeedback("재고 수량은 0개 이상이어야 합니다.");
        return;
    }

    products[productName].quantity += parseInt(quantityChange);
    localStorage.setItem("products", JSON.stringify(products));

    // 입력 필드 초기화
    document.getElementById("updateProductName").value = "";
    document.getElementById("updateQuantity").value = "";

    showFeedback(`${productName}의 재고가 ${quantityChange}만큼 업데이트되었습니다.`);
    updateProductList();
}

// 재고 조회
function viewStock() {
    const productName = document.getElementById("viewProductName").value;

    if (!productName) {
        showFeedback("제품명을 입력해주세요.");
        return;
    }

    const stockResult = document.getElementById("stockResult");
    if (products[productName]) {
        stockResult.textContent = `${productName}의 현재 재고: ${products[productName].quantity}개`;
    } else {
        stockResult.textContent = "해당 제품이 등록되어 있지 않습니다.";
    }
}

// 제품 삭제
function deleteProduct(productName) {
    // 삭제 확인 경고창
    const isConfirmed = confirm(`${productName} 제품을 정말 삭제하시겠습니까?`);

    if (!isConfirmed) {
        return;  // "취소" 버튼을 클릭하면 아무 작업도 하지 않음
    }

    // "확인"을 클릭했을 때만 삭제 진행
    delete products[productName];
    localStorage.setItem("products", JSON.stringify(products));
    showFeedback(`${productName} 제품이 삭제되었습니다.`);
    updateProductList();
}

// 피드백 메시지 표시
function showFeedback(message) {
    const feedbackMessage = document.getElementById("feedbackMessage");
    feedbackMessage.textContent = message;
    feedbackMessage.style.display = "block";
    setTimeout(() => {
        feedbackMessage.style.display = "none";
    }, 3000);
}

// 초기 화면 로드 시 제품 목록 업데이트
updateProductList();
