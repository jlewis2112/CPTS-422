export let userMocks = [
  {
    "firstname": "Zhe",
    "isOwner": true,
    "lastname": "Dang",
    "password": "failtime",
    "phone": null,
    "username": "zdang@wsu.edu"
  },
  {
    "firstname": "Bad",
    "isOwner": true,
    "lastname": "Student",
    "password": "help",
    "phone": null,
    "username": "bstudent@wsu.edu"
  }
];

export let threadMocks = [
  {
    "id": 1,
    "sender": "zdang@wsu.edu",
    "receiver": "bstudent@wsu.edu",
    "subject": "CS350 WARNING — PREPARE TO FAIL"
  }
]

export let applyMocks = [
  {
      "email" : "zdang@wsu.edu",
      "lastname" : "dang",
      "password" : "failtime",
      "confirmpassword" : "failtime",
      "primaryphone" : "5554443333",
      "firstname" : "z"
  }
]

export let messageMocks = [
  {
    id: 1,
    threadId: 1,
    content: 'prepare to FAIL you students! this class is very hard',
    sender: 'zdang@wsu.edu',
    receiver: 'bstudent@wsu.edu'
  },
  {
    id: 2,
    threadId: 1,
    content: 'plzzz let me pass plzzzz!!!!',
    receiver: 'zdang@wsu.edu',
    sender: 'bstudent@wsu.edu'
  },
  {
    id: 3,
    threadId: 1,
    content: 'no! if you don\'t know these algorithms you will never use then what is the point?',
    sender: 'zdang@wsu.edu',
    receiver: 'bstudent@wsu.edu'
  },
  {
    id: 4,
    threadId: 1,
    content: 'nooooooooooooooooooo',
    receiver: 'zdang@wsu.edu',
    sender: 'bstudent@wsu.edu'
  },
]

