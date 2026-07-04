const Contest = require('../models/Contest');
const Problem = require('../models/Problem');

exports.createContest = async (req, res) => {
    try {
        const { title, description, startTime, durationMinutes, problems } = req.body;
        const newContest = new Contest({ title, description, startTime, durationMinutes, problems });
        await newContest.save();

        if (problems && problems.length > 0) {
            await Problem.updateMany({ _id: { $in: problems } }, { $set: { visibility: 'ContestOnly' } });
        }
        res.status(201).json({ success: true, message: 'Contest deployed successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to deploy contest.' });
    }
};

exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find().sort({ startTime: -1 });
        res.status(200).json({ success: true, contests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch contests.' });
    }
};

exports.getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id).populate('problems', 'title difficulty visibility');
        if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

        const now = new Date().getTime();
        const startTime = new Date(contest.startTime).getTime();

        if (now < startTime) {
            const secureContest = contest.toObject();
            secureContest.problems = secureContest.problems.map(p => ({ _id: p._id }));
            return res.status(200).json({ success: true, contest: secureContest });
        }

        res.status(200).json({ success: true, contest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch contest details.' });
    }
};

exports.finalizeContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

        if (contest.problems && contest.problems.length > 0) {
            await Problem.updateMany({ _id: { $in: contest.problems } }, { $set: { visibility: 'Public' } });
        }

        res.status(200).json({ success: true, message: 'Contest finalized! Ratings updated and problems released.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to finalize contest.' });
    }
};

exports.deleteContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (contest && contest.problems.length > 0) {
            await Problem.updateMany({ _id: { $in: contest.problems } }, { $set: { visibility: 'Public' } });
        }
        await Contest.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Contest purged successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to purge contest.' });
    }
};