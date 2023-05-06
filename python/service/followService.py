from pydantic import BaseModel
from errors import internalServerError
import logging as logger
from db.main import Database
from datetime import datetime
from typing import Optional, Tuple
from errors import internalServerError, main as Errors

class followUser(BaseModel):
    usr_follower: str
    usr_follows: Optional[str] = None

class followArtist(BaseModel):
    usr_follower: str
    artist_followed: Optional[str] = None

class FollowService():

    def __init__(self, db: Database):
        self.Database = db

    #get all following users
    def getAllFollowingUsers(self, querydata: str) -> Tuple[list[str], list[str]]:
        db = self.Database
        try:
            requests = db.query(f"SELECT follows, follower FROM follows WHERE follows = %s OR follower = %s", [querydata, querydata])
            # return a list of follows and a list of follower
            follows = []
            followers = []
            for r in requests['result']:
                if r['follows'] == querydata:
                    followers.append(r['follower'])
                elif r['follower'] == querydata:
                    follows.append(r['follows'])

            return follows, followers

        except Exception as e:
            logger.error("Unable to get all following lists")
            logger.error(e)
            raise internalServerError.InternalServerError()

    #insert new following relationship  
    def insertFollowingUser(self, querydata:followUser):
        db = self.Database
        try:
            current_datetime = datetime.now()
            if db.query(
                ("SELECT * FROM follows WHERE follower = %s AND follows = %s"), [querydata.usr_follower, querydata.usr_follows]) ['result']:
                logger.error("Duplicate following")
                raise Errors.alreadyFollowed
            db.query(
                ("INSERT INTO `follows` (`follower`, `follows`, `createdAt`) VALUES (%s, %s, %s)"), [querydata.usr_follower, querydata.usr_follows, current_datetime]
            )
            
        except  Exception as e:
            logger.error("Unable to follow user")
            logger.error(e)
            raise internalServerError.InternalServerError()
        
    #get all artist that usr_follower is a fan of
    def getFollowingArtist(self, querydata: str) -> list[str]:
        db = self.Database
        try:
            requests = db.query(
                ("SELECT fname, lname FROM userFanOfArtist NATURAL JOIN artist WHERE username = %s"), [querydata])
            return [f"{r['fname']} {r['lname']}" for r in requests['result']]
        
        except Exception as e:
            logger.error("Unable to get all friend requests")
            logger.error(e)
            raise internalServerError.InternalServerError()
        
    # insert new userFanOfArtist  
    def insertFollowingArtist(self, querydata: followArtist):
        db = self.Database
        try:
            if querydata.artist_followed is None:
                raise ValueError("Artist name cannot be None")
        # retrieve the artistID from the artist table based on the artist name
            artist = db.query("""
            SELECT artistID
            FROM artist
            WHERE CONCAT(fname, ' ', lname) = %s
            """, [querydata.artist_followed])
            if 'result' in artist and len(artist['result']) > 0:
                artistID = artist['result'][0]['artistID']
            else:
                raise ValueError("Invalid artist name")

            # insert a new record into the userFanOfArtist table
            db.query("INSERT INTO userFanOfArtist (username, artistID) VALUES (%s, %s)",
                    [querydata.usr_follower, artistID])

        except Exception as e:
            logger.error("Unable to follow artist")
            logger.error(e)
            raise internalServerError.InternalServerError()
