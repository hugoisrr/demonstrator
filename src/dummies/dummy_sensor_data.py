import socket
import json
import struct

clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
clientSocket.connect(("localhost", 65432))

messageToSend = 'converted'

formatString = (b'BBLffffffhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
                b'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
                b'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
                b'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
                b'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
                b'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
                b'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'
                b'hhhhhhhhhhhhhhhhhhhhhh')

confString = b'XXX,60,200'

dataMessage = (b'\x0f\x00\x00\x00\xaa%\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x80\x96?\x00\x80\x96?'
               b'\x00\x00\x91?\xe5\xf3\xde\xed\x87\xe5\xe1\xfe\x14\x00\x95\xff$\xfe\x94\xfe2\x03\xaa%\x00\x00\x05\x00'
               b'\xee\xf3\xfe\xed\xb0\xe5\xe2\xfe\x17\x00\x94\xff$\xfe\x94\xfe2\x03\xaf%\x00\x00\x05\x00\x03\xf48\xee'
               b'\xa0\xe5\xd6\xfe\x15\x00\xa4\xff$\xfe\x94\xfe2\x03\xb4%\x00\x00\x05\x00\x1e\xf4\x1b\xee{\xe5\xd0\xfe'
               b'\x19\x00\xa6\xff\x1f\xfe\x8f\xfe/\x03\xb9%\x00\x00\x05\x00\x12\xf4(\xee\x92\xe5\xea\xfe#\x00\xa1\xff'
               b'\x1f\xfe\x8f\xfe/\x03\xbe%\x00\x00\x05\x00\x1e\xf4)\xee\xb6\xe5\x00\xff+\x00\x8a\xff\x1f\xfe\x8f\xfe/'
               b'\x03\xc3%\x00\x00\x05\x00"\xf4\x04\xee|\xe5\xf6\xfe\x1f\x00|\xff\x1f\xfe\x8f\xfe/\x03\xc8%\x00\x00\x05'
               b'\x00\x15\xf4\xe0\xed\xae\xe5\xda\xfe\x1b\x00\x82\xff\x1f\xfe\x8f\xfe/\x03\xcd%\x00\x00\x05\x00\xfb\xf3'
               b'\xe0\xed\x99\xe5\xcc\xfe\x10\x00\x84\xff\x1f\xfe\x8f\xfe/\x03\xd2%\x00\x00\x05\x00\xe0\xf3\x0e\xee\x96'
               b'\xe5\xe0\xfe\x18\x00\x94\xff\x1f\xfe\x8f\xfe/\x03\xd7%\x00\x00\x05\x00\t\xf49\xee\x90\xe5\xf2\xfe#\x00'
               b'\x95\xff\x1f\xfe\x8f\xfe/\x03\xdc%\x00\x00\x05\x00\xe4\xf3\x0c\xeea\xe5\xff\xfe(\x00\x97\xff\x1f\xfe'
               b'\x8f\xfe/\x03\xe1%\x00\x00\x05\x00\xef\xf3\x0b\xeel\xe5\x0c\xff)\x00\x89\xff\x1f\xfe\x8f\xfe/\x03\xe6%'
               b'\x00\x00\x05\x00\xd0\xf3\xec\xedw\xe5\'\xff#\x00z\xff\x1f\xfe\x8f\xfe/\x03\xeb%\x00\x00\x05\x00\x05\xf4'
               b'\'\xee\x88\xe5R\xff#\x00s\xff\x1f\xfe\x8f\xfe/\x03\xf0%\x00\x00\x05\x00\xbb\xf3\xc9\xed\xa0\xe5l\xff'
               b'\x1d\x00s\xff\x1f\xfe\x8f\xfe/\x03\xf5%\x00\x00\x05\x00\xf1\xf3\xc4\xedw\xe5\x84\xff/\x00r\xff\x1f\xfe'
               b'\x8f\xfe/\x03\xfa%\x00\x00\x05\x00+\xf4?\xee\x98\xe5\x88\xff+\x00v\xff\x1f\xfe\x8f\xfe/\x03\xff%\x00'
               b'\x00\x05\x00F\xf4=\xee\x05\xe6%\xff!\x00|\xff\x1f\xfe\x8f\xfe/\x03\x04&\x00\x00\x05\x00\x1b\xf4\x12\xee'
               b'\xe9\xe5\xb7\xfe%\x00\x85\xff\x1f\xfe\x8f\xfe/\x03\t&\x00\x00\x05\x00\x1e\xf4\xf6\xed\xc7\xe5p\xfe\''
               b'\x00\x94\xff\x1f\xfe\x8f\xfe/\x03\x0e&\x00\x00\x05\x00\x13\xf4\xf6\xed\xb6\xe5d\xfe \x00\x9a\xff\x1f'
               b'\xfe\x8f\xfe/\x03\x13&\x00\x00\x05\x00\xf4\xf3\xf3\xed\x92\xe5\x83\xfe\x11\x00\x97\xff\x1f\xfe\x8f\xfe/'
               b'\x03\x18&\x00\x00\x05\x00\xff\xf3*\xeey\xe5\x93\xfe\xf6\xff\x94\xff\x1f\xfe\x8f\xfe/\x03\x1d&\x00\x00'
               b'\x05\x00\xd5\xf3\xfd\xed~\xe5\xb0\xfe\xf2\xff\x95\xff\x1f\xfe\x8f\xfe/\x03"&\x00\x00\x05\x00\xa4\xf3'
               b'\xff\xed\x99\xe5\xcc\xfe\xee\xff\x8f\xff\x1f\xfe\x8f\xfe/\x03\'&\x00\x00\x05\x00\xe4\xf3\xf2\xeds\xe5'
               b'\x05\xff\x03\x00\x80\xff\x1f\xfe\x8f\xfe/\x03,&\x00\x00\x05\x00\xc4\xf3\xf1\xedU\xe58\xff\x12\x00\x83'
               b'\xff\x1f\xfe\x99\xfe3\x031&\x00\x00\x05\x00\xdb\xf3\x03\xee^\xe56\xff%\x00\x8a\xff\x1f\xfe\x99\xfe3'
               b'\x036&\x00\x00\x05\x00\x18\xf4$\xee\x8a\xe5\x1d\xff.\x00\x87\xff\x1f\xfe\x99\xfe3\x03;&\x00\x00\x05'
               b'\x00\x01\xf4\x00\xee\xa7\xe5\x10\xff\'\x00v\xff\x1f\xfe\x99\xfe3\x03@&\x00\x00\x05\x00\x19\xf4\x10'
               b'\xeer\xe5\x1e\xff:\x00n\xff\x1f\xfe\x99\xfe3\x03E&\x00\x00\x05\x002\xf4\x1c\xee\x8b\xe55\xff;\x00m\xff'
               b'\x1f\xfe\x99\xfe3\x03J&\x00\x00\x05\x00 \xf4\xef\xed\x9f\xe5&\xff)\x00l\xff\x1f\xfe\x99\xfe3\x03O&\x00'
               b'\x00\x05\x00\x11\xf4\x1d\xee\xb2\xe5\x05\xff\x13\x00\x87\xff\x1f\xfe\x99\xfe3\x03T&\x00\x00\x05\x00,'
               b'\xf48\xee\xd3\xe5\xe6\xfe\x11\x00\x8b\xff\x1f\xfe\x99\xfe3\x03Y&\x00\x00\x05\x00\x01\xf4\x11\xee\xe8'
               b'\xe5\xc1\xfe\x14\x00\x96\xff\x1f\xfe\x99\xfe3\x03^&\x00\x00\x05\x00\xec\xf3\xe6\xed\xb9\xe5\xc3\xfe'
               b'\x14\x00\x9d\xff\x1f\xfe\x99\xfe3\x03c&\x00\x00\x05\x00\r\xf4\x1d\xee\xac\xe5\xeb\xfe\x19\x00\x92\xff'
               b'\x1f\xfe\x99\xfe3\x03h&\x00\x00\x05\x00\x02\xf4\xfa\xed\xb7\xe5\xf0\xfe\x16\x00\x88\xff\x1f\xfe\x99'
               b'\xfe3\x03m&\x00\x00\x05\x00(\xf4\xfe\xed\x92\xe5\xb5\xfe\x1a\x00~\xff\x1f\xfe\x99\xfe3\x03r&\x00\x00'
               b'\x05\x00\xed\xf3\xab\xed\xbd\xe5\x86\xfe%\x00\x85\xff\x1f\xfe\x99\xfe3\x03w&\x00\x00\x05\x00\x06\xf4'
               b'\xc9\xed\x98\xe5\x97\xfe@\x00\x8e\xff\x1f\xfe\x99\xfe3\x03|&\x00\x00\x05\x00\xd5\xf3\xe5\xed\x81\xe5'
               b'\xc1\xfeQ\x00\x8a\xff\x1f\xfe\x99\xfe3\x03\x81&\x00\x00\x05\x00\xfb\xf3\x14\xee\x97\xe5\xee\xfeF\x00'
               b'\x84\xff\x1f\xfe\x99\xfe3\x03\x86&\x00\x00\x05\x00\t\xf4N\xee\x94\xe5\x03\xffD\x00\x83\xff\x1f\xfe\x99'
               b'\xfe3\x03\x8b&\x00\x00\x05\x00!\xf48\xee{\xe5\xe9\xfe3\x00w\xff\x1f\xfe\x99\xfe3\x03\x90&\x00\x00\x05'
               b'\x00\xf3\xf3\x01\xee}\xe5\xc8\xfe,\x00t\xff\x1f\xfe\x99\xfe3\x03\x95&\x00\x00\x05\x00\xdb\xf3\xec\xed'
               b'\x90\xe5\xc3\xfe"\x00\x84\xff\x1f\xfe\x99\xfe3\x03\x9a&\x00\x00\x05\x00\x1c\xf4\x08\xee\x81\xe5\xe9'
               b'\xfe!\x00\x8d\xff\x1f\xfe\x99\xfe3\x03\x9f&\x00\x00\x05\x00\x05\xf4\x14\xee\xa1\xe5\x15\xff.\x00\x8c'
               b'\xff\x1f\xfe\x99\xfe3\x03\xa4&\x00\x00\x05\x00\x11\xf4%\xee\x99\xe5%\xff&\x00\x84\xff\x1f\xfe\x99\xfe3'
               b'\x03\xa9&\x00\x00\x05\x00\xde\xf3\xdb\xed\x85\xe5%\xff3\x00_\xff\x1f\xfe\x99\xfe3\x03\xae&\x00\x00\x05'
               b'\x00\xe7\xf3\xcb\xed\x9e\xe59\xff0\x00Y\xff\x1f\xfe\x99\xfe3\x03\xb3&\x00\x00\x05\x00\x1b\xf4\xf6\xed'
               b'\xd2\xe50\xff>\x00f\xff\x1f\xfe\x99\xfe3\x03\xb8&\x00\x00\x05\x00\x14\xf4\xe5\xed\xdc\xe50\xff3\x00|'
               b'\xff\x1f\xfe\x99\xfe3\x03\xbd&\x00\x00\x05\x00*\xf4\n\xee\x00\xe65\xff;\x00\x8b\xff\x1f\xfe\x99\xfe3'
               b'\x03\xc2&\x00\x00\x05\x00\n\xf4\xfd\xed\xfb\xe5#\xff.\x00\x94\xff\x1f\xfe\x99\xfe3\x03\xc7&\x00\x00'
               b'\x05\x00\xf4\xf3\xfa\xed\xd2\xe5;\xff3\x00\x96\xff\x1f\xfe\x99\xfe3\x03\xcc&\x00\x00\x05\x00\x19\xf4'
               b'\xf7\xed\xa1\xe5N\xff$\x00\x91\xff\x1f\xfe\x99\xfe3\x03\xd1&\x00\x00\x05\x00')

timestamp = 9642
packageNumber = 0

for idx in list(range(3)):
    clientSocket.send(formatString)
for idx in list((range(3))):
    clientSocket.send(confString)
while True:
    convertedMessage = struct.pack(formatString, 15, packageNumber, timestamp, 0.0, 0.0, 0.0, 1.17578125, 1.17578125,
                                   1.1328125, -3099, -4642, -6777, -287, 20, -107, -476, -364, 818, 9642, 0, 5, -3090,
                                   -4610, -6736, -286, 23, -108, -476, -364, 818, 9647, 0, 5, -3069, -4552, -6752, -298,
                                   21, -92, -476, -364, 818, 9652, 0, 5, -3042, -4581, -6789, -304, 25, -90, -481, -369,
                                   815, 9657, 0, 5, -3054, -4568, -6766, -278, 35, -95, -481, -369, 815, 9662, 0, 5,
                                   -3042, -4567, -6730, -256, 43, -118, -481, -369, 815, 9667, 0, 5, -3038, -4604,
                                   -6788, -266, 31, -132, -481, -369, 815, 9672, 0, 5, -3051, -4640, -6738, -294, 27,
                                   -126, -481, -369, 815, 9677, 0, 5, -3077, -4640, -6759, -308, 16, -124, -481, -369,
                                   815, 9682, 0, 5, -3104, -4594, -6762, -288, 24, -108, -481, -369, 815, 9687, 0, 5,
                                   -3063, -4551, -6768, -270, 35, -107, -481, -369, 815, 9692, 0, 5, -3100, -4596,
                                   -6815, -257, 40, -105, -481, -369, 815, 9697, 0, 5, -3089, -4597, -6804, -244, 41,
                                   -119, -481, -369, 815, 9702, 0, 5, -3120, -4628, -6793, -217, 35, -134, -481, -369,
                                   815, 9707, 0, 5, -3067, -4569, -6776, -174, 35, -141, -481, -369, 815, 9712, 0, 5,
                                   -3141, -4663, -6752, -148, 29, -141, -481, -369, 815, 9717, 0, 5, -3087, -4668,
                                   -6793, -124, 47, -142, -481, -369, 815, 9722, 0, 5, -3029, -4545, -6760, -120, 43,
                                   -138, -481, -369, 815, 9727, 0, 5, -3002, -4547, -6651, -219, 33, -132, -481, -369,
                                   815, 9732, 0, 5, -3045, -4590, -6679, -329, 37, -123, -481, -369, 815, 9737, 0, 5,
                                   -3042, -4618, -6713, -400, 39, -108, -481, -369, 815, 9742, 0, 5, -3053, -4618,
                                   -6730, -412, 32, -102, -481, -369, 815, 9747, 0, 5, -3084, -4621, -6766, -381, 17,
                                   -105, -481, -369, 815, 9752, 0, 5, -3073, -4566, -6791, -365, -10, -108, -481, -369,
                                   815, 9757, 0, 5, -3115, -4611, -6786, -336, -14, -107, -481, -369, 815, 9762, 0, 5,
                                   -3164, -4609, -6759, -308, -18, -113, -481, -369, 815, 9767, 0, 5, -3100, -4622,
                                   -6797, -251, 3, -128, -481, -369, 815, 9772, 0, 5, -3132, -4623, -6827, -200, 18,
                                   -125, -481, -359, 819, 9777, 0, 5, -3109, -4605, -6818, -202, 37, -118, -481, -359,
                                   819, 9782, 0, 5, -3048, -4572, -6774, -227, 46, -121, -481, -359, 819, 9787, 0, 5,
                                   -3071, -4608, -6745, -240, 39, -138, -481, -359, 819, 9792, 0, 5, -3047, -4592,
                                   -6798, -226, 58, -146, -481, -359, 819, 9797, 0, 5, -3022, -4580, -6773, -203, 59,
                                   -147, -481, -359, 819, 9802, 0, 5, -3040, -4625, -6753, -218, 41, -148, -481, -359,
                                   819, 9807, 0, 5, -3055, -4579, -6734, -251, 19, -121, -481, -359, 819, 9812, 0, 5,
                                   -3028, -4552, -6701, -282, 17, -117, -481, -359, 819, 9817, 0, 5, -3071, -4591,
                                   -6680, -319, 20, -106, -481, -359, 819, 9822, 0, 5, -3092, -4634, -6727, -317, 20,
                                   -99, -481, -359, 819, 9827, 0, 5, -3059, -4579, -6740, -277, 25, -110, -481, -359,
                                   819, 9832, 0, 5, -3070, -4614, -6729, -272, 22, -120, -481, -359, 819, 9837, 0, 5,
                                   -3032, -4610, -6766, -331, 26, -130, -481, -359, 819, 9842, 0, 5, -3091, -4693,
                                   -6723, -378, 37, -123, -481, -359, 819, 9847, 0, 5, -3066, -4663, -6760, -361, 64,
                                   -114, -481, -359, 819, 9852, 0, 5, -3115, -4635, -6783, -319, 81, -118, -481, -359,
                                   819, 9857, 0, 5, -3077, -4588, -6761, -274, 70, -124, -481, -359, 819, 9862, 0, 5,
                                   -3063, -4530, -6764, -253, 68, -125, -481, -359, 819, 9867, 0, 5, -3039, -4552,
                                   -6789, -279, 51, -137, -481, -359, 819, 9872, 0, 5, -3085, -4607, -6787, -312, 44,
                                   -140, -481, -359, 819, 9877, 0, 5, -3109, -4628, -6768, -317, 34, -124, -481, -359,
                                   819, 9882, 0, 5, -3044, -4600, -6783, -279, 33, -115, -481, -359, 819, 9887, 0, 5,
                                   -3067, -4588, -6751, -235, 46, -116, -481, -359, 819, 9892, 0, 5, -3055, -4571,
                                   -6759, -219, 38, -124, -481, -359, 819, 9897, 0, 5, -3106, -4645, -6779, -219, 51,
                                   -161, -481, -359, 819, 9902, 0, 5, -3097, -4661, -6754, -199, 48, -167, -481, -359,
                                   819, 9907, 0, 5, -3045, -4618, -6702, -208, 62, -154, -481, -359, 819, 9912, 0, 5,
                                   -3052, -4635, -6692, -208, 51, -132, -481, -359, 819, 9917, 0, 5, -3030, -4598,
                                   -6656, -203, 59, -117, -481, -359, 819, 9922, 0, 5, -3062, -4611, -6661, -221, 46,
                                   -108, -481, -359, 819, 9927, 0, 5, -3084, -4614, -6702, -197, 51, -106, -481, -359,
                                   819, 9932, 0, 5, -3047, -4617, -6751, -178, 36, -111, -481, -359, 819, 9937, 0, 5)
    if messageToSend == 'data':
        clientSocket.send(dataMessage)
    else:
        clientSocket.send(convertedMessage)
    print(packageNumber)
    print(timestamp)
    packageNumber += 1
    if packageNumber == 256:
        packageNumber = 0
    timestamp += 250