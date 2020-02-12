import asyncio
import websockets
import pickle
import json


with open('../data/X_test.pickle', 'rb') as inp_file:
    raw_data = pickle.load(inp_file)

HOST = 'localhost'
PORT = 2000

def run_server(HOST, PORT):
    loop = asyncio.get_event_loop()

    start_server = websockets.serve(handler, str(HOST),
                                    int(PORT))

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


async def send(websocket, path):
    try:
       idx = 0
       while True:
           message = raw_data[idx:idx+1]
           print(message)
           await websocket.send(json.dumps(message))
           idx += 1
           await asyncio.sleep(0.250)
           if idx == len(raw_data):
               idx = 0

    except websockets.ConnectionClosed:
        print('connection closed')


if __name__ == '__main__':
    run_server(HOST, PORT)


