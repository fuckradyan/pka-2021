TrueAlph = true;
// var alphabet = `абвгдеёжзийклмнопрстуфхцчшщъыьэюя!? ;-:,.\n'"`;
var matrixCol = 0;
var ObrMatrix = '';
var alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя `;

function switching() {
    if (TrueAlph) {
        alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
        $('#alphabetPlace').text(`Алфавит сейчас: [${alphabet}]`)
        TrueAlph = false;
    } else {
        alphabet = `абвгдеёжзийклмнопрстуфхцчшщъыьэюя!? ;-:,.\n'"`;
        $('#alphabetPlace').text(`Алфавит сейчас: [${alphabet}]`)
        TrueAlph = true;
    }
}

function prepare(message) {
    message = message.toLowerCase();
    message = message.replaceAll(`!`, 'вск');
    message = message.replaceAll(`?`, 'впр');
    message = message.replaceAll(`;`, 'тчкзпт');
    message = message.replaceAll(`-`, '');
    message = message.replaceAll(`:`, '');
    message = message.replaceAll(`,`, 'зпт');
    message = message.replaceAll(`.`, 'тчк');
    message = message.replaceAll(`\n`, '');
    message = message.replaceAll(`"`, '');
    message = message.replaceAll(`'`, '');
    return message
}

function replaceBack(message) {
    message = message.replaceAll(`вск`, '!');
    message = message.replaceAll(`впр`, '?');
    message = message.replaceAll(`тчкзпт`, ';');
    message = message.replaceAll(`зпт`, ',');
    message = message.replaceAll(`тчк`, '.');
    return message
}

function atbash(message) {
    var alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
    var encoded_string = "";
    var decoded_string = "";
    message = prepare(message)
    message = message.replaceAll(' ', '')
        // шифрование атбаш
    for (i = 0; i < message.length; i++) {
        b = alphabet.length - alphabet.indexOf(message[i]) - 1;
        encoded_string += alphabet[b];
    }
    $('#lab1_1_enc').val(encoded_string);
    // расшифровка атбаш
    for (i = 0; i < encoded_string.length; i++) {
        b = alphabet.length - alphabet.indexOf(encoded_string[i]) - 1;
        decoded_string += alphabet[b];
    }
    $('#lab1_1_dec').val(replaceBack(decoded_string));
    return encoded_string;
}

function caesar(message, step) {
    var encoded_string = "";
    var decoded_string = "";
    step = $('#lab1_2_step').val();
    // проверка ключа
    if (Number.isInteger(Number(step))) {

    } else {
        alert('Введите число типа int')
        return;
    }
    message = prepare(message);
    // шифрование цезарь
    for (i = 0; i < message.length; i++) {
        b = (alphabet.length + alphabet.indexOf(message[i]) + step % alphabet.length) % alphabet.length;
        encoded_string += alphabet[b];
    }
    $('#lab1_2_enc').val(encoded_string);
    // расшифровка цезарь
    for (i = 0; i < encoded_string.length; i++) {
        b = (alphabet.length + alphabet.indexOf(encoded_string[i]) - step % alphabet.length) % alphabet.length;
        decoded_string += alphabet[b];
    }
    $('#lab1_2_dec').val(replaceBack(decoded_string));
    return encoded_string;

}

function polibius(message) {
    var encoded_string = "";
    var decoded_string = "";
    message = prepare(message);
    square = 0;
    // составление квадрата
    while (alphabet.length > square ** 2 || alphabet.length == square ** 2) {
        square += 1;
    }
    // заполнение
    var x = [],
        i, j;
    for (i = 0; i < square; i++) {
        x[i] = new Array();
        for (j = 0; j < square; j++) {
            alphabet[square * i + j] ? x[i][j] = alphabet[square * i + j] : x[i][j] = '';
        }
    }
    // шифрование квадрат полибия
    for (i = 0; i < message.length; i++) {
        for (k = 0; k < x.length; k++) {
            if (x[k].indexOf(message[i]) != -1) {
                encoded_string += `${k}${x[k].indexOf(message[i])} `;
            }
        }
    }

    // расшифровка квадрат полибия
    enc_array = encoded_string.split(' ');
    for (i = 0; i < enc_array.length; i++) {
        if (enc_array[i][0] && enc_array[i][1]) {
            decoded_string += x[Number(enc_array[i][0])][Number(enc_array[i][1])];
        }
    }
    $('#lab1_3_enc').val(encoded_string);
    $('#lab1_3_dec').val(replaceBack(decoded_string));
}

function tritemius(message) {
    var encoded_string = "";
    var decoded_string = "";
    message = prepare(message);
    message = message.replaceAll(' ', '');
    var alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
    // шифрование тритемия
    for (i = 0; i < message.length; i++) {
        b = (alphabet.length + alphabet.indexOf(message[i]) + i % alphabet.length) % alphabet.length;
        encoded_string += alphabet[b];
    }
    $('#lab2_1_enc').val(encoded_string);
    // расшифровка тритемия
    for (i = 0; i < encoded_string.length; i++) {
        b = (alphabet.length + alphabet.indexOf(encoded_string[i]) - i % alphabet.length) % alphabet.length;
        decoded_string += alphabet[b];
    }
    $('#lab2_1_dec').val(replaceBack(decoded_string));
    return encoded_string;
}

function belazo(message, key) {
    var encoded_string = "";
    var decoded_string = "";
    var alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
    message = prepare(message);
    messArr = message.split(' ');
    console.log(messArr);
    currlenght = 0;
    // проверка ключа
    if (Number.isInteger(Number(key))) {
        alert('Ключ должен быть типа str и не содержать чисел');
        return;
    }
    //шифрование
    for (i = 0; i < messArr.length; i++) {
        for (j = 0; j < messArr[i].length; j++) {

            currAlphabet = alphabet.substring(alphabet.indexOf(key[currlenght % key.length]), alphabet.length) + alphabet.substring(0, alphabet.indexOf(key[currlenght % key.length]));
            // подробная последовательность действий выполнения программы
            console.log(`найти ${messArr[i][j]} при помощи ${key[currlenght%key.length]} в ` + currAlphabet);
            console.log('получается');
            console.log(currAlphabet[alphabet.indexOf(messArr[i][j])]);

            encoded_string += currAlphabet[alphabet.indexOf(messArr[i][j])];
            currlenght++;
        }
        encoded_string += ' ';
    }
    $('#lab2_2_enc').val(encoded_string);
    encArr = encoded_string.split(' ');
    currlenght = 0;
    // расшифровка
    for (i = 0; i < encArr.length; i++) {
        for (j = 0; j < encArr[i].length; j++) {
            console.log(encArr[i][j]);
            console.log(`(${alphabet.length} + ${alphabet.indexOf(encArr[i][j])} - ${alphabet.indexOf(key[currlenght%key.length])}) % ${alphabet.length}`)
            decoded_string += alphabet[(alphabet.length + alphabet.indexOf(encArr[i][j]) - alphabet.indexOf(key[currlenght % key.length])) % alphabet.length]
            currlenght++;
        }
        decoded_string += ' ';
    }
    console.log(decoded_string);
    $('#lab2_2_dec').val(replaceBack(decoded_string));
}

function vizhener(message, key) {
    currlenght = 0;
    var alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
    key = key[0];
    // проверка ключа
    if (Number.isInteger(Number(key))) {
        alert('Ключ должен быть типа str и не содержать чисел');
        return;
    }
    var encoded_string = "";
    var decoded_string = "";
    message = prepare(message);
    messArr = message.split(' ');
    new_alph = key + message;
    new_alph = new_alph.replace(' ', '');
    console.log(new_alph);
    // шифрование
    for (i = 0; i < messArr.length; i++) {
        for (j = 0; j < messArr[i].length; j++) {
            console.log(messArr[i][j]);
            console.log(new_alph[currlenght]);

            encoded_string += alphabet[(alphabet.length + alphabet.indexOf(messArr[i][j]) + alphabet.indexOf(new_alph[currlenght])) % alphabet.length];
            console.log(`(${alphabet.indexOf(messArr[i][j])}+${alphabet.indexOf(new_alph[currlenght])})%${alphabet.length}`)
            console.log(encoded_string);
            currlenght++;
            console.log('---')
        }
        encoded_string += ' '
    }
    $('#lab2_3_enc').val(encoded_string);
    new_enc = key + encoded_string.replace(' ', '');
    encArr = encArr = encoded_string.split(' ');
    currlenght = 0;
    //расшифрование
    for (i = 0; i < encArr.length; i++) {
        for (j = 0; j < encArr[i].length; j++) {
            decoded_string += alphabet[(alphabet.length + alphabet.indexOf(encArr[i][j]) - alphabet.indexOf(new_alph[currlenght])) % alphabet.length];
            currlenght++;
        }
        decoded_string += ' '
    }
    $('#lab2_3_dec').val(replaceBack(decoded_string));
}

function matrixCypher(message) {
    message = prepare(message);
    // проверка условия
    if (message.length < matrixCol) {
        alert(`Исходное сообщение должно быть >= ${matrixCol}`);
        return 0
    }
    var pythonMatrix = ''
    var matrixInput = document.querySelector('#MatrixPlace');
    // заполнение массива значениями из матрицы
    var InputedMatrix = new Array(matrixInput.children.length);
    for (i = 0; i < matrixInput.children.length; i++) {
        InputedMatrix[i] = new Array(matrixInput.children.length);
        for (j = 0; j < matrixInput.children[i].children.length; j++) {
            InputedMatrix[i][j] = matrixInput.children[i].children[j].value;
            pythonMatrix += ' ' + matrixInput.children[i].children[j].value;
        }
        pythonMatrix += ';'
    }


    if (message.length % matrixCol != 0) {
        message += 'a'.repeat(matrixCol - message.length % matrixCol)
    }

    alphabet1 = `абвгдежзийклмнопрстуфхцчшщъыьэюя `;

    var enc_string = ''
    var enc_array = new Array()
    var pythonPortion = ''
    for (i = 0; i < message.length; i += parseInt(matrixCol)) {


        if (i < message.length - 1) {
            for (j = 0; j < matrixCol; j++) {
                if (alphabet1.indexOf(message[i + j]) != -1) {
                    pythonPortion += ' ' + alphabet1.indexOf(message[i + j]) + ";";
                } else {
                    pythonPortion += ' ' + '0' + ";";
                }

            }

        }

    }


    url = `${window.location.origin}` + '/lab3Umn' + `?shape=${matrixCol}&matrix1=${pythonMatrix}&matrix2=${pythonPortion}`;
    //  console.log(url);
    sendRequest(url, 'GET', function() {
        UmnMatrix = this.response;
        for (i = 0; i < UmnMatrix.length; i++)
            enc_string += `${UmnMatrix[i]}, `
        Array.prototype.push.apply(enc_array, UmnMatrix)
        $('#lab3_1_enc').val(enc_string);
    })

    //  $('#lab3_1_enc').val(enc_string);
    url = `${window.location.origin}` + '/lab3Obr' + `?matrix=${pythonMatrix}`;
    sendRequest(url, 'GET', function() {
        // проверка ключа
        if (this.response == "вырожденная") {
            alert("Ошибка. Определитель матрицы равен нулю")
            return 0
        }
        ObrMatrix = this.response;

        Obr_str = ''
        console.log(ObrMatrix);
        // преобразование вида матрицы для вычислений
        for (i = 0; i < ObrMatrix.length; i++) {
            for (j = 0; j < ObrMatrix[i].length; j++) {
                Obr_str += ' ' + ObrMatrix[i][j];

            }
            Obr_str += ';'
        }
        enc_str = ''
            //  cоставление векторов
        for (i = 0; i < enc_array.length; i += parseInt(matrixCol)) {
            if (i < enc_array.length - 1) {

                console.log(url);
                enc_str += enc_array.slice(i, i + parseInt(matrixCol)).toString().replaceAll(',', '; ') + '; '
                console.log(enc_str);

            }
        }
        dec_str = ''
        url = `${window.location.origin}` + '/lab3Umn1' + `?shape=${matrixCol}&matrix1=${Obr_str}&matrix2= ${enc_str}`;
        sendRequest(url, 'GET', function() {
            UmnMatrix = this.response;
            for (i = 0; i < UmnMatrix.length; i++)
                dec_str += alphabet1[UmnMatrix[i]];
            Array.prototype.push.apply(enc_array, UmnMatrix)
            $('#lab3_1_dec').val(replaceBack(dec_str));
            console.log(dec_str)
        })

    })
}

function BuildMatrix(Number) {
    matrixCol = Number;
    document.querySelector('#MatrixPlace').innerHTML = '';
    // построение матрицы по заданным пользователем значениям в GUI
    for (i = 0; i < Number; i++) {
        var row = document.createElement('div');
        row.classList += "row";
        for (j = 0; j < Number; j++) {
            var input = document.createElement("input");
            input.classList.add('col-md-1');
            row.appendChild(input);
        }
        document.querySelector('#MatrixPlace').appendChild(row);
    }

}
window.onload = function() {
    $('#changeAlph').click(function() {
        switching();
    })
    $('#alphabetPlace').text(`Алфавит сейчас: [${alphabet}]`)
    $('#lab1_1').click(function() {
        console.log(atbash($('#lab1_1_mes').val()))
    });
    $('#lab1_2').click(function() {
        console.log(caesar($('#lab1_2_mes').val()))
    });
    $('#lab1_3').click(function() {
        console.log(polibius($('#lab1_3_mes').val()))
    });
    $('#lab2_1').click(function() {
        console.log(tritemius($('#lab2_1_mes').val()))
    })
    $('#lab2_2').click(function() {
        belazo($('#lab2_2_mes').val(), $('#lab2_2_key').val());
    })
    $('#lab2_3').click(function() {
        vizhener($('#lab2_3_mes').val(), $('#lab2_3_key').val());
    })
    $('#lab3_matr_submit').click(function() {
        BuildMatrix($('#preMatrix').val());
    })
    $('#lab3_1').click(function() {
        matrixCypher($('#lab3_1_mes').val());
    });
    $('#lab3_2').click(function() {
            Playfaircipher();
            deCodeCipher();
        }

    );
    $('#lab4_1').click(function() {
        VerticalCypher($('#lab4_1_mes').val(), $('#lab4_1_key').val());
    });
    $('#lab4_2').click(function() {
        Cardan($('#lab4_2_mes').val(), $('#lab4_2_key').val());
    });
    $('#lab5_1').click(function() {
        Shennon(prepare($('#lab5_1_mes').val()), );
    });
    $('#lab5_2').click(function() {
        Gost89(prepare($('#lab5_2_mes').val()), );
    });
    $('#lab6_1').click(function() {
        A51(prepare($('#lab6_1_mes').val()), $('#lab6_1_key').val());
    });
    // $('#lab7_1').click(function() {
    //     Kuznechik($('#lab7_1_mes').val().replaceAll('\n', ' ').replaceAll('-', ' ').replaceAll(':', ' ').replaceAll(';', ' ').replaceAll('"', ' ').replaceAll(')', '').replaceAll('(', '').toLowerCase().replaceAll('.', 'тчк').replaceAll(',', 'зпт').replaceAll('!', 'вск').replaceAll('?', 'впр'), );
    // });
    $('#lab7_2').click(function() {
        Magma(prepare($('#lab7_2_mes').val()), $('#lab7_2_key').val());
    });
    $('#lab8_1').click(function() {
        RSA(prepare($('#lab8_1_mes').val()).replaceAll(' ', ''), $('#lab8_1_p').val(), $('#lab8_1_q').val());
    });
    $('#lab9_1').click(function() {
        DSRSA(prepare($('#lab9_1_mes').val()), $('#lab9_1_p').val(), $('#lab9_1_q').val());
    });
    $('#lab10_1').click(function() {
        gost94(prepare($('#lab10_1_mes').val()), $('#lab10_1_p').val(), $('#lab10_1_q').val(), $('#lab10_1_a').val(), $('#lab10_1_x').val(), $('#lab10_1_k').val());
    });
    $('#lab11_1_btn1').click(function() {
        n1 = parseInt($('#lab11_1_2').val());
        a1 = parseInt($('#lab11_1_1').val());
        ka1 = parseInt($('#lab11_1_ka').val());
        // проверка введенных пользователем значений
        if (n1 > a1 && ka1 > 2 && ka1 < n1 - 1) {
            $('#hidden1').removeClass('d-none');
            $('#hidden1Ya').text('Ваш Ya = ' + a1 ** ka1 % n1)
            Ya1 = a1 ** ka1 % n1;

        } else {
            alert('n должно быть больше a. 2 < Ka < n-1. Введите корректные значения')
        }
        $('#lab11_1_btn2').click(function() {
            $('#hidden1Ka').text('Ваш общий ключ = ' + a1 ** (Ya1 * parseInt($('#lab11_1_3').val())) % n1)
        });
    });

    $('#lab11_2_btn1').click(function() {
        n2 = parseInt($('#lab11_2_2').val());
        a2 = parseInt($('#lab11_2_1').val());
        ka2 = parseInt($('#lab11_2_ka').val());
        // проверка введенных пользователем значений
        if (n2 > a2 && ka2 > 2 && ka2 < n2 - 1) {
            $('#hidden2').removeClass('d-none');
            $('#hidden2Ya').text('Ваш Ya = ' + a2 ** ka2 % n2)
            Ya2 = a2 ** ka2 % n2;

        } else {
            alert('n должно быть больше a. 2 < Ka < n-1. Введите корректные значения')
        }
        $('#lab11_2_btn2').click(function() {
            $('#hidden2Ka').text('Ваш общий ключ = ' + a2 ** (Ya2 * parseInt($('#lab11_2_3').val())) % n2)
        });
    });


}

function sendRequest(url, method, onloadHandler, params) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';
    xhr.onload = onloadHandler;
    xhr.send(params);

}

var isChet = false;
var isEnd = false;
var flag = false;
var flagX = false;
var flagAdd = false;

function processKey() {

    var key = document.getElementById("lab3_2_key").value.replaceAll('й', 'и').replaceAll('ъ', 'ь').replaceAll('ё', 'е');
    key = key.toUpperCase().replace(/\s/g, '');
    // проверка ключа
    if (Number.isInteger(Number(key))) {
        alert('Ключ должен быть типа str и не содержать чисел');
        return '';
    }
    var result = [];
    var temp = '';
    var alphabet = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЬЭЮЯ';
    // удаление из алфавита букв, присутствующих в ключе
    for (var i = 0; i < key.length; i++) {
        if (alphabet.indexOf(key[i]) !== -1) {
            alphabet = alphabet.replace(key[i], '');
            temp += key[i];

        }
    }
    console.log('НОВЫЙ КЛЮЧ')
    console.log(temp);
    // соединение ключа и алфавита
    temp += alphabet;
    var result = [];
    temp = temp.split('');
    while (temp[0]) {
        result.push(temp.splice(0, 5));
    }
    return result;
}

function Playfaircipher() {

    var keyresult = processKey();
    var res = [];
    var error = 'Строка пуста';

    var str = document.getElementById("lab3_2_mes").value.replaceAll(' ', '');
    str = prepare(str);
    // if (str === '') {
    //     alert(error);
    //     return
    // }
    // var err = 'ERRORX';
    var textPhrase, separator;
    str = str.toUpperCase();
    if (str.length === 0) {} else {
        textPhrase = str[0];
    }
    var help = 0;
    flagAdd = false;
    // случаи вставки сепараторов
    for (var i = 1; i < str.length; i++) {
        if (str[i - 1] === str[i]) {
            if (str[i] === 'Х') {
                // вставка сепаратора ь, если текущий символ равен х
                separator = 'Ь';
            } else {
                // вставка сепаратора х, если текущий символ не равен х
                separator = 'Х';
            }
            textPhrase += separator + str[i];
            help = 1;
        } else {

            textPhrase += str[i];
        }
        if (help === 1) {
            flagAdd = true;
        }
    }
    // случай нечетнойй длины строки
    if (textPhrase.length % 2 !== 0) {
        if (textPhrase[textPhrase.length - 1] === 'Х') {
            // вставка ь если последний символ - х 
            textPhrase += 'Ь';
            isEnd = true;
            flagX = false;
        } else {
            // вставка х в ином случае
            textPhrase += 'Х';
            isEnd = true;
            flagX = true;
        }
    }

    var t = [];
    var enCodeStr = '';
    // переход биграмм входного текста к биграммам выходного текста
    for (var i = 0; i < textPhrase.length; i += 2) {
        var pair1 = textPhrase[i];
        var pair2 = textPhrase[i + 1];
        var p1i, p1j, p2i, p2j;
        //  нахождение индексов букв в новом алфавите
        for (var stroka = 0; stroka < keyresult.length; stroka++) {
            for (var stolbec = 0; stolbec < keyresult[stroka].length; stolbec++) {
                if (keyresult[stroka][stolbec] == pair1) {
                    console.log(`${keyresult[stroka][stolbec]} == ${pair1}`)
                    p1i = stroka;
                    p1j = stolbec;
                    console.log(`p1i = ${stroka}; p1j = ${stolbec}`)
                }
                if (keyresult[stroka][stolbec] == pair2) {
                    console.log(`${keyresult[stroka][stolbec]} == ${pair2}`)
                    p2i = stroka;
                    p2j = stolbec;
                    console.log(`p2i = ${stroka}; p2j = ${stolbec}`)
                }
            }
        }
        console.log(keyresult)
        console.log(pair1, p1i, p1j)
        console.log(pair2, p2i, p2j)
        console.log(p1j)
        var coord1 = '',
            coord2 = '';
        // случай, когда буквы находятся в одной строке
        if (p1i === p2i) {
            console.log(`p1i = p2i`)
                // если первая буква находится в последнем столбце, переходит в первый
            if (p1j === 6) {
                coord1 = keyresult[p1i][0];
                console.log(`p1j = 6`)
                console.log(`coord1 = ${keyresult[p1i][0]}`)
            } else {
                // иначе сдвиг на +1 по модулю длины строки
                coord1 = keyresult[p1i][(p1j + 1) % keyresult[p1i].length];
                console.log(`p1j != 6`)
                console.log(`coord1 = ${keyresult[p1i][(p1j + 1) % keyresult[p1i].length]}`)
            }
            // если вторая буква находится в последнем столбце, переходит в первый
            if (p2j === 6) {
                console.log(`p2j = 6`)
                coord2 = keyresult[p2i][0];
                console.log(`coord2 = ${keyresult[p2i][0]}`)
            } else {
                console.log(`p2j != 6`)
                    // иначе сдвиг на +1 по модулю длины строки
                coord2 = keyresult[p2i][(p2j + 1) % keyresult[p2i].length]
                console.log(`coord2 = ${keyresult[p2i][(p2j + 1) % keyresult[p2i].length]}`)
            }
        }
        // случай, когда буквы находятся в одном столбце
        if (p1j === p2j) {
            console.log(`p1j = p2j`)
                // если первая буква находится в последней строке, переходит в первую
            if (p1i === 5) {
                console.log(`p1i = 5`)
                console.log(`coord1 = ${keyresult[0][p1j]}`)
                coord1 = keyresult[0][p1j];
            } else {
                // иначе сдвиг на +1 по модулю количества строк
                console.log(`p1i != 5`)
                console.log(`coord1 = ${keyresult[(p1i + 1) % keyresult.length][p1j]}`)
                coord1 = keyresult[(p1i + 1) % keyresult.length][p1j];
            }
            if (p2i === 5) {
                // если вторая буква находится в последней строке, переходит в первую
                console.log(`p2i = 5`)
                console.log(`p2i = ${keyresult[0][p2j]}`)
                coord2 = keyresult[0][p2j];
            } else {
                // иначе сдвиг на +1 по модулю количества строк
                console.log(`p2i != 5`)
                console.log(`p2i = ${keyresult[(p2i + 1) % keyresult.length][p2j]}`)
                coord2 = keyresult[(p2i + 1) % keyresult.length][p2j]
            }
        }
        // случай, когда буквы не имеют общих строк и столбцов
        if (p1i !== p2i && p1j !== p2j) {
            // индекс столбца первой буквы, меняется на индекс столбца второй буквы
            // индекс столбца второй буквы, меняется на индекс столбца первой буквы
            console.log(`p1i !== p2i && p1j !== p2j`)
            console.log(`p1i !== p2i && p1j !== p2j`)
            console.log(`coord1 = ${keyresult[p1i][p2j]}`)
            console.log(`coord2 = ${keyresult[p2i][p1j]}`)
            coord1 = keyresult[p1i][p2j];
            coord2 = keyresult[p2i][p1j];
        }
        enCodeStr = enCodeStr + coord1 + coord2;
    }
    document.getElementById("lab3_2_enc").value = enCodeStr.toLocaleLowerCase();
    alert(enCodeStr)
    console.log(enCodeStr)
    console.log('!!!')
        // alert("Добавили букву в середине слова? - " + flagAdd);
    return enCodeStr;
}

function deCodeCipher() {
    var deCodeStr = '';
    var text = '';
    var error = "Warning!!! String is empty";
    var text1 = Playfaircipher();
    if (text1 === '') {
        alert(error);
    }
    var keyresult = processKey();
    // переход биграмм выходного текста к биграммам изначального текста
    for (var i = 0; i < text1.length; i += 2) {
        var pair1 = text1[i];
        var pair2 = text1[i + 1];
        var p1i, p1j, p2i, p2j;
        //  нахождение индексов букв в матрице
        for (stroka = 0; stroka < keyresult.length; stroka++) {
            for (stolbec = 0; stolbec < keyresult[stroka].length; stolbec++) {
                if (keyresult[stroka][stolbec] == pair1) {
                    p1i = stroka;
                    p1j = stolbec;
                }
                if (keyresult[stroka][stolbec] == pair2) {
                    p2i = stroka;
                    p2j = stolbec;
                }
            }
        }
        var coord1 = '',
            coord2 = '';
        // случай, когда буквы находятся в одной строке
        if (p1i === p2i) {
            // если первая буква в первом столбце, меняется на последний столбец, иначе сдвиг на -1 по модулю длины строки
            if (p1j === 0) {
                coord1 = keyresult[p1i][4];
            } else {
                coord1 = keyresult[p1i][(keyresult[p1i].length + p1j - 1) % keyresult[p1i].length];
            }
            // если вторая буква в первом столбце, меняется на последний столбец, иначе сдвиг на -1 по модулю длины строки
            if (p2j === 0) {
                coord2 = keyresult[p2i][4];
            } else {
                coord2 = keyresult[p2i][(keyresult[p1i].length + p2j - 1) % keyresult[p2i].length]
            }
        }
        // случай, когда буквы находятся в одном столбце
        if (p1j === p2j) {
            // если первая буква в первой строке, меняется на последнюю строку, иначе сдвиг на -1 по модулю количества строк
            if (p1i === 0) {
                coord1 = keyresult[5][p1j]
            } else {
                coord1 = keyresult[(keyresult.length + p1i - 1) % keyresult.length][p1j];
            }
            // если вторая буква в первой строке, меняется на последнюю строку, иначе сдвиг на -1 по модулю количества строк
            if (p2i === 0) {
                coord2 = keyresult[5][p2j];
            } else {
                coord2 = keyresult[(keyresult.length + p2i - 1) % keyresult.length][p2j]
            }
        }
        // случай, когда буквы не имеют общих строк и столбцов
        if (p1i !== p2i && p1j !== p2j) {
            // индекс столбца первой буквы, меняется на индекс столбца второй буквы
            // индекс столбца второй буквы, меняется на индекс столбца первой буквы
            coord1 = keyresult[p1i][p2j];
            coord2 = keyresult[p2i][p1j];
        }
        text = text + coord1 + coord2;
    }
    text = text.split('');
    // удаление сепараторов
    for (var i = 0; i < text.length; i++) {
        var count;
        if (flagAdd) {
            if (text[i] === text[i + 2] && (text[i + 1] === 'Х' || text[i + 1] === 'Ь')) {
                count = i + 1;
                text.splice(count, 1);
            }
        } else if (flagAdd && isEnd && (flagX || !flagX)) {
            if (text[i - 2] === text[i] && (text[i - 1] === 'Х' || text[i - 1] === 'Ь'))
                count = i + 1;
            text.splice(count, 1);
        } else if (!flagAdd) {
            break;
        }
    }
    if (flagX) {
        text.pop();
    }
    if (isEnd && !flagX) {
        text.pop();
    }
    text = text.join('');
    console.log(text);
    document.getElementById('lab3_2_dec').innerHTML = replaceBack(text.toLowerCase());
}

function VerticalCypher(msg, key) {
    if (Number.isInteger(Number(key))) {


    } else {
        alert('Ключ должен быть числом')
        return
    }
    url = `${window.location.origin}` + '/lab4Enc' + `?msg=${msg}&key=${key}`;

    sendRequest(url, 'GET', function() {
        console.log(this.response);
        encode_str = this.response;
        console.log(encode_str);

        $('#lab4_1_enc').val(encode_str.replaceAll(`_`, ''));
        url = `${window.location.origin}` + '/lab4Dec' + `?msg=${encode_str}&key=${key}`;
        sendRequest(url, 'GET', function() {
            console.log(this.response);
            decode_str = this.response;
            console.log(decode_str);

            $('#lab4_1_dec').val(replaceBack(decode_str));

        })

    })
}

function Cardan(msg, key) {
    url = `${window.location.origin}` + '/lab4Enc1' + `?msg=${msg}&key=${key}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        $('#lab4_2_enc').val(this.response[0]);
        $('#lab4_2_dec').val(this.response[1]);
    })

}


function Shennon(msg) {
    url = `${window.location.origin}` + '/lab5shennon' + `?msg=${msg}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        $('#lab5_1_enc').val(`${this.response[0][0]} \n\nгамма(для ручного теста)  ${this.response[0][1]}`);
        $('#lab5_1_dec').val(this.response[1]);
    })
}


function Gost89(msg) {
    url = `${window.location.origin}` + '/lab5gost' + `?msg=${msg}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        $('#lab5_2_enc').val(this.response[0]);
        $('#lab5_2_dec').val(this.response[1]);

    })
}

function A51(msg, key) {
    // проверка ключа
    if (key.length == 64 && key.match(/^([01])+/)[0].length == 64) {} else {
        alert('Ключ должен быть размером 64 бита и содержать только 0 и 1')
        return;
    }
    url = `${window.location.origin}` + '/lab6a51' + `?msg=${msg}&key=${key}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        $('#lab6_1_enc').val(this.response[0]);
        $('#lab6_1_dec').val(replaceBack(this.response[1]));

    })
}

// function Kuznechik(msg) {
//     url = `${window.location.origin}` + '/lab7kuznechik' + `?msg=${msg}`;
//     sendRequest(url, 'GET', function() {
//         console.log(this.response)

//     })
// }


function Magma(msg, key) {
    url = `${window.location.origin}` + '/lab7Magma' + `?msg=${msg}&key=${key}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        $('#lab7_2_enc').val(this.response[0]);
        $('#lab7_2_dec').val(replaceBack(this.response[1]));
    })
}


function RSA(msg, p, q) {
    url = `${window.location.origin}` + '/lab8rsa' + `?msg=${msg}` + `&p=${p}` + `&q=${q}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        if (this.response == 'Ошибка.' || this.response == 'p и q не могут быть равны' || this.response == 'Оба числа должны быть простыми.') {
            alert(this.response)
            return
        } else {
            $('#lab8_1_enc').val(this.response[0]);
            $('#lab8_1_dec').val(replaceBack(this.response[1]));
        }
    })
}

function DSRSA(msg, p, q) {
    url = `${window.location.origin}` + '/lab9dsrsa' + `?msg=${msg}` + `&p=${p}` + `&q=${q}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        $('#lab9_1_1').val(this.response[0]);
        $('#lab9_1_2').val(this.response[1]);
        $('#lab9_1_3').val(this.response[2]);
        if (this.response[0] == this.response[2]) {
            alert('Подпись верна')
        } else {
            alert('Подпись не верна')
        }
    })
}

function gost94(msg, p, q, a, x, k) {
    // проверка ключей на то, являются ли они числом
    if (Number.isInteger(Number(p)) && Number.isInteger(Number(q)) && Number.isInteger(Number(a)) && Number.isInteger(Number(x)) && Number.isInteger(Number(k))) {
        // проверка ключей на требование стандарта
        if ((Number(p) - 1) % Number(q) == 0 && Number(a) > 1 && Number(a) < (p - 1) && Number(a) ** Number(q) % Number(p) == 1 && Number(x) < Number(q)) {} else {
            alert('ключи заданы не по стандарту');
            return;
        }
    } else {
        alert('Ключи должны быть числами')
        return;
    }
    url = `${window.location.origin}` + '/gost94' + `?msg=${msg}` + `&p=${p}` + `&q=${q}` + `&a=${a}` + `&x=${x}` + `&k=${k}`;
    sendRequest(url, 'GET', function() {
        console.log(this.response)
        $('#lab10_1_1').val(this.response[0]);
        $('#lab10_1_2').val(this.response[1]);
        $('#lab10_1_3').val(this.response[2]);
        $('#lab10_1_4').val(this.response[3]);
    })
}