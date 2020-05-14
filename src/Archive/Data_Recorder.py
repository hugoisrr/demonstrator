#   ********************************************************************************************************************
#   Part 1/2 of the Sensorkoffer recording suite
#   Author:             Florian Grabi for Fraunhofer IPA (florian.grabi@ipa.fraunhofer.de)
#   Version:            0.1
#   Date first Version: 11.11.2019
#
#   This module listens for Minitags, registers them and records the data stream.
#   ********************************************************************************************************************

#   ********************************************************************************************************************
#   Imports
#   ********************************************************************************************************************
#   ********************************************************************************************************************
#   This Script opens a UDP port to receive data from the Sensorkoffer Minitags and stores it in csv files.
#   Author:             Florian Grabi for Fraunhofer IPA (florian.grabi@ipa.fraunhofer.de)
#   Version:            0.1
#   Date first Version: 13.02.2019
#
#   Use with Sensorkoffer Edge Device V1 and Sensorkoffer Minitags V3/V3EasyManufacture with Firmware StreamLogger V1.
#   Modelled after the older udpJsonLogger.py in the sensorkoffer_MiniServerDisplay_UDP project
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

hasSocket = False
while not hasSocket:
    try:
        # Bind to address and ip
        UDPServerSocket.bind((localIP, localPort))
        hasSocket = True
    except:
        time.sleep(5)
        logger.debug('Could not connect to network. Trying again in 5s')

knownAddresses = {}
lastTimestampServer = {}
lastTimestampMCU = {}
logfileHandles = {}
messageNumbers = {}
logFiles = []
flushHandles = {}

# Scan for Minitags, add new ones to the known sender list and read format strings when given.
# Also check for the camera trigger file

minitagTimeout = 30 # if a Minitag has not talked in this time, it is ignored when creating logfiles

isRecording = False
formatString = None
dataRate = None
arrayLength = None


logger.debug('Server is running on %s', localIP)
try:
    while True:
        # Helper variables for LED blinking
        currentTime = dt.datetime.now()

        while not isRecording:
            data,address = UDPServerSocket.recvfrom(bufferSize)
            logger.debug('received %s bytes from %s' % (len(data), address[0]))

            # Add new IPs or update the "last active" timestamp of a given address
            if address[0] in knownAddresses:
                lastTimestampServer[address[0]] = knownAddresses[address[0]]
            knownAddresses[address[0]] = time.time()
            logger.debug("Updating timestamp for %s to %s", address[0], knownAddresses[address[0]])

            # Check if data contains a format string
            # TODO get message length of the first valid message/the format string and ignore/trash all other messages after that for safety
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
                        logger.debug('Received config data: Data rate is %s, array length is %s', dataRate,arrayLength)
                    except:
                        dataRate = None
                        arrayLength = None
                        logger.debug('Error while parsing config data, check string formatting')
            elif formatString is not None and dataRate is not None and arrayLength is not None:
                # decode and print the data if a format string was given

                message = struct.unpack(formatString, data)
                print(message)
                if address[0] in messageNumbers:
                    if message[1] == messageNumbers[address[0]]:
                        logger.debug('Skipped message: Redundant data packet')
                    else:
                        #logger.debug(message)
                        if address[0] in lastTimestampMCU:
                            logger.debug('Valid message received: MCU time %s ms after last message, server time %s ms.', message[2]-lastTimestampMCU[address[0]],int(round((knownAddresses[address[0]]-lastTimestampServer[address[0]]) * 1000)))
                        lastTimestampMCU[address[0]] = message[2]
                        messageNumbers[address[0]] = message[1]
                else:
                    messageNumbers[address[0]] = message[1]

            else:
                logger.debug('Data packet ignored')

            # Check if the camera is recording
            camSemaphoreFile = Path('isRecording')
            if camSemaphoreFile.exists():
                logger.info('Data recording started - File')
                isRecording = True

        # If a started recording is detected, parse all known addresses and check if they are still active (Timestamp not too old)
        # Start logfiles for all active known addresses and start recording
        if isRecording:
            logger.info("Recording started")
            fieldNames = ['TIME', 'ACCX', 'ACCY', 'ACCZ', 'GYRX', 'GYRY', 'GYRZ', 'MAGX', 'MAGY', 'MAGZ', 'KARX', 'KARY', 'KARZ']
            logfileHandles.clear()
            for ip,timeStamp in knownAddresses.items():
                # Check if the address is still valid (= has the Minitag in question stopped talking?)
                if time.time() - timeStamp > minitagTimeout:
                    logger.debug("Minitag with IP %s skipped for long inactivity: %s > %s", ip, time.time() - timeStamp, minitagTimeout)
                    pass
                else:
                    octets = ip.split('.')
                    filename = 'XX_' + octets[3] + '_' + dt.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')+'.csv'
                    file = open(filename, '+w', newline='', buffering=1)
                    logger.debug("Opening file for Minitag with IP %s, filename %s", ip, filename)
                    logFiles.append(file)
                    logfileHandles[ip] = csv.writer(file)
                    logfileHandles[ip].writerow(fieldNames)
                    flushHandles[ip] = file # to flush logfiles later on per-file basis

        while   isRecording:
            print('Recording loop entered')
            # get UDP packets, unpack them and log the data
            data, address = UDPServerSocket.recvfrom(bufferSize)
            logger.debug('received %s bytes from %s' % (len(data), address))
            print(struct.unpack(formatString, data))
            print('Adress in logfileHandles')
            print(address[0] in logfileHandles)
            print(logfileHandles)
            print('Adress in Message Numbers')
            print(address[0] in messageNumbers)
            print(messageNumbers)
            if address[0] in logfileHandles and address[0] in messageNumbers:
                if formatString is not None and dataRate is not None and arrayLength is not None:
                    #UDPServerSocket.sendto(data, ('192.168.0.220', 65432))
                    rawData = struct.unpack(formatString, data)
                    print(rawData)
                    if rawData[1] != messageNumbers[address[0]]:
                        # TODO change if necessary
                        # TODO add code for the fusion Kardan angles

                        # update message number
                        messageNumbers[address[0]] = rawData[1]

                        # get timestamp, write in front of the sensor values
                        startTimeMcu = rawData[2]
                        # add one hour (Cam and logger have different timezones o0)
                        tempTime = dt.datetime.now() + dt.timedelta(hours=1)
                        startTimeServer = int(tempTime.timestamp()*1000)
                        # compute time difference at given poll rate
                        difference = int(1000/int(dataRate))
                        dataTimeStamp = startTimeServer

                        rows = tuple(rawData[i: i + 12] for i in range(9, len(rawData), 12))
                        for row in rows:
                            logger.debug('Scanned row: %s', row)
                            row = (dataTimeStamp,) + row
                            dataTimeStamp = int(dataTimeStamp + difference) # TODO check if that is consistent with the MCU time differences
                            logfileHandles[address[0]].writerow(row)
                            #flushHandles[address[0]].flush()
                            logger.debug('Writing row to file: %s',row)

                        logger.debug("Data written to file")
                    else:
                        logger.debug('Data packet skipped, redundant')
                else:
                    logger.debug("Data packet skipped, no format or config string given")
            else:
                logger.debug("Data packet skipped, Minitag has no open logfile")

            # Check if the camera is recording
            camSemaphoreFile = Path('isRecording')
            # If the recording has stopped, switch off the green LED
            if not camSemaphoreFile.exists():
                isRecording = False
                # Close all logfiles and remove handles
                for file in logFiles:
                    file.close()
                logFiles.clear()
except Exception as e:
    logger.debug('An error occured. Logger halted')
    # Show the error state using the red LED
    print(e)
    for file in logFiles:
        file.close()
    while(True):
        pass
finally:
    for file in logFiles:
        file.close()