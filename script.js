window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const allBtns = document.querySelectorAll('.calculator__button'),
        entryField = document.querySelector('.calculator__entry-field'),
        ac = document.querySelector('button[value="AC"]'),

        collectionOrangeBtns = document.getElementsByClassName('calculator__button-orange'),
        arrFunc = [collectionOrangeBtns[0], collectionOrangeBtns[1], collectionOrangeBtns[2], collectionOrangeBtns[3]],
        
        equality = document.querySelector('button[value="="]');

    let string = '',                 // строковое значение числа
        total = '',                 // итоговое значение, результат к-л операции
        lastoperation = '',        //  последня операция до нажатия на '='   
        regexp = /[\/\*\-\+]/g;

    for(let btn of allBtns) {
        btn.addEventListener('click', ()=> {

            // Настрока кнопок от 0 до 9
            if(btn.value.match(/[0-9]/)) {
                if(btn.value == '0' && (string.length == 0 || string == '-')) {
                    console.log('0 не может стоять первым, если не задумано дробное число');
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
        return string;
    }

    // Расчёт процента от ста (%)
    function calcPercent(string) {
        let num,
            result;
        string = checkLastChar(string);
        num = Number(fromComma_toDot(string))/100;

        result = rounding(num).replace('.', ',');
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
            /*
                Перед нажатием на знак либо нет string и total, что соотв. ситуации, когда пользователь начинает расчёт сразу со знака, подразумевая,
                что действие будет произведено с '0': *6=0, за первую строку берётся '0';
                Вторая ситуация - пользователь сначала нажал на один знак, а потом, передумав, на второй: 2*+2. В данной ситуации так же уже отсутствуют
                string и total. За предыдущ. строку также берётся '0': 2*0+2;
                Третья ситуация(в дополнение к первой) - строка в начале расчёта равна либо '-', либо '0,', либо '-0,'
            
            */
            } else if((string.length == 0 && total.length == 0) || string == '-' || string == '0,' || string == '-0,') {
                string = '';
                stringForCalculation += ('0' + func.value);
            }
            // console.log(stringForCalculation);
        });
    }

    // Настрока =
    equality.addEventListener('click', ()=> {
        if(total.length >= 1 && lastoperation.length >= 1) {
            total = repeatLastFunc(total, lastoperation);
            total = rounding(total);
        } else {
            string = checkLastChar(string);                                // проверка, не заканчивается ли string на ','

            /*
                Ситуация типа '6'-0+'3' и '6'*0 (обозначены строки; 0 возвращает пустую строку):
                - в первом случае в stringForCalculation сохранается 6-+3,
                    а - и + искусственно создают между собой '0' как строку (см. обработчик для func)
                - во втором случае происходит преобразование типов - пустая строка преобразуется в 0  в результате вычислений
            */
            stringForCalculation += string;
            arrNums = stringForCalculation.split(regexp);
            arrOperations = stringForCalculation.match(regexp);

            /*
                Логика, описананная ниже, предотвращает ошибку в случае, если польз-ль оканчивает свой расчёт знаком: 2*3-=,
                т.к. цикл запускается по массиву с числами и бессмысленный последний знак в функцию calculation уже не попадает
            */
            for(let i = 0; i < arrNums.length; i++) {
                arrNums[i] = fromComma_toDot(arrNums[i]);
                if(i == 1) {
                    let obj = culculation(arrNums[i-1], arrNums[i], i-1);
                    arrTotals.push(obj.itemTotal);
                    lastoperation = obj.lastoperation;
                    // console.log(arrTotals);
                } else if(i >= 2) {lastoperation
                    obj = culculation(arrTotals[i-2], arrNums[i], i-1);
                    arrTotals.push(obj.itemTotal);
                    lastoperation = obj.lastoperation;
                    // console.log(arrTotals);
                }
                
            }

            total = rounding(arrTotals[arrTotals.length-1]);
        }
        
        console.log(total); // Вывод total
        fillEntryField(total);
        clearVar();
    });

    // Выполнение операций деления, умножения, вычитания и сложения
    function culculation(item1, item2, index) {
        let obj = {};
        obj.itemTotal;
        obj.lastoperation;    // последняя операция

        if(arrOperations[index] == '/') {
            obj.itemTotal = (Number(item1)/Number(item2));
            obj.lastoperation = `/${item2}`;
        } else if (arrOperations[index] == '-') {
            obj.itemTotal = (Number(item1)-Number(item2));
            obj.lastoperation = `-${item2}`;
        } else if (arrOperations[index] == '*') {
            obj.itemTotal = (Number(item1)*Number(item2));
            obj.lastoperation = `*${item2}`;
        } else if (arrOperations[index] == '+') {
            obj.itemTotal = (Number(item1)+Number(item2));
            obj.lastoperation = `+${item2}`;
        }
        return obj;
    }

    // Повторное выполнение последней операции
    function repeatLastFunc(num, lastoperation) {
        let lastitem = fromComma_toDot(lastoperation.replace(regexp, '')),
            sign = lastoperation[lastoperation.search(regexp)],
            total;
        num = fromComma_toDot(num);
        
        if(sign == '/') {
            total = (Number(num)/Number(lastitem));
        } else if (sign == '-') {
            total = (Number(num)-Number(lastitem));
        } else if (sign == '*') {
            total = (Number(num)*Number(lastitem));
        } else if (sign == '+') {
            total = (Number(num)+Number(lastitem));
        }
        return total;
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
            } else {
                str = arr.join('');
                return str;
            }
        }
    }

    // Функция замены ',' на '.' для дальнейших вычислительных действий
    function fromComma_toDot(str) {
        if(str.includes(',')) {
            str = str.replace(',', '.');
        } 
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