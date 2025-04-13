import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const MainContent = () => {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', status: 'in_progress' });

  // Handle delete todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Fetch todos
  useEffect(() => {
    fetchTodos();
    // Set up polling for updates
    const intervalId = setInterval(fetchTodos, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const todoDate = new Date(todo.createdAt);
    const matchesDateRange = (!startDate || todoDate >= startDate) &&
                           (!endDate || todoDate <= endDate);
    return matchesSearch && matchesDateRange;
  });

  const completedTasks = filteredTodos.filter(todo => todo.status === 'completed');
  const inProgressTasks = filteredTodos.filter(todo => todo.status === 'in_progress');

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
      await axios.put(`http://localhost:5000/api/todos/${id}`, { status: newStatus });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  // Handle new todo
  const handleSubmit = async () => {
    if (!newTodo.title || !newTodo.description) {
      alert('Please fill in both title and description');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/todos', newTodo);
      setOpen(false);
      setNewTodo({ title: '', description: '' });
      fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <Box className="main-content">
      <Box sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, pb: 2 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Welcome, Aishwarya</Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search tasks"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          placeholderText="From"
          customInput={<TextField size="small" />}
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          placeholderText="To"
          customInput={<TextField size="small" />}
        />
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ ml: 'auto' }}
        >
          + Add New
        </Button>
      </Box>
      </Box>

      <div className="content-container">
        {/* Left Section - All Tasks */}
        <div className="tasks-section">
          <div className="task-grid">
            {filteredTodos.map((todo) => (
              <div className="task-card" key={todo._id}>
                <IconButton
                  className="delete-btn"
                  onClick={() => handleDelete(todo._id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => toggleStatus(todo._id, todo.status)}
                  sx={{ mt: 2 }}
                >
                  {todo.status === 'completed' ? 'Mark In Progress' : 'Mark Complete'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Task Status */}
        <div className="status-section">
          <div className="status-header">
            <Typography variant="h5">Task Status</Typography>
          </div>
          
          <div className="status-boxes">
            <div className="status-box">
              <Typography variant="h6">{completedTasks.length}</Typography>
              <Typography>Completed</Typography>
            </div>
            <div className="status-box">
              <Typography variant="h6">{inProgressTasks.length}</Typography>
              <Typography>In Progress</Typography>
            </div>
          </div>

          <div className="completed-tasks">
            <Typography variant="h6" sx={{ mb: 2 }}>Completed Tasks</Typography>
            {completedTasks.map((todo) => (
              <div className="task-card" key={todo._id}>
                <IconButton
                  className="delete-btn"
                  onClick={() => handleDelete(todo._id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => toggleStatus(todo._id, todo.status)}
                  sx={{ mt: 2 }}
                >
                  Mark In Progress
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Todo Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add Task</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainContent;
