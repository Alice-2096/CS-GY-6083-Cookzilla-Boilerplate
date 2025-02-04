from fastapi import FastAPI, Request, Query
import uvicorn
import os
from fastapi.responses import JSONResponse
from db.main import Database
from dotenv import load_dotenv
import service.authService as authService
import service.accountService as accountService
import service.queryService as queryService
import service.friendReqService as friendReqService
import service.followService as followService
import service.playlistService as playlistService
from errors.main import ExtendableError
from errors.internalServerError import InternalServerError
from errors.invalidToken import InvalidJwtError
from errors.userNotFound import UserNotFound
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

db = Database()

AuthService = authService.AuthService(db)
AccountService = accountService.AccountService(db)
QueryService = queryService.QueryService(db)
FriendReqService = friendReqService.FriendReqService(db)
PlaylistService = playlistService.PlaylistService(db)
FollowService = followService.FollowService(db)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# authentication routes


@app.post("/signup")
async def signupHandler(registrationData: authService.UserRegistration):
    try:
        user = AuthService.registerUser(registrationData)
        return user
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/login")
async def loginHandler(loginData: authService.LoginForm):
    try:
        user = AuthService.login(loginData)
        return user
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e

# query songs, albums,etc


@app.post("/querysongs")
async def songQueryHandler(queryData: queryService.Query):
    try:
        results = QueryService.generalQuery(queryData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/songsOfWeek")
async def songQueryHandler():
    try:
        results = QueryService.songOfWeek()
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/newitems")
async def newItemsHandler(username: str = Query(...)):
    try:
        results = QueryService.newItems(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/newsongs")
async def newItemsHandler(username: str = Query(...)):
    try:
        results = QueryService.newSongs(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e

# get new songs by fav artist released after last login


@app.get("/newsongsafterlogin")
async def newItemsHandler(username: str = Query(...), lastlogin: str = Query(...)):
    try:
        results = QueryService.newSongsAfterLogin(username, lastlogin)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


# search for songs by title
@app.get("/searchsongs")
async def searchSongsHandler(songtitle: str = Query(...)):
    try:
        results = QueryService.searchSongs(songtitle)
        print(results)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e

# reviews and ratings routes


@app.get("/getreviews")
async def getReviews(songID: str = Query(...)):
    try:
        results = QueryService.songReviews(songID)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/getratings")
async def getRatings(songID: str = Query(...)):
    try:
        results = QueryService.songRating(songID)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/pastreviews")
async def getPastReviews(username: str = Query(...)):
    try:
        results = AccountService.getSongReviews(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get('/pastratings')
async def getPastRatings(username: str = Query(...)):
    try:
        results = AccountService.getSongRatings(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/reviewsong")  # post a new song review based on songID
async def postSongReview(request: Request, songToAdd: accountService.InsertSongReview):
    try:
        # reads the request body and returns a dictionary with the parsed JSON data
        data = await request.json()
        songToAdd.username = data["username"]
        songToAdd.songID = data["songID"]
        songToAdd.reviewText = data["reviewText"]
        print(songToAdd)
        postedSong = AccountService.insertSongReview(songToAdd)
        return postedSong
    except Exception as e:
        print(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/ratesong")  # post a new song rating
async def postSongRating(request: Request, songToAdd: accountService.InsertSongRating):
    try:
        data = await request.json()
        songToAdd.username = data["username"]
        songToAdd.songID = data["songID"]
        songToAdd.rating = data["rating"]
        postedSong = AccountService.insertSongRating(songToAdd)
        print(postedSong)
        return postedSong
    except Exception as e:
        print(e)
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e

# friends and friend requests routes


@app.get("/getfriends")
async def getFriends(username: str = Query(...)):
    try:
        results = FriendReqService.getAllRFriends(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/getfriendsreqs")
async def getFriends(username: str = Query(...)):
    try:
        results = FriendReqService.getAllRequests(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/managereqs")
async def manageFriendsReqs(queryData: friendReqService.friendReq):
    try:
        results = FriendReqService.manageFriendRequests(queryData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post("/sendreq")
async def sendFriendReq(queryData: friendReqService.friendReq):
    try:
        results = FriendReqService.issueFriendRequest(queryData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e

# get a list of users by username search string


@app.get("/searchusers")
async def searchUsers(username: str = Query(...)):
    try:
        results = FriendReqService.searchUsers(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e

# follow user and artist routes


@app.get("/getfollows")
async def getFollows(username: str = Query(...)):
    try:
        results = FollowService.getAllFollowingUsers(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/getusersearchresults")
async def getUserSearchResults(searchData: str = Query(...)):
    try:
        results = FollowService.searchUsers(searchData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/getartistsearchresults")
async def getArtistSearchResults(searchData: str = Query(...)):
    try:
        results = FollowService.searchArtists(searchData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post('/followUser')
async def followUser(followData: followService.followUser):
    try:
        results = FollowService.insertFollowingUser(followData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.get("/getfollowingArtists")
async def getFollowsArtists(username: str = Query(...)):
    try:
        results = FollowService.getFollowingArtist(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post('/followArtist')
async def followArtist(followData: followService.followArtist):
    try:
        results = FollowService.insertFollowingArtist(followData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


# playlist routes

@app.get('/getplaylists')
async def getPlaylists(username: str = Query(...)):
    try:
        results = PlaylistService.getAllPlaylists(username)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post('/createplaylist')
async def createPlaylist(playlistData: playlistService.playlist):
    try:
        results = PlaylistService.createPlaylist(playlistData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.post('/addtoplaylist')
async def addToPlaylist(playlistData: playlistService.playlist):
    try:
        results = PlaylistService.addSong(playlistData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.delete('/deleteplaylist')
async def deletePlaylist(playlistData: playlistService.playlist):
    try:
        results = PlaylistService.deletePlaylist(playlistData)
        return results
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.middleware("http")
async def AuthMiddleWare(request: Request, call_next):
    try:
        # added additional routes for testing purposes
        if (request.url.path not in ['/searchusers', '/searchsongs', '/newsongsafterlogin', '/getratings', '/getreviews', '/deleteplaylist', '/addtoplaylist', '/createplaylist', '/getplaylists', '/pastratings', '/pastreviews', '/newsongs', '/songsOfWeek', '/signup', '/login', '/sendreq', '/getfriendsreqs', '/querysongs', '/newitems', '/reviewsong', '/ratesong', '/getfriends', '/managereqs', '/followUser', '/getfollows', '/followArtist', '/getfollowingArtists', '/getfollowsArtists', '/getplaylists', '/createplaylist', '/addtoplaylist', '/getusersearchresults', '/getartistsearchresults']):
            authHeader = request.headers.get('authorization')
            if authHeader is None:
                raise InvalidJwtError()
            tokenizedHeader = authHeader.split(' ')
            if len(tokenizedHeader) != 2:
                raise InvalidJwtError()
            token = tokenizedHeader[1]
            user = AuthService.getUserFromToken(token)
            request.state.user = user
        response = await call_next(request)
        return response
    except Exception as e:
        if not isinstance(e, ExtendableError):
            ex = InternalServerError()
            return JSONResponse(
                status_code=int(ex.code),
                content={'info': ex.info, 'code': int(
                    ex.code), 'name': ex.name}
            )
        return JSONResponse(
            status_code=int(e.code),
            content={'info': e.info, 'code': int(e.code), 'name': e.name}
        )


@app.get("/")
async def getUser(request: Request):
    try:
        if (request.state.user == None):
            raise UserNotFound()
        return request.state.user
    except Exception as e:
        if not isinstance(e, ExtendableError):
            raise InternalServerError()
        raise e


@app.exception_handler(ExtendableError)
async def exceptionHandler(request: Request, exc: ExtendableError):
    return JSONResponse(
        status_code=int(exc.code),
        content={'info': exc.info, 'code': int(exc.code), 'name': exc.name}
    )


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3000)
