#include <iostream>

#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

using namespace std;

int error(int sock, const char *msg){
    close(sock);
    cout << msg << endl;
    return -1;
}

bool* add_power_bit(bool* states){
    bool *msg = new bool[7];
    for(int i=0; i<7; i++) msg[i] = states[i];
    msg[6] = 0;
    return msg;
} 

int send_msg(bool *msg){
    int port = 8080;
    struct sockaddr_in serv_addr;

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return error(sock, "Socket creation error");

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(port);

    int result = inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr);
    if(result <= 0) return error(sock, "Invalid address");

    result = connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));
    if (result < 0) return error(sock, "Connection Failed");

    send(sock, msg, sizeof(bool)*7, 0);
    close(sock);

    return 0;
}

int test_conection(){
    bool msg[7] = {0,0,0,0,0,0,1}; 
    return send_msg( msg );
}

int send_states(bool * states){
   return send_msg( add_power_bit(states) ); 
}

int send_poweroff(){
    bool msg[7] = {0,0,0,0,0,0,1}; 
    return send_msg( msg );
}
