'use strict';

window.addEventListener('DOMContentLoaded', function() {
    const allBtns = document.querySelectorAll('.calculator__button'),
        entryField = document.querySelector('.calculator__entry-field'),
        ac = document.querySelector('button[value="AC"]');

    let string = '',
        writePermisson = false;

    for(let btn of allBtns) {
        btn.addEventListener('click', function(e) {
            check_stringLength();

            if(!btn.value.search(/[0-9]/i) || !btn.value.search(/,/i)) {

                if(!btn.value.search(/[0-9]/i)) {
                    ac.textContent = 'C';
                    entryField.textContent = (string += btn.value); 
                } else if(!btn.value.search(/,/i) && writePermisson) {
                    entryField.textContent = (string += btn.value);
                }

            } else if(btn.value == 'AC') {
                ac.textContent = 'AC';
                string = '';
                entryField.textContent = '0';
            }
            return string;
        });
        
    }
    function check_stringLength() {
        if(string.length > 0) {
            writePermisson = true;
        } else {
            writePermisson = false;
        }
        return writePermisson;
    }


});