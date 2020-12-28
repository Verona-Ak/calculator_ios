'use strict';

window.addEventListener('DOMContentLoaded', function() {
    const allBtns = document.querySelectorAll('.calculator__button'),
        entryField = document.querySelector('.calculator__entry-field'),
        ac = document.querySelector('button[value="AC"]');

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
                if(string.length == 0) {
                    string += '-';
                    entryField.textContent = string + entryField.textContent;
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
    function clearString(string) {
        string = (string.replace(/-/, '')).replace(/,/, '');
        if(string.length >= 9) {
            permission = false;
            console.log('Достигнут максимум');
            return permission;
        }
    }

});