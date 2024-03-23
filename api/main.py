# import the api key from the auth_token.py file
from auth_token import auth_token

from fastapi import FastAPI, Response  # import fastapi library
# for cross origin resource sharing
from fastapi.middleware.cors import CORSMiddleware

import torch  # for pytorch
from diffusers import DiffusionPipeline  # import the diffuser
from io import BytesIO  # for reading the image
import base64  # for decoding the image

import random  # for random prompt generation

app = FastAPI()  # create the app

app.add_middleware(  # add the middleware
    CORSMiddleware,
    allow_credentials=True,  # allow credentials
    allow_origins=["*"],  # allow all origins
    allow_methods=["*"],  # allow all methods
    allow_headers=["*"],  # allow all headers
)

# import stable diffusion
device = "mps"  # to use nvidia gpu -> device = "cuda" to use macbook gpu -> device = "mps"
model_id = "runwayml/stable-diffusion-v1-5"
pipe = DiffusionPipeline.from_pretrained(model_id, use_auth_token=auth_token)
pipe.to(device)
pipe.enable_attention_slicing()  # enable attention slicing for less than 64gb ram


@app.get("/generate")  # define the root path
def generateRandomImage(prompt: str):  # define the generate function
    result = pipe(prompt,
                  guidance_scale=8.5  # how strict to follow the prompt
                  ).images[0]  # get the image
    # save the image
    result.save("result.png")
    # convert to base64 buffer
    buffer = BytesIO()
    result.save(buffer, format="PNG")  # save the image to the buffer
    imgstr = base64.b64encode(buffer.getvalue())  # encode the buffer
    # return the imgstr as a string

    # return the result
    return Response(content=imgstr, media_type="image/png")

# random prompt api


@app.get("/random")
def generateRandomPrompt():
    objectList = ["car", "animals", "sky", "sun", "moon", "superheroes",
                  "harry potter", "buildings", "humans", "elon", "god", "friends", "family"]
    styleList = ["anime", "cartoon", "realistic", "painting", "sketch", "watercolor",
                 "comic", "pixel", "3d", "abstract", "cyberpunk", "andywarhol", "renaissance"]
    actionList = ["flying", "running", "jumping", "swimming", "dancing", "singing",
                  "eating", "posing", "sleeping", "watching netflix", "acting", "writing", "teaching", "coding", ""]
    hdList = ["hd", "4k", "high quality", "high res", "high resolution", ""]

    # generate a random prompt
    prompt = random.choice(objectList) + " " + random.choice(styleList) + \
        " " + random.choice(actionList) + " " + random.choice(hdList)

    return prompt
