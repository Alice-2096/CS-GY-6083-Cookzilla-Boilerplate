from pydantic import BaseModel
import bcrypt
from db.main import Database
import jwt
import os
import logging as logger
import datetime
from errors import duplicateUser, internalServerError, userNotFound, incorrectPassword, main as Errors, invalidToken


class UserRegistration(BaseModel):
    userName: str
    password: str
    firstName: str
    lastName: str
    nickname: str


class LoginForm(BaseModel):
    userName: str
    password: str


class AuthService():

    def __init__(self, db: Database):
        self.Database = db

    def generateToken(self, userName: str):
        expiryTime = datetime.datetime.now(
            tz=datetime.timezone.utc) + datetime.timedelta(days=2)
        return jwt.encode({"sub": userName, "iss": "cookzilla", "aud": "cookzilla", "exp": expiryTime}, os.environ['JWT_SECRET'],)

    def registerUser(self, user: UserRegistration):
        db = self.Database
        try:
            passwordBytes = user.password.encode('utf-8')
            hashedPassword = bcrypt.hashpw(passwordBytes, bcrypt.gensalt())
            _ = db.query(("INSERT into " + db.PersonTable + " (username, pwd, fname, lname, nickname) values (%s,%s,%s,%s,%s)"), [
                user.userName, hashedPassword, user.firstName, user.lastName, user.nickname
            ])
            return {
                **user.dict(exclude={'password'}),
                "token": self.generateToken(user.userName)
            }
        except Exception as e:
            logger.error(e)
            if e.errno == 1062:
                raise duplicateUser.DuplicateUser()
            raise internalServerError.InternalServerError()

    def login(self, loginData: LoginForm):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT username, pwd, lastlogin FROM user where username = %s"), [loginData.userName])
            if len(queryResult['result']) != 1:
                raise userNotFound.UserNotFound()
            user = queryResult['result'][0]
            print(user)

            # update lastlogin time
            db.query(
                ("UPDATE user SET lastlogin = %s WHERE username = %s"), [datetime.datetime.now(), loginData.userName])

            # check if pwd matches
            passwordBytes = loginData.password.encode('utf-8')
            hashedPWInBytes = user['pwd'].encode('utf-8')
            passwordMatches = bcrypt.checkpw(passwordBytes, hashedPWInBytes)
            if (not passwordMatches):
                raise incorrectPassword.IncorrectPassword
            return {
                **user,
                'pwd': None,
                "token": self.generateToken(loginData.userName)
            }
        except Exception as e:
            logger.error(e)
            if isinstance(e, Errors.ExtendableError):
                raise e
            raise internalServerError.InternalServerError()

    def getUserFromToken(self, token):
        try:
            verifiedData = jwt.decode(jwt=token, key=os.environ['JWT_SECRET'], algorithms=[
                                      "HS256"], audience="cookzilla", issuer="cookzilla")
            user = self.getUser(verifiedData['sub'])
            return user
        except Exception as e:
            if isinstance(e, Errors.ExtendableError):
                raise e
            logger.error("Invalid Token")
            logger.error(e)

            raise invalidToken.InvalidJwtError()

    def getUser(self, userName):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT username, fname, lname, nickname FROM user where username= % s"),
                [userName]
            )
            if (len(queryResult['result']) != 1):
                raise userNotFound.UserNotFound()

            user = queryResult['result'][0]
            return user
        except Exception as e:
            logger.error("unable to find user")
            logger.error(e)
            raise userNotFound.UserNotFound()
