const sauces = require('../models/sauces')
const fs = require('fs')


exports.getAllSauces = (req, res, next) => {
    sauces.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({
            error
        }))
}


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }))
}



exports.getOneSauce = (req, res, next) => {
    sauces.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error: error
        }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    sauces.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }))
}


exports.deleteSauce = (req, res, next) => {
    sauces.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                sauces.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Sauce supprimée !'
                    }))
                    .catch(error => res.status(400).json({
                        error: error
                    }))
            })
        })
        .catch(error => res.status(500).json({
            error
        }))
}


exports.likeOrNot = (req, res, next) => {

    sauces.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            if (req.body.like === 1) {
                if (!sauce.usersLiked.includes(req.body.userId)) {
                    sauces.updateOne({
                            _id: req.params.id
                        }, {
                            $inc: {
                                likes: req.body.like++
                            },
                            $push: {
                                usersLiked: req.body.userId
                            }
                        })
                        .then((sauce) => res.status(200).json({
                            message: 'Like ajouté !'
                        }))
                        .catch(error => res.status(400).json({
                            error
                        }))
                }else{
                   return res.status(400).json({error:"Un like existe déjà"}) 
                }
            } else if (req.body.like === -1) {
                if (!sauce.usersDisliked.includes(req.body.userId)) {
                    sauces.updateOne({
                            _id: req.params.id
                        }, {
                            $inc: {
                                dislikes: (req.body.like++) * -1
                            },
                            $push: {
                                usersDisliked: req.body.userId
                            }
                        })
                        .then((sauce) => res.status(200).json({
                            message: 'Dislike ajouté !'
                        }))
                        .catch(error => res.status(400).json({
                            error
                        }))
                }else{
                    return res.status(400).json({error:"Un unlike existe déjà"}) 
                 }
            } else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    sauces.updateOne({
                            _id: req.params.id
                        }, {
                            $pull: {
                                usersLiked: req.body.userId
                            },
                            $inc: {
                                likes: -1
                            }
                        })
                        .then((sauce) => {
                            res.status(200).json({
                                message: 'Like supprimé !'
                            })
                        })
                        .catch(error => res.status(400).json({
                            'error': 'Impossible de supprimer le like'
                        }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    sauces.updateOne({
                            _id: req.params.id
                        }, {
                            $pull: {
                                usersDisliked: req.body.userId
                            },
                            $inc: {
                                dislikes: -1
                            }
                        })
                        .then((sauce) => {
                            res.status(200).json({
                                message: 'Dislike supprimé !'
                            })
                        })
                        .catch(error => res.status(400).json({
                            'error': 'impossible de suppirmer le dislike'
                        }))
                }
            }
        })
        .catch(error => res.status(404).json({
            'error': 'Je ne trouve pas la sauce'
        }))

}