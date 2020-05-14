#pragma once

#include <cuda_runtime.h>

struct pixel{
    int i;
    int j;
};

class StateIdentifier{
    private:
        int element;
	    pixel pixels[6];

        uchar3 *image;
        uchar3 led_off[6], led_on[6];

        static StateIdentifier *state_identifier;
        StateIdentifier(uchar3 *image);

    public:

        bool add_element(pixel pos);
        void get_led_on();
        bool* track_state(bool *states);
        void print_pixel(pixel pos);

        static StateIdentifier* get_state_identifier();
        static StateIdentifier* get_state_identifier(uchar3 *image);
        ~StateIdentifier();
};
