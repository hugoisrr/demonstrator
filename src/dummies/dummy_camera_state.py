import asyncio
import websockets
import json
import signal
from random import randrange

first_msg = [{"id": 10, "name": "Drill"}, {"id": 11, "name": "Laser"}, {"id": 12, "name": "Hammer"}]
states = [ { "id": 10, "state": 0, "stateName": "not running" },
           { "id": 10, "state": 1, "stateName": "spindle" },
           { "id": 10, "state": 2, "stateName": "engraving" } ]

async def send_state(websocket, path):
    print("client connected")
    await websocket.send( json.dumps( first_msg ) )
    while True:
        data = states[randrange(3)]
        await websocket.send( json.dumps( data ) )
        await asyncio.sleep(0.5)

async def server(stop):
    async with websockets.serve(send_state, "0.0.0.0", 2000):
        print("Waiting for client")
        await stop
        print("Stoping server")

def main():
    loop = asyncio.get_event_loop()
    stop = loop.create_future()
    #loop.add_signal_handler(signal.SIGINT, stop.set_result, None)
    loop.run_until_complete(server(stop))
    print("Server stoped")

main()