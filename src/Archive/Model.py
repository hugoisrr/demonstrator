import asyncio
import websockets
import json
import pickle
from src import preprocessing as pp
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import time

HOST = 'localhost'
PORT = 3000

def read_pickle(path):
    with open(path, 'rb') as input_file:
        return pickle.load(input_file)


model_dict = {3: {'model': read_pickle('../model/model_191113_cnc.pickle'),
                  'encoder': read_pickle('../model/Archive/encoder.pickle')},
              4: {'model': read_pickle('../model/model_191113_cnc.pickle'),
                  'encoder': read_pickle('../model/Archive/encoder.pickle')}}


print('models imported')

def run_server(HOST, PORT):
    loop = asyncio.get_event_loop()

    start_server = websockets.serve(handler, str(HOST),
                                    int(PORT))
    print('server started')
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
    try:
        while True:
            msg = await websocket.recv()
            print(msg)
    except websockets.ConnectionClosed:
        print('connection closed')

def load_message(message, values):
    msg = json.loads(message)[0]
    val = msg['data_plot']['value']
    values.append(val)

async def send(websocket, path):
    print('trying to connect')
    try:
        async with websockets.connect('ws://localhost:2000') as client:
            print('connected to client')
            state_counts = {}
            class_translation = {3: {0: 'count1',
                                     1: 'count2',
                                     2: 'count3'},
                                 4: {0: 'count1',
                                     1: 'count2',
                                     2: 'count3'},
                                 }
            fig = plt.figure()
            ax = fig.add_subplot(1,1,1)

            y_values = list(range(20))
            x_values = list(range(20))
            ax.plot(x_values, y_values)
            i = 0
            #plt.ion()
            fig.show()
            while True:
                message = await client.recv()
                message = json.loads(message)[0]
                print(message)
                val = message['values'][0][0]
                y_values.append(val)
                x_values.append(i)
                print(x_values)
                print(y_values)
                ax.plot(x_values, y_values)
                fig.canvas.draw_idle()
                i+= 1

                ax.set_xlim(left=max(0, i-50), right=i+50)
                plt.pause(0.001)
                if message['id'] in [3, 4]:
                    if message['id'] == 3:
                        r_val = pp.preprocess(data_file=message,
                                              models_path=C:\Users\jlm\ownCloud\Demonstrator\CNC\Models,
                                              mode_training=False, w_factor=[2], bool_raw=False, bool_nothing=False,
                                              bool_minmax=False, bool_pca=False)

                    elif message['id'] == 4:
                        r_val = pp.preprocess(data_file=message,
                                              models_path="C:/Users/emc-ap/Desktop/Andrea_Test/Drawing/Models/",
                                              mode_training=False, w_factor=[2], bool_raw=False, bool_nothing=False,
                                              bool_minmax=False, bool_pca=False)
                    pred_enc = model_dict[message['id']]['model'].predict(message['values'])
                    pred_class = model_dict[message['id']]['encoder'].inverse_transform(pred_enc)
                    for idx_pred, pred in enumerate(pred_class):
                       print(pred)
                       if message['id'] not in state_counts:
                           state_counts[message['id']] = {'count1': 0,
                                                          'count2': 0,
                                                          'count3': 0,
                                                          'total_count': 0}


                       state_counts[message['id']][class_translation[message['id']][pred_enc[idx_pred]]] += 1
                       state_counts[message['id']]['total_count'] += 1

                       message_send = {'id': int(message['id']),
                                      'state': pred,
                                      'ts': int(message['ts']),
                                      'count1': state_counts[message['id']]['count1'],
                                      'count2': state_counts[message['id']][ 'count2'],
                                      'count3': state_counts[message['id']][ 'count3'],
                                      'total_count': state_counts[message['id']][ 'total_count'],
                                      'data_plot': {'feature_name': 'acc_z',
                                                    'value': message['values'][idx_pred][0]}}
                       print(message_send)
                       await websocket.send(json.dumps(message_send))
                await asyncio.sleep(0.02)



    except websockets.ConnectionClosed:
        print('connection closed')


if __name__ == '__main__':
    run_server(HOST, PORT)


