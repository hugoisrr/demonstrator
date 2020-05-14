import numpy as np
import pickle

import preprocessing_functions as pf


def preprocessStream(stream_file, config):
    config_processing = config['process']
    config_scaling = config['scale']
    stream = np.asarray(stream_file['values'])[:, config['variables']]

    if not(config['detrend'] is None):
        stream = pf.detrend(stream)

    if not(config['filter'] is None):
        stream = pf.filtering(stream, config['filter'], config['filter_config'])

    if config_processing == "raw":
        if config_scaling == "non scale":
            return stream
        else:
            with open(config['model_path1'], 'rb') as p:
                model = pickle.load(p)
            p.close()
            return model.transform(stream)

    stream, _ = pf.featureEngineering(stream, config['time_features'], config['freq_features'], config['sample_time'],
                                      config['w_function'], calculate_names=False)

    if config_processing == "features":
        if config_scaling == "non scale":
            return stream
        else:
            with open(config['model_path1'], 'rb') as p:
                model = pickle.load(p)
            p.close()
            return model.transform(stream)
    else:
        with open(config['model_path2'], 'rb') as p:
            model = pickle.load(p)
        p.close()
        model.transform(stream)

        with open(config['model_path1'], 'rb') as p:
            model = pickle.load(p)
        p.close()
        return model.transform(stream)
