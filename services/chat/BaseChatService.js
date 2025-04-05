import Chat from "../../models/chat.js";

export default class BaseChatService {
  constructor(user) {
    this.user = user;
  }

  async _updateGroupAndReturn(groupId, updateData) {
    return await Chat.findByIdAndUpdate(
      groupId,
      updateData,
      { new: true }
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage');
  }

}