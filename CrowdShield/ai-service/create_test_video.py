import cv2
import numpy as np

width, height = 640, 480
fps = 30
duration = 2
out = cv2.VideoWriter('test_video.mp4', cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

for i in range(fps * duration):
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    # Draw a moving rectangle to simulate a person
    x = int((i / (fps * duration)) * width)
    cv2.rectangle(frame, (x, 200), (x+50, 300), (0, 255, 0), -1)
    out.write(frame)

out.release()
print('test_video.mp4 created successfully')
