import numpy as np
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import mutual_info_classif
from sklearn.decomposition import PCA
from sklearn import preprocessing


# GENERAL FUNCTIONS
def merge(data, value_old, value_new):
    """
    Changes a given value in a specified column.
    :param data: DataFrame.
    :param value_old: str. Old class name.
    :param value_new: str. New class name.
    :return: DataFrame with the indicated modifications.
    """
    data.loc[data.loc[:, 'LABEL'] == value_old, 'LABEL'] = value_new

    return data


def delete(value, data, labels, sample_time):
    """
    Drops or deletes the samples of a given class.
    :param value: str. Class name.
    :param data: DataFrame.
    :param labels: DataFrame.
    :return: DataFrame with the indicated modifications.
    """
    keep_index = [value != labels['LABEL']]
    delete_data = []
    for i in np.where(keep_index[0] == False)[0]:
        delete_data = delete_data + [j for j in range(int(labels.loc[i, 'START'] // sample_time),
                                                      int(labels.loc[i, 'END'] // sample_time))]
    data = data.drop(delete_data)
    data = data.reset_index(drop=True)
    labels = labels.loc[keep_index[0], :]
    labels = labels.reset_index(drop=True)

    return data, labels


# WINDOW RELATED FUNCTIONS
def throughDuration(labels, duration_bool=True, sample_time=None):
    start_values = labels['START'].values
    end_values = labels['END'].values

    if duration_bool:
        labels_unique = list(set(labels['LABEL'].values))
        to_return = [[] for _ in range(len(labels_unique))]

        for i in range(len(start_values)):
            duration = (end_values[i] - start_values[i])
            index = labels_unique.index(labels.loc[i, 'LABEL'])
            to_return[index].append(duration)
    else:
        start_values = start_values // sample_time
        end_values = end_values // sample_time
        to_return = []

        for i in range(len(start_values)):
            duration = (int(end_values[i]) - int(start_values[i]))
            to_return = to_return + [labels.loc[i, 'LABEL'] for _ in range(duration)]

    return to_return


def windowSize(labels, metric_1, metric_2, percentile1=25, percentile2=25):
    labels_duration = throughDuration(labels)

    if metric_1 == 'min':
        metric_1_values = [min(x) for x in labels_duration]
    elif metric_1 == 'q1':
        metric_1_values = [np.percentile(x, percentile1) for x in labels_duration]
    else:
        metric_1_values = [np.mean(x) for x in labels_duration]

    if metric_2 == 'min':
        return min(metric_1_values)
    elif metric_2 == 'q1':
        return np.percentile(metric_1_values, percentile2)
    else:
        return np.mean(metric_1_values)


def codeLabels(vector, one_hot=False):
    if one_hot:
        le = preprocessing.OneHotEncoder(sparse=False, dtype=int)
        vector = le.fit_transform(vector.reshape(-1, 1))
        return vector, le.categories_.tolist()
    else:
        le = preprocessing.LabelEncoder()
        vector = le.fit_transform(vector)
        return vector, le.classes_.tolist()


def windowing(data, labels, window_size, calculate_labels, overlap_pct=50):
    X = []
    y = []

    w_start = 0
    signal_len = data.shape[0]

    while (w_start + window_size) <= signal_len:
        X.append(data[w_start:(w_start + window_size), :])

        if calculate_labels:
            uni, count = np.unique(labels[w_start:(w_start + window_size)], return_counts=True)
            y.append(uni[np.where(count == count.max())[0][-1]])

        w_start = w_start + round(window_size * overlap_pct / 100)

    return np.array(X), np.array(y)


# DIMENSIONALITY REDUCTION
def selectK(X, y, n_top):
    select_model = SelectKBest(score_func=mutual_info_classif, k=n_top)
    select_model.fit(X, y)
    X_mutual = select_model.transform(X)

    return X_mutual, select_model


def dimReduce(X, n_top):
    pca = PCA(n_components=n_top)
    X_pca = pca.fit_transform(X)

    return X_pca, pca
