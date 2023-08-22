const router = require('express').Router();
const { User, Thought } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
    try {
        const userData = await User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v');
        res.json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findById(req.params.id)
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v');

        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }

        res.json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a new user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        res.json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
    try {
        const userData = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE to remove a user by its _id
router.delete('/:id', async (req, res) => {
    try {
        const userData = await User.findByIdAndDelete(req.params.id);

        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }

        // BONUS: Remove a user's associated thoughts when deleted.
        await Thought.deleteMany({ _id: { $in: userData.thoughts } });

        res.json(userData);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/:id/friends/:friendId', async (req, res) => {
    try {
        const { id, friendId } = req.params;

        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).send({ message: 'User / friend does not exist!' });
        }

        user.friends.push(friendId);
        await user.save();

        res.status(201).send({ message: 'Friend added successfully', user });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', error });
    }
});

router.delete('/:id/friends/:friendId', async (req, res) => {
    try {
        const { id, friendId } = req.params;

        const user = await User.findById(id);
    
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
    
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        await user.save();
    

        res.status(201).send({ message: 'Friend removed successfully', user });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', error });
    }
});



module.exports = router;