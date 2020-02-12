import asyncio
import websockets
import json
import signal
import threading

from StateGraph import Server, Writter, build_state_graph

graph = build_state_graph()

async def send_state(websocket, path):
    print("client connected")
    await websocket.send( json.dumps( [{"id": 10, "name": "Drill"}, {"id": 11, "name": "Laser"}, {"id": 12, "name": "Hammer"}] ) )
    while True:
        data = { "id": 10, "state": graph.current.id_number, "stateName": graph.current.name }
        await websocket.send( json.dumps( data ) )
        await asyncio.sleep(0.5)

async def server(stop):
    async with websockets.serve(send_state, "0.0.0.0", 2000):
        print("Waiting for client")
        thread = threading.Thread(target=graph.execute)
        thread.start()

        await stop

        print("Stoping server")
        graph.keep_execution = False
        Server.get_instance().close()
        Writter.get_instance().close()

def main():
    loop = asyncio.get_event_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGINT, stop.set_result, None)
    loop.run_until_complete(server(stop))
    print("Server stoped")

main()
