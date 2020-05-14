import asyncio
import websockets
import json

import matplotlib.animation as animation
import time

HOST = 'localhost'
PORT = 3000

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
        while True:
            await websocket.send('state 0')
            await asyncio.sleep(0.02)



    except websockets.ConnectionClosed:
        print('connection closed')


if __name__ == '__main__':
    run_server(HOST, PORT)


