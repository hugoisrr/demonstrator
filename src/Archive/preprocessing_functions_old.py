import numpy as np
import pandas as pd
import scipy.stats
import scipy.signal


# FILTERING FUNCTIONS
def detrend(data):
    for i in range(data.shape[1]):
        data[:, i] = scipy.signal.detrend(data[:, i])
    return data


def filtering(data, filter_type, filter_config):
    if filter_type == "Savitzky-Golay":
        for i in range(data.shape[1]):
            data[:, i] = scipy.signal.savgol_filter(data[:, i], window_length=filter_config['window_length'],
                                                    polyorder=filter_config['polyorder'])
    elif filter_type == "Median":
        for i in range(data.shape[1]):
            data[:, i] = scipy.signal.medfilt(data[:, i])
    elif filter_type == "Exponential moving average":
        data = ema_filter(data, filter_config['alpha'])

    return data


def ema_filter(data, alpha):
    data = pd.DataFrame(data)
    return data.ewm(alpha=alpha, adjust=False).mean().values


# FEATURE ENGINEERING FUNCTIONS
def mean(signal, axis=0):
    return np.mean(signal, axis=axis)


def std(signal, axis=0):
    return np.std(signal, axis=axis, ddof=1)


def mad(signal, axis=0):
    return np.median(abs(signal - np.median(signal, axis=axis)), axis=axis)


def maximum(signal, axis=0):
    return np.max(signal, axis=axis)


def minimum(signal, axis=0):
    return np.min(signal, axis=axis)


def sma(signal):
    return np.array([np.sum(abs(signal)) / signal.shape[0]])


def iqr(signal, axis=0):
    return scipy.stats.iqr(signal, axis=axis)


def energy(signal, w_len, axis=0):
    return (np.sum(np.power(signal, 2), axis=axis)) / w_len


def entropy(signal, n_var, axis=0):
    divisor = np.sum(signal, axis=axis)
    value = []

    if any(divisor == 0):
        for i in range(n_var):
            if divisor[i] == 0:
                value.append(0)
            else:
                signal_prob = signal[:, i] / divisor[i]
                value.append(scipy.stats.entropy(signal_prob))
        value = np.array(value)
    else:
        signal_prob = signal / divisor
        value = scipy.stats.entropy(signal_prob)

    return value


def corr(signal, n_var, axis=0):
    correlation = []

    index = np.where(np.var(signal, axis=axis, ddof=1) == 0)[0].tolist()

    for i in range(n_var - 1):
        for j in range(i + 1, n_var):
            if i in index or j in index:
                correlation.append(0)
            else:
                correlation.append(np.corrcoef(signal[:, (i, j)], rowvar=False)[0, 1])
    return np.array(correlation)


def maxInds(signal, n_var):
    indexes = np.array([])
    for i in range(n_var):
        index = np.where(signal[:, i] == np.max(signal[:, i]))[0]
        if len(index) > 1:
            indexes = np.append(indexes, 0)
        else:
            indexes = np.append(indexes, index + 1)
    return indexes


def meanFreq(frequency, weights, n_var):
    mean_freq = np.array([])
    for i in range(n_var):
        if sum(weights[:, i]) != 0:
            mean_freq = np.append(
                mean_freq, np.average(frequency, weights=weights[:, i]))
        else:
            mean_freq = np.append(mean_freq, 0)

    return mean_freq


def kurtosis(signal, axis=0):
    return scipy.stats.kurtosis(signal, axis=axis)


def skewness(signal, axis=0):
    return scipy.stats.skew(signal, axis=axis)


def fourierTransform(signal, sample_time):
    if signal.ndim > 1:
        n_var = signal.shape[1]
    else:
        n_var = 1
    w_len = signal.shape[0]

    FFT = np.array([])
    for i in range(n_var):
        FFT = np.append(FFT, np.abs(np.fft.rfft(signal[:, i])[1:]))
    FFT = np.transpose(np.reshape(FFT, (n_var, int(FFT.shape[0] / n_var))))
    freq = np.fft.rfftfreq(w_len, d=sample_time / 1000)[1:]

    return FFT, freq


def featuresCalculation(signal, features, domain, w_len, freq=None, names=False):
    if freq is None:
        freq = []

    if signal.ndim > 1:
        n_var = signal.shape[1]
    else:
        n_var = 1
    f_list = None
    f_name = []

    if 'mean' in features:
        if f_list is None:
            f_list = mean(signal)
        else:
            f_list = np.concatenate((f_list, mean(signal)))
        if names:
            f_name = f_name + [domain + '_mean_' + str(x + 1) for x in range(n_var)]

    if 'std' in features:
        if f_list is None:
            f_list = std(signal)
        else:
            f_list = np.concatenate((f_list, std(signal)))
        if names:
            f_name = f_name + [domain + '_std_' + str(x + 1) for x in range(n_var)]

    if 'skew' in features:
        if f_list is None:
            f_list = skewness(signal)
        else:
            f_list = np.concatenate((f_list, skewness(signal)))
        if names:
            f_name = f_name + [domain + '_skew_' + str(x + 1) for x in range(n_var)]

    if 'kurtosis' in features:
        if f_list is None:
            f_list = kurtosis(signal)
        else:
            f_list = np.concatenate((f_list, kurtosis(signal)))
        if names:
            f_name = f_name + [domain + '_kurtosis_' + str(x + 1) for x in range(n_var)]

    if 'max' in features:
        if f_list is None:
            f_list = maximum(signal)
        else:
            f_list = np.concatenate((f_list, maximum(signal)))
        if names:
            f_name = f_name + [domain + '_max_' + str(x + 1) for x in range(n_var)]

    if 'min' in features:
        if f_list is None:
            f_list = minimum(signal)
        else:
            f_list = np.concatenate((f_list, minimum(signal)))
        if names:
            f_name = f_name + [domain + '_min_' + str(x + 1) for x in range(n_var)]

    if 'iqr' in features:
        if f_list is None:
            f_list = iqr(signal)
        else:
            f_list = np.concatenate((f_list, iqr(signal)))
        if names:
            f_name = f_name + [domain + '_iqr_' + str(x + 1) for x in range(n_var)]

    if 'mad' in features:
        if f_list is None:
            f_list = mad(signal)
        else:
            f_list = np.concatenate((f_list, mad(signal)))
        if names:
            f_name = f_name + [domain + '_mad_' + str(x + 1) for x in range(n_var)]

    if 'sma' in features:
        for i in range(int(n_var//3)):
            if f_list is None:
                f_list = sma(signal[:, (3*i):(3*(i+1))])
            else:
                f_list = np.concatenate((f_list, sma(signal[:, (3*i):(3*(i+1))])))
        if names:
            f_name = f_name + [domain + '_sma_' + str(x + 1) for x in range(int(n_var//3))]

    if 'energy' in features:
        if f_list is None:
            f_list = energy(signal, w_len)
        else:
            f_list = np.concatenate((f_list, energy(signal, w_len)))
        if names:
            f_name = f_name + [domain + '_energy_' + str(x + 1) for x in range(n_var)]

    if 'entropy' in features:
        if f_list is None:
            f_list = entropy(signal, n_var)
        else:
            f_list = np.concatenate((f_list, entropy(signal, n_var)))
        if names:
            f_name = f_name + [domain + '_entropy_' + str(x + 1) for x in range(n_var)]

    if domain == 't':
        if 'corr' in features:
            for i in range(int(n_var // 3)):
                if f_list is None:
                    f_list = corr(signal[:, (3*i):(3*(i+1))], 3)
                else:
                    f_list = np.concatenate((f_list, corr(signal[:, (3*i):(3*(i+1))], 3)))
            if names:
                f_name = f_name + [domain + '_corr_' + str(x + 1) for x in range(n_var)]

    if domain == 'f':
        if 'maxInds' in features:
            if f_list is None:
                f_list = maxInds(signal, n_var)
            else:
                f_list = np.concatenate((f_list, maxInds(signal, n_var)))
            if names:
                f_name = f_name + [domain + '_maxInds_' + str(x + 1) for x in range(n_var)]

        if 'meanFreq' in features:
            if f_list is None:
                f_list = meanFreq(freq, signal, n_var)
            else:
                f_list = np.concatenate((f_list, meanFreq(freq, signal, n_var)))
            if names:
                f_name = f_name + [domain + '_meanFreq_' + str(x + 1) for x in range(n_var)]

    return f_list, f_name


def featureEngineering(signal, f_time, f_freq, sample_time, w_function, calculate_names=True):
    n_windows = signal.shape[0]
    w_len = signal.shape[1]

    features = None
    names = []
    for i in range(n_windows):
        sub_signal = signal[i]

        # Time domain features
        if i == 0 and calculate_names:
            # initial_time = time.time()
            aux1, aux2 = featuresCalculation(sub_signal, f_time, 't', w_len, names=True)
            names = aux2
            # print(time.time() - initial_time)
        else:
            aux1, _ = featuresCalculation(sub_signal, f_time, 't', w_len)
        sub_features = aux1

        # Frequency domain features
        # initial_time = time.time()
        if w_function == 'Hamming':
            sub_FFT, sub_freq = fourierTransform(sub_signal * np.hamming(w_len)[:, None], sample_time)
        elif w_function == 'Hanning':
            sub_FFT, sub_freq = fourierTransform(sub_signal * np.hanning(w_len)[:, None], sample_time)
        else:
            sub_FFT, sub_freq = fourierTransform(sub_signal, sample_time)

        if i == 0 and calculate_names:
            aux1, aux2 = featuresCalculation(sub_FFT, f_freq, 'f', w_len, sub_freq, names=True)
            names = names + aux2
            # print(time.time() - initial_time)
        else:
            aux1, _ = featuresCalculation(sub_FFT, f_freq, 'f', w_len, sub_freq)
        sub_features = np.concatenate((sub_features, aux1))

        if features is None:
            features = sub_features.reshape(1, sub_features.size)
        else:
            features = np.concatenate((features, sub_features.reshape(1, sub_features.size)), axis=0)

    return features, names
