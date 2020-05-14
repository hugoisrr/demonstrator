import asyncio
import websockets
import pickle
import json
import random


HOST = 'localhost'
PORT = 3000

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
       ts = 12354436568543

       message_dict = {12: [0, 1, 2],
                       13: [0, 1, 2],
                       14: [0, 1, 2]}
       id = 12

       while True:


           message = {"id": id,
                      "state": message_dict[id][random.randint(0,2)],
                      "ts": ts}

           print(message)
           await websocket.send(json.dumps(message))
           ts += 250
           id += 1
           if id > 14:
               id = 12
           await asyncio.sleep(0.250)


    except websockets.ConnectionClosed:
        print('connection closed')


if __name__ == '__main__':
    run_server(HOST, PORT)


