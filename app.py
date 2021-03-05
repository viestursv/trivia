import time
import board
import busio
import digitalio
from adafruit_mcp230xx.mcp23017 import MCP23017
from flask import Flask, render_template, request, jsonify

import random, threading, webbrowser


url = "http://127.0.0.1:5000/"



app = Flask(__name__)

# chrome_options.add_argument("--start-fullscreen");
# threading.Timer(1.25, lambda: webbrowser.open(url) ).start()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/views_de', methods=['GET','POST'])
def view_de():
    #parse view string to html filename
    response = request.data
    response = response.decode("utf-8")
    response = response.replace('"', '')
    response = response + ".html"
    
    return render_template('DE/' + response)

@app.route('/views_en', methods=['GET','POST'])
def view_en():
    #parse view string to html filename
    response = request.data
    response = response.decode("utf-8")
    response = response.replace('"', '')
    response = response + ".html"
    
    return render_template('EN/' + response)

@app.route('/ajax', methods=['GET', 'POST'])
def ajax():
    response = request.data
    response = response.decode("utf-8")

    response = int(response)
#     response = str(type(response))
    response = response - 1
    
    message = ""
    
    i2c = busio.I2C(board.SCL, board.SDA)

    #choose GPIO expander
    if response >= 0 and response < 16:
      mcp = MCP23017(i2c, address=0x20)
      #assign pin
      pin = mcp.get_pin(response)
      message = "first unit"
    elif response >= 16 and response < 32:
      #adjust number for real GPIO pins
      response = response - 16
      mcp = MCP23017(i2c, address=0x21)
      pin = mcp.get_pin(response)
      message = "second unit"
    elif response >= 32:
      response = response - 32
      mcp = MCP23017(i2c, address=0x22)
      pin = mcp.get_pin(response)
      message = "third unit"


    pin.switch_to_output(value=True)
    time.sleep(5)
    pin.switch_to_output(value=False)
    
#     text = jsonify(text)
    
    #return jsonify(message)


if __name__ == '__main__':
    app.run(debug=True)