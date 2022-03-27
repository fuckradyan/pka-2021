from crypt import methods
from flask import Flask, render_template, request
from flask.json import jsonify
import numpy as np
import math
import random
import numpy.random
import itertools
import binascii
import re
import copy
import collections
from math import gcd



app = Flask(__name__)
app.config.from_pyfile('config.py')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lab1')
def lab1():
    return render_template('lab1.html')

@app.route('/lab2')
def lab2():
    return render_template('lab2.html')

@app.route('/lab3')
def lab3():
    return render_template('lab3.html')

@app.route('/lab3Obr', methods = ['GET'])
def lab3Obr():
    # проверка матрицы на вырожденность
    try:
        matrix = request.args.get('matrix')
        matrix= matrix[1:len(matrix)-1]
        ArrayMatrix = np.matrix(matrix)
        return jsonify(np.linalg.inv(ArrayMatrix).tolist())
    except:
        return jsonify('вырожденная')

@app.route('/lab3Umn', methods= ['GET'])
def lab3Umn():
    
    matrix1 = request.args.get('matrix1')
    matrix1= matrix1[1:len(matrix1)-1]
    matrix2 = request.args.get('matrix2')
    shape = request.args.get('shape')
    matrix2= matrix2[1:len(matrix2)-1]
    # преобразование матриц в нужный тип
    ArrayMatrix1 = np.matrix(matrix1)
    ArrayMatrix2 = np.matrix(matrix2)
    ArrayMatrix3=[]
    # умножение матриц для зашифровки
    for i in range (0,int(ArrayMatrix2.shape[0]),int(shape)):
        ArrayMatrix3+=(ArrayMatrix1*ArrayMatrix2[i:i+int(shape)]).tolist()
    return jsonify(ArrayMatrix3)

@app.route('/lab3Umn1', methods= ['GET'])
def lab3Umn1():
    
    print(request.args)
    matrix1 = request.args.get('matrix1')
    matrix1= matrix1[1:len(matrix1)-1]
    matrix2 = request.args.get('matrix2')
    matrix2= matrix2[1:len(matrix2)-1]
    print('```````````````')
    print(matrix2)
    print(matrix1)
    print('```````````````')
    # преобразование матриц в нужный тип
    shape = request.args.get('shape')
    ArrayMatrix1 = np.matrix(matrix1)
    ArrayMatrix2 = np.matrix(matrix2)
    ArrayMatrix3=[]
    # умножение матриц для расшифрования
    for i in range (0,int(ArrayMatrix2.shape[0]),int(shape)):
        ArrayMatrix3+=(ArrayMatrix1*ArrayMatrix2[i:i+int(shape)]).round().tolist()
    return jsonify(ArrayMatrix3)

@app.route('/lab4', methods= ['GET'])
def lab4():
    return render_template('lab4.html')


@app.route('/lab4Enc', methods= ['GET'])
def lab4Enc():
    to_encrypt = request.args.get('msg')
    to_encrypt = to_encrypt.lower()
    to_encrypt = to_encrypt.replace(' ', '')
    key = request.args.get('key')
    dict = {'.': 'тчк', ',': 'зпт', '!' : 'вск', '?' : 'впр'}
    for i, j in dict.items():
        to_encrypt = to_encrypt.replace(i, j)
    
    alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя "
    cipher = ""

    k_indx = 0
    # количество символов в сообщении
    msg_len = float(len(to_encrypt))
    msg_lst = list(to_encrypt)
    # столбцы из ключа
    key_lst = sorted(list(key))
    # количество cтолбцов в матрице
    col = len(key)
    # количество строк в матрице
    row = int(math.ceil(msg_len / col))
    fill_null = int((row * col) - msg_len)
    # заполнение пустых клеток в матрице
    msg_lst.extend('_' * fill_null)
    # составление матрицы
    matrix = [msg_lst[i: i + col] for i in range(0, len(msg_lst), col)]
    # составление зашифрованного сообщения по матрице
    for _ in range(col):
        curr_idx = key.index(key_lst[k_indx])
        # к итоговой фразе прибавляется буква из каждой строки с номером текущего столбца
        cipher += ''.join([row[curr_idx] for row in matrix])
        k_indx += 1
    print(cipher)
    return jsonify(cipher)


@app.route('/lab4Dec', methods= ['GET'])
def lab4Dec():
    to_decript = request.args.get('msg')
    key = request.args.get('key')
    msg = ""

    k_indx = 0

    msg_indx = 0
    # длина зашифрованного сообщения
    msg_len = float(len(to_decript))
    msg_lst = list(to_decript)
    # количество столбцов
    col = len(key)
    # количество строк
    row = int(math.ceil(msg_len / col))
    # номера столбцов из ключа
    key_lst = sorted(list(key))
    # генерация матрицы для расшифрования 
    dec_cipher = []
    for _ in range(row):
        dec_cipher += [[None] * col]
    #
    for _ in range(col):
        curr_idx = key.index(key_lst[k_indx])
        print(curr_idx)
        for j in range(row):
            # вставка колонок шифртекста в соответствующие по ключу столбцы матрциы
            dec_cipher[j][curr_idx] = msg_lst[msg_indx]
            msg_indx += 1
        k_indx += 1

    null_count = msg.count('_')

    if null_count > 0:
        return msg[: -null_count]
    # присоединение ячеек матрицы к расшифрованной строке
    msg = ''.join(sum(dec_cipher, []))

    return jsonify(msg.replace('_', ''))

@app.route('/lab4Enc1', methods= ['GET'])
def lab4Enc1():
    # предобработка текста
    to_encrypt = request.args.get('msg')
    dict = {'.': 'тчк', ',': 'зпт', '!' : 'вск', '?' : 'впр'}
    to_encrypt = to_encrypt.replace(' ', '')
    for i, j in dict.items():
        to_encrypt = to_encrypt.replace(i, j)
    to_encrypt = to_encrypt.lower()
    #составление кортежа пропусков в решетке(вырезанные клетки)
    gaps = request.args.get('key')
    print(gaps)
    #создание решетки с указанием размерности и вырезанными клетками
    r = Cardan(8, gaps)
    inp_text = to_encrypt
    inp_text = inp_text.replace(' ', '')
    n = len(inp_text)
    enc_text = r.encode(inp_text)
    print(enc_text.replace(' ', ''))
    print(r.decode(enc_text, n))
    return jsonify(enc_text.replace(' ', ''),r.decode(enc_text, n))
# класс, отвечающий за взаимодействие с решеткой кардано
class Cardan(object):
    def __init__(self, size, spaces):
        # предобработка текста
        self.size = int(size)
        self.spaces = str(spaces)
        self.spaces = self.spaces.replace("[", '')
        self.spaces = self.spaces.replace("]", '')
        self.spaces = self.spaces.replace("(", '')
        self.spaces = self.spaces.replace(")", '')
        self.spaces = self.spaces.replace(",", '')
        self.spaces = self.spaces.replace(" ", '')
        matricespaces = []
        i = 0
        cont = 0
        while i < self.size*self.size/4:
            t = int(self.spaces[cont]), int(self.spaces[cont + 1])
            cont = cont + 2
            i = i+1
            matricespaces.append(t)
        self.spaces = matricespaces

    def encode(self, message):
        offset = 0
        encoded_mes = ""
       #создаем массив из ячеек для хранения букв
        matrice = []
        for i in range(self.size*2-1):
            matrice.append([])
            for j in range(self.size):
                matrice[i].append(None)
        whitesneeded = self.size*self.size - \
            len(message) % (self.size*self.size)
        if (len(message) % (self.size*self.size) != 0):
            for h in range(whitesneeded):
                message = message + ' '
        while offset < len(message):
            self.spaces.sort()
            for i in range(int(self.size*self.size//4)):
                xy = self.spaces[i]
                x = xy[0]
                y = xy[1]
                matrice[x][y] = message[offset]
                offset = offset + 1
            if (offset % (self.size*self.size)) == 0:
                for i in range(self.size):
                    for j in range(self.size):
                        encoded_mes = encoded_mes + matrice[i][j]
            for i in range(self.size*self.size//4):
                x = (self.size-1)-self.spaces[i][1]
                y = self.spaces[i][0]
                self.spaces[i] = x, y
        return encoded_mes


    def decode(self, message, size):
        decoded_msg = ""
        offset = 0
        matrice = []
        for i in range(self.size*2-1):
            matrice.append([])
            for j in range(self.size):
                matrice[i].append(None)
        whitesneeded = self.size*self.size - \
            len(message) % (self.size*self.size)
        if (len(message) % (self.size*self.size) != 0):
            for h in range(whitesneeded):
                message = message + ' '
        offsetmsg = len(message) - 1
        while offset < len(message):
            if (offset % (self.size*self.size)) == 0:
                for i in reversed(list(range(self.size))):
                    for j in reversed(list(range(self.size))):
                        matrice[i][j] = message[offsetmsg]
                        offsetmsg = offsetmsg - 1
            for i in reversed(list(range(self.size*self.size//4))):
                x = self.spaces[i][1]
                y = (self.size-1)-self.spaces[i][0]
                self.spaces[i] = x, y
            self.spaces.sort(reverse=True)
            for i in range(self.size*self.size//4):
                xy = self.spaces[i]
                x = xy[0]
                y = xy[1]
                decoded_msg = matrice[x][y] + decoded_msg
                offset = offset + 1

        return decoded_msg



@app.route('/lab5', methods= ['GET'])
def lab5():
    return render_template('lab5.html')

## LAB 5.1
@app.route('/lab5shennon',methods=['GET'])
def lab5shennon():
    alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя "
    alphabet = alphabet.replace(' ', '')
    alphabet_lower = {}
    i = 0
    # составление словаря с буквой и ее индексом
    while i < (len(alphabet)):
        alphabet_lower.update({alphabet[i]: i})
        i += 1


    to_encrypt = request.args.get('msg')
    # предобработка текста
    dict = {'.': 'тчк', ',': 'зпт', '!' : 'вск', '?' : 'впр'}
    to_encrypt = to_encrypt.replace(' ', '')
    for i, j in dict.items():
        to_encrypt = to_encrypt.replace(i, j)
    to_encrypt = to_encrypt.lower()

    def replace(to_encrypt, dict):
        to_encrypt = to_encrypt.replace(' ', '')
        for i, j in dict.items():
            to_encrypt = to_encrypt.replace(i, j)
        return to_encrypt

    def replace2(to_decrypt, dict):
        for i, j in dict.items():
            to_decrypt = to_decrypt.replace(j, i)
        return to_decrypt

    def input_enc():
        return replace(to_encrypt, dict)

    def dec_text(decrypted_text):
        return replace2(decrypted_text, dict)
    txt_encoded = lab5encode(input_enc(), alphabet_lower)
    txt_decoded = dec_text(lab5decode(txt_encoded[0], txt_encoded[1],alphabet_lower))
    return jsonify(txt_encoded,txt_decoded)
# функция получения ключа
def get_key(d, value):
    for k, v in d.items():
        if v == value:
            return k
# шифрование
def lab5encode(msg, alphabet_lower):
    msg_list = list(msg)
    msg_list_len = len(msg_list)
    msg_code_bin_list = list()
    # массив с индексами букв сообщения
    for i in range(len(msg_list)):
        msg_code_bin_list.append(alphabet_lower.get(msg_list[i]))
        
    # генерация гаммы 
    key_list = list()
    for i in range(msg_list_len):
        key_list.append(random.randint(0, 32))

    cipher_list = list()
    for i in range(msg_list_len):
        # представление в виде индексов
        m = int(msg_code_bin_list[i])
        k = int(key_list[i])
        # XOR
        cipher_list.append(int(bin(m ^ k), base=2))
    # вывод значения
    return cipher_list, key_list

# расшифрование
def lab5decode(msg, key_list, alphabet_lower):
    decipher_list = list()
    msg_list_len = len(msg)
    for i in range(msg_list_len):
        # представление в виде индексов
        c = int(msg[i])
        k = int(key_list[i])
        # XOR
        decipher_list.append(int(bin(c ^ k), base=2))
    deciphered_str = ""
    # нахождение букв в алфавите с помощью расшифрованных индексов
    for i in range(len(decipher_list)):
        deciphered_str += get_key(alphabet_lower, decipher_list[i])
    # вывод значения
    return deciphered_str


## LAB 5.2
@app.route('/lab5gost',methods=['GET'])
def lab5gost():
    alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя "
    dict = {'.': 'тчк', ',': 'зпт'}
    to_encrypt = request.args.get('msg')
    def replace_all_to(input_text, dict):
        input_text = input_text.replace(' ', '')
        for i, j in dict.items():
            input_text = input_text.replace(i, j)
        return input_text
    def replace_all_from(input_text, dict):
        for i, j in dict.items():
            input_text = input_text.replace(j, i)
        return input_text
    def input_for_cipher_short():
        return replace_all_to(to_encrypt, dict)


    def input_for_cipher_long():
        return replace_all_to(to_encrypt, dict)


    def output_from_decrypted(decrypted_text):
        return replace_all_from(decrypted_text, dict)
    sbox = [numpy.random.permutation(l) for l in itertools.repeat(list(range(16)), 8)]
    sbox = (
        (4, 10, 9, 2, 13, 8, 0, 14, 6, 11, 1, 12, 7, 15, 5, 3),
        (14, 11, 4, 12, 6, 13, 15, 10, 2, 3, 8, 1, 0, 7, 5, 9),
        (5, 8, 1, 13, 10, 3, 4, 2, 14, 15, 12, 7, 6, 0, 9, 11),
        (7, 13, 10, 1, 0, 8, 9, 15, 14, 4, 6, 12, 11, 2, 5, 3),
        (6, 12, 7, 1, 5, 15, 13, 8, 4, 10, 9, 14, 0, 3, 11, 2),
        (4, 11, 10, 0, 7, 2, 1, 13, 3, 6, 8, 5, 9, 12, 15, 14),
        (13, 11, 4, 1, 3, 15, 5, 9, 0, 10, 14, 7, 6, 8, 2, 12),
        (1, 15, 13, 0, 5, 7, 10, 4, 9, 2, 3, 14, 6, 11, 8, 12),
        )

    key = 18318279387912387912789378912379821879387978238793278872378329832982398023031

    text_short = input_for_cipher_short().encode().hex()
    text_short = int(text_short, 16)

    gost_short = GostCrypt(key, sbox)

    enc_txt = gost_short.encrypt(text_short)
    dec_txt = gost_short.decrypt(enc_txt)
    dec_txt = bytes.fromhex(hex(dec_txt)[2::]).decode('utf-8')


    text_long = input_for_cipher_long().encode().hex()
    text_long = int(text_long, 16)
    print(enc_txt)
    return jsonify(str(enc_txt),dec_txt)
class GostCrypt(object):
    def __init__(self, key, sbox):
        self._key = None
        self._subkeys = None
        self.key = key
        self.sbox = sbox

    @staticmethod
    def _bit_length(value):
        return len(bin(value)[2:])

    @property
    def key(self):
        return self._key

    @key.setter
    def key(self, key):
        self._key = key
        self._subkeys = [(key >> (32 * i)) & 0xFFFFFFFF for i in range(8)] #8 кусков


    def _f(self, part, key):
        temp = part ^ key
        output = 0
        for i in range(8):
            output |= ((self.sbox[i][(temp >> (4 * i)) & 0b1111]) << (4 * i))
        return ((output >> 11) | (output << (32 - 11))) & 0xFFFFFFFF


    def _decrypt_round(self, left_part, right_part, round_key):
        return left_part, right_part ^ self._f(left_part, round_key)

    def encrypt(self, plain_msg):
        def _encrypt_round(left_part, right_part, round_key):
            return right_part, left_part ^ self._f(right_part, round_key)

        left_part = plain_msg >> 32
        right_part = plain_msg & 0xFFFFFFFF
        for i in range(24):
            left_part, right_part = _encrypt_round(left_part, right_part, self._subkeys[i % 8])
        for i in range(8):
            left_part, right_part = _encrypt_round(left_part, right_part, self._subkeys[7 - i])
        return (left_part << 32) | right_part

    def decrypt(self, crypted_msg):
        def _decrypt_round(left_part, right_part, round_key):
            return right_part ^ self._f(left_part, round_key), left_part

        left_part = crypted_msg >> 32
        right_part = crypted_msg & 0xFFFFFFFF
        for i in range(8):
            left_part, right_part = _decrypt_round(left_part, right_part, self._subkeys[i])
        for i in range(24):
            left_part, right_part = _decrypt_round(left_part, right_part, self._subkeys[(7 - i) % 8])
        return (left_part << 32) | right_part
    
    
    
@app.route('/lab6',methods=['GET'])
def lab6():
    return render_template('lab6.html')

@app.route('/lab6a51',methods=['GET'])
def lab6a51():
    # выставление длины регистров
    reg_x_length = 19
    reg_y_length = 22
    reg_z_length = 23

    key_one = ""
    reg_x = []
    reg_y = []
    reg_z = []
    alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя "
    
    dict = {'.': 'тчк', ',': 'зпт', '!' : 'вск', '?' : 'впр'}
    key = request.args.get('key')
    
    to_encrypt = request.args.get('msg')
    #подготовка сообщения к шифрованию
    def replace_all_to(input_text, dict):
        input_text = input_text.replace(' ', '')
        for i, j in dict.items():
            input_text = input_text.replace(i, j)
        return input_text

    # обратная смена в расшифрованном сообщении
    def replace_all_from(input_text, dict):
        for i, j in dict.items():
            input_text = input_text.replace(j, i)
        return input_text


    def input_for_cipher_short():
        return replace_all_to(to_encrypt, dict)

    def output_from_decrypted(decrypted_text):
        return replace_all_from(decrypted_text, dict)
    
    # функция записи частей ключа в регистры
    def loading_registers(key):
        i = 0
        # запись в первый регистр(19)
        while(i < reg_x_length):
            reg_x.insert(i, int(key[i]))
            i = i + 1
        j = 0
        p = reg_x_length
        # запись во второй регистр(22)
        while(j < reg_y_length):
            reg_y.insert(j, int(key[p]))
            p = p + 1
            j = j + 1
        k = reg_y_length + reg_x_length
        r = 0
        # запись в третий регистр(23)
        while(r < reg_z_length):
            reg_z.insert(r, int(key[k]))
            k = k + 1
            r = r + 1

    # проверка ключа
    def set_key(key):
        if(len(key) == 64 and re.match("^([01])+", key)):
            key_one = key
            loading_registers(key)
            return True
        return False


    def get_key():
        return key_one

    # перевод сообщения в двоичную СИ
    def to_binary(plain):
        s = ""
        i = 0
        for i in plain:
            binary = str(' '.join(format(ord(x), 'b') for x in i))
            j = len(binary)
            while(j < 12):
                binary = "0" + binary
                s = s + binary
                j = j + 1
        binary_values = []
        k = 0
        while(k < len(s)):
            binary_values.insert(k, int(s[k]))
            k = k + 1
        return binary_values

    # функция вычисления majority(какого числа больше) (F = x&y|x&z|y&z)
    def get_majority(x, y, z):
        if(x + y + z > 1):
            return 1
        else:
            return 0


    def get_keystream(length):
        reg_x_temp = copy.deepcopy(reg_x)
        reg_y_temp = copy.deepcopy(reg_y)
        reg_z_temp = copy.deepcopy(reg_z)
        keystream = []
        i = 0
        while i < length:
            # нахождение majority (F = x&y|x&z|y&z)
            majority = get_majority(reg_x_temp[8], reg_y_temp[10], reg_z_temp[10])
            # если 8 бит первого регистра совпадает с majority
            if reg_x_temp[8] == majority:
                # вычисление многочлена обратной связи (XOR)
                new = reg_x_temp[13] ^ reg_x_temp[16] ^ reg_x_temp[17] ^ reg_x_temp[18]
                reg_x_temp_two = copy.deepcopy(reg_x_temp)
                j = 1
                # сдвиг всех элементов вправо, первым становится многочлен обратной связи
                while(j < len(reg_x_temp)):
                    reg_x_temp[j] = reg_x_temp_two[j-1]
                    j = j + 1
                reg_x_temp[0] = new
            # если 10 бит второго регистра совпадает с majority
            if reg_y_temp[10] == majority:
                # вычисление многочлена обратной связи (XOR)
                new_one = reg_y_temp[20] ^ reg_y_temp[21]
                reg_y_temp_two = copy.deepcopy(reg_y_temp)
                k = 1
                # сдвиг всех элементов вправо, первым становится многочлен обратной связи
                while(k < len(reg_y_temp)):
                    reg_y_temp[k] = reg_y_temp_two[k-1]
                    k = k + 1
                reg_y_temp[0] = new_one
            # если 10 бит третьего регистра совпадает с majority
            if reg_z_temp[10] == majority:
                # вычисление многочлена обратной связи (XOR)
                new_two = reg_z_temp[7] ^ reg_z_temp[20] ^ reg_z_temp[21] ^ reg_z_temp[22]
                reg_z_temp_two = copy.deepcopy(reg_z_temp)
                m = 1
                # сдвиг всех элементов вправо, первым становится многочлен обратной связи
                while(m < len(reg_z_temp)):
                    reg_z_temp[m] = reg_z_temp_two[m-1]
                    m = m + 1
                reg_z_temp[0] = new_two
            # вычисление выходного бита системы (XOR)
            keystream.insert(i, reg_x_temp[18] ^ reg_y_temp[21] ^ reg_z_temp[22])
            i = i + 1
        return keystream

    # функция перевода двоичных значений в текст        
    def convert_binary_to_str(binary):
        s = ""
        length = len(binary) - 12
        i = 0
        while(i <= length):
            s = s + chr(int(binary[i:i+12], 2))
            i = i + 12
        return str(s)


    def encode(plain):
        s = ""
        binary = to_binary(plain)
        keystream = get_keystream(len(binary))
        i = 0
        while(i < len(binary)):
            s = s + str(binary[i] ^ keystream[i])
            i = i + 1
        return s


    def decode(cipher):
        s = ""
        binary = []
        keystream = get_keystream(len(cipher))
        i = 0
        while(i < len(cipher)):
            binary.insert(i, int(cipher[i]))
            s = s + str(binary[i] ^ keystream[i])
            i = i + 1
        return convert_binary_to_str(str(s))

    set_key(key)
    return jsonify(encode(input_for_cipher_short()),output_from_decrypted(decode(encode(input_for_cipher_short()))))


@app.route('/lab7',methods=['GET'])
def lab7():
    return render_template('lab7.html')



@app.route('/lab7Magma', methods=['GET'])
def lab7Magma():
    # импорт компонентов, необходимых для работы программы
    pi0 = [12, 4, 6, 2, 10, 5, 11, 9, 14, 8, 13, 7, 0, 3, 15, 1]
    pi1 = [6, 8, 2, 3, 9, 10, 5, 12, 1, 14, 4, 7, 11, 13, 0, 15]
    pi2 = [11, 3, 5, 8, 2, 15, 10, 13, 14, 1, 7, 4, 12, 9, 6, 0]
    pi3 = [12, 8, 2, 1, 13, 4, 15, 6, 7, 0, 10, 5, 3, 14, 9, 11]
    pi4 = [7, 15, 5, 10, 8, 1, 6, 13, 0, 9, 3, 14, 11, 4, 2, 12]
    pi5 = [5, 13, 15, 6, 9, 2, 12, 10, 11, 7, 8, 1, 4, 3, 14, 0]
    pi6 = [8, 14, 2, 5, 6, 9, 1, 12, 15, 4, 11, 0, 13, 10, 3, 7]
    pi7 = [1, 7, 14, 13, 0, 5, 8, 3, 4, 15, 10, 6, 9, 12, 11, 2]
    pi = [pi0, pi1, pi2, pi3, pi4, pi5, pi6, pi7]
    MASK32 = 2 ** 32 - 1
    prekey = request.args.get('key')
    to_encrypt = request.args.get('msg')
    def t(x):
        y = 0
        for i in reversed(range(8)):
            j = (x >> 4 * i) & 0xf
            y <<= 4
            y ^= pi[i][j]
        return y
    # функция сдвига на 11
    def rot11(x):
        return ((x << 11) ^ (x >> (32 - 11))) & MASK32
    def g(x, k):
        return rot11(t((x + k) % 2 ** 32))
    def split(x):
        L = x >> 32
        R = x & MASK32
        return (L, R)
    def join(L, R):
        return (L << 32) ^ R
    def magma_key_schedule(k):
        keys = []
        for i in reversed(range(8)):
            keys.append((k >> (32 * i)) & MASK32)
        for i in range(8):
            keys.append(keys[i])
        for i in range(8):
            keys.append(keys[i])
        for i in reversed(range(8)):
            keys.append(keys[i])
        return keys
    # функция шифрования
    def magma_encrypt(x, k):
        keys = magma_key_schedule(k)
        (L, R) = split(x)
        for i in range(31):
            (L, R) = (R, L ^ g(R, keys[i]))
        return join(L ^ g(R, keys[-1]), R)
    # функция расшифрования
    def magma_decrypt(x, k):
        keys = magma_key_schedule(k)
        keys.reverse()
        (L, R) = split(x)
        for i in range(31):
            (L, R) = (R, L ^ g(R, keys[i]))
        return join(L ^ g(R, keys[-1]), R)
    # установка ключа
    key = int(str(prekey), 16)
    i = 0
    text_short = to_encrypt
    encr_short = []
    while (i < len(text_short)):
        text = text_short[i:i+4].encode().hex()
        text = int(text, 16)
        text = text % 2**64
        pt = text
        ct = magma_encrypt(pt, key)
        encr_short.append(ct)
        i += 4
    decr_short = []
    for i in encr_short:
        dt = magma_decrypt(i, key)
        decr_short.append(bytes.fromhex(hex(dt)[2::]).decode('utf-8'))
    return jsonify(encr_short, ''.join(decr_short))



@app.route('/lab8',methods=['GET'])
def lab8():
    return render_template('lab8.html')

@app.route('/lab8rsa',methods=['GET'])
def lab8rsa():
    # НОД
    def gcd(a, b):
        while b != 0:
            a, b = b, a % b
        return a

    def multiplicative_inverse(e,r):
        for i in range(r):
            print('(e*i) разд на r == 1', (e*i)%r)
            if((e*i)%r == 1):
                return i
    # Ф-ия определения простоты
    def is_prime(num):
        if num == 2:
            return True
        if num < 2 or num % 2 == 0:
            return False
        for n in range(3, int(num**0.5)+2, 2):
            if num % n == 0:
                return False
        return True
     #проверка чисел на простоту и генерация ключей (e,n) (d,n)
    def generate_keypair(p, q):
        if not (is_prime(p) and is_prime(q)):
            return jsonify('Оба числа должны быть простыми.')
        elif p == q:
            return jsonify('p и q не могут быть равны')
        #n = pq
        n = p * q

        phi = (p-1) * (q-1)

        e = random.randrange(1, phi)

        g = gcd(e, phi)
        while g != 1:
            print('g', g)
            e = random.randrange(1, phi)
            g = gcd(e, phi)
        d = multiplicative_inverse(e, phi)
        print('d',d)
        return ((e, n), (d, n))
    # шифрование
    def encrypt(pk, plaintext):
        key, n = pk
        # шифртекст  получается последовательным шифрованием каждой шифрвеличины Mi возведением ее в степень E по модулю N: 
        # Ci = Mi^E MOD N
        cipher = [(ord(char) ** key) % n for char in plaintext]
        return cipher
    # расшифровка
    def decrypt(pk, ciphertext):
        key, n = pk
        # расшифровывание сообщения, возводя последовательно Сi в степень D по модулю N:
        # Mi = Ci^D MOD N
        plain = [chr((char ** key) % n) for char in ciphertext]
        return ''.join(plain)
    try:
        message = request.args.get('msg')
        p = int(request.args.get('p'))
        q = int(request.args.get('q'))
        public, private = generate_keypair(p, q)
        print("Публичный ключ: ", public ,"Секретный ключ: ", private)
        encrypted_msg = encrypt(public, message)
        return jsonify(''.join([str(x) for x in encrypted_msg]),decrypt(private, encrypted_msg))
    except:
        return jsonify('Ошибка.')
    
    
@app.route('/lab9',methods=['GET'])
def lab9():
    return render_template('lab9.html')

@app.route('/lab9dsrsa',methods=['GET'])
def lab9dsrsa():
    alphabet_lower = {'а':0, 'б':1, 'в':2, 'г':3, 'д':4,
                  'е':5, 'ж':6, 'з':7, 'и':8, 'й':9,
                  'к':10, 'л':11, 'м':12, 'н':13, 'о':14,
                  'п':15, 'р':16, 'с':17, 'т':18, 'у':19,
                  'ф':20, 'х':21, 'ц':22, 'ч':23, 'ш':24,
                  'щ':25, 'ъ':26, 'ы':27, 'ь':28, 'э':29,
                  'ю':30, 'я':31, ' ':32, ",":33, ".":34,
                  }

    #проверка на простое число
    def IsPrime(n):
        d = 2
        while n % d != 0:
            d += 1
        return d == n
    #расширенный алгоритм Евклида или (e**-1) mod fe
    def modInverse(e,el):
        e = e % el
        for x in range(1,el):
            if ((e * x) % el == 1):
                return x
        return 1

    #инициализация p,q,e,n
    p = int(request.args.get('p'))
    print('p - простое число: ',IsPrime(p))
    
    q = int(request.args.get('q'))
    print('q - простое число:',IsPrime(q))
    n = p * q
    print("N =",n)
    el = (p-1) * (q-1)
    print("El =",el)
    e = random.randrange(1, el)
    while gcd(e,el) != 1:
        e = random.randrange(1, el)
        gcd(e, el)
    print("E =",e)
    if gcd(e,el) == 1:
        print("E подходит")
    else:
        print("False")
    
    #нахождение секретной экспоненты D
    d = modInverse(e,el)
    print("D =",d)
    print("Открытый ключ e={} n={}".format(e,n))
    print("Секретный ключ d={} n={}".format(d,n))
    #хэширование сообщения
    msg = request.args.get('msg')
    msg_list = list(msg)
    alpha_code_msg = list()
    for i in range(len(msg_list)):
        alpha_code_msg.append(int(alphabet_lower.get(msg_list[i])))
    print("Длина исходного сообщения {} символов".format(len(alpha_code_msg)))
    # функция хэширования
    def hash_value(n,alpha_code):
        i = 0
        hashing_value = 1
        while i < len(alpha_code_msg):
            hashing_value = (((hashing_value-1) + int(alpha_code_msg[i]))**2) % n
            i += 1
            print ('Значение хэша №{}'.format(i),hashing_value)
        return hashing_value

    hash_code_msg = hash_value(n, alpha_code_msg)
    print("Хэш сообщения", hash_code_msg)
    #подпись сообщения s=Sa(m) = m^d mod n
    def signature_msg(hash_code,n,d):
        sign = (hash_code**d)%n
        return sign

    sign_msg = signature_msg(hash_code_msg,n,d)
    print("Значение подписи: {}".format(sign_msg))
    #передаём пару m,s
    def check_signature(sign_msg, n,e):
        check = (sign_msg**e) % n
        return check

    check_sign = check_signature(sign_msg,n,e)
    print("Значение проверки подписи = {}".format(check_sign))
    return jsonify(hash_code_msg, sign_msg, check_sign)

@app.route('/lab10',methods=['GET'])
def lab10():
    return render_template('lab10.html')

@app.route('/gost94',methods=['GET'])
def gost94():

    alphavit = {'а': 0, 'б': 1, 'в': 2, 'г': 3, 'д': 4,
    'е': 5, 'ё': 6, 'ж': 7, 'з': 8, 'и': 9, 'й': 10,
    'к': 11, 'л': 12, 'м': 13, 'н': 14, 'о': 15,
    'п': 16, 'р': 17, 'с': 18, 'т': 19, 'у': 20,
    'ф': 21, 'х': 22, 'ц': 23, 'ч': 24, 'ш': 25,
    'щ': 26, 'ъ': 27, 'ы': 28, 'ь': 29, 'э': 30,
    'ю': 31, 'я': 32, ' ':33
    }
    def ciphergostd(clearText):
        array = []
        flag = False
        for s in range(50, 1000):
            for i in range(2, s):
                if s % i == 0:
                    flag = True
                    break
            if flag == False:
                array.append(s)
            flag = False
        p = int(request.args.get('p'))
        print("p = ", p)
        q = int(request.args.get('q'))
        print("q = ", q)
        a = int(request.args.get('a'))
        print("a =", a)
        array2 = []
        flag2 = False
        for s in range(2, q):
            for i in range(2, s):
                if s % i == 0:
                    flag2 = True
                    break
            if flag2 == False:
                array2.append(s)
            flag2 = False
        x = int(request.args.get('x'))
        print("x = ", x)
        y = a**x % p
        k = int(request.args.get('k'))
        print("k = ", k)
        #
        r = (a**k % p) % q
        msg = clearText
        msg_list = list(msg)
        alpha_code_msg = list()
        for i in range(len(msg_list)):
            alpha_code_msg.append(int(alphavit.get(msg_list[i])))
        print("Длина исходного сообщения {} символов".format(len(alpha_code_msg)))
        hash_code_msg = hash_value(p, alpha_code_msg)
        print("Хэш сообщения = {}".format(hash_code_msg))
        s = (x*r+k*hash_code_msg) % q
        print("Цифровая подпись = ", r % (2**256), ",", s % (2**256))
        v = (hash_code_msg**(q-2)) % q
        z1 = s*v % q
        z2 = ((q-r)*v) % q
        u = (((a**z1)*(y**z2)) % p) % q
        
        if u == r:
            print(r, " = ", u, 'следовательно')
            res = "Подпись верна"
            print("Подпись верна")
        else:
            print(r, "!= ", u, 'следовательно')
            res ="Подпись неверна"
            print("Подпись неверна")
        return r % (2**256),s % (2**256),u,res
    
    # функци хэширования
    def hash_value(n, alpha_code):
        i = 0
        hash = 1
        while i < len(alpha_code):
            hash = (((hash-1) + int(alpha_code[i]))**2) % n
            i += 1
        return hash

    msg = request.args.get('msg')
    dict = {'.': 'тчк', ',': 'зпт', '!' : 'вск', '?' : 'впр'}
    for i, j in dict.items():
        msg = msg.replace(i, j)
    
    return jsonify(ciphergostd(msg))


@app.route('/lab11',methods=['GET'])
def lab11():
    return render_template('lab11.html')