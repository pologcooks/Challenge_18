const router = require('express').Router();
const { User, Thought } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.status(200).json(thoughts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const thought = await Thought.findById(id);

        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
        }

        res.status(200).json(thought);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;

        const newThought = new Thought({
            thoughtText,
            username
        });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        const result = await newThought.save();
        user.thoughts.push(result._id);
        await user.save();

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;