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

router.put('/:id', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.id);

        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }

        res.status(201).json(thought);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});


router.post('/:id/reactions', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);

        if (!thought) {
            return res.status(404).json({ error: 'Thought not found' });
        }

        const newReaction = {
            reactionBody: req.body.reactionBody,
            username: req.body.username
        };

        thought.reactions.push(newReaction);
        await thought.save();
        res.status(201).json(thought);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.delete('/:id/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);

        if (!thought) {
            return res.status(404).json({ error: 'Thought not found' });
        }

        thought.reactions = thought.reactions.filter(reaction => reaction.reactionId.toString() !== req.params.reactionId);
        await thought.save();
        res.status(200).json(thought);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;