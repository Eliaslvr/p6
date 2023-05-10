const Thing = require('../models/Thing');
// const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    console.log(thingObject);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
  
    // Vérifiez si l'utilisateur a déjà aimé ou pas aimé la sauce
    Thing.findOne({ _id: sauceId })
      .then((sauce) => {
        if (like === 1 && !sauce.usersLiked.includes(userId)) {
          // Ajouter un like à la sauce et mettre à jour les utilisateurs qui ont aimé la sauce
          sauce.likes += 1;
          sauce.usersLiked.push(userId);
        } else if (like === -1 && !sauce.usersDisliked.includes(userId)) {
          // Ajouter un dislike à la sauce et mettre à jour les utilisateurs qui n'ont pas aimé la sauce
          sauce.dislikes += 1;
          sauce.usersDisliked.push(userId);
        } else if (like === 0) {
          // Enlever le like ou le dislike de l'utilisateur et mettre à jour la sauce en conséquence
          if (sauce.usersLiked.includes(userId)) {
            sauce.likes -= 1;
            sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
          } else if (sauce.usersDisliked.includes(userId)) {
            sauce.dislikes -= 1;
            sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
          }
        }
        // Enregistrer les modifications de la sauce dans la base de données
        Thing.updateOne({ _id: sauceId }, sauce)
          .then(() => res.status(200).json({ message: 'Sauce likée avec succès !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};