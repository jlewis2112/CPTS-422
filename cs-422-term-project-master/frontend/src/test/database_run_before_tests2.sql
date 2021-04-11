truncate table apply CASCADE;

INSERT INTO "public"."apply"("firstname","lastname","primaryphone","email","password","confirmpassword")
VALUES
(E'z',E'dang',E'5554443333',E'zdang@wsu.edu',E'failtime',E'failtime');