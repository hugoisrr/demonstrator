import os
import pandas as pd
import datetime as dt
import pathlib
import logging
import src.aux_functions as aux
from sklearn.model_selection import train_test_split
import src.ml_class as ml
import src.perf_check as perf

### Specify parameters ###

process = 'CNC'
path_raw_data = pathlib.Path.home().joinpath('ownCloud', 'Demonstrator', 'Data',
                                                process, 'RawData')
path_preprocessed = pathlib.Path.home().joinpath('ownCloud', 'Demonstrator', 'Data',
                                                process, 'PreProcessed')
path_performance = pathlib.Path.home().joinpath('ownCloud', 'Demonstrator', 'Data',
                                                process, 'Performance')
path_models = '../model/' + process + '/'

path_list = [path_raw_data, path_preprocessed,
             path_performance, path_models]

aux.create_directories(path_list)

file_list = os.listdir(path_preprocessed)
model_list = ['exTree', 'descTree', 'votEns', 'gradBoost', 'bagging',
              'adaBoost']
perf_comparison = pd.DataFrame({}, columns=['accuracy', 'prec', 'recall', 'f1'])

### Define Logging ###
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler(f'../logs/{dt.datetime.now().strftime("%Y%m%d_%H_%M_%S")}_log.log')
formatter = logging.Formatter('%(asctime)s:%(levelname)s:%(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)





curr_TS = aux.current_TS()




########### Andreas Preprocessing Code ###########


########### Andreas Preprocessing Code ###########
for file in file_list:
    logger.info(f'Processing file: {file}')
    data = aux.read_pickle(path_preprocessed.joinpath(file))
    labels = data['Y']
    classes = list(set(labels))
    (X_train, X_test, y_train, y_test) = train_test_split(data['X'], labels, test_size=0.2)
    models = {}
    for model in model_list:
        logger.info(f'Processing model: {model}')
        model_data ={}
        model_name = file + '_' + model
        models[model] = ml.classifier(model)
        predictions = models[model].fit_predict(X_train, X_test, y_train)
        perf_metrics, _ = perf.combined_perf_eval(y_test, predictions, classes,
                                                  model_name, path_performance)
        model_data['model'] = models[model]
        model_data['path_raw'] = path_raw_data
        model_data['path_preprocessed'] = path_preprocessed.joinpath(file)
        aux.store_pickle(path_models + curr_TS + model_name + '.pickle',
                         model_data)
        perf_comparison.loc[model_name, 'accuracy'] = perf_metrics['accuracy']
        perf_comparison.loc[model_name, 'precision'] = perf_metrics['precision']
        perf_comparison.loc[model_name, 'recall'] = perf_metrics['recall']
        perf_comparison.loc[model_name, 'f1_score'] = perf_metrics['f1_score']

perf_comparison.to_excel(f'{path_performance}/{curr_TS}'
                         f'_performance_comparison_{process}.xlsx')