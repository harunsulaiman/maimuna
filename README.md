Multimodal Deepfake Detection System

This repository contains the source code for a dual-stream deepfake detection architecture designed to identify manipulated video content by analyzing visual and audio streams simultaneously.   Traditional unimodal detection systems are vulnerable to sophisticated manipulations, such as a genuine face paired with a cloned voice, or an authentic voice layered over a swapped face. 

This system addresses that vulnerability by processing the visual stream through a Convolutional Neural Network paired with a Long Short-Term Memory network (CNN-LSTM) to track spatial and temporal anomalies, while simultaneously processing the audio stream using Mel-Frequency Cepstral Coefficients (MFCCs) to detect synthetic vocal characteristics. The independent probabilities are then combined using a weighted late-fusion mechanism to produce a final authenticity verdict.   

Key Features

Dual-Stream Analysis: Independent evaluation of spatial-temporal visual artifacts and vocal frequency anomalies.   

Late-Fusion Decision Engine: Weighted probability combination preventing single-modality deception.  

Institutional-Grade UI: A high-performance, dark-mode Next.js frontend featuring live processing telemetry and dynamic probability metrics.

Traceable Architecture: PostgreSQL integration via Prisma for comprehensive audit trails of all detection requests.  

Technology StackFrontend: Next.js, React, Vanilla CSS, Prisma ORMBackend Engine: Python, Flask, GunicornMachine Learning & Processing: TensorFlow / Keras, OpenCV, MTCNN, Librosa, scikit-learn   

Database: PostgreSQL
