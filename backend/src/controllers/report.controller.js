import User from "../models/User.model.js";
import Task from "../models/Task.model.js";
import exceljs from "exceljs"


export const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found!" });
    }

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "TaskID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 40 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 40 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
        assignedTo: assignedTo || "Unassigned",
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};



export const exportUsersReport = async (req, res) => {
  try {
    // exclude admins
    const users = await User.find({ role: { $ne: "admin" } })
      .select("name email _id role createdAt updatedAt")
      .lean();

    if (!users.length) {
      return res.status(404).json({ message: "No users found!" });
    }

    // Map tasks to users
    const tasks = await Task.find().select("assignedTo status").lean();
    const userTaskCountMap = {};

    users.forEach(user => {
      userTaskCountMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingCount: 0,
        inProgressTask: 0,
        completedTask: 0
      };
    });

    tasks.forEach(task => {
      if (task.assignedTo) {
        task.assignedTo.forEach(assignedUser => {
          const key = assignedUser.toString();
          if (userTaskCountMap[key]) {
            userTaskCountMap[key].taskCount += 1;
            if (task.status === "Pending") {
              userTaskCountMap[key].pendingCount += 1;
            } else if (task.status === "In Progress") {
              userTaskCountMap[key].inProgressTask += 1;
            } else if (task.status === "Completed") {
              userTaskCountMap[key].completedTask += 1;
            }
          }
        });
      }
    });

    // Create workbook
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 35 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingCount", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTask", width: 25 },
      { header: "Completed Tasks", key: "completedTask", width: 25 },
    ];

    Object.values(userTaskCountMap).forEach(user => worksheet.addRow(user));

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2CC" },
      };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

