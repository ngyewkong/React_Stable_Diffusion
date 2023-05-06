FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

RUN useradd -m -u 1000 user

USER user

ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

COPY --chown=user . $HOME/app

# Get secret hugging_face_api_key and output it to $HOME/secrets at buildtime
RUN --mount=type=secret,id=hugging_face_api_key,mode=0444,required=true \
    cat /run/secrets/hugging_face_api_key > $HOME/secrets

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]