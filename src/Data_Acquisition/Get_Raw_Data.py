#   ********************************************************************************************************************
#   Author:             Florian Grabi for Fraunhofer IPA (florian.grabi@ipa.fraunhofer.de)
#   Version:            0.1
#   Date first Version: 11.11.2019
#   Modified:           05.02.2020
#
#   This module listens for Minitags, registers them and (PLACEHOLDER) forwards the data for further processing.
#   ********************************************************************************************************************

#   ********************************************************************************************************************
#   Imports
#   ********************************************************************************************************************

import socket
import datetime as dt
import time
import csv
import logging
import struct
from pathlib import Path
import cv2


# setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

# Setup the server socket

localIP = "192.168.0.99"

localPort = 65432

bufferSize = 4096
UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
UDPServerSocket.settimeout(10) # Set socket timeout to 10 seconds

hasSocket = False
while not hasSocket:
    try:
        # Bind to address and ip
        UDPServerSocket.bind((localIP, localPort))
        hasSocket = True
    except:
        time.sleep(5)
        logger.debug('Could not connect to network. Trying again in 5s')


# Setup message and address storage
knownAddresses = {}
lastTimestampServer = {}
lastTimestampMCU = {}
logfileHandles = {}
messageNumbers = {}
logFiles = []
flushHandles = {}

# Scan for Minitags, add new ones to the known sender list and read format strings when given.

isRecording = False
formatString = None
dataRate = None
arrayLength = None
logger.debug('Server is running on %s', localIP)


# Main loop
try:
    while True:
        try:
            # Receive messages
            data, address = UDPServerSocket.recvfrom(bufferSize)
        except socket.timeout:
            logger.error('Socket timeout - Waited too long for messages')
            data = None
            address = None

        if data is not None: # Socket timeout was triggered
            logger.debug('received %s bytes from %s' % (len(data), address[0]))

            # Add new IPs or update the "last active" timestamp of a given address
            if address[0] in knownAddresses:
                logger.debug('IP address is known')
                lastTimestampServer[address[0]] = knownAddresses[address[0]]
                knownAddresses[address[0]] = time.time()
            else:
                logger.debug('Unknown IP detected - Adding to known list')
                knownAddresses[address[0]] = time.time()
            logger.debug("Updating timestamp for %s to %s", address[0], knownAddresses[address[0]])

            # Check if data contains a format string
            if len(data) > 9 and data[:9] == b'BBLffffff':
                # Format string detected, check if Format string is already set
                if formatString is not None:
                    logger.debug('Format string ignored')
                else:
                    formatString = data.decode('ascii')
                    logger.debug('Format String detected: ')
                    logger.debug(formatString)
            elif len(data) > 3 and data[:3] == b'XXX':
                # Config string detected, check if already set
                if dataRate is not None and arrayLength is not None:
                    logger.debug('Config string ignored')
                else:
                    logger.debug('Config string detected: %s', data)
                    # get the string, separate the three parts (Marker, data rate, array length)
                    confString = data.decode('ascii')
                    conf = confString.split(',')
                    try:
                        dataRate = conf[2]
                        arrayLength = conf[1]
                        logger.debug('Received config data: Data rate is %s, array length is %s', dataRate, arrayLength)
                    except:
                        dataRate = None
                        arrayLength = None
                        logger.debug('Error while parsing config data, check string formatting')
            elif formatString is not None and dataRate is not None and arrayLength is not None:
                # Decode and forward the data
                message = struct.unpack(formatString, data)
                if address[0] in messageNumbers:
                    if message[1] == messageNumbers[address[0]]:
                        logger.debug('Data packet ignored: Redundant')
                    else:
                        if address[0] in lastTimestampMCU:
                            logger.debug('Valid message received: MCU time %s ms after last message, server time %s ms.',message[2] - lastTimestampMCU[address[0]],int(round((knownAddresses[address[0]] - lastTimestampServer[address[0]]) * 1000)))

                            # TODO Optional: unpack the data payload to a tuple and add the MCU timestamp
                            rows = tuple(message[i: i + 12] for i in range(9, len(message), 12))
                            for row in rows:
                                row = (message[2],) + row
                            # TODO forward data





                        lastTimestampMCU[address[0]] = message[2]
                        messageNumbers[address[0]] = message[1]
                else:
                    messageNumbers[address[0]] = message[1]
            else:
                logger.debug('Unknown data ignored')
except Exception as e:
    logger.debug('An error occured. Data acquisition halted')
    print(e)