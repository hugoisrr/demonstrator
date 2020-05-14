import socket
import struct
import datetime as dt
import csv

HOST = '192.168.0.221'
PORT = 65432

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

try:
    while True:
        data, addr = sock_client.recvfrom(4096)
        print(str(dt.datetime.now().timestamp()) + ' Received from ' + addr[0])

        if len(data) > 9 and data[:9] == b'BBLffffff':
            print('Format string ignored')
        elif len(data) > 3 and data[:3] == b'XXX':
            print('Config string ignored')
        else:
            # add one hour (Cam and logger have different timezones o0)
            tempTime = dt.datetime.now() + dt.timedelta(hours=1)
            startTimeServer = int(tempTime.timestamp() * 1000)
            difference = 5
            dataTimeStamp = startTimeServer

            rawData = struct.unpack(def_string, data)
            rows = tuple(rawData[i: i + 12] for i in range(9, len(rawData), 12))
            for row in rows:
                row = (dataTimeStamp,) + row
                dataTimeStamp = int(dataTimeStamp + difference)  # TODO check if that is consistent with the MCU time differences
                file_csv.writerow(row)
except Exception as e:
    print(e)
    file.close()
finally:
    file.close()