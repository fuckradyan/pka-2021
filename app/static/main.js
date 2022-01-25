TrueAlph = true;
var alphabet = `абвгдеёжзийклмнопрстуфхцчшщъыьэюя!? ;-:,.\n'"`;
var matrixCol = 0;
var ObrMatrix = '';
// var alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
function switching(){
    if (TrueAlph){
        alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
        $('#alphabetPlace').text(`Алфавит сейчас: [${alphabet}]`)
        TrueAlph = false;
    } else {
        alphabet = `абвгдеёжзийклмнопрстуфхцчшщъыьэюя!? ;-:,.\n'"`;
        $('#alphabetPlace').text(`Алфавит сейчас: [${alphabet}]`)
        TrueAlph = true;
    }
}
function atbash(message) {
    var encoded_string = "";
    var decoded_string = "";
    message = message.toLowerCase();
    // шифрование атбаш
    for (i = 0; i < message.length; i++) {
        b = alphabet.length - alphabet.indexOf(message[i]) - 1;
        encoded_string+= alphabet[b];
    }
    $('#lab1_1_enc').val(encoded_string);
    // расшифровка атбаш
    for (i = 0; i < encoded_string.length; i++) {
        b = alphabet.length - alphabet.indexOf(encoded_string[i]) - 1;
        decoded_string+= alphabet[b];
    }
    $('#lab1_1_dec').val(decoded_string);
    return encoded_string;
    }
function caesar(message,step) {
    var encoded_string = "";
    var decoded_string = "";
    step = $('#lab1_2_step').val();
    message = message.toLowerCase();
    // шифрование цезарь
    for (i = 0; i < message.length; i++) {
        b = (alphabet.length + alphabet.indexOf(message[i]) + step % alphabet.length) % alphabet.length;
        encoded_string+= alphabet[b];
    }
    $('#lab1_2_enc').val(encoded_string);
    // расшифровка цезарь
    for (i = 0; i < encoded_string.length; i++) {
        b = (alphabet.length +alphabet.indexOf(encoded_string[i]) - step % alphabet.length) % alphabet.length;
        decoded_string+= alphabet[b];
    }
    $('#lab1_2_dec').val(decoded_string);
    return encoded_string;

}
function polibius(message){
    var encoded_string = "";
    var decoded_string = "";
    message = message.toLowerCase();
    square = 0;
    // составление квадрата
    while (alphabet.length > square**2 || alphabet.length == square**2) {
        square+=1;
    }
    // заполнение
    var x=[], i, j;
    for (i=0; i<square; i++){
    x[i] = new Array();
    for (j=0; j<square; j++){
    alphabet[square*i+j] ? x[i][j]=alphabet[square*i+j] : x[i][j] = '';
    }
   }
   // шифрование квадрат полибия
   for (i=0; i<message.length; i++){
       for (k=0; k<x.length; k++){
           if (x[k].indexOf(message[i])!=-1) {
               encoded_string +=`${k}${x[k].indexOf(message[i])} `;
           }
       }
   }

   console.log(square);
   console.log(x);
   console.log(encoded_string);
   // расшифровка квадрат полибия
   enc_array = encoded_string.split(' ');
   for (i=0; i < enc_array.length; i++){
    if (enc_array[i][0] && enc_array[i][1]) {
        decoded_string += x[Number(enc_array[i][0])][Number(enc_array[i][1])];
    }
   }
   console.log(decoded_string);
   $('#lab1_3_enc').val(encoded_string);
   $('#lab1_3_dec').val(decoded_string);
}
function tritemius(message){
    var encoded_string = "";
    var decoded_string = "";
    message = message.toLowerCase();
    // шифрование тритемия
    for (i = 0; i < message.length; i++) {
        b = (alphabet.length + alphabet.indexOf(message[i]) + i % alphabet.length) % alphabet.length;
        encoded_string+= alphabet[b];
    }
    $('#lab2_1_enc').val(encoded_string);
    // расшифровка тритемия
    for (i = 0; i < encoded_string.length; i++) {
        b = (alphabet.length +alphabet.indexOf(encoded_string[i]) - i % alphabet.length) % alphabet.length;
        decoded_string+= alphabet[b];
    }
    $('#lab2_1_dec').val(decoded_string);
    return encoded_string;
}
function belazo(message,key){
    var encoded_string = "";
    var decoded_string = "";
    message = message.toLowerCase();
    message= message.replace(`!`,'');
    message= message.replace(`?`,'');
    message= message.replace(`;`,'');
    message= message.replace(`-`,'');
    message= message.replace(`:`,'');
    message= message.replace(`,`,'');
    message= message.replace(`.`,'');
    message= message.replace(`\n`,'');
    message= message.replace(`"`,'');
    message= message.replace(`'`,'');
    messArr = message.split(' ');
    console.log(messArr);
    currlenght=0;
    //шифрование
    for (i =0; i < messArr.length; i++){
        for (j=0; j<messArr[i].length;j++){
            
            currAlphabet = alphabet.substring(alphabet.indexOf(key[currlenght%key.length]),alphabet.length) + alphabet.substring(0,alphabet.indexOf(key[currlenght%key.length]));
            console.log(`найти ${messArr[i][j]} при помощи ${key[currlenght%key.length]} в ` + currAlphabet);
            console.log('получается');
            console.log(currAlphabet[alphabet.indexOf(messArr[i][j])]);
            encoded_string +=currAlphabet[alphabet.indexOf(messArr[i][j])];
            currlenght++;
        }
        encoded_string+=' ';
    }
    $('#lab2_2_enc').val(encoded_string);
    encArr = encoded_string.split(' ');
    currlenght=0;
    // дешифровка
    for (i =0; i < encArr.length; i++){
        for (j=0; j<encArr[i].length;j++){
            console.log(encArr[i][j]);
            console.log(`(${alphabet.length} + ${alphabet.indexOf(encArr[i][j])} - ${alphabet.indexOf(key[currlenght%key.length])}) % ${alphabet.length}`)
            decoded_string +=alphabet[(alphabet.length + alphabet.indexOf(encArr[i][j])- alphabet.indexOf(key[currlenght%key.length]))%alphabet.length]
            currlenght++;
        }
        decoded_string+=' ';
    }
    console.log(decoded_string);
    $('#lab2_2_dec').val(decoded_string);
}
function vizhener(message,key){
    currlenght=0;
    key = key[0];
    var encoded_string = "";
    var decoded_string = "";
    message = message.toLowerCase();
    message= message.replace(`!`,'');
    message= message.replace(`?`,'');
    message= message.replace(`;`,'');
    message= message.replace(`-`,'');
    message= message.replace(`:`,'');
    message= message.replace(`,`,'');
    message= message.replace(`.`,'');
    message= message.replace(`\n`,'');
    message= message.replace(`"`,'');
    message= message.replace(`'`,'');
    messArr = message.split(' ');
    new_alph = key + message;
    new_alph = new_alph.replace(' ','');
    console.log(new_alph);
    // шифрование
    for(i=0;i<messArr.length; i++){
        for(j=0;j<messArr[i].length;j++){
            console.log(messArr[i][j]);
            console.log(new_alph[currlenght]);
            
            encoded_string+=alphabet[(alphabet.length + alphabet.indexOf(messArr[i][j])+alphabet.indexOf(new_alph[currlenght]))%alphabet.length];
            console.log(`(${alphabet.indexOf(messArr[i][j])}+${alphabet.indexOf(new_alph[currlenght])})%${alphabet.length}`)
            console.log(encoded_string);
            currlenght++;
            console.log('---')
        }
        encoded_string+=' '
    }
    $('#lab2_3_enc').val(encoded_string);
    new_enc = key + encoded_string.replace(' ','');
    encArr = encArr = encoded_string.split(' ');
    currlenght=0;
    //дешифровка
    for(i=0;i<encArr.length; i++){
        for(j=0;j<encArr[i].length;j++){
            decoded_string+=alphabet[(alphabet.length + alphabet.indexOf(encArr[i][j])-alphabet.indexOf(new_alph[currlenght]))%alphabet.length];
            currlenght++;
        }
        decoded_string+=' '
    }
    $('#lab2_3_dec').val(decoded_string);
}
function matrixCypher(message){
message = message.toLowerCase();
message = message.toLowerCase();
message= message.replace(`!`,'');
message= message.replace(`?`,'');
message= message.replace(`;`,'');
message= message.replace(`-`,'');
message= message.replace(`:`,'');
message= message.replace(`,`,'');
message= message.replace(`.`,'');
message= message.replace(`\n`,'');
message= message.replace(`"`,'');
message= message.replace(`'`,'');

 if (message.length < matrixCol) {
    alert(`Исходное сообщение должно быть >= ${matrixCol}`);
    return 0
 }
 var pythonMatrix = ''
 var matrixInput = document.querySelector('#MatrixPlace');
 var InputedMatrix = new Array(matrixInput.children.length);
 for (i=0; i< matrixInput.children.length; i++) {
    InputedMatrix[i] = new Array(matrixInput.children.length);
     for(j=0; j < matrixInput.children[i].children.length; j++){
         InputedMatrix[i][j]=matrixInput.children[i].children[j].value;
         pythonMatrix +=' ' + matrixInput.children[i].children[j].value;
     }
     pythonMatrix+=';'
 }

 
 if (message.length%matrixCol!=0){
    message += 'a'.repeat(matrixCol-message.length%matrixCol)
 }

 alphabet1 = `абвгдежзийклмнопрстуфхцчшщъыьэюя `;
 
 var enc_string=''
 var enc_array = new Array()
 var pythonPortion=''
 for (i=0; i<message.length; i+=parseInt(matrixCol)){
    

    if (i<message.length-1) {
     for(j=0; j < matrixCol; j++){
        if (alphabet1.indexOf(message[i+j])!=-1){
        pythonPortion += ' ' + alphabet1.indexOf(message[i+j]) + ";";
        } else {
            pythonPortion += ' ' + '0' + ";";
        }
        
     }

    }
   
 }


  url = `${window.location.origin}`+'/lab3Umn'+`?shape=${matrixCol}&matrix1=${pythonMatrix}&matrix2=${pythonPortion}`;
 //  console.log(url);
     sendRequest(url, 'GET', function() {
        UmnMatrix = this.response;
        for (i=0;i < UmnMatrix.length; i++)
        enc_string+= `${UmnMatrix[i]}, `
        Array.prototype.push.apply(enc_array,UmnMatrix)
        $('#lab3_1_enc').val(enc_string);
     })

//  $('#lab3_1_enc').val(enc_string);
 url = `${window.location.origin}`+'/lab3Obr'+`?matrix=${pythonMatrix}`;
 sendRequest(url, 'GET', function() {
    if (this.response =="вырожденная"){
        alert("Ошибка. Определитель матрицы равен нулю")
        return 0
    }
    ObrMatrix = this.response;        
 
Obr_str=''
console.log(ObrMatrix);
 for(i=0; i<ObrMatrix.length; i++){
     for(j=0;j<ObrMatrix[i].length;j++){
        Obr_str+= ' ' + ObrMatrix[i][j];

     }
     Obr_str+= ';'
 }
 enc_str=''
 for(i=0; i<enc_array.length; i+=parseInt(matrixCol)) {
    if (i<enc_array.length-1){

    console.log(url);
    enc_str+=enc_array.slice(i,i+parseInt(matrixCol)).toString().replaceAll(',','; ') + '; '
    console.log(enc_str);

    }
 }
 dec_str=''
 url = `${window.location.origin}`+'/lab3Umn1'+`?shape=${matrixCol}&matrix1=${Obr_str}&matrix2= ${enc_str}`;
 sendRequest(url, 'GET', function() {
    UmnMatrix = this.response;
    for (i=0;i < UmnMatrix.length; i++)
    dec_str+=alphabet1[UmnMatrix[i]];
    Array.prototype.push.apply(enc_array,UmnMatrix)
    $('#lab3_1_dec').val(dec_str);
    console.log(dec_str)
 })

})  
}
function BuildMatrix(Number){
    matrixCol=Number;
    document.querySelector('#MatrixPlace').innerHTML = '';
    for (i=0; i<Number; i++) {
        var row = document.createElement('div');
            row.classList += "row";
        for (j=0; j<Number; j++) {
            var input = document.createElement("input");
            input.classList.add('col-md-1');
            row.appendChild(input);
        }
        document.querySelector('#MatrixPlace').appendChild(row);
    }
    
}
window.onload = function(){
    $('#changeAlph').click(function(){
        switching();
    })
    $('#alphabetPlace').text(`Алфавит сейчас: [${alphabet}]`)
    $('#lab1_1').click(function(){
        console.log(atbash($('#lab1_1_mes').val()))
    });
    $('#lab1_2').click(function(){
        console.log(caesar($('#lab1_2_mes').val()))
    });
    $('#lab1_3').click(function(){
        console.log(polibius($('#lab1_3_mes').val()))
    });
    $('#lab2_1').click(function(){
        console.log(tritemius($('#lab2_1_mes').val()))
    })
    $('#lab2_2').click(function(){
        belazo($('#lab2_2_mes').val(), $('#lab2_2_key').val());
    })
    $('#lab2_3').click(function(){
        vizhener($('#lab2_3_mes').val(),$('#lab2_3_key').val());
    })
    $('#lab3_matr_submit').click(function(){
        BuildMatrix($('#preMatrix').val());
    })
    $('#lab3_1').click(function(){
       matrixCypher($('#lab3_1_mes').val());
    });
    $('#lab3_2').click(function(){
        Playfaircipher();
        deCodeCipher();
    }

    );
    $('#lab4_1').click(function(){
      VerticalCypher($('#lab4_1_mes').val(),$('#lab4_1_key').val());
   });
   $('#lab4_2').click(function(){
    Cardan($('#lab4_2_mes').val());
 });
   
}
function sendRequest(url, method, onloadHandler, params){
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
  var key = document.getElementById("lab3_2_key").value;
  key = key.toUpperCase().replace(/\s/g, '').replace(/J/g, "I");
  var result = [];
  var temp = '';
  var alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ.-_';
  for(var i = 0; i < key.length; i++) {
    if (alphabet.indexOf(key[i]) !== -1) {
      alphabet = alphabet.replace(key[i], '');
      temp += key[i];

    }
  }
  console.log('НОВЫЙ КЛЮЧ')
  console.log(temp);
  temp += alphabet;
  var result = [];
  temp = temp.split('');
  while(temp[0]) {
    result.push(temp.splice(0,6));
  }
  return result;
}

function Playfaircipher() {
  var keyresult = processKey();
  var res = [];
  var error = 'Строка пуста';
  var str = document.getElementById("lab3_2_mes").value;
  str= str.replace(`!`,'вск');
  str= str.replace(`?`,'впр');
  str= str.replace(`;`,'тчкзпт');
  str= str.replace(`-`,'тр');
  str= str.replace(`:`,'двтч');
  str=str.replace(`,`,'зпт');
  str= str.replace(`.`,'тчк');
  str= str.replace(`\n`,'');
  str= str.replace(`"`,'');
  str= str.replace(`'`,'');
  if(str === '') {
    alert(error);
  }
  // var err = 'ERRORX';
  var textPhrase, separator;
  str = str.toUpperCase().replace(/\s/g, '').replace(/J/g, "I");
  if(str.length === 0) {
    }
  else {
    textPhrase = str[0];
  }
  var help = 0; flagAdd = false;
  for(var i = 1; i < str.length; i++) {
      if(str[i - 1] === str[i]) {
        if(str[i] === 'Х') {
          separator = 'Ъ';
        }
        else {
          separator = 'Х';
        }
        textPhrase += separator + str[i];
        help = 1; 
      }
      else {
        textPhrase += str[i];
      }
    if(help === 1) {
      flagAdd = true;
    }
  }
  
  if(textPhrase.length % 2 !== 0) {
    if(textPhrase[textPhrase.length - 1] === 'Х') {
      textPhrase += 'Ъ';
      isEnd = true;
      flagX = false;
    }
    else {
      textPhrase += 'Ъ';
      isEnd = true;
      flagX = true;
    }
  }
  
  var t = [];
  var enCodeStr = '';
  for(var i = 0; i < textPhrase.length; i += 2){
  	var pair1 = textPhrase[i];
  	var pair2 = textPhrase[i + 1];
  	var p1i, p1j, p2i, p2j;
  	for(var stroka = 0; stroka < keyresult.length; stroka++) {
	    for(var stolbec = 0; stolbec < keyresult[stroka].length; stolbec++){
	      if (keyresult[stroka][stolbec] == pair1){
	      	p1i = stroka;
	      	p1j = stolbec;
	      }
	      if (keyresult[stroka][stolbec] == pair2){
	      	p2i = stroka;
	      	p2j = stolbec;
	      }
	    }
	  }
    console.log(keyresult)
    console.log(pair1)
    console.log(p1i)
    console.log(p1j)
    var coord1 = '', coord2 = '';
    
    if(p1i === p2i) {
      if(p1j === 5) {
        coord1 = keyresult[p1i][0];
      }
      else {
        coord1 = keyresult[p1i][p1j + 1];
      }
      if(p2j === 5) {
        coord2 = keyresult[p2i][0];
      }
      else {
        coord2 = keyresult[p2i][p2j + 1]
      }
    }
    if(p1j === p2j) {
      if(p1i === 5) {
        coord1 = keyresult[0][p1j];
      }
      else {
        coord1 = keyresult[p1i + 1][p1j];
      }
      if(p2i === 5) {
        coord2 = keyresult[0][p2j];
      }
      else {
        coord2 = keyresult[p2i + 1][p2j]
      }
    }
    if(p1i !== p2i && p1j !== p2j) {
      coord1 = keyresult[p1i][p2j];
      coord2 = keyresult[p2i][p1j];
    }
    enCodeStr = enCodeStr + coord1 + coord2;
  }
  document.getElementById("lab3_2_enc").value = enCodeStr;
  // alert("Добавили букву в середине слова? - " + flagAdd);
  return enCodeStr;
}

function deCodeCipher() {
  var deCodeStr = '';
  var text = '';
  var error = "Warning!!! String is empty";
  var text1 = Playfaircipher();
  if(text1 === '') {
    alert(error);
  }
  var keyresult = processKey();
  for(var i = 0; i < text1.length; i += 2){
  	var pair1 = text1[i];
  	var pair2 = text1[i + 1];
  	var p1i, p1j, p2i, p2j;
  	for(var stroka = 0; stroka < keyresult.length; stroka++) {
	    for(var stolbec = 0; stolbec < keyresult[stroka].length; stolbec++){
	      if (keyresult[stroka][stolbec] == pair1){
	      	p1i = stroka;
	      	p1j = stolbec;
	      }
	      if (keyresult[stroka][stolbec] == pair2){
	      	p2i = stroka;
	      	p2j = stolbec;
	      }
	    }
	  }
    var coord1 = '', coord2 = '';
    
    if(p1i === p2i) {
      if(p1j === 0) {
        coord1 = keyresult[p1i][5];
      }
      else {
        coord1 = keyresult[p1i][p1j - 1];
      }
      if(p2j === 0) {
        coord2 = keyresult[p2i][5];
      }
      else {
        coord2 = keyresult[p2i][p2j - 1]
      }
    }
    if(p1j === p2j) {
      if(p1i === 0) {
        coord1 = keyresult[5][p1j]
      }
      else {
        coord1 = keyresult[p1i - 1][p1j];
      }
      if(p2i === 0) {
        coord2 = keyresult[5][p2j];
      }
      else {
        coord2 = keyresult[p2i - 1][p2j]
      }
    }
    if(p1i !== p2i && p1j !== p2j) {
      coord1 = keyresult[p1i][p2j];
      coord2 = keyresult[p2i][p1j];
    }
    text = text + coord1 + coord2;
  }
  text = text.split('');
  
  for(var i = 0; i < text.length; i++) {
    var count;
    if (flagAdd) {
    if(text[i] === text[i + 2] && (text[i + 1] === 'Х' || text[i + 1] === 'Ъ')) {
        count = i + 1;
        text.splice(count, 1);
      }
    }
    else if(flagAdd && isEnd && (flagX || !flagX)) {
      if(text[i - 2] === text[i] && (text[i - 1] === 'Х' || text[i - 1] === 'Ъ'))
        count = i + 1;
      text.splice(count, 1);
    }
    else if(!flagAdd) {
      break;
    }
  }
  if(flagX) {
    text.pop();
  }
  if(isEnd && !flagX) {
    text.pop();
  }
  text = text.join('');
  console.log(text);
  document.getElementById('lab3_2_dec').innerHTML = text;
}

function VerticalCypher(msg, key) {
  url = `${window.location.origin}`+'/lab4Enc'+`?msg=${msg}&key=${key}`;
  //  console.log(url);
      sendRequest(url, 'GET', function() {
        console.log(this.response);
        encode_str = this.response;
        console.log(encode_str);
         
         $('#lab4_1_enc').val(encode_str);
         url = `${window.location.origin}`+'/lab4Dec'+`?msg=${encode_str}&key=${key}`;
         sendRequest(url, 'GET', function() {
          console.log(this.response);
          decode_str = this.response;
          console.log(decode_str);
           
           $('#lab4_1_dec').val(decode_str);
           
        })
   
      })
}

function Cardan(msg){
  url = `${window.location.origin}`+'/lab4Enc1'+`?msg=${msg}`;
  sendRequest(url, 'GET', function() {
    console.log(this.response)
    $('#lab4_2_enc').val(this.response[0]);
    $('#lab4_2_dec').val(this.response[1]);
 })

}

