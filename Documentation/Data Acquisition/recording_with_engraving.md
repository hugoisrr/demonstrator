# COLLECTING DATA WITH THE CNC

Three processes are taken into account: 
1. **ENGRAVING:** Starts when the start button is pressed, the yellow light on it is on and the upper part of the machine is moving. Ends when the yellow light is off and the upper part of the machine stops moving.  
2. **SPINDLE:** Starts when the spindle button is pressed and the red light on it is on and ends when the button is pressed again and the red light is off.
3. **NULL:** The machine is not working. It is always the transition between the other two states.  

## Requirements 
- Engraving machine
- Laptop with the ***GEM Engraving 7*** software installed 
- Flashlights
- HDMI Cable 

## Steps 
1. Connect the engraving machine to the laptop using the HDMI cable. 
2. Turn on the laptop and the machine.
3. Start the ***GEM Engraving 7*** software.
4. Select *Öffnen* and open one of the files with extension *.SDR* (for example *IPA blau.SDR*).
5. In the upper tool bar, click on *Produktion* and then in *Gravieren*.
6. After this, some windows will show up. Select *OK* -> *yes* -> *OK*.
7. Now, the design is uploaded in the machine and you need to set up in the machine the position to start engraving:
    - Place one of the flashlights between the two black holes in the center of the machine and adjust it with the black handle.
    - Press *Start* and the *Home* button should be light on. The machine will move to an initial position.
    - Press *Start* again and the *Position* button should be light on. The machine will move to the center. 
    - Press *Start* again and the *Surface* button should be light on. 
    - Here, you need to set up the position for engraving. Press *DOWN* until the engraving tool slightly touches the surface of the flashlights. If necessary, press *ROTARY* until the black button in the flashlight is underneath. 
8. Then, you can start recording the data. Set up the minitags and edge device as explained in the data_recording file. 
9. For engraving, press *Start* and while engraving the *Spindle* button should be lighting red. When the process is finished, the *Finish* button will switch on. 
10. Every time you want to start the engraving process, press *Repeat* and the engraving tool will move to the position that you set up and then press *Start*. 
11. For spindle, press *Spindle* to start the process and press it again to finish the process. While splinde, the *Spindle* button should be lighting red. 

## To take into account 

- The minitag is placed at the front of the engraving tool (moving part) of the machine because in this place the vibrations are stronger. 
- You should be really careful with the place where you put the camera. It should be a place when you can have a complete view of the machine (all the buttons as well as the engraving tool).
- Avoid leaving your fingers in the buttons when pressing them because you will hide the lights, so it will be more difficult to identify the durations of the processes on the video, especially for the spindle process. 
- This dataset is easy to label with the signal because the signals of the three processes are really differents. The engraving process has a stronger signal with higher peaks and usually a big peak at the beginning which corresponds to the moment when you press *Repeat* and the tool moves to the engraving position. The spindle process has a signal more constant and with lower peaks. 
- For labeling with the video, you should pay a lot of attention to the lights. For the engraving process, it can be easily seen when the engraving tool, but for the spindle process it is not possible to notice on the video when the tool is rotating. Therefore, you will know the start and end of the process by looking at the moment when the finger press *Spindle* button and the red light is on. 


