import random
import math

def get_block_num(i, j):
    return 3 * math.floor(j / 3) + math.floor(i / 3)

def generate_rand_board(p = .7): 
    board = [[0]*9 for i in range(9)]
    for val in range(1, 10):
        used_cols = []
        used_blocks = []
        for i in range(9):
            r = random.random()
            j = random.randint(0,8)
            block = get_block_num(i, j)
            if (
                r > p
                and j not in used_cols 
                and block not in used_blocks
                and board[j][i] == 0
            ):
                board[j][i] = val
                used_blocks.append(block)
                used_cols.append(j)
    return board

def display_board(board):
    hline = "".join(["-"]*17) + "\n"
    out = hline
    for i in range(9):
        for j in range(9):
            out += str(board[i][j])
            sep = "|" if j % 3 == 2 else " "
            out += str(sep)
        out += "\n"
        if i % 3 == 2:
            out += hline
    print(out)

def display_block(block):
    out = ""
    for i in range(9):
        out += str(block[i])
        out += "\n" if i % 3 == 2 else ""
    print(out)

def get_block(board, idx):
    fj = 3 * math.floor(idx % 3)
    fi = 3 * math.floor(idx / 3)
    block = []
    for k in range(9):
        i = fi + math.floor(k / 3)
        j = fj + math.floor(k % 3)
        val = board[i][j]
        if val != 0: block.append(val)
    return block

def get_row(board, idx):
    return [x for x in board[idx] if x !=0]

def get_col(board, idx):
    return [row[idx] for row in board if row[idx] !=0]

def verify_list(l):
    return len(list(set(l))) == len(l)

def verify_new_val(board, i, j, val):
    row = get_row(board, j)
    col = get_col(board, i)
    block = get_block(board, get_block_num(i, j))
    return (
        val not in row 
        and val not in col
        and val not in block
    )

def verify_board(board):
    for i in range(9):
        row = get_row(board, i)
        col = get_col(board, i)
        block = get_block(board, i)
        ok = verify_list(row) and verify_list(col) and verify_list(block)
        if not ok:
            return False
    return True

def board_done(board):
    return get_empty_val(board)[0] == -1 and verify_board(board)

def get_empty_val(board):
    for j in range(9):
        for i in range(9):
            if board[j][i] == 0:
                return (i, j)
    return (-1,-1)

def solve_board(board):
    i, j = get_empty_val(board)

    # print("i: {}, j: {}".format(i, j))
    # display_board(board)

    if i == -1:
        display_board(board)
        print("SOLVED")
        return True
    
    for val in range(1, 10):
        if verify_new_val(board, i, j, val):
            board[j][i] = val
            if solve_board(board):
                return True
            board[j][i] = 0
    return False
    

board = [
    [7,8,0,4,0,0,1,2,0],
    [6,0,0,0,7,5,0,0,9],
    [0,0,0,6,0,1,0,7,8],
    [0,0,7,0,4,0,2,6,0],
    [0,0,1,0,5,0,9,3,0],
    [9,0,4,0,6,0,0,0,5],
    [0,7,0,3,0,0,0,1,2],
    [1,2,0,0,0,7,4,0,0],
    [0,4,9,2,0,6,0,0,7]
]

board = generate_rand_board(.4)

display_board(board)
if not solve_board(board):
    i, j = get_empty_val(board)
    print("i: {}, j: {}".format(i, j))
    print("NO SOLUTION")
