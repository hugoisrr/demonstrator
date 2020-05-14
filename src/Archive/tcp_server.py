# Test script, sets up a UDP receiver port to listen for Minitag messages.
# Should print messages on reception
# If no messages are received, check: Firewall, static IP of your computer

import socket # For udp sending/receiving
import struct # For binary data packing
import logging
import datetime as dt
import asyncio
import websockets
import csv
import time
import json
import os

# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s-%(name)s-%(levelname)s-%(message)s')

currTime = dt.datetime.now().strftime("%y%m%d_%H%M%S")
fileHandler = logging.FileHandler(f'../../logs/{currTime}_logfile.log')
fileHandler.setFormatter(formatter)

streamHandler = logging.StreamHandler()
streamHandler.setFormatter(formatter)

logger.addHandler(fileHandler)
logger.addHandler(streamHandler)




# Set up udp server (for minitags as clients)
UDP_IP_ADDRESS = "localhost" #Adress that needs to be set as static IP on PC running the code
UDP_PORT_NO = 65432

serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
serverSock.bind((UDP_IP_ADDRESS, UDP_PORT_NO))

os.makedirs('../../recordings/', exist_ok=True)

async def client(hostname="localhost", port=8765, UDP_IP_ADRESS="localhost",
                 UDP_PORT_NO=65432):
    websocketURL = f"ws://{hostname}:{port}"
    # Initialize variables
    formatString = None
    confString = None
    bufferSize = 4096
    async with websockets.connect(websocketURL) as wsClient:
        ts = int(time.time()) * 1000
        csvFile = open(f'../../recordings/{dt.datetime.now().strftime("%y%m%d_%H%M%S")}_recording.csv', 'a')
        while True:
            camMessage = await wsClient.recv()
            camMessage = json.loads(camMessage)
            print(camMessage)
            await asyncio.sleep(0.2)
            data, addr = serverSock.recvfrom(bufferSize)  # receive data with buffer size
            logger.info(f"Received message: {data}")
            logger.info(f"Message length: {len(data)}")
            logger.info(f"Message type: {type(data)}")
            logger.info(f"IP sending data: {addr}")

            if len(data) > 9 and data[:9] == b'BBLffffff': #Check for format string
                formatString = data.decode('ascii')
                logger.info('format string: ', formatString)

            elif len(data) > 3 and data[:3] == b'XXX': #Check for config string containing data rate and array length
                confString = data.decode('ascii')
                conf = confString.split(',')
                dataRate = conf[2]
                arrayLength = conf[1]
                logger.info(f'Array length: {arrayLength}; data rate: {dataRate}')

            elif (formatString is not None) and (confString is not None):
                #Start parsing data after formatString and confString have been received
                message = struct.unpack(formatString, data)  #parse data
                logger.info(f'parsed message: {message}')
                logger.info(f'message number: {message[1]}')
                logger.info(f'MCU timestamp: {message[2]}')
                for i in range(9, len(message), 12):
                    print([ts])
                    print(list(message[i: i + 12]))
                    print(camMessage)
                    print(type(camMessage))
                    print(camMessage["state"])
                    labeledData = [ts] + list(message[i: i + 12]) + [camMessage["state"]]
                    ts += 50
                    labeledData = ','.join([str(element) for element in labeledData])
                    print(labeledData)
                    csvFile.write(labeledData)
                    csvFile.write("\n")
                logger.info(f'sensor values: {labeledData}')

            camMessage = None
            data = None


loop = asyncio.get_event_loop()
loop.run_until_complete(client())
loop.run_forever()

# while True:
#     data, addr = serverSock.recvfrom(bufferSize) #receive data with buffer size
#     logger.info(f"Received message: {data}")
#     logger.info(f"Message length: {len(data)}")
#     logger.info(f"Message type: {type(data)}")
#     logger.info(f"IP sending data: {addr}")
#
#     if len(data) > 9 and data[:9] == b'BBLffffff': #Check for format string
#         formatString = data.decode('ascii')
#         logger.info('format string: ', formatString)
#
#     elif len(data) > 3 and data[:3] == b'XXX': #Check for config string containing data rate and array length
#         confString = data.decode('ascii')
#         conf = confString.split(',')
#         dataRate = conf[2]
#         arrayLength = conf[1]
#         logger.info(f'Array length: {arrayLength}; data rate: {dataRate}')
#
#     elif (formatString is not None) and (confString is not None):
#         #Start parsing data after formatString and confString have been received
#         message = struct.unpack(formatString, data)  #parse data
#         logger.info(f'parsed message: {message}')
#         logger.info(f'message number: {message[1]}')
#         logger.info(f'MCU timestamp: {message[2]}')
#         rows = tuple(message[i: i + 12] for i in range(9, len(message), 12))
#         logger.info(f'sensor values: {rows}')
