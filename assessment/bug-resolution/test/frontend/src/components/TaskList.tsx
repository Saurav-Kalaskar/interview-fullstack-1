import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import axios from 'axios';

interface Task {
  id: any;
  title: any;
  completed: any;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/tasks');
        setTasks(response.data);
        
        setCompletedCount(response.data.filter((task: Task) => task.completed).length);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const handleToggle = async (taskId: string) => {
    try {
      await axios.patch(`http://localhost:3001/api/tasks/${taskId}/toggle`);

      const newTasks = [...tasks];
      const taskIndex = newTasks.findIndex(t => t.id === taskId);
      newTasks[taskIndex].completed = !newTasks[taskIndex].completed;
      setTasks(newTasks);
      
      setCompletedCount(newTasks.filter(task => task.completed).length);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const incompleteTasks = tasks.filter(task => !task.completed);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">
        Tasks ({completedCount} completed)
      </Typography>
      <List>
        {tasks.map(task => (
          <ListItem>
            <ListItemText primary={task.title} />
            <Button 
              variant="contained"
              onClick={() => handleToggle(task.id)}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </Button>
          </ListItem>
        ))}
      </List>
      <Typography>
        Remaining tasks: {incompleteTasks.length}
      </Typography>
    </Box>
  );
}; 