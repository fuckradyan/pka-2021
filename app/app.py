from flask import Flask, render_template, request
from flask.json import jsonify
import numpy as np
import math
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
