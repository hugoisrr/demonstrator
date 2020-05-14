import csv
import time
import socket

class Server:
    instance = None

    def __init__(self):
        self.addr = "127.0.0.1"
        self.port = 8080
        self.server = socket.socket()
        self.server.bind((self.addr, self.port))
        self.server.listen(1)

    def wait_for_camera(self):
        print("Waiting for camera")
        self.read_raw_state()
        print("camera connected")

    def read_raw_state(self):
        client, _ = self.server.accept()
        data = client.recv(7)
        client.close()
        return data

    def close(self):
        self.server.close()

    @staticmethod
    def get_instance():
        if Server.instance == None:
            Server.instance = Server()
        return Server.instance

class Graph:
    def __init__(self, start_node):
        self.current = start_node
        self.keep_execution = True

    def eval(self, code):
        next_node = self.current.eval(code)
        if next_node is not None:
            self.current = next_node
            return next_node.write()

    def decode_data(self, data):
        return [ int(x) for x in data[:-1] ]

    def execute(self):
        server = Server.get_instance()
        server.wait_for_camera()

        self.current.write()

        while self.keep_execution:
            data = server.read_raw_state()

            if data[-1] == 1:
                print("Camera disconected")
                break
               
            code = self.decode_data(data)
            self.eval( code )

        print("Graph execution finished")

class Writter:
    instance = None

    def __init__(self):
        self.file_name = "States.csv"
        self.file_id = open(self.file_name, 'a')
        self.file_handler = csv.writer(self.file_id)

    def write(self, state):
        self.file_handler.writerow([state, time.time()])

    def close(self):
        self.file_id.close()

    @staticmethod
    def get_instance():
        if Writter.instance == None:
            Writter.instance = Writter()
        return Writter.instance

class Node:
    def __init__(self, id_number, name):
        self.id_number = id_number
        self.name = name
        self.transitions = []
        self.n_match = 0

    def add_transition(self, code, node):
        self.transitions.append( (code, node) )

    def match(self, code1, code2):
        for bit1, bit2 in zip(code1, code2):
            if bit1 == 2 or bit2 == 2:
                continue
            if bit1 != bit2:
                return False
        return True

    def eval(self, code1):
        match, choosen = False, None

        for code2, node in self.transitions:
            if self.match(code1, code2):
                match, choosen = True, node

        if match:
            self.n_match += 1
            if self.n_match >= 3:
                return choosen
        else:
            self.n_match = 0

    def write(self):
        print( "========> %s <=========" % self.name)
        Writter.get_instance().write(self.name)
        return self.id_number

def build_state_graph():
    idle = Node(0, "not running")
    spindle = Node(1, "spindle")
    engraving = Node(2, "engraving")

    idle.add_transition([0,0,0,0,0,1], engraving)
    idle.add_transition([2,0,0,0,1,1], spindle)
    idle.add_transition([0,1,0,0,1,1], spindle)
    idle.add_transition([0,0,1,0,1,1], spindle)
    idle.add_transition([0,0,0,1,1,1], spindle)

    spindle.add_transition([2,0,0,0,1,0], idle)
    spindle.add_transition([0,1,0,0,1,0], idle)
    spindle.add_transition([0,0,1,0,1,0], idle)
    spindle.add_transition([0,0,0,1,1,0], idle)

    engraving.add_transition([0,0,0,1,1,0], idle)

    print("State graph ready")
    graph = Graph(idle)
    return graph
