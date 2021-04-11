truncate table message CASCADE;
truncate table property CASCADE;
truncate table thread CASCADE;
truncate table "user" CASCADE;

INSERT INTO "public"."user"("username","password","firstname","lastname","isOwner","phone")
VALUES
(E'bstudent@wsu.edu',E'help',E'Bad',E'Student',TRUE,E'null'),
(E'zdang@wsu.edu',E'failtime',E'Zhe',E'Dang',TRUE,E'null');

INSERT INTO "public"."thread"("id","user1","user2","subject")
VALUES
(1,E'zdang@wsu.edu',E'bstudent@wsu.edu',E'CS350 WARNING — PREPARE TO FAIL');

INSERT INTO "public"."message"("id","threadId","content","sender","receiver")
VALUES
(1,1,E'prepare to FAIL you students! this class is very hard',E'zdang@wsu.edu',E'bstudent@wsu.edu'),
(2,1,E'plzzz let me pass plzzzz!!!!',E'bstudent@wsu.edu',E'zdang@wsu.edu'),
(3,1,E'no! if you don\'t know these algorithms you will never use then what is the point?',E'zdang@wsu.edu',E'bstudent@wsu.edu'),
(4,1,E'nooooooooooooooooooo',E'bstudent@wsu.edu',E'zdang@wsu.edu');

INSERT INTO "public"."property"("id","name","address","description","price","rating")
VALUES
(32,E'Best Property',E'123 Best Property LN',E'Hippity hoppity get off my property!',E'4250000',5);

