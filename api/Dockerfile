FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Get secret hugging_face_api_key and output it to /secrets at buildtime
RUN --mount=type=secret,id=hugging_face_api_key,mode=0444,required=true \
    cat /run/secrets/hugging_face_api_key > /secrets

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]