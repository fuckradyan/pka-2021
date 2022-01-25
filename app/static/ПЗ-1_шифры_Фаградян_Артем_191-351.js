var alphabet = `абвгдеёжзийклмнопрстуфхцчшщъыьэюя!? ;-:,.\n'"`;
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
}