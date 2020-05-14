#include <iostream>
#include <math.h>

#include "StateIdentifier.h"

using namespace std;

StateIdentifier::StateIdentifier(uchar3 *image){
    element = 0;
    this->image = image;
}

bool StateIdentifier::add_element(pixel pos){
    int idx = pos.i*512 + pos.j;
    pixels[element] = pos;
    led_off[element] = image[idx];
    element++;

    if (element == 6) return false;
    else return true;
}

void StateIdentifier::get_led_on(){
    for(int i=0; i<6; i++) led_on[i] = image[ pixels[i].i*512 + pixels[i].j ];
}

float euclidean_dist(uchar3 p1, uchar3 p2){
    return sqrtf(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2) + pow(p1.z - p2.z, 2));
}

bool* StateIdentifier::track_state(bool *states){
    int idx;
    float dist_off, dist_on;

    for(int i=0; i<6; i++){
        idx = pixels[i].i*512 + pixels[i].j;


        dist_off = euclidean_dist( image[idx], led_off[i] );
        dist_on  = euclidean_dist( image[idx], led_on[i] );


        if(dist_off > dist_on) states[i] = true;
        else states[i] = false;
    }
    
    return states;
}

void StateIdentifier::print_pixel(pixel pos){
    int idx = pos.i*512 + pos.j;
    cout << (int) image[idx].x << " "
         << (int) image[idx].y << " "
         << (int) image[idx].z << endl;
}

StateIdentifier* StateIdentifier::state_identifier = 0;
StateIdentifier* StateIdentifier::get_state_identifier(){
    return state_identifier;
}

StateIdentifier* StateIdentifier::get_state_identifier(uchar3 *image){
    if(state_identifier == 0) state_identifier = new StateIdentifier(image);
    return state_identifier;
}

StateIdentifier::~StateIdentifier(){}
