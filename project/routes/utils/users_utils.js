const DButils = require("./DButils");

async function markGameAsFavorite(user_id, game_id) {
    await DButils.execQuery(
        `insert into FavoriteGames values ('${user_id}',${game_id})`
    );
}

async function getFavoriteGames(user_id) {
    const game_ids = await DButils.execQuery(
        `select game_id from FavoriteGames where user_id='${user_id}'`
    );
    return game_ids;
}

exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;