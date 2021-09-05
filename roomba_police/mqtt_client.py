from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
import datetime
import time as t
import json

# Define ENDPOINT, CLIENT_ID, PATH_TO_CERT, PATH_TO_KEY, PATH_TO_ROOT, MESSAGE, TOPIC, and RANGE
ENDPOINT = "XXXXX-ats.iot.ap-northeast-1.amazonaws.com"
CLIENT_ID = "roomba"
PATH_TO_CERT = "certificates/XXXXX-certificate.pem.crt"
PATH_TO_KEY = "certificates/XXXXX-private.pem.key"
PATH_TO_ROOT = "certificates/root.pem"
TOPIC = "test/roomba"
RANGE = 20

# Spin up resources
event_loop_group = io.EventLoopGroup(1)
host_resolver = io.DefaultHostResolver(event_loop_group)
client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
mqtt_connection = mqtt_connection_builder.mtls_from_path(
            endpoint=ENDPOINT,
            cert_filepath=PATH_TO_CERT,
            pri_key_filepath=PATH_TO_KEY,
            client_bootstrap=client_bootstrap,
            ca_filepath=PATH_TO_ROOT,
            client_id=CLIENT_ID,
            clean_session=False,
            keep_alive_secs=6
            )
print("Connecting to {} with client ID '{}'...".format(
        ENDPOINT, CLIENT_ID))
# Make the connect() call
connect_future = mqtt_connection.connect()
# Future.result() waits until a result is available
connect_future.result()
print("Connected!")

while True:
    # Get the location ID from the standard input
    id = input()

    # Create send data
    dt_now = datetime.datetime.now()
    data = {
        'date': dt_now.strftime('%Y-%m-%d'),
        'time': dt_now.strftime('%H:%M:%S.%f'),
        'location': id
    }

    # Send a MQTT request
    mqtt_connection.publish(topic=TOPIC, payload=json.dumps(data), qos=mqtt.QoS.AT_LEAST_ONCE)
    print("Published: '" + json.dumps(data) + "' to the topic: " + TOPIC)
    t.sleep(0.1)

disconnect_future = mqtt_connection.disconnect()
disconnect_future.result()
