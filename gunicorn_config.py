bind = '0.0.0.0:8080'
workers = 2  # You can adjust the number of workers as needed
worker_class = 'geventwebsocket.gunicorn.workers.GeventWebSocketWorker'
