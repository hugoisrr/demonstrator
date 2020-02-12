import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, LSTM, BatchNormalization
from tensorflow.keras.layers import CuDNNLSTM, TimeDistributed
from tensorflow.keras.layers import Conv1D, GlobalAveragePooling1D, MaxPooling1D
from tensorflow.python.keras.callbacks import TensorBoard
from keras.models import load_model
from keras_sequential_ascii import sequential_model_to_ascii_printout
import os
import time



class rnn_keras():
    def __init__(self, dataset, log_path, num_classes, num_features, timesteps,
                 train_plan={}, dropout=0.5, batch_size=64, epochs=10):
        if train_plan:
            dropout = train_plan['dropout']
            batch_size = train_plan['batch_size']
            epochs = train_plan['epochs']

        model_name = (f'drop{dropout}'
                      f'-batch{batch_size}'
                      f'-EP{epochs}')
        self.log_path = log_path
        self.num_classes = num_classes
        self.num_features = num_features
        self.num_timesteps = timesteps
        self.dropout = dropout
        self.batch_size = batch_size
        self.epochs = epochs
        self.model = Sequential()
        self.model_name = model_name
        self.dataset = dataset

    def build_m2o_model(self, train_plan={}, num_CNN=0, cells_CNN=64,
                        kernel_CNN=3, activation_CNN="tanh", shape_CNN=None,
                        num_LSTM=2, cells_LSTM=128, activation_LSTM = 'tanh',
                        shape_LSTM=None, ret_sequences=True, num_DENSE=1, cells_DENSE=32,
                        activation_DENSE='tanh', optimizer='adam',
                        learning_rate=0.001, decay=1e-6,
                        loss='sparse_categorical_crossentropy',
                        metrics=['accuracy'], act_tboard=True):
        if train_plan:
            num_CNN = train_plan['num_CNN']
            cells_CNN = train_plan['cells_CNN']
            kernel_CNN = train_plan['kernel_CNN']
            activation_CNN = train_plan['activation_CNN']
            shape_CNN = train_plan['shape_CNN']
            num_LSTM = train_plan['num_LSTM']
            cells_LSTM = train_plan['cells_LSTM']
            activation_LSTM = train_plan['activation_LSTM']
            shape_LSTM = train_plan['shape_LSTM']
            ret_sequences = train_plan['ret_sequences']
            num_DENSE = train_plan['num_DENSE']
            cells_DENSE = train_plan['cells_DENSE']
            activation_DENSE = train_plan['activation_DENSE']
            optimizer = train_plan['optimizer']
            learning_rate = train_plan['learning_rate']
            decay = train_plan['decay']
            loss = train_plan['loss']
            metrics = train_plan['metrics']
            act_tboard = train_plan['act_tboard']


        self.model_name + (f'M2O-cnn{num_CNN}-{cells_CNN}-lstm{num_LSTM}'
                           f'-{cells_LSTM}-{int(time.time())}')

        if num_CNN > 0:
            for _ in range(0, num_CNN):
                self.model.add(Conv1D(cells_CNN, kernel_CNN,
                                      activation=activation_CNN,
                                      input_shape=shape_CNN))
            self.model.add(MaxPooling1D(kernel_CNN))

        if num_LSTM > 0:
            for _ in range(0, num_LSTM-1):
                self.model.add(CuDNNLSTM(cells_LSTM,
                                    input_shape=shape_LSTM,
                                    return_sequences=ret_sequences))
                self.model.add(Dropout(self.dropout))
                self.model.add(BatchNormalization())
            self.model.add(CuDNNLSTM(cells_LSTM, input_shape=shape_LSTM,
                                return_sequences=False))
            self.model.add(Dropout(self.dropout))
            self.model.add(BatchNormalization())


        for _ in range(0, num_DENSE):
            self.model.add(Dense(cells_DENSE, activation=activation_DENSE))

        self.model.add(Dense(self.num_classes, activation='softmax'))

        if optimizer == 'adam':
            optimizer = tf.keras.optimizers.Adam(lr=learning_rate, decay=decay)
        self.model.compile(loss=loss,
                      optimizer=optimizer,
                      metrics=metrics)

        if act_tboard:
            log_dir = os.path.join(self.log_path+'logs/', self.dataset,
                                   self.model_name)
            os.makedirs(os.path.join(log_dir, 'train'), exist_ok=True)
            tensorboard = TensorBoard(log_dir=log_dir)
            print(f'Tensorboard logfiles stored in: {log_dir}')
            return tensorboard

    def build_m2m_model(self, train_plan={}, num_LSTM=1,cells_LSTM=128,
                        activation_LSTM = 'tanh',
                        shape_LSTM=None, ret_sequences=True, optimizer='adam',
                        learning_rate=0.001, decay=1e-6,
                        loss='categorical_crossentropy',
                        metrics=['accuracy'], act_tboard=True):
        if train_plan:
            num_LSTM = train_plan['num_LSTM']
            cells_LSTM = train_plan['cells_LSTM']
            activation_LSTM = train_plan['activation_LSTM']
            shape_LSTM = train_plan['shape_LSTM']
            ret_sequences = train_plan['ret_sequences']
            optimizer = train_plan['optimizer']
            learning_rate = train_plan['learning_rate']
            decay = train_plan['decay']
            loss = train_plan['loss']
            metrics = train_plan['metrics']
            act_tboard = train_plan['act_tboard']

        self.model_name + (f'M2M-lstm{num_LSTM}'
                           f'-{cells_LSTM}-{int(time.time())}')

        self.model.add(CuDNNLSTM(cells_LSTM,
                                input_shape=shape_LSTM,
                                return_sequences=ret_sequences))
        self.model.add(TimeDistributed(Dense(self.num_classes),
                                       input_shape=(self.num_features,
                                                    self.num_timesteps)))
        if optimizer == 'adam':
            optimizer = tf.keras.optimizers.Adam(lr=learning_rate, decay=decay)
        self.model.compile(loss=loss,
                          optimizer=optimizer,
                          metrics=metrics)

        if act_tboard:
            log_dir = os.path.join(self.log_path+'logs/', self.dataset,
                                   self.model_name)
            os.makedirs(os.path.join(log_dir, 'train'), exist_ok=True)
            tensorboard = TensorBoard(log_dir=log_dir)
            print(f'Tensorboard logfiles stored in: {log_dir}')
            return tensorboard

    def return_model(self):
        return self.model

    def fit_model(self, X_train, y_train, validation_data, callbacks=[],
                  shuffle=False, class_weight=None):
        perf_log = self.model.fit(X_train, y_train, batch_size=self.batch_size,
                                  epochs=self.epochs,
                                  validation_data=validation_data,
                                  callbacks=callbacks, shuffle=shuffle,
                                  class_weight=class_weight)
        return perf_log

    def summary(self):
        self.model.summary()

    def print_ascii(self):
        sequential_model_to_ascii_printout(self.model)

    def predict(self, X_test, output='both'):
        if output == 'proba':
            proba = self.model.predict_proba(X_test)
            return proba
        elif output == 'classes':
            classes = self.model.predict_classes(X_test)
            return classes
        else:
            proba = self.model.predict_proba(X_test)
            classes = self.model.predict_classes(X_test)
            return classes, proba

    def save_model(self, name, path=None, overwrite=False, include_optimizer=True):
        if path:
            os.makedirs(path, exist_ok=True)
        else:
            path = ''
        if not (('hdf5' in name) or ('h5' in name)):
            name = name + '.hdf5'
        name = int(time.time()) + '_' + name
        self.model.save(path + name, overwrite=overwrite,
                        include_optimizer=include_optimizer)

    def load_model(self, name, path):
        if not (('hdf5' in name) or ('h5' in name)):
            name = name + '.hdf5'
        self.model = load_model(path+name)