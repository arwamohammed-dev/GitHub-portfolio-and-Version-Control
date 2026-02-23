import socket
import struct
import time

HOST = "127.0.0.1"
PORT = 5000

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))

lat = 24.7136   # الرياض
lon = 46.6753
alt = 500
heading = 90
speed = 250
track_id = 123
node_id = 1

while True:
    timestamp = int(time.time())

    packet = struct.pack(
        '<H B Q H I f f f f f',
        37,         # length
        1,          # track type
        timestamp,  # timestamp
        node_id,    # node id
        track_id,   # track id
        lat,        # latitude
        lon,        # longitude
        alt,        # altitude
        heading,    # heading
        speed       # speed
    )

    sock.sendall(packet)

    lon += 0.01  # تحريك بسيط للطائرة

    print("Sent test packet:", lat, lon)

    time.sleep(1)

