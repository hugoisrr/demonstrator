import asyncio
import websockets
import json
import signal
from numpy.random import choice

first_device = [
    {
        "ws_id": 0,
        "ws_name": "sensor 1",
        "raw_data": {"0": "acc_x", "1": "acc_y", "2": "acc_z", "3": "gyr_x", "4": "gyr_y", "5": "gyr_z", "6": "mag_x", "7": "mag_y", "8": "mag_z", "9": "kar_x", "10": "kar_y", "11": "kar_z"}
    },
    {
        "ws_id": 1,
        "ws_name": "sensor 3",
        "raw_data": {"0": "acc_x", "1": "acc_y", "2": "acc_z", "3": "gyr_x", "4": "gyr_y", "5": "gyr_z", "6": "mag_x", "7": "mag_y", "8": "mag_z", "9": "kar_x", "10": "kar_y", "11": "kar_z"}
    }
]

msg_device = [
    { "ws_id": 0, "raw_values": {0: 123, 1: -12, 2: 135, 3: 32, 4: 23, 5: -54, 6: 90, 7: -65, 8: 17, 9: 0, 10: 5, 11: 10} },
    { "ws_id": 1, "raw_values": {0: 321, 1: -21, 2: 531, 3: 23, 4: 32, 5: -45, 6: 19, 7: -56, 8: 71, 9: 0, 10: 5, 11: 19} }
]

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
        data =  choice(msg_device, p=[0.5, 0.5])
        try:
            await websocket.send( json.dumps( data ) )
            await asyncio.sleep(0.5)
        except websockets.exceptions.ConnectionClosedError:
            print("Device gui disconected")
            break

async def send_label(websocket, path):
    print("client connected to label")
    await websocket.send( json.dumps( first_label ) )
    while True:
        data =  choice(msg_label, p=[0.14, 0.14, 0.14, 0.14, 0.14, 0.15, 0.15])
        try:
            await websocket.send( json.dumps( data ) )
            await asyncio.sleep(0.5)
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
            await asyncio.sleep(0.5)
        except websockets.exceptions.ConnectionClosedError:
            print("Model gui disconected")
            break

async def server(title, server, keep_execution, port):
    # async with websockets.serve(server, "0.0.0.0", port):
    async with websockets.serve(server, "172.21.30.241", port):
        print("Waiting for %s client on port %d" % (title,port))
        await keep_execution
        print("Stoping server on port %d" % port)

def main():
    loop = asyncio.get_event_loop()
    keep_execution = loop.create_future()
    loop.add_signal_handler(signal.SIGINT, keep_execution.set_result, None)

    loop.create_task(server("device", send_device, keep_execution, 2000))
    loop.create_task(server("labler", send_label, keep_execution, 3000))
    loop.create_task(server("model", send_model, keep_execution, 4000))

    loop.run_until_complete(keep_execution)

    print("Server stoped")

main()
