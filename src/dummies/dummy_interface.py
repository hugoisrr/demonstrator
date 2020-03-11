import asyncio
import websockets
import json
import signal
from numpy.random import choice, normal as n

first_device = [
    {
        "ws_id": 0,
        "ws_name": "device 1",
        "raw_data": {"0": "acc_x", "1": "acc_y", "2": "acc_z", "3": "gyr_x", "4": "gyr_y", "5": "gyr_z", "6": "mag_x", "7": "mag_y", "8": "mag_z", "9": "kar_x", "10": "kar_y", "11": "kar_z"}
    },
    {
        "ws_id": 1,
        "ws_name": "device 3",
        "raw_data": {"0": "acc_x", "1": "acc_y", "2": "acc_z", "3": "gyr_x", "4": "gyr_y", "5": "gyr_z", "6": "mag_x", "7": "mag_y", "8": "mag_z", "9": "kar_x", "10": "kar_y", "11": "kar_z"}
    }
]

def msg_device():
    msgs = [
        { "ws_id": 0, "raw_values": {0: n(0,1), 1: n(0,1), 2: n(0,1), 3: n(0,1), 4: n(0,1), 5: n(0,1), 6: n(0,1), 7: n(0,1), 8: n(0,1), 9: n(0,1), 10: n(0,1), 11: n(0,1)} },
        { "ws_id": 1, "raw_values": {0: n(0,1), 1: n(0,1), 2: n(0,1), 3: n(0,1), 4: n(0,1), 5: n(0,1), 6: n(0,1), 7: n(0,1), 8: n(0,1), 9: n(0,1), 10: n(0,1), 11: n(0,1)} },
    ]
    return choice(msgs, p=[1, 0])


first_label = [
    {
        "ws_id": 0,
        "ws_name": "engraving machine",
        "states": { 0: "null", 1: "spindle", 2: "engraving" }
    },
    {
        "ws_id": 1,
        "ws_name": "drill",
        "states": { 0: "null", 1: "moving", 2: "drilling", 3: "playing"}
    },
]

msg_label =[
             { "ws_id": 0, "state_key": 0 }, 
             { "ws_id": 0, "state_key": 1 },
             { "ws_id": 0, "state_key": 2 },
             { "ws_id": 1, "state_key": 0 },
             { "ws_id": 1, "state_key": 1 },
             { "ws_id": 1, "state_key": 2 },
             { "ws_id": 1, "state_key": 3 }
           ]

async def send_device(websocket, path):
    print("client connected to device")
    await websocket.send( json.dumps( first_device ) )
    while True:
        data = msg_device()
        try:
            await websocket.send( json.dumps( data ) )
            await asyncio.sleep(1/30)
        except websockets.exceptions.ConnectionClosedError:
            print("Device gui disconected")
            break

""" async def send_label(websocket, path):
    print("client connected to label")
    await websocket.send( json.dumps( first_label ) )
    while True:
        data =  choice(msg_label, p=[0.14, 0.14, 0.14, 0.14, 0.14, 0.15, 0.15])
        try:
            await websocket.send( json.dumps( data ) )
            await asyncio.sleep(1/1)
        except websockets.exceptions.ConnectionClosedError:
            print("Label gui disconected")
            break

async def send_model(websocket, path):
    print("client connected to model")
    await websocket.send( json.dumps( first_label ) )
    while True:
        data =  choice(msg_label, p=[0.14, 0.14, 0.14, 0.14, 0.14, 0.15, 0.15])
        try:
            await websocket.send( json.dumps( data ) )
            await asyncio.sleep(1/1)
        except websockets.exceptions.ConnectionClosedError:
            print("Model gui disconected")
            break
 """
async def server(title, server, keep_execution, port):
    async with websockets.serve(server, "0.0.0.0", port):
        print("Waiting for %s client on port %d" % (title,port))
        await keep_execution
        print("Stoping server on port %d" % port)

def main():
    loop = asyncio.get_event_loop()
    keep_execution = loop.create_future()
    loop.add_signal_handler(signal.SIGINT, keep_execution.set_result, None)

    loop.create_task(server("device", send_device, keep_execution, 2000))
    """ loop.create_task(server("labler", send_label, keep_execution, 3000)) """
    """ loop.create_task(server("model", send_model, keep_execution, 4000)) """

    loop.run_until_complete(keep_execution)

    print("Server stoped")

main()
