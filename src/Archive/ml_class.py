from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn import svm
from sklearn import tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.ensemble import BaggingClassifier
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import VotingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.linear_model import SGDClassifier


class classifier():
    def __init__(self, clf):
        models = {}
        estimators = [('naiveB', GaussianNB()),
                      ('descTree', DecisionTreeClassifier()),
                      ('svm', svm.SVC(kernel='rbf')),
                      ('randForest', RandomForestClassifier()),
                      ('knn', KNeighborsClassifier()),
                      ('lda', LinearDiscriminantAnalysis()),
                      ('bagging', BaggingClassifier(n_estimators=100)),
                      ('exTree', ExtraTreesClassifier(n_estimators=100)),
                      ('gradBoost', GradientBoostingClassifier(n_estimators=100))]
        models['naiveB'] = GaussianNB()
        models['descTree'] = DecisionTreeClassifier()
        models['svm'] = svm.SVC(kernel='rbf')
        models['randForest'] = RandomForestClassifier()
        models['knn'] = KNeighborsClassifier()
        models['lda'] = LinearDiscriminantAnalysis()
        models['bagging'] = BaggingClassifier(n_estimators=100)
        models['exTree'] = ExtraTreesClassifier(n_estimators=100)
        models['gradBoost'] = GradientBoostingClassifier(n_estimators=100)
        models['adaBoost'] = AdaBoostClassifier(n_estimators=100)
        models['votEns'] = VotingClassifier(estimators)
        models['ANN'] = MLPClassifier(solver='lbfgs', alpha=1e-5,
                                      hidden_layer_sizes=(26, 6),
                                      random_state=1)
        models['PAC'] = PassiveAggressiveClassifier()
        models['SGD'] = SGDClassifier()

        self.clf = models[clf]
        self.model_name = clf

    def fit(self, X_train, y_train):
        self.clf = self.clf.fit(X_train, y_train)

    def fit_predict(self, X_train, X_test, y_train):
        self.clf = self.clf.fit(X_train, y_train)
        return self.clf.predict(X_test)

    def partial_fit(self, X_train, y_train):
        self.clf = self.clf.partial_fit(X_train, y_train)

    def predict(self, X_test):
        return self.clf.predict(X_test)

    def predict_proba(self, X_test):
        return self.clf.predict_proba(X_test)

