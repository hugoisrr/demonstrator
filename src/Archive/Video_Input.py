#   ********************************************************************************************************************
#   Code for IPA/127 process analytics demonstrator for "Spitzentreffen" executive summit 07112019
#   Author:             Florian Grabi for Fraunhofer IPA (florian.grabi@ipa.fraunhofer.de)
#   Version:            0.1
#   Date first Version: 28.10.2019
#
#   This module reads a prerecorded video file OR a live video stream from a camera.
#   It forwards frames and a UNIX timestamp(+ms) to a post-processing facility
#   and/or an output.
#   ********************************************************************************************************************

#   ********************************************************************************************************************
#   Imports
#   ********************************************************************************************************************


from vidgear.gears import CamGear
from vidgear.gears import WriteGear
import datetime
import cv2
import logging

logger = logging.getLogger(__name__)

class InputCamera:
    """
    Gets video frames, saves the last valid video frame to replace faulty frames.
    Pass this object to a processing/output object.
    """
    def __init__(self, output_link=None, source=0, width = 1280, height = 960, fps = 60):   #TODO implement video file opening

            self.denominator = 'camera'
            self.lastFrame = None
            self.source = source
            self.stream = None
            self.width = width #TODO automate
            self.height = height
            self.fps = fps

            self.options = {"CAP_PROP_FRAME_WIDTH ": self.width, "CAP_PROP_FRAME_HEIGHT": self.height,
                       "CAP_PROP_FPS ": self.fps}  # define tweak parameters

            try:
                if output_link.input == self.denominator:
                    logger.error('Cannot connect module to itself')
            except:
                logger.info('No output link specified')



    def start(self): # TODO move to ctor
        self.stream = CamGear(source=self.source, time_delay=1, logging=True, **self.options).start()  # To open video stream on first index(i.e. 0) device

    def get_frame(self):
        # read frame from camera
        frame = self.stream.read()
        # read timestamp
        timestamp = datetime.datetime.now()
        # if no frame could be read, reuse the ast valid frame. If there is none, return None.
        if frame is None:
            if self.lastFrame is None:
                logger.error('No camera connected')
            frame = self.lastFrame
        else:
            self.lastFrame = frame
        return (frame,timestamp)

    def stop(self):
        self.stream.stop()

class InputFile:
    pass

class InputStream:
    pass