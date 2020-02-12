# This receiver has to do the following:
# 1. Decrypt arriving datagrams/Sanitize ill-formed packets and document
# 2. Check if datagram header

# Datagram structure V1:
# Last part of IP address (Dynamic identifier), 1B
# Unique identifier number for a client/tag, 2B (Is stored in tag EEPPROM)
# Packet number (1B, looping from 0 to 255, also usable as reset marker)
# Number of data points in this datagram (1B)
# Data points:
# 12B Acc values (4*float)
# 12B Gyro values (4*float)
# 12B Mag values (4*float)
# Status Byte (ABCDEFGH)
# A: isMoving bit
# B: hasWarning bit (Not used ATM)
# C: hasReset bit (Not used ATM)
# D: hasReconnect bit (not used ATM)
# E: isBatteryLow bit (Not used ATM)
# F: Empty, for later use
# G: Empty, for later use

import socket # For udp sending/receiving
from struct import *
import struct # For binary data packing

UDP_IP_ADDRESS = "192.168.0.99"
UDP_PORT_NO = 65432

serverSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
serverSock.bind((UDP_IP_ADDRESS, UDP_PORT_NO))

while True:
    data, addr = serverSock.recvfrom(4096)
    print("Message: ", data)
    print("Length: ", len(data))
    print("Sender:", addr)
    # Get the data
    #if len(data) == 48:
    #    uData = unpack('BHBBfffffffff?xxx',data)
    #    print(uData)
