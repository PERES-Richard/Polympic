from locust import TaskSet, task, between
from locust.contrib.fasthttp import FastHttpLocust
import uuid
import random

class MyTaskSet(TaskSet):

    route = "/user"

    @task
    def index(self):

        r2 = random.random()

        if bool(random.getrandbits(1)):
            r2 = r2 *-1

        lat = 43.6145
        long = 7.0812 + r2 

        response = self.client.post(self.route, {"uuid": str(random.randrange(100000)), "latitude": lat, "longitude": long})

class MyLocust(FastHttpLocust):
    task_set = MyTaskSet
    wait_time = between(1, 2)
