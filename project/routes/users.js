var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const game_utils = require("./utils/game_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function(req, res, next) {
    console.log(req.session, req.session.user_id);
    if (req.session && req.session.user_id) {
        DButils.execQuery("SELECT user_id FROM Users")
            .then((users) => {
                if (users.find((x) => x.user_id === req.session.user_id)) {
                    req.user_id = req.session.user_id;
                    next();
                }
            })
            .catch((err) => next(err));
    } else {
        res.sendStatus(401);
    }
});

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favoriteGames", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const game_id = req.body.game_id;
        await users_utils.markGameAsFavorite(user_id, game_id);
        res.status(201).send("The game successfully saved as favorite");
    } catch (error) {
        next(error);
    }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoriteGames", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        let favorite_games = {};
        const game_ids = await users_utils.getFavoriteGames(user_id);
        let game_ids_array = [];
        game_ids.map((element) => game_ids_array.push(element.game_id)); //extracting the players ids into array
        const results = await game_utils.getGamesInfo(game_ids_array);
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});

module.exports = router;