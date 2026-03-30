import socket
import struct
import time
import random
import math

# ----------------------------------------------------
# 1) دالة التشفير XOR
# ----------------------------------------------------
def xor_encrypt(data_bytes, key):
    key_bytes = key.encode()
    encrypted = bytearray()

    for i in range(len(data_bytes)):
        encrypted.append(data_bytes[i] ^ key_bytes[i % len(key_bytes)])

    return bytes(encrypted)

# ----------------------------------------------------
# 2) قراءة المفتاح من key.txt
# ----------------------------------------------------
with open("key.txt", "r") as f:
    KEY = f.read().strip()

HOST = "127.0.0.1"
PORT = 5000

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))

# إنشاء 50 طائرة
planes = []
for i in range(50):
    move_dir = random.uniform(0, 360)
    planes.append({
        "lat": 24.7136 + random.uniform(-2, 2),
        "lon": 46.6753 + random.uniform(-2, 2),
        "alt": 500 + random.uniform(-50, 50),
        "heading": 0,
        "move_dir": move_dir,
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
            plane["heading"],
            plane["speed"]
        )

        # ----------------------------------------------------
        # 3) تشفير الـ packet قبل الإرسال
        # ----------------------------------------------------
        encrypted_packet = xor_encrypt(packet, KEY)

        # 🔥 طباعة للتأكد أن البيانات مشفّرة
        print("Encrypted packet:", encrypted_packet)

        sock.sendall(encrypted_packet)

        # حركة الطائرة
        rad = plane["move_dir"] * math.pi / 180
        move = 0.01
        plane["lat"] += move * math.sin(rad)
        plane["lon"] += move * math.cos(rad)

    time.sleep(1)
