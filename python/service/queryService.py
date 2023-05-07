from typing import Optional
from pydantic import BaseModel
from db.main import Database
from errors import internalServerError
import datetime


class Query(BaseModel):
    fname: Optional[str] = ''
    lname: Optional[str] = ''
    genre: Optional[str] = ''
    rating: Optional[str] = 0


class QueryService():
    def __init__(self, db: Database):
        self.Database = db

    # query for songs
    def generalQuery(self, userQuery: Query):
        db = self.Database
        query = '''
            SELECT title, songID, fname, lname, albumTitle, songURL
            FROM (song NATURAL JOIN artistPerformsSong NATURAL JOIN artist NATURAL JOIN songInAlbum NATURAL JOIN album)
            WHERE songID IN
            (SELECT DISTINCT songID
            FROM song NATURAL LEFT OUTER JOIN rateSong NATURAL JOIN songGenre NATURAL JOIN artist NATURAL JOIN artistPerformsSong
            WHERE (genre = %s OR %s = '')
            AND(
            (fname = %s AND lname = %s)
            OR(fname = %s AND %s='')
            OR(lname = %s AND %s='')
            OR (%s = '' AND %s = '')
            )
            GROUP BY song.songID
            {having_clause})
        '''
        having_clause = ""
        s = userQuery.rating
        if s is not None and s != '':
            having_clause = "HAVING AVG(rateSong.stars) >= %s"

        query = query.format(having_clause=having_clause)

        try:
            if (s is None or s == ''):
                queryResult = db.query(
                    query, [userQuery.genre, userQuery.genre, userQuery.fname, userQuery.lname, userQuery.fname, userQuery.lname, userQuery.lname, userQuery.fname, userQuery.fname, userQuery.lname])
            else:
                queryResult = db.query(
                    query, [userQuery.genre, userQuery.genre, userQuery.fname, userQuery.lname, userQuery.fname, userQuery.lname, userQuery.lname, userQuery.fname, userQuery.fname, userQuery.lname, userQuery.rating])
            return {'songs': queryResult['result']}
        except Exception as e:
            raise internalServerError.InternalServerError()

    # query for songs of the week
    def songOfWeek(self):
        db = self.Database
        query = '''
            SELECT DISTINCT title, fname, lname, songURL
            FROM song NATURAL JOIN artist NATURAL JOIN artistPerformsSong
            WHERE songID IN
            (SELECT DISTINCT songID
            FROM rateSong
            GROUP BY songID
            HAVING AVG(stars) >= 3)
            ORDER BY RAND() LIMIT 7;
        '''
        try:
            queryResult = db.query(
                query)
            return {'songs': queryResult['result']}
        except Exception as e:
            print(e)
            raise internalServerError.InternalServerError()

    # return new items of interest, takes in username as query parameter
    def newItems(self, username):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT username, title as reviewedItem, reviewText, reviewDate FROM user NATURAL JOIN reviewSong NATURAL JOIN song WHERE (username IN (SELECT user1 from friend WHERE user2 = %s AND acceptStatus = 'Accepted') OR username IN (SELECT user2 FROM friend WHERE user1 = %s AND acceptStatus ='Accepted') OR username IN (SELECT follows FROM follows WHERE follower = %s)) AND reviewText IS NOT NULL UNION SELECT username, albumID as reviewedItem, reviewText, reviewDate FROM user NATURAL JOIN reviewAlbum WHERE (username IN (SELECT user1 from friend WHERE user2 =%s AND acceptStatus = 'Accepted') OR username IN (SELECT user2 FROM friend WHERE user1 = %s AND acceptStatus ='Accepted') OR username IN (SELECT follows FROM follows WHERE follower = %s)) AND reviewText IS NOT NULL"), [username, username, username, username, username, username])
            print(queryResult)
            return {'reviews': queryResult['result']}
        except Exception as e:
            print(e)
            raise internalServerError.InternalServerError()

    # return new songs by artists the user is a fan of
    def newSongs(self, username):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT title, fname, lname, songURL FROM song NATURAL JOIN userFanOfArtist NATURAL JOIN artistPerformsSong NATURAL JOIN artist WHERE username = %s ORDER BY releaseDate DESC LIMIT 10;"), [username])
            return queryResult['result']
        except Exception as e:
            print(e)
            raise internalServerError.InternalServerError()

    # returns songs by artist the user is a fan of and are released after user's last login
    def newSongsAfterLogin(self, username, lastlogin):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT title, fname, lname, songURL, releaseDate FROM song NATURAL JOIN userFanOfArtist NATURAL JOIN artistPerformsSong NATURAL JOIN artist WHERE username = %s AND releaseDate > %s;"), [username, lastlogin])
            return queryResult['result']
        except Exception as e:
            print(e)
            raise internalServerError.InternalServerError()

    # return reviews of songs given songID
    def songReviews(self, songID):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT username, reviewText, reviewDate FROM reviewSong WHERE songID = %s"), [songID])
            return queryResult['result']
        except Exception as e:
            print(e)
            raise internalServerError.InternalServerError()

    # return song rating given songID
    def songRating(self, songID):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT AVG(stars) as rating FROM rateSong WHERE songID = %s"), [songID])
            return queryResult['result']
        except Exception as e:
            print(e)
            raise internalServerError.InternalServerError()

    # return a list of songs given song title
    def searchSongs(self, songtitle):
        db = self.Database
        try:
            queryResult = db.query(
                ("SELECT title, fname, lname, songID FROM song NATURAL JOIN artistPerformsSong NATURAL JOIN artist WHERE title = %s"), [songtitle])
            return queryResult['result']
        except Exception as e:
            print(e)
            raise internalServerError.InternalServerError()
