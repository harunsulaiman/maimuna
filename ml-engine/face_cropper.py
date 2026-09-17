import cv2
import os
from mtcnn import MTCNN

def crop_faces():
    # Make a new folder just for the faces
    if not os.path.exists("faces"):
        os.makedirs("faces")
        
    print("Waking up the face detector...")
    detector = MTCNN()
    
    print("Cropping faces from your pictures. This might take a minute...")
    
    # Go through every picture we saved in the last step
    for filename in os.listdir("pictures"):
        if filename.endswith(".jpg"):
            image_path = os.path.join("pictures", filename)
            image = cv2.imread(image_path)
            
            # Look for faces in the picture
            results = detector.detect_faces(image)
            
            # If it finds a face, crop it out!
            if results:
                x, y, width, height = results[0]['box']
                
                # Cut out the exact square where the face is
                cropped_face = image[y:y+height, x:x+width]
                
                # Save it into our new 'faces' folder
                cv2.imwrite(f"faces/cropped_{filename}", cropped_face)
                
    print("Done! Check your new 'faces' folder.")

if __name__ == "__main__":
    crop_faces()