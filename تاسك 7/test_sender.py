import socket
import struct
import time
import random
import math

HOST = "127.0.0.1"
PORT = 5000

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))

# إنشاء 50 طائرة في أماكن مختلفة واتجاهات مختلفة
planes = []
for i in range(50):

    # اتجاه الحركة الحقيقي (وليس heading)
    move_dir = random.uniform(0, 360)

    planes.append({
        "lat": 24.7136 + random.uniform(-2, 2),
        "lon": 46.6753 + random.uniform(-2, 2),
        "alt": 500 + random.uniform(-50, 50),
        "heading": 0,                 # رأس الطائرة للأعلى دائماً
        "move_dir": move_dir,         # اتجاه الحركة الحقيقي
        "speed": random.uniform(200, 300),
        "track_id": 1000 + i,
        "node_id": 1
    })

while True:
    timestamp = int(time.time())

    for plane in planes:
        packet = struct.pack(
            '<H B Q H I f f f f f',
            37,
            1,
            timestamp,
            plane["node_id"],
            plane["track_id"],
            plane["lat"],
            plane["lon"],
            plane["alt"],
            plane["heading"],   # ثابت للأعلى
            plane["speed"]
        )

        sock.sendall(packet)

        # حركة حسب الاتجاه الحقيقي
        rad = plane["move_dir"] * math.pi / 180
        move = 0.01

        plane["lat"] += move * math.sin(rad)
        plane["lon"] += move * math.cos(rad)

        print(f"Plane {plane['track_id']} → dir={plane['move_dir']:.1f}°")

    time.sleep(1)
