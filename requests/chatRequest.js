export const validateOpenChat = (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "receiver user id not present" });
    }
    
    next();
}


export const validateCreateGroupChat = (req, res, next) => {
    let { groupName, groupMembers } = req.body;

    if(!groupName || !groupMembers) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if(groupMembers.length < 2) {
        return res.status(400).json({ message: "Group must have at least 2 members" });
    }

    next();
}


export const validateUpdateGroupChat = (req, res, next) => {
    let { groupName, groupMembers, groupId } = req.body;

    if(!groupName || !groupMembers || !groupId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if(groupMembers.length < 2) {
        return res.status(400).json({ message: "Group must have at least 2 members" });
    }

    next();
}

export const validateRenameGroup = (req, res, next) => {
    const { groupId, newGroupName } = req.body;

    if(!groupId || !newGroupName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    next();
}

export const validateAddMember = (req, res, next) => {
    const { groupId, newMember } = req.body;

    if(!groupId || !newMember) {
        return res.status(400).json({ message: "All fields are required" });
    }

    next();
}

export const validateRemoveMember = (req, res, next) => {
    const { groupId, memberToRemove } = req.body;

    if(!groupId || !memberToRemove) {
        return res.status(400).json({ message: "All fields are required" });
    }

    next();
}