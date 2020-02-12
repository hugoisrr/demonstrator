### FOLDER STRUCTURE ON OWNCLOUD PROJECT DEMONSTRATOR

* Datasets
    * CNC   
        * YYYYMMDD
            * CA_YYYY-MM-DD HH_MM_SS.mp4
            * YYYY-MM-DD_HH-MM-SS.csv
            * Labels    
                * labels_nameOfProcess_YYYYMMDD.csv
                * YYYY-MM-DD_HH-MM-SS_ms.csv
    * Drill
        * YYYYMMDD
            * CA_YYYY-MM-DD HH_MM_SS.mp4
            * YYYY-MM-DD_HH-MM-SS.csv
            * Labels    
                * labels_nameOfProcess_YYYYMMDD.csv
                * YYYY-MM-DD_HH-MM-SS_ms.csv


Inside this one, there are several folders named with the date in which the data was recorded in this format YYYYMMDD (for example 20191106).

This folder contains: 
- video which name is in the format CA_YYYY-MM-DD HH_MM_SS
- csv file with the raw data, which name is in the format YYYY-MM-DD_HH-MM-SS
- Folder called Labels

The folder Labels contains:
- csv file with the labels which name is in the format labels_nameOfProcess_YYYYMMDD
- csv file with the raw data but with the times changed to miliseconds, which name is in the format YYYY-MM-DD_HH-MM-SS_ms
