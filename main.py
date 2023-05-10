# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the Licenses

from __future__ import print_function

# [START gae_flex_websockets_apps]
from flask import Flask, render_template, request
from flask_sockets import Sockets
from flask_wtf import CSRFProtect, csrf

import json
import numpy as np
import time
import gc
import base64
import io
import matplotlib
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg') # don't show plot

import main_calcALL
import genPosition

class npEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return super(npEncoder, self).default(obj)

app = Flask(__name__)
app.secret_key = b'_53oi3uriq9pifpff;apl'
csrf = CSRFProtect(app)

sockets = Sockets(app)

@sockets.route('/fvm')
#@sockets.route('/fvm', methods=['GET', 'POST'])
def fvm_socket(ws):
    while not ws.closed:

        message = ws.receive() # receive message from form submit
        if message is None:  # message is "None" if the client has closed.
            continue
        res = json.loads(message)
        print(":: req.method =", request.method)
        if request.method == 'POST':
            print(":: in if statement ::")

        print(":: res['flag'] =", res['flag'])
        main_error = np.asfortranarray(np.ones(1000), dtype='float32')

        N = int(res['N'])
        NI = N
        NJ = N
        velNI = 2*NI + 1
        velNJ = 2*NJ + 1

        u = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')
        v = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')
        P_prime = np.asfortranarray(np.zeros((NI,NJ)), dtype='float32')
        P = np.asfortranarray(np.zeros((NI,NJ)), dtype='float32')

        u = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')
        v = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')
        uresid = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')
        vresid = np.asfortranarray(np.zeros((2*NI+1,2*NJ+1)), dtype='float32')
        P_prime = np.asfortranarray(np.zeros((NI,NJ)), dtype='float32')
        P = np.asfortranarray(np.zeros((NI,NJ)), dtype='float32')
        cresid = np.asfortranarray(np.zeros((NI,NJ)), dtype='float32')

        # Should probably keep this for websocket dump
        L = 1
        ro = 983.1747
        dx = L / NI
        dy = L / NJ

        Fu = np.zeros((velNI, velNJ))
        Fv = np.zeros((velNI, velNJ))

        Nmax = 2 # can scale Nmax based on coarseness of mesh
        check = True
        ctr = 0
        iter_prev = 0
        gc.collect()
        #time.sleep(10)
        t1 = time.time()
        for i in range(0,10000):

            # Define fluid properites
            #mu = PropsSI('V','T',float(res['T'])+273.15,'P',101325,'Water')
            #ro = PropsSI('D','T',float(res['T'])+273.15,'P',101325,'Water')
            mu = 1.12e-3
            ro = 100

            # Define flow conditions
            Re = float(res['Re'])
            ubn = float(res['U'])
            print(":: mu:", mu, " :: ro:", ro, ":: Re:", Re, " :: ubn:", ubn)

            main_error = 0
            [u_out,v_out,P_out,P_prime_out,cresid_out,vresid_out,uresid_out,main_error,iter] = main_calcALL.main(N,Nmax,ctr,u,v,P,P_prime,mu,ro,Re,ubn)

            u = np.asfortranarray(u_out, dtype='float32')
            v = np.asfortranarray(v_out, dtype='float32')
            P = np.asfortranarray(P_out, dtype='float32')
            P_prime = np.asfortranarray(P_prime_out, dtype='float32')
            uresid = np.asfortranarray(uresid_out, dtype='float32')
            vresid = np.asfortranarray(vresid_out, dtype='float32')
            cresid = np.asfortranarray(cresid_out, dtype='float32')
            main_error = np.asfortranarray(main_error, dtype='float32')
            main_error_old = main_error[-1]

            #print(":: iter =", iter)
            j = -1
            event = {
                "x": ctr,
                "total": main_error[j],
                "pressure": cresid[j],
                "umom": uresid[j],
                "vmom": vresid[j],
            }
            # Send the message to all clients connected to this webserver
            # process. (To support multiple processes or instances, an
            # extra-instance storage or messaging system would be required.)
            clients = ws.handler.server.clients.values()
            for client in clients:
                print("in for loop ::")
                client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
            print(":: clients =", clients)
            #ws.send(json.dumps(event, cls=npEncoder))

            #for client in clients:
            #    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
            #await websocket.send(json.dumps(event, cls=npEncoder))
            #await asyncio.sleep(((time.time() - t1))*10)
            #await asyncio.sleep(0.05)

            """ for j in (iter - 1):
                print(":: j =", j)
                event = {
                    #"x": ctr*iter_prev+iter[i],
                    "x": ctr,
                    "total": main_error[j],
                    "pressure": cresid[j],
                    "umom": uresid[j],
                    "vmom": vresid[j],
                }
                print("Elapsed =", time.time() - t1)
                await websocket.send(json.dumps(event, cls=npEncoder))
                #await asyncio.sleep(((time.time() - t1))*10)
                await asyncio.sleep(0.1) """
            #if main_error == 0:
            if main_error[iter[-1]-1] < 1e-2:
                #sio.savemat('/Users/stephenhodson/matlab/lidcavity/data3.mat', mdict={'arrU': u})
                #sio.savemat('/Users/stephenhodson/matlab/lidcavity/data3.mat', mdict={'arrV': v})
                #Find mass flow rates

                for ii in range(0, velNI):
                    for jj in range(0, velNJ):
                        Fu[ii, jj] = ro*dy*u[ii, jj]
                        Fv[ii, jj] = ro*dx*v[ii, jj]

                for ii in range(0, NI):
                    m = 2*ii + 1
                    mvn = 2*ii + 2
                    for jj in range(0, NJ - 1):
                        q = 2*jj + 2
                        nvn = 2*jj + 2
                        Feu = Fu[m, q + 2] + np.dot(0.5,(Fv[m + 1,q + 1] - Fv[m - 1,q + 1]))
                        Fwu = Fu[m, q - 2] + np.dot(0.5,(Fv[m - 1,q - 1] - Fv[m + 1,q - 1]))
                        Fnu = np.dot(0.5,(Fv[m + 1, q - 1] + Fv[m + 1, q + 1]))
                        Fsu = np.dot(0.5,(Fv[m - 1, q - 1] + Fv[m - 1, q + 1]))
                        v[mvn, nvn] = Fnu / (np.dot(ro, dx))
                        v[m, nvn] = (Fnu + np.dot(0.5, (Feu - Fwu))) / (np.dot(ro, dx))
                        u[m, q - 1] = Fwu / (np.dot(ro, dy))
                        u[m, q + 1] = Feu / (np.dot(ro, dy))

                for ii in range(0, NI - 1):
                    m = 2*ii + 2
                    mue = 2*ii + 2
                    for jj in range(0, NJ):
                        q = 2*jj + 1
                        nue = 2*jj + 2
                        Fnv = Fv[m + 2, q] + np.dot(0.5, (Fu[m + 1, q + 1] - Fu[m + 1, q - 1]))
                        Fsv = Fv[m - 2, q] + np.dot(0.5, (Fu[m - 1, q - 1] - Fu[m - 1, q + 1]))
                        Fev = np.dot(0.5,(Fu[m + 1,q + 1] + Fu[m - 1,q + 1]))
                        Fwv = np.dot(0.5,(Fu[m + 1,q - 1] + Fu[m - 1,q - 1]))
                        u[mue,nue] = Fev / (np.dot(ro, dy))
                        u[mue,q] = (Fev + np.dot(0.5, (Fnv - Fsv))) / (np.dot(ro, dy))
                        v[m + 1,q] = Fnv / (np.dot(ro, dy))
                        v[m - 1,q] = Fsv / (np.dot(ro, dy))

                event = {'u': u, 'v': v}
                # Send the message to all clients connected to this webserver
                # process. (To support multiple processes or instances, an
                # extra-instance storage or messaging system would be required.)
                for client in clients:
                    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
                #await websocket.send(json.dumps(event, cls=npEncoder))
                #await asyncio.sleep(0.5)
                print("Elapsed (CFD) =", time.time() - t1)

                del(N,Nmax,ctr,u,v,P,P_prime)
                gc.collect()
                check = False
                ws.close()
                break

            ctr = ctr + 1
            print("ctr =", ctr)
            iter_prev = iter[-1]

# [END fvm_websocket]
@sockets.route('/genP')
def genP_socket(ws):
    while not ws.closed:

        clients = ws.handler.server.clients.values()

        message = ws.receive() # receive message
        if message is None:  # message is "None" if the client has closed.
            continue
        res = json.loads(message)

        N = int(res['N'])

        u = np.asfortranarray(res['u'], dtype=np.double)
        v = np.asfortranarray(res['v'], dtype=np.double)
        velN = len(u)

        L = 1
        x_mat, y_mat = np.mgrid[0:L:((2*N+1)*1j), 0:L:((2*N+1)*1j)]

        # pack meshgrid
        xy = np.asfortranarray((x_mat.transpose(), y_mat.transpose()), dtype='float32')

        """ Integrate Velocity Field to Generate Particle Positions """

        # Initialize particles

        #print(":: data =", request.body)
        Np = int(res['Np'])
        print(":: Np =", Np)
        solx0 = np.asfortranarray(np.random.uniform(low=0.01, high=0.99, size=(Np,)), dtype='float32')
        soly0 = np.asfortranarray(np.random.uniform(low=0.01, high=0.99, size=(Np,)), dtype='float32')

        Nint = int(res['Nint'])

        #print(":: solx0 =", solx0, " :: soly0 =", soly0)

        x_out = np.asfortranarray(np.zeros((Np,Nint)), dtype='float32')
        y_out = np.asfortranarray(np.zeros((Np,Nint)), dtype='float32')

        t1 = time.time()
        for j in range(0, Np):
            [x_out[j], y_out[j]] = genPosition.main(N, 1, Nint, u, v, solx0[j], soly0[j])
            event = {'ctr': j}
            #print(":: event ::", event)
            #print(":: x_out[j].shape ::", x_out[j].shape
            ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage

        print(":: Elapsed (integration, s) =", time.time() - t1)
        #print(":: x_out ::", x_out)

        event = {
            'x': x_out,
            'y': y_out
        }

         # Send the message to all clients connected to this webserver
        # process. (To support multiple processes or instances, an
        # extra-instance storage or messaging system would be required.)

        for client in clients:
            client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage

        #ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
        ws.close()

# [END genP_websocket]

@sockets.route('/genS')
def genS_socket(ws):

    clients = ws.handler.server.clients.values()
    #while not ws.closed:
    #print(":: Hi from genS_socket ::")
    t1 = time.time()
    message = ws.receive() # receive message
    #if message is None:  # message is "None" if the client has closed.
    #    continue
    res = json.loads(message)

    event = {
        "confirm": 0,
    }

     # Send the message to all clients connected to this webserver
    # process. (To support multiple processes or instances, an
    # extra-instance storage or messaging system would be required.)
    for client in clients:
        client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
    #ws.send(json.dumps(event, cls=npEncoder))

    N = int(res['N'])

    u = np.asfortranarray(res['u'], dtype=np.double)
    v = np.asfortranarray(res['v'], dtype=np.double)

    L = 1
    x_mat, y_mat = np.mgrid[0:L:((2*N+1)*1j), 0:L:((2*N+1)*1j)]
    #x_mat = np.transpose(x_mat); y_mat=np.transpose(y_mat)

    def velocity_fieldStream():
        vx = u
        vy = v
        return (vx, vy)

    # pack meshgrid
    xy = np.asfortranarray((x_mat.transpose(), y_mat.transpose()), dtype='float32')
    x_dot, y_dot = velocity_fieldStream()

    speed = np.sqrt(x_dot ** 2 + y_dot ** 2)

    # Suppress/hide the warning for divide by 0 in u_n & v_n
    #np.seterr(invalid='ignore')
    u_n = x_dot / speed
    v_n = y_dot / speed

    # unpack x and y
    x, y = xy

    img_buf = io.BytesIO()
    fig = plt.figure()
    ax = plt.subplot(111)
    ax.streamplot(x, y, u_n, v_n,
        density = 3,
        linewidth = 0.6,
        color = speed,
        cmap = 'gist_rainbow',
        broken_streamlines = False,
        integration_direction = 'both',
    )

    #plt.show(block=False)
    #ax.set_xlabel('x'); ax.set_ylabel('y')
    ax.set_xlim((0, L)); ax.set_ylim((0, L))
    ax.set_aspect('equal')
    ax.get_xaxis().set_visible(False); ax.get_yaxis().set_visible(False)
    plt.axis('off')
    plt.savefig(img_buf, format='png', dpi=300, bbox_inches='tight', pad_inches=0, transparent=True)
    #im = Image.open(img_buf)

    # image is binary
    #encoded_string = base64.b64encode(img.read())
    encoded_string = base64.b64encode(img_buf.getvalue())

    #with open('./media/Streamplot.png', 'rb') as image_file:
    #    encoded_string = base64.b64encode(image_file.read())

    # must send decoded string
    decoded_string = encoded_string.decode()
    img_src = "data:image/png;base64,{0}".format(decoded_string)

    event = {
        'img_src': img_src,
    }

     # Send the message to all clients connected to this webserver
    # process. (To support multiple processes or instances, an
    # extra-instance storage or messaging system would be required.)
    clients = ws.handler.server.clients.values()
    for client in clients:
        client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage
    #ws.send(json.dumps(event, cls=npEncoder))
    ws.close()
    #for client in clients:
    #    client.ws.send(json.dumps(event, cls=npEncoder)) # send message back to onmessage

# [END genP_websocket]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/info')
def info():
    return render_template('info.html')


if __name__ == '__main__':
    print("""
This can not be run directly because the Flask development server does not
support web sockets. Instead, use gunicorn:

gunicorn -b 127.0.0.1:8080 -k flask_sockets.worker main:app

""")
