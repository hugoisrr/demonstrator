import ast
import numpy as np
import pandas as pd
import pickle
from sklearn import preprocessing

import preprocessing_functions as pf
import preprocessing_training_functions as ptf

dict_preprocess = dict()
process_values = ['Raw', 'Features', 'SelectK', 'PCA']
scale_values = ['Non scale', 'Normalize', 'MinMax scaling']


def preprocessTraining(train_plan_path, w_size=50):
    # Open the train plan file
    train_plan = pd.read_excel(train_plan_path, header=2)

    # Check if the user has predefined a preprocessed file
    for i in range(train_plan.shape[0]):
        if np.isnan(train_plan.loc[i, 'Preprocessed data']):
            preprocess(lineToConfig(train_plan.iloc[i, :].where((pd.notnull(train_plan.iloc[i, :])), None)), w_size)
        else:
            return train_plan.loc[i, 'Preprocessed data']

    return 'ok'


def lineToConfig(line):
    global process_values, scale_values

    config = {'general': dict(dataset_path=line['Dataset'], labels_path=line['Labels'],
                              database_folder=line['Database folder'], models_folder=line['Models folder'],
                              results_folder=line['Processed data folder'], dataset_name=line['Dataset name'],
                              sample_time=line['Sample time (ms)']),
              'modifications': dict(columns_drop=convertToList(line['Columns to drop']),
                                    classes_drop=convertToList(line['Classes to drop']),
                                    classes_merge=convertToList(line['Classes to merge'])),
              'configuration': dict(process=checkValidity(line['Process'], process_values, "Raw"),
                                    scale=checkValidity(line['Scale'], scale_values, "Non scale"),
                                    data_path=None, detrend=checkValidity(line['Scale'], [True, False], False)),
              'filter': dict(filter=line['Filter type'],
                             filter_config=convertToList(line['Filter configuration'], dictionary=True)),
              'window': dict(calculate_w=checkValidity(line['Calculate window size'], [True, False], False),
                             w_metric_1=line['Window calculation metric 1'],
                             w_metric_2=line['Window calculation metric 2'],
                             w_factor=checkValidity(line['Window size factor'], int, 1, type_bool=True)),
              'features': dict(time_domain=convertToList(line['Time domain features']),
                               freq_domain=convertToList(line['Frequency domain features']),
                               w_function=line['Windowing function'],
                               n_features=checkValidity(line['No. features'], int, float('nan'), type_bool=True),
                               n_components=checkValidity(line['No. components'], int, float('nan'), type_bool=True))
              }

    return config


def convertToList(element, dictionary=False):
    try:
        if dictionary:
            return dict(ast.literal_eval(element))
        else:
            return ast.literal_eval(element)
    except ValueError:
        return None


def checkValidity(element, values, default, type_bool=False):
    if type_bool:
        try:
            element = int(element)
            return element
        except (ValueError, TypeError):
            return default
    else:
        if element in values:
            return element
        else:
            return default


def preprocess(config, w_size):
    global dict_preprocess

    # Open dictionary with preprocessed data
    try:
        with open(config['general']['database_folder'] + "Preprocess_" + config['general']['dataset_name'] +
                  ".pkl", 'rb') as p:
            dict_preprocess = pickle.load(p)
    except (OSError, IOError):
        dict_preprocess = dict()

    # Import labels and fix NaNs
    labels = pd.read_csv(config['general']['labels_path'], sep=',')
    labels['LABEL'] = labels['LABEL'].fillna('NULL')

    # Import data and do the indicated changes to the columns
    data = pd.read_csv(config['general']['dataset_path']).iloc[:, 1:]
    if not (config['modifications']['columns_drop'] is None):
        var_index = [x for x, y in enumerate(data.columns()) if not (y in config['modifications']['columns_drop'])]
        data.drop(columns=config['modifications']['columns_drop'], inplace=True)
        data.reset_index(drop=True)
    else:
        var_index = [x for x in range(len(data.columns))]

    # Do the changes to the classes indicated
    if not (config['modifications']['classes_drop'] is None):
        for i in config['modifications']['classes_drop']:
            data, labels = ptf.delete(i, data, labels, config['general']['sample_time'])

    if not (config['modifications']['classes_merge'] is None):
        for i in config['modifications']['classes_drop']:
            labels = ptf.merge(labels, i[0], i[1])

    # Calculate window size
    if config['window']['calculate_w'] and not(config['window']['w_metric_1'] is None) \
            and not(config['window']['w_metric_2'] is None):
        w_size = ptf.windowSize(labels, config['window']['w_metric_1'], config['window']['w_metric_2'])
    w_size = int(w_size // config['window']['w_factor'])

    # Check if the data has been preprocessed under the same characteristics.
    existing, data_path, status = existence(config, var_index, set(labels['LABEL']), w_size)
    if existing:
        return data_path

    ID = len(dict_preprocess.keys())
    if status is None:
        var_names = data.columns
        data = data.values
        labels = ptf.throughDuration(labels, duration_bool=False,
                                     sample_time=config['general']['sample_time'])[0:data.shape[0]]
        labels, labels_names = ptf.codeLabels(labels)

        ID, data, data_path = filterScale(ID, config, data, labels, var_names, labels_names, var_index)
        if not (data_path is None):
            with open(config['general']['database_folder'] + "Preprocess_" + config['general']['dataset_name'] + ".pkl",
                      'wb') as p:
                pickle.dump(dict_preprocess, p)
            return data_path
    else:
        with open(data_path, 'rb') as p:
            aux = pickle.load(p)

        data = aux['values']['X']
        labels = aux['values']['Y']
        var_names = aux['values']['features_names']
        labels_names = aux['values']['classes_names']

    if status == "Features":
        data_path = dimReduction(ID, config, data, labels, var_names, labels_names, var_index,
                                 aux['config']['model_path1'], aux['config']['w_size'])
    else:
        data, labels = ptf.windowing(data, labels, w_size, True)
        data_path = featureEngineering(ID, config, data, labels, labels_names, var_index, w_size)

    with open(config['general']['database_folder'] + "Preprocess_" + config['general']['dataset_name'] + ".pkl",
              'wb') as p:
        pickle.dump(dict_preprocess, p)

    return data_path


def existence(config, var_index, classes, w_size):
    data_path = None
    status = None

    for i in dict_preprocess.keys():
        if dict_preprocess[i]['sample_time'] == config['general']['sample_time'] \
                and set(dict_preprocess[i]['classes']) == classes \
                and dict_preprocess[i]['variables'] == var_index \
                and dict_preprocess[i]['detrend'] == config['configuration']['detrend']\
                and dict_preprocess[i]['filter'] == config['filter']['filter'] \
                and dict_preprocess[i]['filter_config'] == config['filter']['filter_config']:

            if dict_preprocess[i]['process'] == "Raw" and dict_preprocess[i]['scale'] == "Non scale" and status is None:
                data_path = dict_preprocess[i]['data_path']
                status = "Raw"

            if config['configuration']['process'] == "Raw":
                if dict_preprocess[i]['process'] == "Raw" and \
                        config['configuration']['scale'] == dict_preprocess[i]['scale']:
                    return True, dict_preprocess[i]['data_path'], None

            elif dict_preprocess[i]['w_size'] == w_size \
                    and dict_preprocess[i]['w_function'] == config['features']['w_function'] \
                    and dict_preprocess[i]['time_features'] == config['features']['time_domain'] \
                    and dict_preprocess[i]['freq_features'] == config['features']['freq_domain']:

                if dict_preprocess[i]['process'] == "Features" \
                        and dict_preprocess[i]['scale'] == config['configuration']['scale']:
                    data_path = dict_preprocess[i]['data_path']
                    status = "Features"

                if config['configuration']['process'] == "Features":
                    if dict_preprocess[i]['process'] == "Features" \
                            and config['configuration']['scale'] == dict_preprocess[i]['scale']:
                        return True, dict_preprocess[i]['data_path'], None

                elif config['configuration']['process'] == "SelectK":
                    if dict_preprocess[i]['process'] == "SelectK" \
                            and config['features']['n_features'] == dict_preprocess[i]['n_features'] \
                            and config['configuration']['scale'] == dict_preprocess[i]['scale']:
                        return True, dict_preprocess[i]['data_path'], None

                else:
                    if dict_preprocess[i]['process'] == "PCA" \
                            and config['features']['n_components'] == dict_preprocess[i]['n_components'] \
                            and config['configuration']['scale'] == dict_preprocess[i]['scale']:
                        return True, dict_preprocess[i]['data_path'], None

    return False, data_path, status


def filterScale(ID, config, data, labels, var_names, label_names, var_index):
    global dict_preprocess

    data_path = None

    # [1] DETREND
    if config['configuration']['detrend']:
        data = pf.detrend(data)

    # [2] FILTER
    if not (config['filter']['filter'] is None) and not (config['filter']['filter_config'] is None):
        data = pf.filtering(data, config['filter']['filter'], config['filter']['filter_config'])

    # [3] SCALE
    # Non scale
    info = dict(process="Raw", scale="Non scale", variables=var_index, model_path1="", model_path2="",
                data_path=config['general']['results_folder'] + "data_" + str(ID) + "_raw_nonscale.pkl",
                sample_time=config['general']['sample_time'], detrend=config['configuration']['detrend'],
                filter=config['filter']['filter'], filter_config=config['filter']['filter_config'],
                w_size=None, time_features=None, freq_features=None, w_function=None)

    info_dict = dict(process="Raw", scale="Non scale", variables=var_index, classes=label_names,
                     data_path=config['general']['results_folder'] + "data_" + str(ID) + "_raw_nonscale.pkl",
                     sample_time=config['general']['sample_time'], detrend=config['configuration']['detrend'],
                     filter=config['filter']['filter'], filter_config=config['filter']['filter_config'],
                     w_size=None, time_features=None, freq_features=None, w_function=None, n_features=None,
                     n_components=None)

    with open(config['general']['results_folder'] + "data_" + str(ID) + "_raw_nonscale.pkl", 'wb') as p:
        pickle.dump(dict(values=dict(X=data, Y=labels, features_names=var_names, classes_names=label_names),
                         config=info), p)

    dict_preprocess[ID] = info_dict
    if config['configuration']['process'] == "Raw" and config['configuration']['scale'] == "Non scale":
        data_path = info['data_path']
    ID = ID + 1

    # Normalization
    data_norm, info_norm, info_dict_norm = scaling(ID, config['general'], data, info.copy(), info_dict.copy(),
                                                   "Normalize", "_raw_norm.pkl")

    with open(info_norm['data_path'], 'wb') as p:
        pickle.dump(dict(values=dict(X=data_norm, Y=labels, features_names=var_names, classes_names=label_names),
                         config=info_norm), p)

    dict_preprocess[ID] = info_dict_norm
    if config['configuration']['process'] == "Raw" and config['configuration']['scale'] == "Normalize":
        data_path = info_norm['data_path']
    ID = ID + 1

    # MinMax scaling
    data_minmax, info_minmax, info_dict_minmax = scaling(ID, config['general'], data, info.copy(), info_dict.copy(),
                                                         "MinMax scaling", "_raw_minmax.pkl")

    with open(info_minmax['data_path'], 'wb') as p:
        pickle.dump(dict(values=dict(X=data_minmax, Y=labels, features_names=var_names, classes_names=label_names),
                         config=info_minmax), p)

    dict_preprocess[ID] = info_dict_minmax
    if config['configuration']['process'] == "Raw" and config['configuration']['scale'] == "MinMax scaling":
        data_path = info_minmax['data_path']
    ID = ID + 1

    return ID, data, data_path


def scaling(ID, config, data, info, info_dict, type_scale, end_file):
    global dict_preprocess

    if type_scale == 'Normalize':
        scale_data = preprocessing.StandardScaler()
    else:
        scale_data = preprocessing.MinMaxScaler()

    data_scale = scale_data.fit_transform(data)

    with open(config['models_folder'] + str(ID) + end_file, 'wb') as p:
        pickle.dump(scale_data, p)

    info['scale'] = type_scale
    info['data_path'] = config['results_folder'] + "data_" + str(ID) + end_file
    info['model_path1'] = config['models_folder'] + str(ID) + end_file

    info_dict['scale'] = type_scale
    info_dict['data_path'] = config['results_folder'] + "data_" + str(ID) + end_file

    return data_scale, info, info_dict


def featureEngineering(ID, config, data, labels, label_names, var_index, w_size):
    data_path = None

    # [3] FEATURES
    features, features_names = pf.featureEngineering(data, config['features']['time_domain'],
                                                     config['features']['freq_domain'],
                                                     config['general']['sample_time'], config['features']['w_function'],
                                                     calculate_names=True)

    info = dict(process="Features", scale="Non scale", variables=var_index, model_path1="", model_path2="",
                data_path=config['general']['results_folder'] + "data_" + str(ID) + "_features_nonscale.pkl",
                sample_time=config['general']['sample_time'], detrend=config['configuration']['detrend'],
                filter=config['filter']['filter'], filter_config=config['filter']['filter_config'],
                w_size=w_size, time_features=config['features']['time_domain'],
                freq_features=config['features']['freq_domain'], w_function=config['features']['w_function'])

    info_dict = dict(process="Features", scale="Non scale", variables=var_index, classes=label_names,
                     data_path=config['general']['results_folder'] + "data_" + str(ID) + "_features_nonscale.pkl",
                     sample_time=config['general']['sample_time'], detrend=config['configuration']['detrend'],
                     filter=config['filter']['filter'], filter_config=config['filter']['filter_config'],
                     w_size=w_size, time_features=config['features']['time_domain'],
                     freq_features=config['features']['freq_domain'], w_function=config['features']['w_function'],
                     n_features=None, n_components=None)

    # [4] SCALE
    # Non scale
    with open(config['general']['results_folder'] + "data_" + str(ID) + "_features_nonscale.pkl", 'wb') as p:
        pickle.dump(dict(values=dict(X=features, Y=labels, features_names=features_names, classes_names=label_names),
                         config=info), p)

    dict_preprocess[ID] = info_dict
    if config['configuration']['process'] == "Features" and config['configuration']['scale'] == "Non scale":
        data_path = info['data_path']
    ID = ID + 1

    # Normalization
    features_norm, info_norm, info_dict_norm = scaling(ID, config['general'], features, info.copy(), info_dict.copy(),
                                                       "Normalize", "_features_norm.pkl")

    with open(info_norm['data_path'], 'wb') as p:
        pickle.dump(dict(values=dict(X=features_norm, Y=labels, features_names=features_names,
                                     classes_names=label_names), config=info_norm), p)

    dict_preprocess[ID] = info_dict_norm
    if config['configuration']['process'] == "Features" and config['configuration']['scale'] == "Normalize":
        data_path = info_norm['data_path']
    ID = ID + 1

    # MinMax scaling
    features_minmax, info_minmax, info_dict_minmax = scaling(ID, config['general'], features, info.copy(),
                                                             info_dict.copy(), "MinMax scaling", "_features_minmax.pkl")

    with open(info_minmax['data_path'], 'wb') as p:
        pickle.dump(dict(values=dict(X=features_minmax, Y=labels, features_names=features_names,
                                     classes_names=label_names), config=info_minmax), p)

    dict_preprocess[ID] = info_dict_minmax
    if config['configuration']['process'] == "Features" and config['configuration']['scale'] == "MinMax scaling":
        data_path = info_minmax['data_path']
    ID = ID + 1

    if not (data_path is None):
        return data_path

    if config['configuration']['scale'] == 'Non scale':
        return dimReduction(ID, config, features, labels, features_names, label_names, var_index, "", w_size)
    elif config['configuration']['scale'] == 'Normalize':
        return dimReduction(ID, config, features_norm, labels, features_names, label_names, var_index,
                            config['general']['models_folder'] + str(ID - 2) + "_features_norm.pkl", w_size)
    else:
        return dimReduction(ID, config, features_minmax, labels, features_names, label_names, var_index,
                            config['general']['models_folder'] + str(ID - 1) + "_features_minmax.pkl", w_size)


def dimReduction(ID, config, data, labels, var_names, label_names, var_index, model_path2, w_size):
    global dict_preprocess

    info = dict(process=config['configuration']['process'], scale=config['configuration']['scale'],
                variables=var_index, model_path1="", model_path2=model_path2,
                data_path="", sample_time=config['general']['sample_time'], detrend=config['configuration']['detrend'],
                filter=config['filter']['filter'], filter_config=config['filter']['filter_config'],
                w_size=w_size, time_features=config['features']['time_domain'],
                freq_features=config['features']['freq_domain'], w_function=config['features']['w_function'])
    info_dict = dict(process=config['configuration']['process'], scale=config['configuration']['scale'],
                     variables=var_index, classes=label_names, data_path="",
                     sample_time=config['general']['sample_time'], detrend=config['configuration']['detrend'],
                     filter=config['filter']['filter'], filter_config=config['filter']['filter_config'],
                     w_size=w_size, time_features=config['features']['time_domain'],
                     freq_features=config['features']['freq_domain'], w_function=config['features']['w_function'],
                     n_features=None, n_components=None)

    if config['configuration']['process'] == "SelectK":
        if config['configuration']['scale'] == "Non scale":
            end_file = "_selectK_nonscale.pkl"
        elif config['configuration']['scale'] == "Normalize":
            end_file = "_selectK_norm.pkl"
        else:
            end_file = "_selectK_minmax.pkl"

        info['model_path1'] = config['general']['models_folder'] + str(ID) + end_file
        info['data_path'] = config['general']['results_folder'] + "data_" + str(ID) + end_file
        info_dict['data_path'] = config['general']['results_folder'] + "data_" + str(ID) + end_file
        info_dict['n_features'] = config['features']['n_features']

        features, model = ptf.selectK(data, labels, config['features']['n_features'])
        featureScores = pd.concat([pd.DataFrame(var_names), pd.DataFrame(model.scores_)], axis=1)
        featureScores.columns = ['Feature', 'Score']
        features_names = featureScores.nlargest(config['features']['n_features'], 'Score')['Feature'].values.tolist()

    else:
        if config['configuration']['scale'] == "Non scale":
            end_file = "_pca_nonscale.pkl"
        elif config['configuration']['scale'] == "Normalize":
            end_file = "_pca_norm.pkl"
        else:
            end_file = "_pca_minmax.pkl"

        info['model_path1'] = config['general']['models_folder'] + str(ID) + end_file
        info['data_path'] = config['general']['results_folder'] + "data_" + str(ID) + end_file
        info_dict['data_path'] = config['general']['results_folder'] + "data_" + str(ID) + end_file
        info_dict['n_components'] = config['features']['n_components']

        features, model = ptf.dimReduce(data, config['features']['n_components'])
        features_names = ['component_' + str(i) for i in range(config['features']['n_components'])]

    with open(info['model_path1'], 'wb') as p:
        pickle.dump(model, p)

    with open(config['general']['results_folder'] + "data_" + str(ID) + end_file, 'wb') as p:
        pickle.dump(dict(values=dict(X=features, Y=labels, features_names=features_names, labels_names=label_names),
                         config=info), p)
    dict_preprocess[ID] = info_dict

    return info['data_path']


preprocessTraining("C:/Users/emc-ap/Desktop/Mappe1.xlsx", w_size=50)
