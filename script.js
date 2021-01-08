window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const allBtns = document.querySelectorAll('.calculator__button'),
        entryField = document.querySelector('.calculator__entry-field'),
        ac = document.querySelector('button[value="AC"]'),

        collectionOrangeBtns = document.getElementsByClassName('calculator__button-orange'),
        arrFunc = [collectionOrangeBtns[0], collectionOrangeBtns[1], collectionOrangeBtns[2], collectionOrangeBtns[3]],
        
        equality = document.querySelector('button[value="="]');

    let string = '',                // строковое значение числа
        total = '',                // итоговое значение, результат к-л операции
        lastSign = '',            // последний нажатый знак
        regexp = /[\/\*\-\+]/g;

    for(let btn of allBtns) {
        btn.addEventListener('click', ()=> {

            // Настрока кнопок от 0 до 9
            if(btn.value.match(/[0-9]/)) {
                if(btn.value == '0' && (string.length == 0 || string == '-')) {
                    console.log('0 не может стоять первым, если не задумано дробное число');
                    // let promise = new Promise(function(resolve, reject) {
                    //     lastSign == '=' ? resolve('Нажато равно') : reject('Равно не нажато');
                    //     return promise;
                    // })
                } else {
                    ac.textContent = 'C';
                    string += btn.value;
                    fillEntryField(string);
                }
            
            // Настрока кнопки ','
            } else if(btn.value == ',' && !string.includes(','))  {
                if(string.length == 0 || string == '-') {
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
        total = '';
        fillEntryField(0);
    });

    // Запись в поле калькулятора
    function fillEntryField(text) {
        entryField.textContent = text;
    }

    // Функция отчистки переменных
    function clearVar() {
        string = '';
        stringForCalculation = '';
        arrTotals = [];
    }

    // Функция проверки последнего символа в строке на запятую
    function checkLastChar(string) {
        if(string[string.length-1] == ',') {
            string = string.replace(',', '');
        } 
        // else if(/[\/\*\-\+]$/.test(string)) {
        //     string = string.replace(regexp, '');
        // }
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

    let stringForCalculation = '',   // строка из строк вместе со знаками '5*3-6+10/'
        arrNums = [],               // массив для строк ['5', '3', '6', '10']
        arrOperations = [],        // массив для знаков ['*', '-', '+', '/']
        arrTotals = [];           // массив для результатов промежуточных действий [15, 9, 19]
        

    // Настрока кнопок /, *, -, +
    for(let func of arrFunc) {
        func.addEventListener('click', ()=> {

            // Если строка перед нажатием на знак - обычное число
            if(string.length >= 1 && string != '-' && string != '0,' && string != '-0,') {
                string = checkLastChar(string);

                stringForCalculation += string;
                stringForCalculation += func.value;
                string = '';

            // Перед нажатием на знак был зафиксирован результат предыдущего вычисления
            } else if(string.length == 0 && total.length >= 1) {

                stringForCalculation += total;
                stringForCalculation += func.value;
                total = '';
                console.log(stringForCalculation);
            // Перед нажатием на знак нет ни строки, ни тотала => вместо строки берём '0'
            } else if(string.length == 0 && total.length == 0) {
                stringForCalculation += ('0' + func.value);
            }
            
        });
    }

    equality.addEventListener('click', ()=> {
        string = checkLastChar(string);                                // проверка, не заканчивается ли string на ','
        // stringForCalculation = checkLastChar(stringForCalculation);   // проверка, не заканчивается ли stringForCalculation на к-л знак

        stringForCalculation += string;
        arrNums = stringForCalculation.split(regexp);
        arrOperations = stringForCalculation.match(regexp);

        for(let i = 0; i < arrNums.length; i++) {
            if(arrNums[i].includes(',')) {
                arrNums[i] = arrNums[i].replace(',', '.');
            }
            if(i == 1) {
                arrTotals.push(culculation(arrNums[i-1], arrNums[i], i-1));
                console.log(arrTotals);
            } else if(i >= 2) {
                arrTotals.push(culculation(arrTotals[i-2], arrNums[i], i-1));
                console.log(arrTotals);
            }
            
        }

        total = rounding(arrTotals[arrTotals.length-1]);
        fillEntryField(total);
        clearVar();
    });

    // Выполнение операций деления, умножения, вычитания и сложения
    function culculation(item1, item2, index) {
        let itemTotal;
        if(arrOperations[index] == '/') {
            itemTotal = (Number(item1)/Number(item2));
        } else if (arrOperations[index] == '-') {
            itemTotal = (Number(item1)-Number(item2));
        } else if (arrOperations[index] == '*') {
            itemTotal = (Number(item1)*Number(item2));
        } else if (arrOperations[index] == '+') {
            itemTotal = (Number(item1)+Number(item2));
        }
        return itemTotal;
    }

    /* 
        В JavaScript некоторые операции с числами, имеющими плавающую точку, 
        дают не правильный ответ, поэтому решино:
        - округлить total до 4х зн. после ',' 
        - удалить лишние нули
    */ 
    
    // Округление
    function rounding(num) {
        if(!Number.isInteger(num)) {  // проверка является ли num не целым    
            num = deleteExtraZeros(String(num.toFixed(4)).replace('.', ','));  // В функцию передаём строку
            return num;
        }
        return String(num);
    }

    // Удаление нулей
    function deleteExtraZeros(str) {
        let arr = str.split('');
        for(let i = arr.length-1; i > 0; i=i-1) {
            if(arr[i] == '0') {
                delete arr[i];          
            }
        }
        str = arr.join('');
        return str;
    }
    // function clearString(string) {
    //     string = (string.replace(/-/, '')).replace(/,/, '');
    //     if(string.length >= 9) {
    //         permission = false;
    //         console.log('Достигнут максимум');
    //         return permission;
    //     }
    // }
});