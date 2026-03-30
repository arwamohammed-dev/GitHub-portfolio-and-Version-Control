import random
import string

def generate_key(length=10):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

key = generate_key()
with open("key.txt", "w") as f:
    f.write(key)

print("Generated key:", key)

