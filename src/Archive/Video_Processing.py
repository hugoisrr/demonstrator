#   ********************************************************************************************************************
#   Code for IPA/127 process analytics demonstrator for "Spitzentreffen" executive summit 07112019
#   Author:             Florian Grabi for Fraunhofer IPA (florian.grabi@ipa.fraunhofer.de)
#   Version:            0.1
#   Date first Version: 10.10.2019
#
#   This module takes prerecorded
#
#   ********************************************************************************************************************

#   ********************************************************************************************************************
#   Imports
#   ********************************************************************************************************************

import cv2
import imutils
import numpy as np

class Timestamper:
    def __init__(self):
        self.font = font = cv2.FONT_HERSHEY_SIMPLEX
        self.fourcc = cv2.VideoWriter_fourcc(*'DIVX')
    def process(self, frame, timestamp, height=300):
        # annotate with datetime timestamp
        cv2.putText(frame, str(timestamp), (10, int(height * 0.9)), self.font, 1, (255, 0, 0), 2, cv2.LINE_AA)
        return frame, timestamp
    # TODO check if usable for automated frame height deduction
#    width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
 #   height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
  #  fps = vid.get(cv2.CAP_PROP_FPS)

class Preprocessor:
    def __init__(self):
        pass
    def resize(self, frame, width=400):
        # get image size, and return the scale factor
        #orig_height, orig_width = frame.shape[:2]
        #scale = width/orig_height
        return (imutils.resize(frame, width=width))
    def blur(self, frame):
        return cv2.GaussianBlur(frame, (7,7), 0)
    def to_gray(self, frame):
        return cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)


class SingleMotionDetector:
    def __init__(self, accumWeight=0.5):
        # store the accumulated weight factor
        self.accumWeight = accumWeight
        self.background_counter = 0
        self.background_max = 40

        # initialize the background model
        self.bg = None

    def update(self, image):
        # if the background model is None, initialize it
        if self.bg is None:
            self.bg = image.copy().astype("float")
            return

        # update the background model by accumulating the weighted
        # average
        cv2.accumulateWeighted(image, self.bg, self.accumWeight)

    def detect(self, image, tVal=25):
        motion = None
        if self.background_counter >= self.background_max:

            # compute the absolute difference between the background model
            # and the image passed in, then threshold the delta image
            delta = cv2.absdiff(self.bg.astype("uint8"), image)
            thresh = cv2.threshold(delta, tVal, 255, cv2.THRESH_BINARY)[1]

            # perform a series of erosions and dilations to remove small
            # blobs
            thresh = cv2.erode(thresh, None, iterations=2)
            thresh = cv2.dilate(thresh, None, iterations=2)

            # find contours in the thresholded image and initialize the
            # minimum and maximum bounding box regions for motion
            cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                cv2.CHAIN_APPROX_SIMPLE)
            cnts = imutils.grab_contours(cnts)
            (minX, minY) = (np.inf, np.inf)
            (maxX, maxY) = (-np.inf, -np.inf)

            # if no contours were found, return None
            if len(cnts) == 0:
                return None

            # otherwise, loop over the contours
            for c in cnts:
                # compute the bounding box of the contour and use it to
                # update the minimum and maximum bounding box regions
                (x, y, w, h) = cv2.boundingRect(c)
                (minX, minY) = (min(minX, x), min(minY, y))
                (maxX, maxY) = (max(maxX, x + w), max(maxY, y + h))

            motion = (thresh, (minX, minY, maxX, maxY))

        self.update(image)
        if self.background_counter < self.background_max:
            self.background_counter += 1

        # If motion was found, return a tuple of the thresholded image along
        # with bounding box
        return motion

class DotWatcher:
    def __init__(self):
        self.dot_coordinates = []
        self.dot

    def add_dot(self, x, y):
        self.dot_coordinates.append((x,y))

class ColorTracker:
    def __init__(self, hsvLowThresh, hsvHighThresh, minSize, maxSize, maxBlobCount=1):
        self.hsv_low_thresh = hsvLowThresh
        self.hsv_high_thresh = hsvHighThresh
        self.min_size = minSize
        self.max_size = maxSize
        self.max_blob_count = maxBlobCount # TODO implement for multi tracking

    def find_color_blobs(self,frame):
        # Change color domain
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Mask the selected color
        mask = cv2.inRange(hsv, self.hsv_low_thresh, self.hsv_high_thresh)
        # Remove small specks in the masked image
        mask = cv2.erode(mask, None, iterations=2)
        mask = cv2.dilate(mask, None, iterations=2)

        # find contours in the mask and initialize the current
        # (x, y) center of the found contours
        cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL,
                                cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        center = None
        blob = None
        # only proceed if at least one contour was found
        if len(cnts) > 0:
            # find the largest contour in the mask, then use
            # it to compute the minimum enclosing circle and
            # centroid
            c = max(cnts, key=cv2.contourArea)
            ((x, y), radius) = cv2.minEnclosingCircle(c)
            #M = cv2.moments(c)
            #center = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))

            # only proceed if the radius meets a minimum size window
            if radius > self.min_size and radius < self.max_size:
                blob = (int(x), int(y), int(radius))
        return blob




