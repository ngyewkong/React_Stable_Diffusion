from dotenv import load_dotenv
import os

load_dotenv()
auth_token = os.environ.get("hugging_face_api_key")
