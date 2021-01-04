window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const allBtns = document.querySelectorAll('.calculator__button'),
        entryField = document.querySelector('.calculator__entry-field'),
        ac = document.querySelector('button[value="AC"]'),

        collectionOrangeBtns = document.getElementsByClassName('calculator__button-orange'),
        arrFunc = [collectionOrangeBtns[0], collectionOrangeBtns[1], collectionOrangeBtns[2], collectionOrangeBtns[3]],
        equality = document.querySelector('button[value="="]');

    
    let string = '',
        permission = true, 
        counter = 1;

    for(let btn of allBtns) {
        btn.addEventListener('click', function(e) {
            if((!btn.value.search(/[0-9]/) || !btn.value.search(/,/i)) && permission) {

                if(!btn.value.search(/[1-9]/)) {
                    if(string.length == 1 && string[0] == '0') {
                        string = '';
                    } else if (string.length == 2 && string == '-0') {
                        string = '-';
                    }
                    ac.textContent = 'C';
                    entryField.textContent = (string += btn.value); 
                } else if(btn.value == ',' && string.length > 0 && !/,/.test(string)) {
                    entryField.textContent = (string += btn.value);
                } else if(btn.value == '0') {
                    if( (string.length == 1 && string[0] == '0') || (string.length == 2 && string == '-0') ) {
                        console.log(string);
                    }  else {
                        entryField.textContent = (string += btn.value);
                    }
                }

            } else if(btn.value == 'AC') {
                ac.textContent = 'AC';
                string = '';
                entryField.textContent = '0';
            } else if(btn.value == '+/-') {
                if(entryField.textContent == '0') {
                    entryField.textContent == '-' + entryField.textContent;
                    
                } else if(string.length > 0 && string[0] != '-') {
                    string = '-' + string;
                    entryField.textContent = string;
                }
                // counter += 1;
                // if(counter % 2 != 0) {
                //     string = string.replace('-', '');

                // } 
                // console.log(counter);
            }
            clearString(string);
            return string;

        });
        
    }

    let stringForCalculation = '',
        arrForCalculation = [],
        regexp = /[\/\*\-\+]/g,
        mass = [],  // Массив из знаков
        intermediateResult = 0, // Переменная, в кот будет записываться и перезаписываться промежуточный результат
        total;  // итог всех расчётов


    for(let item of arrFunc) {
        item.addEventListener('click', function() {
            stringForCalculation += (string + item.value);
            string = '';
            
            console.log(stringForCalculation);
            return stringForCalculation;
        })
    }

    equality.addEventListener('click', function() {
        // Создали массив из чисел м/у кот расположены знаки
        arrForCalculation = stringForCalculation.split(regexp);

        mass = stringForCalculation.match(regexp);

        for(let i = 1; i < arrForCalculation.length; i++) {
            culculation(arrForCalculation[i-1], arrForCalculation[i], i-1);
        }
        total = intermediateResult;
        // console.log(total);
        return total;

    })
    function clearString(string) {
        string = (string.replace(/-/, '')).replace(/,/, '');
        if(string.length >= 9) {
            permission = false;
            console.log('Достигнут максимум');
            return permission;
        }
    }

    function culculation(item1, item2, index) {
        if(index == 0) {
            if(mass[index] == '/') {
                intermediateResult = (Number(item1)/Number(item2));
            } else if (mass[index] == '-') {
                intermediateResult = (Number(item1)-Number(item2));
            } else if (mass[index] == '*') {
                intermediateResult = (Number(item1)*Number(item2));
            } else if (mass[index] == '+') {
                intermediateResult = (Number(item1)+Number(item2));
            }
        } else {
            if(mass[index] == '/') {
                intermediateResult /= Number(item2);
            } else if (mass[index] == '-') {
                intermediateResult -= Number(item2);
            } else if (mass[index] == '*') {
                intermediateResult *= Number(item2);
            } else if (mass[index] == '+') {
                intermediateResult += Number(item2);
            }
        }
        console.log(intermediateResult);
        return intermediateResult;
    }

});