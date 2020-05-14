#   ********************************************************************************************************************
#   Part 2/2 of the Sensorkoffer recording suite
#   Author:             Florian Grabi for Fraunhofer IPA (florian.grabi@ipa.fraunhofer.de)
#   Version:            0.1
#   Date first Version: 11.11.2019
#
#   This module records video from a connected camera and prints a timestamp on it.
#   ********************************************************************************************************************

#   ********************************************************************************************************************
#   Imports
#   ********************************************************************************************************************
from Video_Input import InputCamera
from Video_Processing import Timestamper, Preprocessor, SingleMotionDetector, ColorTracker
import datetime as dt
import cv2
from vidgear.gears import WriteGear
from pathlib import Path
import os

output_params = {"-vcodec": "libx264", "-crf": 0,
                 "-preset": "fast"}  # define (Codec,CRF,preset) FFmpeg tweak parameters for writer

cam = InputCamera(source=1)
cam.start()
timestamper = Timestamper()
isRecording = False
name = dt.datetime.now().strftime('%Y-%m-%d_%H-%M-%S') + '.mp4'
writer = WriteGear(output_filename = name, compression_mode = True, logging = True, **output_params) #Define writer with output filename 'Output.mp4'

print('Starting')

while True:
    frame, timestamp = cam.get_frame()  # keep original frame for output
    frame, timestamp = timestamper.process(frame, timestamp)
    key = cv2.waitKey(1) & 0xFF
    if key == 32:
        if not isRecording:
            try:
                Path('isRecording').touch()
            except:
                pass
            print('Recording start')
            isRecording = True
        else:
            isRecording = False
            writer.close()
            try:
                os.remove('isRecording')
            except:
                pass
            print('Recording stop')

    if isRecording:
        writer.write(frame)

    cv2.imshow('Live Video', frame)

