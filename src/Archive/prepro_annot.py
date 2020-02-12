import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os

def prepro_HAR(path):

    # Load "y" (the neural network's training and testing outputs)

    def load_y(y_path):
        file = open(y_path, 'r')
        # Read dataset from disk, dealing with text file's syntax
        y_ = np.array(
            [elem for elem in [
                row.replace('  ', ' ').strip().split(' ') for row in file
            ]],
            dtype=np.int32
        )
        file.close()

        # Substract 1 to each output class for friendly 0-based indexing
        return y_ - 1

    def load_X(X_signals_paths):
        X_signals = []

        for signal_type_path in X_signals_paths:
            file = open(signal_type_path, 'r')
            # Read dataset from disk, dealing with text files' syntax
            X_signals.append(
                [np.array(serie, dtype=np.float32) for serie in [
                    row.replace('  ', ' ').strip().split(' ') for row in file
                ]]
            )
            file.close()

        return np.transpose(np.array(X_signals), (1, 2, 0))


    # Those are separate normalised input features for the neural network
    INPUT_SIGNAL_TYPES = ["body_acc_x_",
                          "body_acc_y_",
                          "body_acc_z_",
                          "body_gyro_x_",
                          "body_gyro_y_",
                          "body_gyro_z_",
                          "total_acc_x_",
                          "total_acc_y_",
                          "total_acc_z_"]

    # Output classes to learn how to classify
    LABELS = ["WALKING",
              "WALKING_UPSTAIRS",
              "WALKING_DOWNSTAIRS",
              "SITTING",
              "STANDING",
              "LAYING"]

    TRAIN = "train/"
    TEST = "test/"

    X_train_signals_paths = [path + TRAIN + "Inertial Signals/"
                             + signal + "train.txt" for signal
                             in INPUT_SIGNAL_TYPES
    ]
    X_test_signals_paths = [path + TEST + "Inertial Signals/"
                            + signal + "test.txt" for signal
                            in INPUT_SIGNAL_TYPES]

    X_train = load_X(X_train_signals_paths)
    X_test = load_X(X_test_signals_paths)

    y_train_path = path + TRAIN + "y_train.txt"
    y_test_path = path + TEST + "y_test.txt"

    y_train = load_y(y_train_path)
    y_train = [float(y_val[0]) for y_val in y_train]
    y_test = load_y(y_test_path)
    y_test = [float(y_val[0]) for y_val in y_test]

    return X_train, X_test, y_train, y_test, LABELS

def import_window_data(path_data, name_dataset, train_size, shuffle,
                       label_to_cat=False):
    data_features = {}
    data_labels = {}
    inp_data = {}
    files_path = os.listdir(path_data)
    files_window = [file for file in files_path if file[:6] == 'Window']
    files_path_not_norm = [file for file in files_path if file[:4] == 'Data']
    print(files_window)
    for idx_file, file in enumerate(files_window):
        file = name_dataset+file
        with open(path_data+files_window[idx_file], 'rb') as input_file:
            data_features[file] = pickle.load(input_file)
        with open(path_data+files_path_not_norm[idx_file], 'rb') as input_file:
            data_labels[file] = pickle.load(input_file)
            data_labels[file] = list(data_labels[file].loc[:, 'label'].values)
            if label_to_cat:
                encoder = LabelEncoder()
                encoder.fit(list(set(data_labels[file])))
                data_labels[file] = encoder.transform(data_labels[file])
            data_labels[file] = [len(set(data_labels[file]))-1 if label == 'Transition' else label-1 for label in data_labels[file]]
        inp_data[file] = {}
        (inp_data[file]['X_train'],
         inp_data[file]['X_test'],
         inp_data[file]['y_train'],
         inp_data[file]['y_test']) = train_test_split(data_features[file], data_labels[file],
                                                      train_size=train_size, shuffle=shuffle)
    return inp_data

def create_sequences(data, feature_list, sequence_len=150):
    features = []
    labels = []
    temp_features = []
    temp_labels = []
    n_classes = len(data['label'].unique())
    for idx_row, row in data.iterrows():
        if len(temp_features) == sequence_len:
            features.append(temp_features)
            labels.append(temp_labels)
            temp_labels = []
            temp_features = []
        temp_features.append(row[feature_list].values)
        one_hot = np.zeros(n_classes)
        one_hot[int(row['label'])] = 1
        temp_labels.append(one_hot)
    return np.array(features), np.array(labels)

def prediction_list(prediction):
    pred_list = []
    for sample in prediction:
        pred_list.extend(sample)
    return pred_list

def y_test_list(y_test):
    sample_list = []
    timestep_list = []
    for sample in y_test:
        for timestep in sample:
            timestep_list.append(np.argmax(timestep))
        sample_list.extend(timestep_list)
        timestep_list = []
    return sample_list