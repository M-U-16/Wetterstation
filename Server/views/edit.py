from io import BytesIO
import os
import urllib.parse as urllib_parse
import tempfile
from wsgiref.util import FileWrapper
import zipfile
from flask import Blueprint, current_app, render_template, request, send_file, Response

blueprint = Blueprint(
    "edit_bp",
    __name__,
    url_prefix="/edit"
)

edit_ignore = [
    "__pycache__",
    "edits",
    "data"
]

def check_ignore(dst):
    for value in edit_ignore:
        if value in dst: return False
    return True

def get_files(path):
    server_dir = {"dirs": [], "files": []}
    for server_file in os.listdir(path):
        is_allowed = True
        for value in edit_ignore:
            if value in server_file:
                is_allowed = False
        if not is_allowed: continue
        
        if os.path.isdir(os.path.join(path, server_file)):
            server_dir["dirs"].append(server_file)
        else: server_dir["files"].append(server_file)

    return server_dir

def zipdir(path, zip_file):
    for root, dirs, files in os.walk(path):
        if not check_ignore(root): continue
        for file in files:
            zip_file.write(
                os.path.join(root, file),
                os.path.relpath(os.path.join(root, file), path)
            )

@blueprint.route("/")
def index_route():
    if request.args.get("download"):
        path = os.path.join(
            current_app.root_path,
            request.args.get("download")
        )
        
        
        if request.args.get("is_dir"):
            download_name = request.args.get("download")+".zip"
            zip_contents = None
            with tempfile.TemporaryDirectory() as tmpdir:
                print(tmpdir)
                zip_file_path = os.path.join(tmpdir, download_name)
                with zipfile.ZipFile(zip_file_path, mode='w') as zip_file:
                    zipdir(path, zip_file)
                
                zip_file = open(zip_file_path, "rb")
                zip_contents = BytesIO(zip_file.read())
                zip_file.close()
            return Response(
                FileWrapper(zip_contents),
                mimetype="application/octet-stream",
                direct_passthrough=True
            )
        
        return send_file(path)
    
    if request.args.get("open"):
        display_path_root = os.path.relpath(current_app.root_path, os.path.join(current_app.root_path, ".."))
        
        root = current_app.root_path
        open_dir = urllib_parse.unquote_plus(request.args.get("open"))
        if not open_dir.endswith("/"): open_dir += "/"
        
        dir_path = os.path.join(root, open_dir)
        if "\\" in dir_path:
            dir_path = dir_path.replace("\\", "/")
        
        display_path = [display_path_root, *[value for value in open_dir.split("/") if value != ""]]
        print(display_path)
        return render_template(
            "pages/edit.html",
            folder=get_files(dir_path),
            current_path=urllib_parse.quote_plus(open_dir),
            display_path=display_path
        )
        
    #return send_file()
    return render_template(
        "pages/edit.html",
        folder=get_files(current_app.root_path),
        current_path="",
        display_path=["Server"]
    )