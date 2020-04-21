from locust import TaskSet, task, between, HttpLocust
import uuid
import random
import json

class MyTaskSet(TaskSet):

    random.seed(1)
    users = []
    for i in range(random.randrange(300)):
        users.append({"uuid": str(uuid.uuid4()), "latitude": 4, "longitude": 4})

    route = "/service_api/set_users"

    @task
    def index(self):
        usersSample = random.choices(self.users, k=random.randrange(len(self.users)))
        req = []
        for user in usersSample:
            if random.random() <= 0.7:
                user["latitude"] = random.uniform(1,10)
                user["longitude"] = random.uniform(1,10)
            req.append(user)

        self.client.post(self.route,json={"service":"Locust", "users": req})

class MyLocust(HttpLocust):
    task_set = MyTaskSet
    wait_time = between(5, 10)
