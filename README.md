# Welcome

Repository of the Demonstrator for LeanDA

### LeanDA

LeanDA is a plug-and-play toolkit for process optimization, by combining wireless sensors with AI enabled process recognition. 

### Technology stack and Requirements

- Backend and Data Analytics: Python
- Frontend: JS

### Content

- [Documentation](Documentation/)
- [Python code](src/)


## Installation and execution 

### Frontend:

/public/index.html

### Data Acquisition from Minitag ###

1. Check that the minitags are charged. 
2. Place the minitags on the machine. 
3. Use the USB cables to connect the router to a power source. After some seconds, the light on the router should be on.
4. Connect the camera to the computer. 
5. Connect your computer to the Sensorkoffer_Dev Wifi (Password: Sensor171).
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


### Start Backend/Model (order of commands is important):

1. Activate virtual (python) environment

1. If you want simulated raw data start the following dummy server (in src/):

        python raw_data_dummy.py

    (command line is just going to blink after execution)

2. If you want simulated state data (in src/):

        python rand_state_dummy.py

5. Use websocket client to connect

## Contribution

### Gitflow
We are using the **gitflow** workflow for branching within this project.
The basic workflow is shown in the image below:

![Branching1](Documentation/Images/Gitflow.png)

[**Klick here**](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) 
If you are interested in a detailed description of **gitflow**.

#### Naming conventions for branches

Base your work on the `development` branch

- `release_*` for next planned release
- `feature_*` for development of new features
- `fix_*` for hot fixes
- `refactor_*` when refactoring code without behavior changes

#### Commit Messages

Please use the following template for your commit message:

    ---- start ----
    [Label: ADD, REFACTOR, DELETE]
    -- empty line --
    [File: Function]
    -- empty line --
    [short line describing main purpose]
    -- empty line --
    [description, why this change is made]
    -- empty line --
    [close/fix #xxxx - link to gitlab issue id]
    ---- end ----

