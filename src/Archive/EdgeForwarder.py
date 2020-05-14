import socket
import struct
import datetime as dt
import csv
import queue
import asyncio
import websockets
import json

HOST = '192.168.0.220'
PORT = 65432

TARGET_IP = 'localhost' # Put the PC IP running the model here
TARGET_PORT = 6001

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

sock_client = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
sock_client.bind((HOST, PORT))
print("connected")

filename = dt.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')+'.csv'
file = open(filename, '+w', newline='')

fieldNames = ['TIME', 'ACCX', 'ACCY', 'ACCZ', 'GYRX', 'GYRY', 'GYRZ', 'MAGX', 'MAGY', 'MAGZ', 'KARX', 'KARY', 'KARZ']
file_csv = csv.writer(file)
file_csv.writerow(fieldNames)

msgQueue = queue.Queue()

msg = {}

async def forward_msgs(websocket, path):
    while True:
        if not msgQueue.empty():
            await websocket.send(msgQueue.get())
        else:
            await asyncio.sleep(0.1)

start_server = websockets.serve(forward_msgs, TARGET_IP, TARGET_PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


try:
    while True:
        data, addr = sock_client.recvfrom(4096)
        print(str(dt.datetime.now().timestamp()) + ' Received from ' + addr[0])

        if len(data) > 9 and data[:9] == b'BBLffffff':
            print('Format string ignored')
        elif len(data) > 3 and data[:3] == b'XXX':
            print('Config string ignored')
        else:
            msg_list = []
            # add one hour (Cam and logger have different timezones o0)
            tempTime = dt.datetime.now() + dt.timedelta(hours=1)
            startTimeServer = int(tempTime.timestamp() * 1000)
            difference = 5
            dataTimeStamp = startTimeServer

            rawData = struct.unpack(def_string, data)
            rows = tuple(rawData[i: i + 12] for i in range(9, len(rawData), 12))

            # ===================== Comment this out for no logging ================================
            for row in rows:
                msg_list.append(list(row))
                row = (dataTimeStamp,) + row
                dataTimeStamp = int(dataTimeStamp + difference)  # TODO check if that is consistent with the MCU time differences
                file_csv.writerow(row)
            # ===================== Comment this out for no logging ================================

            # format data to json
            msg['id'] = addr
            msg['ts'] = startTimeServer
            msg['values'] = msg_list
            msgQueue.put(json.dumps(msg))



except Exception as e:
    print(e)
    file.close()
finally:
    file.close()