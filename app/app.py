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
    ArrayMatrix1 = np.matrix(matrix1)
    ArrayMatrix2 = np.matrix(matrix2)
    ArrayMatrix3=[]
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
    shape = request.args.get('shape')
    ArrayMatrix1 = np.matrix(matrix1)
    ArrayMatrix2 = np.matrix(matrix2)
    ArrayMatrix3=[]
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

    msg_len = float(len(to_encrypt))
    msg_lst = list(to_encrypt)
    key_lst = sorted(list(key))

    col = len(key)

    row = int(math.ceil(msg_len / col))

    fill_null = int((row * col) - msg_len)
    msg_lst.extend('_' * fill_null)

    matrix = [msg_lst[i: i + col] for i in range(0, len(msg_lst), col)]

    for _ in range(col):
        curr_idx = key.index(key_lst[k_indx])
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
    msg_len = float(len(to_decript))
    msg_lst = list(to_decript)

    col = len(key)

    row = int(math.ceil(msg_len / col))

    key_lst = sorted(list(key))

    dec_cipher = []
    for _ in range(row):
        dec_cipher += [[None] * col]

    for _ in range(col):
        curr_idx = key.index(key_lst[k_indx])

        for j in range(row):
            dec_cipher[j][curr_idx] = msg_lst[msg_indx]
            msg_indx += 1
        k_indx += 1

    null_count = msg.count('_')

    if null_count > 0:
        return msg[: -null_count]

    msg = ''.join(sum(dec_cipher, []))

    return jsonify(msg.replace('_', ''))

@app.route('/lab4Enc1', methods= ['GET'])
def lab4Enc1():
    to_encrypt = request.args.get('msg')
    dict = {'.': 'тчк', ',': 'зпт', '!' : 'вск', '?' : 'впр'}
    to_encrypt = to_encrypt.replace(' ', '')
    for i, j in dict.items():
        to_encrypt = to_encrypt.replace(i, j)
    to_encrypt = to_encrypt.lower()

    gaps = [(7, 7), (6, 0), (5, 0), (4, 0), (7, 1), (1, 1), (1, 2), (4, 1),
                (7, 2), (2, 1), (2, 5), (2, 3), (7, 3), (3, 1), (3, 2), (3, 4)]
    r = Cardan(8, gaps)
    inp_text = to_encrypt
    inp_text = inp_text.replace(' ', '')
    n = len(inp_text)
    enc_text = r.encode(inp_text)
    print(enc_text.replace(' ', ''))
    print(r.decode(enc_text, n))
    return jsonify(enc_text.replace(' ', ''),r.decode(enc_text, n))

class Cardan(object):
    def __init__(self, size, spaces):
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
    while i < (len(alphabet)):
        alphabet_lower.update({alphabet[i]: i})
        i += 1


    to_encrypt = request.args.get('msg')
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
    print(txt_encoded)
    print(txt_decoded)
    return jsonify(txt_encoded,txt_decoded)

def get_key(d, value):
    for k, v in d.items():
        if v == value:
            return k

def lab5encode(msg, alphabet_lower):
    msg_list = list(msg)
    msg_list_len = len(msg_list)
    msg_code_bin_list = list()
    for i in range(len(msg_list)):
        msg_code_bin_list.append(alphabet_lower.get(msg_list[i]))

    key_list = list()
    for i in range(msg_list_len):
        key_list.append(random.randint(0, 32))

    cipher_list = list()
    for i in range(msg_list_len):
        m = int(msg_code_bin_list[i])
        k = int(key_list[i])
        cipher_list.append(int(bin(m ^ k), base=2))
    return cipher_list, key_list

def lab5decode(msg, key_list, alphabet_lower):
    decipher_list = list()
    msg_list_len = len(msg)
    for i in range(msg_list_len):
        c = int(msg[i])
        k = int(key_list[i])
        decipher_list.append(int(bin(c ^ k), base=2))
    deciphered_str = ""
    for i in range(len(decipher_list)):
        deciphered_str += get_key(alphabet_lower, decipher_list[i])
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


