from sklearn import metrics
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import openpyxl
from openpyxl.utils.dataframe import dataframe_to_rows
import os
import pandas as pd
import time


def performance_metrics(y_test, predictions, normalize=True,
                        average='weighted', sample_weight=None, with_print=False):
    performance_dict = {}
    performance_dict['accuracy'] = metrics.accuracy_score(y_test,
                                                          predictions,
                                                          sample_weight=sample_weight)

    performance_dict['precision'] = metrics.precision_score(y_test, predictions,
                                                            average=average,
                                                            sample_weight=sample_weight)

    performance_dict['recall'] = metrics.recall_score(y_test, predictions,
                                                      average=average,
                                                      sample_weight=sample_weight)
    performance_dict['f1_score'] = metrics.f1_score(y_test,
                                                        predictions,
                                                        average=average,
                                                        sample_weight=sample_weight)
    if with_print:
        for key in performance_dict:
            print(f"{key}: {round(100*performance_dict[key], 2)}%")

    return performance_dict


def confusion_matrix(y_test, predictions, labels=None, sample_weight=None,
                     get_normalized=True, with_print=False):

    confusion_matrix = metrics.confusion_matrix(y_test, predictions,
                                                labels=labels,
                                                sample_weight=sample_weight)
    if with_print:
        print('Confusion matrix:')
        print(confusion_matrix)

    if get_normalized:
        normalized_confusion = np.array(confusion_matrix,
                                        dtype=np.float32)/np.sum(confusion_matrix) * 100
        if with_print:
            print('Normalized Confusion matrix:')
            print(normalized_confusion)

        return confusion_matrix, normalized_confusion

    else:
        return confusion_matrix

def plot_confusion_matrix(normalized_confusion_matrix, y_labels=None,
                          path='', filename='', with_print=False):
    os.makedirs(path, exist_ok=True)
    if '.png' not in filename:
        filename = filename + '.png'
    filename = str(int(time.time())) + '_' + filename
    if not y_labels:
        y_labels = range(0, normalized_confusion_matrix.shape[0])
        rotation = 0
    else:
        rotation = 90
    plt.subplots(figsize=(12, 12), dpi=300)
    plt.imshow(normalized_confusion_matrix, interpolation='nearest',
               cmap=plt.cm.rainbow)

    plt.title("Normalized confusion matrix (Percentage of data)")
    plt.colorbar()
    tick_marks = np.arange(len(y_labels))
    plt.xticks(tick_marks, y_labels, rotation=rotation)
    plt.yticks(tick_marks, y_labels)
    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')
    plt.tight_layout()
    plt.savefig(path+filename, dpi=300)
    if with_print:
        plt.show()

def plot_performance(performance_train, performance_test, metric='',
                     path='', filename='', with_print=False):
    os.makedirs(path, exist_ok=True)
    if '.png' not in filename:
        filename = filename+'.png'
    filename = str(int(time.time())) + '_' + filename
    fig, ax = plt.subplots(figsize=(12, 12), dpi=300)
    train = ax.plot(performance_train, label='train', color='b')
    test = ax.plot(performance_test, label='test', color='g')
    plt.title(f'Model {metric}')
    plt.ylabel(f'{metric}')
    plt.xlabel('Epoch')
    plt.legend()
    plt.tight_layout()
    plt.savefig(path+filename, dpi=300)
    if with_print:
        plt.show()


def plot_class_hist(y_test, predictions, path='', filename='',
                    with_print=False):

    os.makedirs(path, exist_ok=True)
    if '.png' not in filename:
        filename = filename + '.png'
    filename = str(int(time.time())) + '_' + filename

    # binsize
    binsize = [val / 100 for val in
               list(range(-25, (len(set(y_test))) * 100, 50))][:-1]

    # define grid
    fig = plt.figure(figsize=(10, 10), dpi=300)
    gs = gridspec.GridSpec(3, 3)
    ax_main = plt.subplot(gs[1:3, :2])
    ax_xDist = plt.subplot(gs[0, :2], sharex=ax_main)
    ax_yDist = plt.subplot(gs[1:3, 2], sharey=ax_main)

    # plot scatter
    ax_main.hexbin(predictions, y_test, gridsize=(4, 4), bins=binsize,
                   cmap='Blues')
    ax_main.set(xlabel="Predicted Class", ylabel="True Class")

    # plot x hist
    ax_xDist.hist(predictions, bins=binsize, align='mid')
    ax_xDist.set(ylabel='count')
    ax_xDist.set_xlabel('Classes')
    ax_xDist.set_title(f'Class distribution predicted vs. actual')

    # plot y hist
    ax_yDist.hist(y_test, bins=binsize, orientation='horizontal', align='mid')
    ax_yDist.set(xlabel='count')
    ax_yDist.set_ylabel('Classes')
    plt.savefig(path+filename, dpi=300)
    if with_print:
        plt.show()

def plot_class_sequence(y_test, predictions, path='', filename='',
                        with_print=True):
    os.makedirs(path, exist_ok=True)
    if '.png' not in filename:
        filename = filename + '.png'
    filename = str(int(time.time())) + '_' + filename
    prediction_shift = [el+0.04 for el in predictions]
    fig, ax = plt.subplots(figsize=(10,10), dpi=300)
    ax.plot(y_test, linestyle='-', marker='', color='b', alpha=0.2)
    ax.plot(y_test, linestyle='', marker='.', color='b')
    ax.plot(prediction_shift, linestyle='-', marker='', color='r', alpha=0.2)
    ax.plot(prediction_shift, linestyle='', marker='.', color='r')
    ax.set_ylabel('Classes')
    ax.set_xlabel('Samples')
    ax.set_title(f'Sequential chart of classes')
    plt.savefig(path+filename, dpi=300)
    if with_print:
        plt.show()

def store_perf_xlsx(model_name, data_set, performance_dict,
                    path=None, filename=''):

    data_to_store = pd.DataFrame.from_dict(performance_dict, orient='index').T
    data_to_store['data set'] = data_set
    data_to_store['model name'] = model_name
    data_to_store = data_to_store[['data set', 'model name',
                                   'accuracy', 'precision',
                                   'recall', 'f1_score']]

    if '.xlsx' not in filename:
        filename = filename + '.xlsx'

    os.makedirs(path, exist_ok=True)
    files_in_path = os.listdir(path)
    if filename not in files_in_path:
        wb = openpyxl.Workbook()
        ws = wb.active
        for r in dataframe_to_rows(data_to_store, index=False, header=True):
            ws.append(r)
    else:
        wb = openpyxl.load_workbook(path+filename)
        ws = wb.active
        for r in dataframe_to_rows(data_to_store, index=False, header=False):
            ws.append(r)
    wb.save(path + filename)
    print(f'Data stored in {path+filename}')



def eval_store_performance(y_test, predictions,
                           perf_log, model_name, data_set, path,
                           y_labels=None, with_print=False):
    if perf_log:
        plot_performance(perf_log.history['loss'], perf_log.history['val_loss'],
                         metric='loss', path=f'{path}/Charts/{model_name}/{data_set}/',
                         filename='loss', with_print=with_print)

        plot_performance(perf_log.history['acc'], perf_log.history['val_acc'],
                         metric='accuracy', path=f'{path}/Charts/{model_name}/{data_set}/',
                         filename='accuracy', with_print=with_print)

    performance_dict = performance_metrics(y_test, predictions,
                                           with_print=with_print)
    conf_matrix, norm_conf_matrix = confusion_matrix(y_test, predictions,
                                                     with_print=with_print)
    plot_confusion_matrix(normalized_confusion_matrix=norm_conf_matrix,
                          y_labels=y_labels,
                          path=f'{path}/Charts/{model_name}/{data_set}/',
                          filename='confusion', with_print=with_print)

    plot_class_sequence(y_test, predictions,
                        path=f'{path}/Charts/{model_name}/{data_set}/',
                        filename='class_sequence',
                        with_print=with_print)

    plot_class_hist(y_test, predictions,
                    path=f'{path}/Charts/{model_name}/{data_set}/',
                    filename='class_histogram',
                    with_print=False)

    store_perf_xlsx(model_name=model_name, data_set=data_set,
                    performance_dict=performance_dict, path=f'{path}Table/',
                    filename='performance_comparison')


