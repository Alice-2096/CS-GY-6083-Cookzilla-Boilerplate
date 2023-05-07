from pydantic import BaseModel
from errors import internalServerError
import logging as logger
from db.main import Database
from datetime import datetime
from typing import Optional


class InsertSongReview(BaseModel):
    username: str
    songID: Optional[str] = None
    songTitle: Optional[str] = None
    reviewText: str


class InsertSongRating(BaseModel):
    username: str
    songID: Optional[str] = None
    songTitle: Optional[str] = None
    rating: int


class AccountService():

    def __init__(self, db: Database):
        self.Database = db

    # insert a new song review based on songID
    def insertSongReview(self, review: InsertSongReview):
        db = self.Database
        try:
            current_date = datetime.now()
            insertResult = db.query(
                ("INSERT into reviewSong values(%s, %s, %s, %s)"),
                [review.username, review.songID, review.reviewText, current_date]
            )
            return {
                "reviewID": insertResult['insertId'],
                **review.dict()
            }
        except Exception as e:
            logger.error("Unable to insert song review/rating")
            logger.error(e)
            raise internalServerError.InternalServerError()

    # insert a new song rating based on songID
    def insertSongRating(self, review: InsertSongRating):
        db = self.Database
        try:
            current_date = datetime.now().strftime('%Y-%m-%d')
            insertResult = db.query(
                ("INSERT into rateSong values(%s, %s, %s, %s)"),
                [review.username, review.songID, review.rating, current_date]
            )
            return {
                "reviewID": insertResult['insertId'],
                **review.dict()
            }
        except Exception as e:
            logger.error("Unable to insert song review/rating")
            logger.error(e)
            raise internalServerError.InternalServerError()

    # get all past song reviews for a user
    def getSongReviews(self, username: str):
        db = self.Database
        try:
            result = db.query(
                "SELECT reviewText, title FROM reviewSong NATURAL JOIN song WHERE username = %s", [username])
            return result['result']
        except Exception as e:
            logger.error("Unable to get song reviews")
            logger.error(e)
            raise internalServerError.InternalServerError()

    # get all past song ratings for a user
    def getSongRatings(self, username: str):
        db = self.Database
        try:
            result = db.query(
                "SELECT stars, title FROM rateSong NATURAL JOIN song WHERE username = %s", [username])
            return result['result']
        except Exception as e:
            logger.error("Unable to get song ratings")
            logger.error(e)
            raise internalServerError.InternalServerError()
