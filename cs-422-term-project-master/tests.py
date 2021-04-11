import json
import unittest
from backend import app, db, User, Property, Thread, Message


class BackendTests(unittest.TestCase):

    # this method is run before each test
    def setUp(self):
        self.client = app.test_client()  # we instantiate a flask test client-
        db.create_all()  # create the database objects
        # add some fixtures to the database
        self.user1 = User(
            username='philip.gelinas@wsu.edu',
            password='super-secret-password',
            firstname='Philip',
            lastname='GeLinas',
            isOwner=False,
            phone='1234567890'
        )
        self.user2 = User(
            username='tom.brady@wsu.edu',
            password='secret',
            firstname='Tom',
            lastname='Brady',
            isOwner=True,
            phone='0987654321'
        )
        self.property1 = Property(
            name='Sunset Hotel',
            address='1234 Pullman Ave',
            description='Nice place to live!',
            price='500',
            rating=4.2
        )
        self.property2 = Property(
            name='Bates Motel',
            address='9876 Cougar Dr',
            description='A filthy place!',
            price='275',
            rating=2.2
        )
        self.thread1 = Thread(
            id=7,
            user1='philip.gelinas@wsu.edu',
            user2='joe.pink@wsu.edu',
            subject='Classmates'
        )
        self.thread2 = Thread(
            id=4,
            user1='josh.allen@wsu.edu',
            user2='cam.newton@wsu.edu',
            subject='Football'
        )
        self.message1 = Message(
            id=5,
            threadId=7,
            content='Whats up!',
            sender='Joe',
            receiver='Philip'
        )
        self.message2 = Message(
            id=8,
            threadId=4,
            content='Hey dude!',
            sender='Cam',
            receiver='Josh'
        )
        db.session.add(self.user1)
        db.session.add(self.user2)
        db.session.add(self.property1)
        db.session.add(self.property2)
        db.session.add(self.thread1)
        db.session.add(self.thread2)
        db.session.add(self.message1)
        db.session.add(self.message2)
        db.session.commit()

    def test_getAllProperties(self):
        response = self.client.get('/api/properties', )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['status'], 1, "Unexpected result")
        self.assertEqual(data['properties'][0]['address'], '1234 Pullman Ave', "Unexpected address")
        self.assertEqual(data['properties'][1]['price'], '275', "Unexpected price")
        self.assertEqual(data['properties'][0]['name'], 'Sunset Hotel', "Unexpected name")
        self.assertEqual(data['properties'][1]['description'], 'A filthy place!', "Unexpected description")
        self.assertEqual(data['properties'][0]['rating'], 4.2, "Unexpected rating")

    def test_getThread(self):
        response1 = self.client.get('/messages/thread?threadId=7', )
        self.assertEqual(response1.status_code, 200)
        data1 = json.loads(response1.data.decode('utf-8'))
        self.assertEqual(data1['status'], 1, "Unexpected result")
        self.assertEqual(data1['messages'][0]['content'], 'Whats up!', "Unexpected content")
        self.assertEqual(data1['messages'][0]['sender'], 'Joe', "Unexpected sender")
        self.assertEqual(data1['messages'][0]['receiver'], 'Philip', "Unexpected receiver")

        response2 = self.client.get('/messages/thread?threadId=4', )
        self.assertEqual(response2.status_code, 200)
        data2 = json.loads(response2.data.decode('utf-8'))
        self.assertEqual(data2['status'], 1, "Unexpected result")
        self.assertEqual(data2['messages'][0]['content'], 'Hey dude!', "Unexpected content")
        self.assertEqual(data2['messages'][0]['sender'], 'Cam', "Unexpected sender")
        self.assertEqual(data2['messages'][0]['receiver'], 'Josh', "Unexpected receiver")

    def test_getMessage(self):
        response1 = self.client.get('/messages/message?messageId=5', )
        self.assertEqual(response1.status_code, 200)
        data1 = json.loads(response1.data.decode('utf-8'))
        self.assertEqual(data1['status'], 1, "Unexpected result")
        self.assertEqual(data1['message']['content'], 'Whats up!', "Unexpected content")
        self.assertEqual(data1['message']['sender'], 'Joe', "Unexpected sender")
        self.assertEqual(data1['message']['receiver'], 'Philip', "Unexpected receiver")
        response2 = self.client.get('/messages/message?messageId=8', )
        self.assertEqual(response2.status_code, 200)
        data2 = json.loads(response2.data.decode('utf-8'))
        self.assertEqual(data2['status'], 1, "Unexpected result")
        self.assertEqual(data2['message']['content'], 'Hey dude!', "Unexpected content")
        self.assertEqual(data2['message']['sender'], 'Cam', "Unexpected sender")
        self.assertEqual(data2['message']['receiver'], 'Josh', "Unexpected receiver")

    def test_getUserThreads(self):
        response1 = self.client.get('/messages/user_threads?username=philip.gelinas@wsu.edu', )
        self.assertEqual(response1.status_code, 200)
        data1 = json.loads(response1.data.decode('utf-8'))
        self.assertEqual(data1['status'], 1, "Unexpected result")
        self.assertEqual(data1['threads'][0]['id'], 7, "Unexpected result")
        response2 = self.client.get('/messages/user_threads?username=josh.allen@wsu.edu', )
        self.assertEqual(response2.status_code, 200)
        data2 = json.loads(response2.data.decode('utf-8'))
        self.assertEqual(data2['status'], 1, "Unexpected result")
        self.assertEqual(data2['threads'][0]['id'], 4, "Unexpected result")

    # Tested using Robust BVA
    def test_createProperty(self):
        response = self.client.post('/api/new_property?id=21&name=property1&address=1234&description=home&price=500&rating=2.5', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['property']['name'], 'property1', "Unexpected result")
        response = self.client.post('/api/new_property?id=22&name=property2&address=1234&description=home&price=1&rating=2.5', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['property']['name'], 'property2', "Unexpected result")
        response = self.client.post('/api/new_property?id=23&name=property3&address=1234&description=home&price=0&rating=2.5', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['property']['name'], 'property3', "Unexpected result")
        response = self.client.post('/api/new_property?id=24&name=property4&address=1234&description=home&price=500&rating=1.1', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['property']['name'], 'property4', "Unexpected result")
        response = self.client.post('/api/new_property?id=25&name=property5&address=1234&description=home&price=500&rating=1.0', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['property']['name'], 'property5', "Unexpected result")
        response = self.client.post('/api/new_property?id=26&name=property6&address=1234&description=home&price=500&rating=4.9', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['property']['name'], 'property6', "Unexpected result")
        response = self.client.post('/api/new_property?id=27&name=property7&address=1234&description=home&price=500&rating=5.0', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['property']['name'], 'property7', "Unexpected result")
        response = self.client.post('/api/new_property?id=28&name=property8&address=1234&description=home&price=500&rating=5.1', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['error'], 'Rating must be less than or equal to 5.', "Unexpected result")
        response = self.client.post('/api/new_property?id=29&name=property9&address=1234&description=home&price=500&rating=0.9', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['error'], 'Rating must be greater than or equal to 1.', "Unexpected result")
        response = self.client.post('/api/new_property?id=30&name=property10&address=1234&description=home&price=-500&rating=2.5', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['error'], 'Price cannot be negative.', "Unexpected result")

    def test_login(self):
        response1 = self.client.get('/api/login?username=philip.gelinas@wsu.edu&password=incorrect-password', )
        self.assertEqual(response1.status_code, 200)
        data1 = json.loads(response1.data.decode('utf-8'))
        self.assertEqual(data1['error'], 'Password is incorrect.', "Unexpected result")
        response2 = self.client.get('/api/login?username=tom.brady@wsu.edu&password=bad-password', )
        self.assertEqual(response2.status_code, 200)
        data2 = json.loads(response2.data.decode('utf-8'))
        self.assertEqual(data2['error'], 'Password is incorrect.', "Unexpected result")

    # Tested using Robust BVA
    def test_createAccount(self):
        response = self.client.post('/api/create_account?username=philip.1@wsu.edu&password=pass1&firstname=Philip&lastname=GeLinas&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['firstname'], 'Philip', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.2@wsu.edu&password=pass2&firstname=Ph&lastname=GeLinas&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['firstname'], 'Ph', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.3@wsu.edu&password=pass3&firstname=P&lastname=GeLinas&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['firstname'], 'P', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.4@wsu.edu&password=pass4&firstname=Philipabcdefghijklm&lastname=GeLinas&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['firstname'], 'Philipabcdefghijklm', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.5@wsu.edu&password=pass5&firstname=Philipabcdefghijklmn&lastname=GeLinas&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['firstname'], 'Philipabcdefghijklmn', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.6@wsu.edu&password=pass6&firstname=Philip&lastname=Ge&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['lastname'], 'Ge', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.7@wsu.edu&password=pass7&firstname=Philip&lastname=G&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['lastname'], 'G', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.8@wsu.edu&password=pass8&firstname=Philip&lastname=GeLinasabcdefghijkl&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['lastname'], 'GeLinasabcdefghijkl', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.9@wsu.edu&password=pass9&firstname=Philip&lastname=GeLinasabcdefghijklm&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['account']['lastname'], 'GeLinasabcdefghijklm', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.10@wsu.edu&password=pass10&firstname=&lastname=GeLinas&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['error'], 'First name is too short.', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.11@wsu.edu&password=pass11&firstname=Philipabcdefghijklmnop&lastname=GeLinas&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['error'], 'First name is too long.', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.12@wsu.edu&password=pass12&firstname=Philip&lastname=&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['error'], 'Last name is too short.', "Unexpected result")
        response = self.client.post('/api/create_account?username=philip.13@wsu.edu&password=pass13&firstname=Philip&lastname=GeLinasabcdefghijklmnop&phone=1236547890', )
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data['error'], 'Last name is too long.', "Unexpected result")

    def test_getUser(self):
        response1 = self.client.get('/api/user?username=philip.gelinas@wsu.edu', )
        self.assertEqual(response1.status_code, 200)
        data1 = json.loads(response1.data.decode('utf-8'))
        self.assertEqual(data1['status'], 1, "Unexpected result")
        self.assertEqual(data1['user']['phone'], '1234567890', "Unexpected phone")
        self.assertEqual(data1['user']['password'], 'super-secret-password', "Unexpected password")
        self.assertEqual(data1['user']['firstname'], 'Philip', "Unexpected firstname")
        self.assertEqual(data1['user']['lastname'], 'GeLinas', "Unexpected lastname")
        self.assertEqual(data1['user']['isOwner'], False, "Unexpected isOwner")
        response2 = self.client.get('/api/user?username=tom.brady@wsu.edu', )
        self.assertEqual(response2.status_code, 200)
        data2 = json.loads(response2.data.decode('utf-8'))
        self.assertEqual(data2['status'], 1, "Unexpected result")
        self.assertEqual(data2['user']['phone'], '0987654321', "Unexpected result")
        self.assertEqual(data2['user']['password'], 'secret', "Unexpected password")
        self.assertEqual(data2['user']['firstname'], 'Tom', "Unexpected firstname")
        self.assertEqual(data2['user']['lastname'], 'Brady', "Unexpected lastname")
        self.assertEqual(data2['user']['isOwner'], True, "Unexpected isOwner")

    # this method is run after each test
    def tearDown(self):
        db.session.remove()
        db.drop_all()


if __name__ == '__main__':
    unittest.main()
