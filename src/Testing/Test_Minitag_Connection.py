# Test script, sets up a UDP receiver port to listen for Minitag messages.
# Should print messages on reception
# If no messages are received, check: Firewall, static IP of your computer

import socket # For udp sending/receiving
import struct # For binary data packing
import logging
import datetime as dt

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


# Initialize variables
formatString = None
confString = None
bufferSize = 4096

# Set up udp server (for minitags as clients)
UDP_IP_ADDRESS = "192.168.0.99" #Adress that needs to be set as static IP on PC running the code
UDP_PORT_NO = 65432

serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
serverSock.bind((UDP_IP_ADDRESS, UDP_PORT_NO))



while True:
    data, addr = serverSock.recvfrom(bufferSize) #receive data with buffer size
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
        rows = tuple(message[i: i + 12] for i in range(9, len(message), 12))
        logger.info(f'sensor values: {rows}')
