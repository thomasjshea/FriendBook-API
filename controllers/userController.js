const { application } = require('express');
const { User, Thought } = require('../models');

module.exports = {
    // get all users
    getUsers(req, res) {
        User.find()
         .then((users) => res.json(users))
         .catch((err) => res.status(500).json(err));
    },
    // get single user
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
         .select('-__v')
         .then((user) =>
            !user 
                ? res.status (404).json({ message: 'No User with that ID' })
                : res.json(user)
         )
        .catch((err) => res.status(500).json(err));
    },
    // create new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // update user by userId
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user)=>
                !application
                    ? res.status(404).json({ message: 'No user with this ID' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err)
                res.status(500).json(err);
            });
    },
    // delete user by userId
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user  
                    ? res.status(404).json({ message: 'No user with this ID'})
                    : Thought.deleteMany({ _id: { $in: user.thoughts }})
            )
            .then(() => res.json({ message: 'User and thoughts deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
};