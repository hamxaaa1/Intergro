import Task from "../models/Task.model.js";
import User from "../models/User.model.js";




export const getUsers = async (req, res) => {
  try {
    const users = await User.find({role: "user"}).select("-password");

    const userWithTasksCount = await Promise.all(users.map( async (user)=> {
      const pendingTasks = await Task.countDocuments({assignedTo: user._id, status: 'Pending'})
      const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: 'In Progress'})
      const completedTasks = await Task.countDocuments({assignedTo: user._id, status: 'Completed'})

      return {
        ...user._doc,
        pendingTasks,
        inProgressTasks,
        completedTasks
      }
    }))
    
    return res.status(200).json({userWithTasksCount});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}


export const getUserById = async (req, res) => {
  try {
    const targetUser = req.params.id
    const user = await User.findById(targetUser).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.status(200).json({user})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}
export const deleteUser = async (req, res) => {
  try {
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}