const DButils = require("./DButils");

async function markGameAsFavorite(user_id, game_id) {
    let user = await DButils.execQuery(
        `select * from FavoriteGames where user_id = ${user_id}`+
        `AND game_id = ${game_id}`
    );
    if(!user || user.length == 0)
    {
        await DButils.execQuery(
            `insert into FavoriteGames values ('${user_id}',${game_id})`
        );
    }
    
}

async function getFavoriteGames(user_id) {
    const game_ids = await DButils.execQuery(
        `select game_id from FavoriteGames where user_id='${user_id}'`
    );
    return game_ids;
}

exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;