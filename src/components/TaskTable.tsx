import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
  TablePagination,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import { Task } from "../interfaces/task";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTasks,
  addTask,
  completeTask,
  deleteTask,
  incompleteTask,
  updateTask,
} from "../store/tasksSlice";

const TaskTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskText, setTaskText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (openModal) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [openModal]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "finished") return task.completed;
      if (filter === "unfinished") return !task.completed;
      return true;
    });
  }, [tasks, filter]);

  const paginatedTasks = useMemo(() => {
    return filteredTasks.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredTasks, page, rowsPerPage]);

  const finishedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleFinished = async (id: string) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id);
      if (taskToToggle) {
        if (taskToToggle.completed) {
          await dispatch(incompleteTask(id)).unwrap();
        } else {
          await dispatch(completeTask(id)).unwrap();
        }
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Error toggling task completion");
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskText("");
    setOpenModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskText(task.text);
    setOpenModal(true);
  };

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        await dispatch(
          updateTask({ id: editingTask.id, text: taskText })
        ).unwrap();
      } else {
        await dispatch(addTask({ text: taskText })).unwrap();
      }
      setOpenModal(false);
      setEditingTask(null);
      setTaskText("");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Error saving task.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };

  const handleMarkAllFinished = async () => {
    try {
      const uncompletedTasks = paginatedTasks.filter((task) => !task.completed);

      if (uncompletedTasks.length === 0) {
        toast.info("All tasks are already completed!");
        return;
      }

      await Promise.all(
        uncompletedTasks.map((task) => dispatch(completeTask(task.id)).unwrap())
      );

      toast.success(`Marked ${uncompletedTasks.length} task(s) as completed.`);
    } catch (error) {
      console.error("Error marking tasks as finished:", error);
      toast.error("Error marking tasks as finished. Please try again.");
    }
  };

  const handleDeleteFinished = async () => {
    try {
      await Promise.all(
        tasks
          .filter((task) => task.completed)
          .map((task) => dispatch(deleteTask(task.id)).unwrap())
      );
    } catch (error) {
      console.error("Error deleting finished tasks:", error);
      toast.error("Error deleting finished tasks");
    }
  };

  return (
    <Box sx={{ margin: { xs: 1, sm: 2 } }}>
      <Typography variant="h6" gutterBottom>
        Finished Tasks: {finishedCount} / {tasks.length}
      </Typography>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          "& > *": {
            flexGrow: 1,
            flexBasis: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(25% - 12px)",
            },
            minWidth: "170px",
            maxWidth: {
              xs: "100%",
              sm: "calc(50% - 8px)",
            },
            height: "36px",
          },
        }}
      >
        <FormControl>
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value as string)}
            label="Filter"
            sx={{ height: "100%" }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="finished">Finished</MenuItem>
            <MenuItem value="unfinished">Unfinished</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleAddTask}>
          Add Task
        </Button>
        <Button variant="contained" onClick={handleMarkAllFinished}>
          Mark All Finished
        </Button>
        <Button variant="contained" onClick={handleDeleteFinished}>
          Delete Finished
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          borderRadius: 1,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <Table aria-label="task table">
          <TableHead>
            <TableRow>
              <TableCell>Text</TableCell>
              {!isMobile && <TableCell align="right">Created Date</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTasks
              .sort(
                (a, b) =>
                  new Date(b.createdDate).getTime() -
                  new Date(a.createdDate).getTime()
              )
              .map((task) => (
                <TableRow
                  key={task.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      maxWidth: { xs: 120, sm: 200 },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {task.completed && (
                        <Check
                          sx={{ color: "green", marginRight: 1, fontSize: 20 }}
                        />
                      )}
                      {task.text}
                    </Box>
                  </TableCell>
                  {!isMobile && (
                    <TableCell
                      align="right"
                      sx={{
                        maxWidth: { sm: 200, md: 300 },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(task.createdDate).toLocaleString()}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton
                        onClick={() => handleEditTask(task)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteTask(task.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        onClick={() => handleToggleFinished(task.id)}
                        size="small"
                      >
                        {task.completed ? <Close /> : <Check />}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={inputRef}
            autoFocus
            margin="dense"
            label="Task Text"
            type="text"
            fullWidth
            variant="outlined"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSaveTask}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskTable;
