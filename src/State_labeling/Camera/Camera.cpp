#include <iostream>

#include <cuda_runtime.h>

#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/videoio.hpp>

#include "Sender.h"
#include "StateIdentifier.h"

using namespace cv;
using namespace std;

bool run = true;

void print_pixel(int  event, int  j, int  i, int  flag, void *param){
    if (event == EVENT_LBUTTONDOWN)
        StateIdentifier::get_state_identifier()->print_pixel( {i,j} );
}

void get_led_on(int  event, int  j, int  i, int  flag, void *param){
    if (event == EVENT_LBUTTONDOWN) {
        StateIdentifier::get_state_identifier()->get_led_on();
        setMouseCallback("Camera", print_pixel);
        run = false;
    }
}

void mouse_callback(int  event, int  j, int  i, int  flag, void *param){
    if (event == EVENT_LBUTTONDOWN) {
        bool added = StateIdentifier::get_state_identifier()->add_element( {i,j} );
        if(!added) setMouseCallback("Camera", get_led_on);
    }
}

int main(int argc, char *argv[]){
    bool states[6];
    int n_pixels = 512 * 512;

    const char* gst = "nvcamerasrc ! video/x-raw(memory:NVMM), width=(int)512, height=(int)512, format=(string)I420, framerate=(fraction)10/1 ! "
                      "nvvidconv ! video/x-raw, format=(string)BGRx ! "
                      "videoconvert ! appsink";

    namedWindow("Camera", CV_WINDOW_AUTOSIZE);
    setMouseCallback("Camera", mouse_callback);

    VideoCapture videoCapture(gst, CAP_GSTREAMER);

    Mat f;
    videoCapture.read(f);
    uchar3 *h_image = (uchar3*) f.ptr<unsigned char>(0);
    StateIdentifier *state_identifier = StateIdentifier::get_state_identifier(h_image);

    bool connected = false;
    while(!connected) connected = test_conection() == 0 ? true : false;
    cout << "Socket connected" << endl;

    while(run){
        videoCapture.read(f);
        imshow("Camera", f);
        waitKey(1);
    }

    while(1){
        videoCapture.read(f);
        state_identifier->track_state(states);
        send_states(states);

        imshow("Camera", f);
        if(waitKey(1) == 27) break; // exit with esc
    }

    send_poweroff();

    delete state_identifier;

    f.release();
    videoCapture.release();
    destroyAllWindows();

    return 0;
}
