window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    const allBtns = document.querySelectorAll('.calculator__button'),
        entryField = document.querySelector('.calculator__entry-field'),
        ac = document.querySelector('button[value="AC"]'),

        collectionOrangeBtns = document.getElementsByClassName('calculator__button-orange'),
        arrFunc = [collectionOrangeBtns[0], collectionOrangeBtns[1], collectionOrangeBtns[2], collectionOrangeBtns[3]],
        equality = document.querySelector('button[value="="]');

    let string = '',
        total;  // итоговое значение, результат к-л операции


    for(let btn of allBtns) {
        btn.addEventListener('click', ()=> {
            if(btn.value.match(/[0-9]/)) {
                if(btn.value == '0' && string.length == 0) {
                    console.log('0 не может стоять первым, если не задумано дробное число');
                } else {
                    ac.textContent = 'C';
                    string += btn.value;
                    fillEntryField(string);
                }
            
            
            // Настрока кнопки ','
            } else if(btn.value == ',' && !string.includes(','))  {
                if(string.length == 0) {
                    string += '0,';
                    ac.textContent = 'C';
                    fillEntryField(string);
                } else {
                    string += ',';
                    fillEntryField(string);
                }

            // Настрока кнопки '+/-'
            } else if(btn.value == '+/-') {
                if(string.length > 1 || (string.length == 1 && string[0] != '-')) {
                    if(string.includes('-')) {
                        string = string.replace('-', '');
                    } else {
                        string = '-' + string;
                    }
                    fillEntryField(string);
                } else if(string.length == 0){
                    string += '-';
                    fillEntryField(string + 0);
                } else if(string == '-') {
                    string = string.replace('-', '');
                    fillEntryField(string + 0);
                }
                
            
            // Настрока кнопки '%'
            } else if(btn.value == '%' && string.length != 0) {
                if(string == '-' || string == '0,' || string == '-0,') {
                    string = '';
                    fillEntryField(string + 0);
                } else {
                    total = calcPercent(string);
                    fillEntryField(total);
                    string = '';
                }
            }
        });
    }

    // Настройка кнопки 'AC'
    ac.addEventListener('click', ()=> {
        ac.textContent = 'AC';
        clearVar();
        fillEntryField(0 + string);
    });

    // Запись в поле калькулятора
    function fillEntryField(text) {
        entryField.textContent = text;
    }

    // Функция отчистки переменных при нажатии на AC
    function clearVar() {
        string = '';
        stringForCalculation = '';
        total = '';
        arrTotals = [];
    }
    // Функция проверки последнего символа в строке
    function checkLastChar(string) {
        if(string[string.length-1] == ',') {
            string = string.replace(',', '');
        }
        return string;
    }

    // Расчёт процента от ста (%)
    function calcPercent(string) {
        let num,
            result;

        string = checkLastChar(string);

        if(string.includes(',')) {
            num = parseFloat(string.replace(',', '.'))/100;
        } else {
            num = Number(string)/100;
        }

        result = String(num).replace('.', ',');
        return result;  
    }


    let stringForCalculation = '',
        arrNums = [],
        arrOperations = [],
        arrTotals = [],
        regexp = /[\/\*\-\+]/g;


    for(let func of arrFunc) {
        func.addEventListener('click', ()=> {
            if(string.length >= 1 && string != '-' && string != '0,' && string != '-0,') {
                string = checkLastChar(string);

                stringForCalculation += string;
                stringForCalculation += func.value;
                string = '';
            } else if(string.length == 0 && total.length >= 1) {
                stringForCalculation += total;
                stringForCalculation += func.value;
            }
            console.log(stringForCalculation);
        });
    }

    equality.addEventListener('click', ()=> {
        string = checkLastChar(string);

        stringForCalculation += string;
        arrNums = stringForCalculation.split(regexp);
        arrOperations = stringForCalculation.match(regexp);

        for(let i = 0; i < arrNums.length; i++) {
            if(arrNums[i].includes(',')) {
                arrNums[i] = arrNums[i].replace(',', '.');
            }

            if(i == 1) {
                arrTotals.push(culculation(arrNums[i-1], arrNums[i], i-1));
                // console.log(arrTotals);
            } else if(i >= 2) {
                arrTotals.push(culculation(arrTotals[i-2], arrNums[i], i-1));
                // console.log(arrTotals);
            }
            
        }
        total = String(arrTotals[arrTotals.length-1]);
        
        if(total.includes('.')) {
            total = checkRound(total.replace('.', ','));
        }
        fillEntryField(total);
        clearVar();
    });

    function culculation(item1, item2, index) {
        let itemTotal;

        if(arrOperations[index] == '/') {
            itemTotal = (Number(item1)/Number(item2)).toFixed(3);
        } else if (arrOperations[index] == '-') {
            itemTotal = (Number(item1)-Number(item2)).toFixed(3);
        } else if (arrOperations[index] == '*') {
            itemTotal = (Number(item1)*Number(item2)).toFixed(3);
        } else if (arrOperations[index] == '+') {
            itemTotal = (Number(item1)+Number(item2)).toFixed(3);
        }

        return itemTotal;
    }

    // В JavaScript операции с числами, имеющими плавающую точку, дают не правильный ответ, поэтому решино не только округлить ответ, но удалить лишние нули в числе после запятой
    function checkRound(total) {
        let arr = total.split('');
        for(let i = arr.length-1; i > 0; i=i-1) {
            if(arr[i] == '0') {
                delete arr[i];          
            } else {

            }
        }
        total = arr.join('');
        return total;
    }

});

// function clearString(string) {
//     string = (string.replace(/-/, '')).replace(/,/, '');
//     if(string.length >= 9) {
//         permission = false;
//         console.log('Достигнут максимум');
//         return permission;
//     }
// }