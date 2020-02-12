import pickle
import json
import os
import logging
import datetime as dt


logger = logging.getLogger(__name__)

def read_pickle(path):
    with open(path, 'rb') as input_file:
        return pickle.load(input_file)

def store_pickle(path, data):
    with open(path, 'wb') as output_file:
        pickle.dump(data, output_file)
        print(f'data stored in {path}')

def current_TS(format="%Y%m%d_%H_%M_%S"):
    return dt.datetime.now().strftime(format)


def store_json(data, path, name):
    if not '.json' in name:
        name = name + '.json'
    with open(f'{path+name}', 'w') as output_file:
        json.dump(data, output_file)
    print(f'stored in: {path+name}')


def load_json(path, name):
    if not '.json' in name:
        name = name + '.json'
    with open(f'{path+name}', 'r') as input_file:
        file = json.load(input_file)
    print(f'imported from: {path+name}')
    return file


def create_directories(path_list):
    for path in path_list:
        os.makedirs(path, exist_ok=True)
