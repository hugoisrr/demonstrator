# Git lfs

Git module for large file storage. The main functionality of this module is to handle data files efficiently, 
avoiding the storage duplication associated with version control.

## Installation

This module is already included in most git installations. To check the installation use
>   git lfs

The module can be downloaded from [https://git-lfs.github.com/](https://git-lfs.github.com/)

## Usage
To initialize the lfs module use
> git lfs init

To indicate which files are going to be tracked by the lfs module use
> git lfs track \'*.\<file_extension>'

To store the configuration in the repo the file .gitattributes must be added to the commit history
> git add .gitattributes

To see a list of the tracked extensions use
> git lfs track

To see the tracked files use 
> git lfs ls-files

To remove the objects associated to past commits use
> git lfs prune
