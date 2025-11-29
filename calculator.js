const basePrices = {
    basic: 100,
    premium: 200,
    custom: 150
};

const optionMultipliers = {
    standard: 1.0,
    advanced: 1.5,
    professional: 2.0
};

const quantityInput = document.getElementById('quantity');
const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
const optionsGroup = document.getElementById('optionsGroup');
const optionsSelect = document.getElementById('options');
const propertyGroup = document.getElementById('propertyGroup');
const propertyCheckbox = document.getElementById('property');
const priceDisplay = document.getElementById('priceDisplay');


function validateQuantity() {
    const quantity = parseInt(quantityInput.value);
    
    if (isNaN(quantity) || quantity <= 0) {
        quantityInput.style.border = '2px solid red';
        priceDisplay.textContent = 'Ошибка: введите корректное количество (больше 0)';
        priceDisplay.style.color = 'red';
        return false;
    } else {
        quantityInput.style.border = '';
        priceDisplay.style.color = '';
        return true;
    }
}


function correctQuantityInput() {
    const quantity = parseInt(quantityInput.value);
    
    if (isNaN(quantity) || quantity < 1) {
        quantityInput.value = 1;
        validateQuantity();
    }
}

function calculatePrice() {
    
    if (!validateQuantity()) {
        return;
    }
    
    const quantity = parseInt(quantityInput.value);
    const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
    
    let basePrice = basePrices[selectedType];
    let totalPrice = basePrice * quantity;
    
    if (selectedType === 'premium') {
        const selectedOption = optionsSelect.value;
        totalPrice *= optionMultipliers[selectedOption];
    }
    
    if (selectedType === 'custom' && propertyCheckbox.checked) {
        totalPrice *= 1.2; 
    }
    
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    priceDisplay.textContent = `Итоговая стоимость: ${totalPrice} руб.`;
}

function updateFormVisibility() {
    const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
    
    optionsSelect.value = 'standard';
    propertyCheckbox.checked = false;
    
    switch(selectedType) {
        case 'basic':
            optionsGroup.classList.add('hidden');
            propertyGroup.classList.add('hidden');
            break;
        case 'premium':
            optionsGroup.classList.remove('hidden');
            propertyGroup.classList.add('hidden');
            break;
        case 'custom':
            optionsGroup.classList.add('hidden');
            propertyGroup.classList.remove('hidden');
            break;
    }
}

function initEventListeners() {
    quantityInput.addEventListener('input', function() {
        validateQuantity();
        calculatePrice();
    });
    

    quantityInput.addEventListener('blur', function() {
        correctQuantityInput();
        calculatePrice();
    });
    
   
    quantityInput.addEventListener('keydown', function(e) {
        
        if ([46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) ||
            
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            
            (e.keyCode >= 48 && e.keyCode <= 57) ||
            
            (e.keyCode >= 96 && e.keyCode <= 105)) {
            return;
        }
        
        
        if (e.keyCode === 189 || e.keyCode === 109) { 
            e.preventDefault();
            return;
        }
    });
    
    
    quantityInput.addEventListener('paste', function(e) {
        const pastedData = e.clipboardData.getData('text/plain');
        if (pastedData.includes('-') || parseInt(pastedData) <= 0) {
            e.preventDefault();
            alert('Нельзя вставлять отрицательные числа или ноль');
        }
    });
    
    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateFormVisibility();
            calculatePrice();
        });
    });
    
    optionsSelect.addEventListener('change', calculatePrice);
    propertyCheckbox.addEventListener('change', calculatePrice);
}

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    updateFormVisibility();
    calculatePrice();
});
