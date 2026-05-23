import Task from "../models/Task.model.js";
import mongoose from "mongoose";




export const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const InProgressTasks = await Task.countDocuments({ status: "In Progress" });
    const overDueDateTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // --- Task distribution by status ---
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    // ✅ Add Overdue + All
    taskDistribution["Overdue"] = overDueDateTasks;
    taskDistribution["All"] = totalTasks;

    // --- Task distribution by priority ---
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPrioritiesLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPrioritiesLevels = taskPriorities.reduce((acc, priority) => {
      const formattedKey = priority.replace(/\s+/g, "");
      acc[formattedKey] =
        taskPrioritiesLevelsRaw.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    }, {});

    // --- Recent tasks ---
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        InProgressTasks,
        overDueDateTasks,
      },
      charts: {
        taskDistribution,
        taskPrioritiesLevels,
      },
      recentTasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};








export const getUserDashboardData = async (req, res) => {
  try {
    const authorId = req.user._id;

    // --- Task counts ---
    const totalTasks = await Task.countDocuments({ assignedTo: authorId });
    const pendingTasks = await Task.countDocuments({ assignedTo: authorId, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ assignedTo: authorId, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ assignedTo: authorId, status: "Completed" });
    const overDueDateTasks = await Task.countDocuments({
      assignedTo: authorId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // --- Task distribution by status ---
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: authorId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Map status counts
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    // Add Overdue slice
    taskDistribution.Overdue = overDueDateTasks;
    taskDistribution.All = totalTasks;

    // --- Task distribution by priority ---
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPrioritiesLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: authorId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPrioritiesLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPrioritiesLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // --- Recent tasks ---
    const recentTasks = await Task.find({ assignedTo: authorId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("assignedTo", "name email avatar")
      .select("title status priority dueDate createdAt assignedTo");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overDueDateTasks,
      },
      charts: {
        taskDistribution,
        taskPrioritiesLevels,
      },
      recentTasks,
    });
  } catch (error) {
    console.error("User Dashboard Error:", error);
    return res.status(500).json({ message: error.message, stack: error.stack });
  }
};




export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};

    if (status && status !== "All") {
      if (status === "Overdue") {
        filter = { status: { $ne: "Completed" }, dueDate: { $lt: new Date() } };
      } else {
        filter.status = status;
      }
    }

    // fetch tasks (admin = all, user = only theirs)
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate("assignedTo", "name email avatar");
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id })
                        .populate("assignedTo", "name email avatar");
    }

    // add completeTodoCount for each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedTask = task.todoCheckList.filter((item) => item.completed).length;
        return { ...task._doc, completeTodoCount: completedTask };
      })
    );

    // counts (base condition differs for admin vs user)
    const baseForCounts = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    const allTasks = await Task.countDocuments(baseForCounts);

    const pendingTask = await Task.countDocuments({
      ...baseForCounts,
      status: "Pending"
    });
    const inProgressTask = await Task.countDocuments({
      ...baseForCounts,
      status: "In Progress"
    });
    const completedTask = await Task.countDocuments({
      ...baseForCounts,
      status: "Completed"
    });
    const overdueTask = await Task.countDocuments({
      ...baseForCounts,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() }
    });

    return res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTask,
        inProgressTask,
        completedTask,
        overdueTask
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};


export const getTaskById = async (req,res) => {
  try {
    const targetId = req.params.id
    const task = await Task.findById(targetId).populate(
      "assignedTo",
      "name email avatar"
    )
    if (!task) {
      return res.status(404).json({message:"Task Not Found!"})
    }
    res.status(200).json({message:"Task Fetched Successfully!", task})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}


export const createTask = async (req,res) => {
  try {
    const {title, description,priority,dueDate, assignedTo,attachments,todoCheckList} = req.body
    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({message: "assignedTo must be an array of usersId"})
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoCheckList
    })

    return res.status(201).json({ message: "Task created Successfully!", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}


export const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoCheckList
    } = req.body;

    const targetId = req.params.id;
    const task = await Task.findById(targetId);

    if (!task) {
      return res.status(404).json({ message: "Task Not Found!" }); // ✅ added return
    }

    // update only provided fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (attachments) task.attachments = attachments;
    if (todoCheckList) task.todoCheckList = todoCheckList;

    if (assignedTo) {
      if (!Array.isArray(assignedTo)) {
        return res.status(400).json({ message: "assignedTo must be an array of usersId" });
      }
      task.assignedTo = assignedTo;
    }

    const updatedTask = await task.save(); // ✅ correct usage

    res.status(200).json({
      message: "Task Updated Successfully!",
      task: updatedTask
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const deleteTask = async (req,res) => {
  try {
    const targetTaskId = req.params.id
    const task = await Task.findById(targetTaskId)
    if (!task) {
      return res.status(404).json({ message: "Task Not Found!" }); // ✅ added return
    }
    await task.deleteOne()
    return res.status(200).json({ message: "Task Deleted Successfully!" }); // ✅ added return
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
}


export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const targetTaskId = req.params.id;

    const task = await Task.findById(targetTaskId); // ✅ correct findById
    if (!task) {
      return res.status(404).json({ message: "Task Not Found!" });
    }

    // Check if the logged-in user is assigned OR is admin
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") { // ✅ correct admin check
      return res.status(403).json({ message: "Not authorized!" }); // ✅ fixed
    }

    // Update status
    task.status = status;

    // If completed → mark all todos as done + set progress to 100%
    if (task.status === "Completed") {
      task.todoCheckList.forEach((item) => {
        item.completed = true;
      });
      task.progress = 100;
    }

    const updatedTask = await task.save();

    return res.status(200).json({
      message: "Task status updated successfully!",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const updateTaskCheckList = async (req, res) => {
  try {
    const { todoCheckList } = req.body;
    const targetTaskId = req.params.id;

    const task = await Task.findById(targetTaskId);
    if (!task) {
      return res.status(404).json({ message: "Task Not Found!" });
    }

    // Check if user is assigned or admin
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized" });
    }

    // Update todo checklist
    task.todoCheckList = todoCheckList;

    // Calculate progress
    const completedTodo = task.todoCheckList.filter((item) => item.completed).length;
    const allTodos = task.todoCheckList.length;
    task.progress = allTodos > 0 ? Math.round((completedTodo / allTodos) * 100) : 0;

    // Update status based on progress
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    const updatedTask = await Task.findById(targetTaskId).populate(
      "assignedTo",
      "name email avatar"
    );

    return res.status(200).json({
      message: "Task checklist updated successfully!",
      task: updatedTask,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};
