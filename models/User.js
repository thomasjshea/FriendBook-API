const { Schema, model } = require('mongoose');
// const thoughtSchema = require('./Thought');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            maxLength: 20
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (email) {
                    return /^([A-Za-z0-9_\.-]+)@([\da-z\.-])+\.([a-z\.]{2,6}))$/.test(email)
                },
                message: email => `${email.value} is not a valid email address!`
            }
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

userSchema
.virtual('friendCount')
.get(function() {
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;