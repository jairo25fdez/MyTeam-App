module.exports = function (app){

    const path = require('path');
    const { isNull } = require('util');
    const mongoose_util = require(path.join(__dirname, './mongoose_util.js'));
    const { checkToken } = require('../middlewares/authentication');

    //URL to Mongoose package.
    const aqp = require('api-query-params');

    const BASE_API_URL = "/api/v1";

    const PlayModule = require(path.join(__dirname, '/../models/play.js'));
    const Play = PlayModule.PlayModel;

    //Get DB data.
    mongoose_util.getDB();

    //Methods to work with the whole collection.

    //DELETE every Play in DB.
    app.delete(BASE_API_URL+"/plays", checkToken ,(request,response) =>{
        Play.deleteMany({}, function (err) {
            if(err){
                console.log("Error while trying to delete plays.");
            }
            else{
                response.sendStatus(200, "Deleted plays.");
            }
        });
    });

    //GET every Play in DB.
    app.get(BASE_API_URL+"/plays", checkToken ,(request,response) =>{

        const { filter, skip, limit, sort, projection, population } = aqp(request.query);

        Play.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((err, plays) => {
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                }
                else{
                    response.send(JSON.stringify(plays,null,2));
                }   
            });

    });

    //POST a Play in DB.
    app.post(BASE_API_URL+"/plays", checkToken ,(request,response) =>{
        let play_data = request.body;

        let play = new Play({
            player: play_data.player,
            team: play_data.team,
            game_id: play_data.game_id,
            home_team_score: play_data.home_team_score,
            visitor_team_score: play_data.visitor_team_score,
            time: play_data.time,
            period: play_data.period,
            type: play_data.type,
            shot_type: play_data.shot_type,
            shot_position: play_data.shot_position,
            shot_made: play_data.shot_made,
            //assisted_shoot: play_data.assisted_shoot,
            rebound_type: play_data.rebound_type,
            block_type: play_data.block_type,
            foul_type: play_data.foul_type,
            //player_in: play_data.player_in,
            //player_out: play_data.player_out,
            //from: play_data.from, 
            //to: play_data.to
        });

        play.save(function(err,doc){
            if(err){
                console.log("Error while trying to post the play into the database.");
                console.log("Check the following error: "+err);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(201, "Created play.");
            }
        });


    });

    //PUT is not allowed when we are working with collections.
    app.put(BASE_API_URL+"/plays", checkToken ,(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A COLLECTION.")
    });


    //Methods to work with a specific play.

    //DELETE a specific play by the ID.
    app.delete(BASE_API_URL+"/plays/:play_id", checkToken ,(request,response) =>{
        var play_id = request.params.play_id;

		Play.deleteOne({_id: play_id}, function (err){
            if(err){
                console.log("Error while trying to delete the play with id: "+play_id);
                response.sendStatus(500);
            }
            else{
                response.sendStatus(200, "Deleted play with id: "+play_id);
            }
        });
		
        
    });

    //GET a specific play by the ID.
    app.get(BASE_API_URL+"/plays/:play_id", checkToken ,(request,response) =>{
        var play_id = request.params.play_id;

        Play.findOne({_id: play_id}, function (err, doc){
            if(isNull(doc)){
                console.log("Play with id: "+play_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                response.send(JSON.stringify(doc,null,2));
            }
        });

    });


    //POST is not allowed when we are working with a specific play.
    app.post(BASE_API_URL+"/plays/:play_id", checkToken ,(request,response) =>{
        response.sendStatus(405, "METHOD NOT ALLOWED ON A SPECIFIC CLUB.")
    });

    //PUT a specific play in the database.
    app.put(BASE_API_URL+"/plays/:play_id", checkToken ,(request,response) =>{

        var play_id = request.params.play_id;
        var updatedData = request.body;

        Play.findOne({_id: play_id}, function (err, play){
            if(isNull(play)){
                console.log("Play with id: "+play_id+" doesn't exists in the database.");
                response.sendStatus(400);
            }
            else{
                play.player = updatedData.player,
                play.team = updatedData.team,
                play.game_id = updatedData.game_id,
                play.home_team_score = updatedData.home_team_score,
                play.visitor_team_score = updatedData.visitor_team_score,
                play.time = updatedData.time,
                play.period = updatedData.period,
                play.type = updatedData.type,
                play.shot_type = updatedData.shot_type,
                play.shot_position = updatedData.shot_position,
                play.shot_made = updatedData.shot_made,
                //play.assisted_shoot = updatedData.assisted_shoot,
                play.rebound_type = updatedData.rebound_type,
                play.block_type = updatedData.block_type,
                play.foul_type = updatedData.foul_type,
                //play.player_in = updatedData.player_in,
                //play.player_out = updatedData.player_out,
                //play.from = updatedData.from, 
                //play.to = updatedData.to

                play.save();

                response.sendStatus(200, "Updated play "+play_id);
            }
        });

    });

}