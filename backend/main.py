from fastapi import FastAPI, WebSocket
from neural_network import run_style_transfer
from PIL import Image

import base64
import io

app = FastAPI()

def decode_image(str):
    """Convert base64 string to PIL Image"""
    image = io.BytesIO(base64.urlsafe_b64decode(
        str.split(',')[1].replace("\n", "")))
    img = Image.open(image)
    print("decode successfully")
    return img


def encode_image(img):
    """Convert PIL Image to base64 string"""
    img = Image.fromarray(img)
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    res_encode = base64.b64encode(buf.getvalue()).decode()
    return res_encode


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Open Websocket connection, 
    then wait for json with 2 images in base64, 
    then run main function of neural network"""
    print('Accepting client connection...')
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            print('images received')

            img1 = decode_image(data['image1'])
            img2 = decode_image(data['image2'])

            # function sends intermediate results
            res = run_style_transfer(img1, img2, num_iterations=1001)
            for i in res:
                res_img = encode_image(i)
                await websocket.send_text(res_img)
    except Exception as e:
        print(e)
    finally:
        await websocket.close()
