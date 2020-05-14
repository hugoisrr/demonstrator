import asyncio
import websockets
import json
import pickle
from src import preprocessing as pp
import socket
import datetime as dt
import struct
import pandas as pd
import time
import logging


from src import aux_functions as aux


### Define Variables ###
HOST = 'localhost'
PORT = 3000

global log_dic
log_dic = pd.DataFrame({})

global log_class
log_class = pd.DataFrame({})

def_string = ('BBLffffffhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh\
               hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')


model_dict = {3: {'model': aux.read_pickle('../model/model_191113_cnc.pickle'),
                  'encoder': aux.read_pickle('../model/encoder_191106_cnc.pickle')},
              4: {'model': aux.read_pickle('../model/model_191113_cnc.pickle'),
                  'encoder': aux.read_pickle('../model/encoder_191106_cnc.pickle')}}

### Logging levels

# DEBUG: Diagnosis of problems

# INFO: User information

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)



file_handler = logging.FileHandler(f'../logs/{dt.datetime.now().strftime("%Y%m%d_%H_%M_%S")}_log.log')
formatter = logging.Formatter('%(asctime)s:%(levelname)s:%(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)


logger.info('models imported')

def log_classification(log_class, data, values):
    if log_class.empty:
        log_class = pd.DataFrame({}, columns=['Timestamp', 'ID', 'Class',
                                              'ACCX', 'ACCY', 'ACCZ',
                                              'GYRX', 'GYRY', 'GYRZ'])
    print(data['ts'])
    print(data['id'])
    print(data['state'])
    print([data['ts'], data['id'],
                     data['state']].extend(values))
    temp_frame = pd.DataFrame([[data['ts'], data['id'],
                                 data['state']] + values],
                              columns=['Timestamp', 'ID', 'Class',
                                       'ACCX', 'ACCY', 'ACCZ',
                                       'GYRX', 'GYRY', 'GYRZ'])
    log_class = log_class.append(temp_frame, ignore_index=True, sort=False)
    return log_class

def log_data(log_dic, data):
    if log_dic.empty:
        log_dic = pd.DataFrame({}, columns=['ACCX', 'ACCY', 'ACCZ',
                                            'GYRX', 'GYRY', 'GYRZ'])

    temp_frame = pd.DataFrame(data['values'], columns=['ACCX', 'ACCY', 'ACCZ',
                                                       'GYRX', 'GYRY', 'GYRZ'])
    temp_frame.loc[:, 'Timestamp'] = data['ts']
    log_dic = log_dic.append(temp_frame, ignore_index=True, sort=False)
    return log_dic

def run_server(HOST, PORT):
    loop = asyncio.get_event_loop()

    start_server = websockets.serve(handler, str(HOST),
                                    int(PORT))
    logger.info('server started')
    loop.run_until_complete(start_server)
    loop.run_forever()


async def handler(websocket, path):
    send_task = asyncio.create_task(send(websocket, path))
    receive_task = asyncio.create_task(receive(websocket, path))
    done, pending = await asyncio.wait([send_task, receive_task],
                                       return_when=asyncio.FIRST_COMPLETED, )
    for task in pending:
        task.cancel()


async def receive(websocket, path):
    global log_dic
    global log_class

    try:
        while True:
            msg = await websocket.recv()
            logger.debug(msg)
    except websockets.ConnectionClosed:
        logger.debug(log_dic)
        log_dic.to_csv(str(time.time())+'_dic.csv')
        logger.debug(log_class)
        log_class.to_csv(str(time.time())+'_class.csv')
        logger.info('connection closed')


async def send(websocket, path):
    logger.info('trying to connect')
    global log_dic
    global log_class
    try:
        HOST_UDP = '192.168.0.99'
        PORT_UDP = 65432
        sock_client = socket.socket(family=socket.AF_INET,
                                    type=socket.SOCK_DGRAM)
        sock_client.bind((HOST_UDP, PORT_UDP))
        logger.info('connected')
        log_dic = pd.DataFrame({})
        log_class = pd.DataFrame({})
        while True:

            data, addr = sock_client.recvfrom(4096)
            logger.debug(data)
            logger.debug(addr)
            logger.debug(str(dt.datetime.now().timestamp()) + ' Received from ' +
                  addr[0])

            if len(data) > 9 and data[:9] == b'BBLffffff':
                logger.debug('Format string ignored')
            elif len(data) > 3 and data[:3] == b'XXX':
                logger.debug('Config string ignored')
            else:
                msg_list = []
                # add one hour (Cam and logger have different timezones o0)
                tempTime = dt.datetime.now() + dt.timedelta(hours=1)
                startTimeServer = int(tempTime.timestamp() * 1000)
                difference = 5
                dataTimeStamp = startTimeServer

                rawData = struct.unpack(def_string, data)
                rows = tuple(
                    rawData[i: i + 12] for i in range(9, len(rawData), 12))
                logger.debug(rows)


                for row in rows:
                    msg_list.append(list(row))
                    row = (dataTimeStamp,) + row
                    dataTimeStamp = int(
                        dataTimeStamp + difference)

                # format data to json
                id_mapper = {"192.168.0.15": 3,
                             "192.168.0.12": 3}
                msg = {}
                msg['id'] = id_mapper[addr[0]]
                msg['ts'] = startTimeServer
                msg['values'] = msg_list

                logger.debug(msg)
                #msgQueue.put(json.dumps(msg))
                state_counts = {}
                class_translation = {3: {0: 'count1',
                                         1: 'count2',
                                         2: 'count3'},
                                     4: {0: 'count1',
                                         1: 'count2',
                                         2: 'count3'}}

                msg['values'] = [vals[:6] for vals in msg['values']]
                log_dic = log_data(log_dic, msg)
                if msg['id'] in [3, 4]:
                    if msg['id'] == 3:
                        r_val = pp.preprocess(data_file=msg,
                                              models_path=r"C:/Users/jlm/Documents/01 Workspace/demonstrator/model/preprocess/CNC/",
                                              mode_training=False,
                                              config=dict(raw=0, features=1, selectk=0, pca=0, nothing=0, norm=0, minmax=1))

                    # elif msg['id'] == 4:
                    #     r_val = pp1.preprocess(data_file=msg,
                    #                           models_path="C:/Users/jlm/ownCloud/Demonstrator/CNC/Models/",
                    #                           mode_training=False,
                    #                           config=dict(nothing=0, norm=0, minmax=1))
                    logger.debug(r_val)
                    #log_dic = print_data(log_dic, msg)
                    pred_enc = model_dict[msg['id']]['model'].predict(r_val)
                    pred_class = pred_enc
                    #pred_class = model_dict[msg['id']][
                     #   'encoder'].inverse_transform(pred_enc)
                    logger.debug(pred_enc)
                    for idx_pred, pred in enumerate(pred_class):

                        # if msg['id'] not in state_counts:
                        #     state_counts[msg['id']] = {'count1': 0,
                        #                                    'count2': 0,
                        #                                    'count3': 0,
                        #                                    'total_count': 0}
                        #
                        #     state_counts[msg['id']][
                        #         class_translation[msg['id']][
                        #             pred_enc[idx_pred]]] += 1
                        #     state_counts[msg['id']]['total_count'] += 1

                            message_send = {'id': int(msg['id']),
                                            'state': pred,
                                            'ts': int(msg['ts'])}
                            #print(message_send)
                            log_class = log_classification(log_class, message_send,
                                                           msg['values'][idx_pred])
                            await websocket.send(json.dumps(message_send))
                            r_val = None
                            pred_enc = None
                            pred = None
                            message_send = None





                await websocket.send(json.dumps(msg))
                await asyncio.sleep(0.02)



    except websockets.ConnectionClosed:
        logger.info(log_dic)
        log_dic.to_csv(str(time.time())+'_dic.csv')
        log_class.to_csv(str(time.time()) + '_class.csv')
        logger.info('connection closed!')


if __name__ == '__main__':
    run_server(HOST, PORT)


