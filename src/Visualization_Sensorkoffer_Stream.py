import cv2
import numpy as np
import datetime as dt
import socket
import struct
import queue


height = 500
width = 1000
#font = cv2.FONT_HERSHEY_SIMPLEX
#font = cv2.FONT_HERSHEY_PLAIN
font = cv2.FONT_HERSHEY_DUPLEX
#font = cv2.FONT_HERSHEY_COMPLEX
#font = cv2.FONT_HERSHEY_TRIPLEX
#font = cv2.FONT_HERSHEY_COMPLEX_SMALL
#font = cv2.FONT_HERSHEY_SCRIPT_SIMPLEX
#font = cv2.FONT_HERSHEY_SCRIPT_COMPLEX


color_font = (0,0,0)
color_active = (190,230,60)
color_state1 = (44, 255, 242)
color_state2 = (44, 185, 255)
color_state3 = (72, 36, 255)

HOST = '192.168.0.220'
#HOST = '127.0.0.1'
PORT = 65432

#================================
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

msgQueue = queue.Queue()

msg = {}

xavg = 0
yavg = 0
zavg = 0

state=None

try:
    while True:
        data, addr = sock_client.recvfrom(4096)
        #print(str(dt.datetime.now().timestamp()) + ' Received from ' + addr[0])

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

            xhigh = rawData[15]
            yhigh = rawData[16]
            zhigh = rawData[17]

            xavg = rawData[18]
            yavg = rawData[19]
            zavg = rawData[20]

            tst=dt.datetime.now()
            print('Time: %s X high: %s Y high: %s Z high: %s X average: %s Y average: %s Z average: %s' % (tst,str(xhigh), str(yhigh), str(zhigh),str(xavg), str(yavg), str(zavg)))

            #if xhigh < 2700 and xhigh > 1600 and yhigh < 2700 and yhigh > 1600 and zhigh < 14900 and zhigh > 13700:
            #    print('Time: %s State: Idle' % tst);
            #elif xhigh < 3700 and xhigh > 2500 and yhigh < 5300 and yhigh > 4100 and zhigh < 17100 and zhigh > 15900:
            #    print('Time: %s State: Spindle turning' % tst);
            #else:
            #    print('Time: %s State: Engraving' % tst);

            if xhigh < 1000 and xhigh > 0 and yhigh < 1000 and yhigh > 0 and zhigh < 17000 and zhigh > 15700:
                print('Time: %s State: Idle' % tst);
                state = 'Idle'
            elif xhigh < 5100 and xhigh > 3900 and yhigh < 3200 and yhigh > 2000 and zhigh < 22000 and zhigh > 20000:
                print('Time: %s State: Spindle turning' % tst);
                state = 'Spindle'
            else:
                print('Time: %s State: Engraving' % tst);
                state = 'Engraving'
            rows = tuple(rawData[i: i + 12] for i in range(9, len(rawData), 12))

            # ===================== Comment this out for no logging ================================
            for row in rows:
                msg_list.append(list(row))
                row = (dataTimeStamp,) + row
                dataTimeStamp = int(dataTimeStamp + difference)  # TODO check if that is consistent with the MCU time differences
            # ===================== Comment this out for no logging ================================

            # format data to json
            msg['id'] = addr
            msg['ts'] = startTimeServer
            msg['values'] = msg_list
            #msgQueue.put(json.dumps(msg))

        frame = np.zeros((height,width,3), np.uint8)
        cv2.rectangle(frame, (0, 0),(round(width/3), height),color_state1, -1)
        cv2.rectangle(frame, (round(width/3), 0), (round(width / 3)*2, height), color_state2, -1)
        cv2.rectangle(frame, (round(width/3)*2, 0), (width, height), color_state3, -1)


        if state == 'Idle':
            cv2.rectangle(frame, (0, 0), (round(width / 3), height), color_active, -1)
        if state == 'Spindle':
            cv2.rectangle(frame, (round(width / 3), 0), (round(width / 3) * 2, height), color_active, -1)
        if state == 'Engraving':
            cv2.rectangle(frame, (round(width / 3) * 2, 0), (width, height), color_active, -1)

        #cv2.putText(frame, str(datetime.datetime.now()), (2, int(height * 0.1)), font, 0.5, (255, 0, 0), 2, cv2.LINE_AA)

        cv2.putText(frame, 'IDLE', (int(width * 0.13), int(height * 0.5)), font, 1, color_font, 2, cv2.LINE_AA)
        cv2.putText(frame, 'SPINNING', (int(width * 0.43), int(height * 0.5)), font, 1, color_font, 2, cv2.LINE_AA)
        cv2.putText(frame, 'ENGRAVING', (int(width * 0.74), int(height * 0.5)), font, 1, color_font, 2, cv2.LINE_AA)
        cv2.imshow("SENSORKOFFER: CNC Milling Process States", frame)
        #cv2.imshow("Output Frame", orig_frame[200:650])# To show over frontend
        # Show output window

        # Live data visualization
        #frame2 = np.ones((height, width, 3), np.uint8)
        #cv2.imshow("SENSORKOFFER: Accelerometer Data", frame)

        key = cv2.waitKey(1) & 0xFF
        # check for 'q' key-press
        if key == ord("q"):
        # if 'q' key-pressed break out
            break
except Exception as e:
    print(e)
#================================