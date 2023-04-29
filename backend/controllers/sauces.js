const Thing = require('../models/Thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    console.log(thingObject);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // likes: 0,
        // dislikes: 0,
        // usersLiked: [],
        // usersDisliked: [],
    });
  
    thing.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getOneThing = (req, res, next) => {// récupère une chose avec l'identifiant spécifié
    Thing.findOne({ _id: req.params.id})
        .then((thing) => {res.status(200).json(thing)})
        .catch((error) => {res.status(404).json({ error })});
};

exports.modifyThing = (req, res, next) => {//met à jour une chose avec l'identifiant spécifié.
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete thingObject._userId;
    Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {res.status(400).json({ error })});
};

exports.deleteThing = (req, res, next) => {//supprime une chose avec l'identifiant spécifié
    Thing.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

exports.getAllStuff = (req, res, next) => {//récupère toutes les choses, mais semble avoir une erreur de code
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Thing.findOne({_id : req.params.id})
        .then((objet) => {
            // if(!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
            // } 
            Thing.updateOne(
            {_id : req.params.id},
            {
                $inc: {likes: 1},
                $push: {usersLiked: req.body.userId}
            }
            )
            // .then(() => res.status(201).json({ message: "Thing like +1"}))
            // .catch((error) => res.status(404).json({error}))

            // if(objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
            // } 

            Thing.updateOne(
            {_id : req.params.id},
            {
                $inc: {likes: -1},
                $pull: {usersLiked: req.body.userId}
            }
            )
            .then(() => res.status(201).json({ message: "Thing like 0"}))
            .catch((error) => res.status(404).json({error}))

            
        })
        .catch((error) => res.status(404).json({error}));
}