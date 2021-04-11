
from http.server import HTTPServer, CGIHTTPRequestHandler
import webbrowser
import os
import sys

web_dir = os.path.join(os.path.dirname(__file__),"")
os.chdir(web_dir)

port = 7777
host = "localhost"




httpd = HTTPServer((host, port), CGIHTTPRequestHandler)
print("server started, to quit press <ctrl-c>")
webbrowser.open_new_tab(f"http://{host}:{port}/prototype")
httpd.serve_forever()

'''
apple script
do shell script "/Library/Frameworks/Python.framework/Versions/3.7/bin/python3 /users/graziano/Dropbox/Università/Aware/_server.py"
'''