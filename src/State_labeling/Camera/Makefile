CUDA_INCLUDE_PATH=/usr/local/cuda/include

OPENCV_INC_PATH=/usr/local/include
OPENCV_LIB_PATH=/usr/local/lib
OPENCV_LIBS=-lopencv_core -lopencv_videoio -lopencv_highgui -lopencv_imgproc -lm

Camera: Sender.o StateIdentifier.o Camera.o
	g++ Sender.o StateIdentifier.o Camera.o -o Camera -L $(OPENCV_LIB_PATH) $(OPENCV_LIBS)

Sender.o: Sender.cpp Sender.h
	g++ -c Sender.cpp -std=c++11

Camera.o: Camera.cpp
	g++ -c Camera.cpp -std=c++11 -I $(OPENCV_INC_PATH) -I $(CUDA_INCLUDE_PATH)

StateIdentifier.o: StateIdentifier.cpp StateIdentifier.h
	g++ -c StateIdentifier.cpp -std=c++11 -I $(OPENCV_INC_PATH) -I $(CUDA_INCLUDE_PATH)

clean:
	rm -f *.o Camera

exe:
	./Camera
