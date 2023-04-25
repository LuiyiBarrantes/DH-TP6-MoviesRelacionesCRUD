module.exports = (sequelize, dataTypes) => {
    let alias = 'Actor_Movie';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        actor_id : {
            type: dataTypes.BIGINT(10),
            onDelete: 'CASCADE',},
        movie_id : {
            type: dataTypes.BIGINT(10),
            onDelete: 'CASCADE',}
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Actor_Movie = sequelize.define(alias, cols, config); 

 
    return Actor_Movie
};