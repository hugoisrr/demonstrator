# GENERAL SETUP FOR DATA RECORDING

### REQUIREMENTS:
- Minitags 
- Camera
- Computer
- Router
- USB cable
- Power bank 
- Python codes (Data_recorder, udpReceiverDummy, Video_Input, Video_Processing, Video_Recorder)

### INSTRUCTIONS:

1. Check that the minitags are charged. 
2. Place the minitags on the machine. 
3. Use the USB cables to connect the router to a power source. After some seconds, the light on the router should be on.
4. Connect the camera to the computer. 
5. Connect your computer to the Sensorkoffer_Dev Wifi.
6. Change your IP address to static 192.168.0.99. following the next steps:
    - Go to *Systemsteuerung*.
    - Click on *Netzwerk und Internet* -> *Netzwerk- und Freigabcenter* -> *Adaptereinstellung ändern*.
    - Right click on *WLAN* and then select *Eigenschaften*.
    - Provide the admin rights.
    - Double click on *Internetprotokoll, Version 4 (TCP/IPv4)*.
    - Select *Folgende IP-Adresse verwenden*. Write 192.168.0.99. on *IP-Adresse* and click on *Subnetmaske*. Then select *OK* -> *OK*.
7. Disable firewall for public networks following the next steps:
    - Go to *Systemsteuerung*.
    - Click on *System und Sicherheit* -> *Windows-Firewall* -> *Windows-Firewall ein- oder ausschalten*.
    - Provide the admin rights.
    - In *Einstellungen für das öffentliche Netzwerk*, select Windows-Firewall deaktivieren. 
8. Run the codes ***Data_Recorder.py*** and ***Video_Recorder.py*** in two different prompts. Another window will be launched, where you can see the video. 
9. Switch on the minitags.
10. Click on the video window and press *space* to start recording. 
11. Check if the csv and mp4 files are created.
12. Start the machine in order to collect data.
13. After the data collection is finished, click on the video window and press again *space* to stop recording and the turn off the minitags. 
14. Enable firewall following steps in **7**, but this time select Windows-Firewall aktivieren.
15. Reset your IP address to automatic following the steps in **6**, but this time select *IP-Adresse automatisch beziehen*.
16. Reconnect to your usual Wifi network. 
