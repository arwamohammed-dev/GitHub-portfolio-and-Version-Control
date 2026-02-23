import socket
import struct
import json

DATA_FILE = "planes.json"

def save_plane(track_id, lat, lon, alt, heading, speed, timestamp):
    try:
        with open(DATA_FILE, "r") as f:
            planes = json.load(f)
    except:
        planes = {}

    planes[str(track_id)] = {
        "lat": lat,
        "lon": lon,
        "alt": alt,
        "heading": heading,
        "speed": speed,
        "timestamp": timestamp
    }

    with open(DATA_FILE, "w") as f:
        json.dump(planes, f)


def parse_packet(data):
    length = struct.unpack('<H', data[0:2])[0]
    track_type = data[2]

    if track_type != 1:
        return

    timestamp = struct.unpack('<Q', data[3:11])[0]
    node_id = struct.unpack('<H', data[11:13])[0]
    track_id = struct.unpack('<I', data[13:17])[0]
    lat = struct.unpack('<f', data[17:21])[0]
    lon = struct.unpack('<f', data[21:25])[0]
    alt = struct.unpack('<f', data[25:29])[0]
    heading = struct.unpack('<f', data[29:33])[0]
    speed = struct.unpack('<f', data[33:37])[0]

    print(f"Plane {track_id}: {lat}, {lon}, heading={heading}")

    save_plane(track_id, lat, lon, alt, heading, speed, timestamp)


def start_tcp():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 5000))
    server.listen(1)

    print("Listening for radar data on port 5000...")

    while True:
        client, addr = server.accept()
        print("Connected:", addr)

        while True:
            data = client.recv(37)
            if not data:
                break
            parse_packet(data)


if __name__ == "__main__":
    start_tcp()

