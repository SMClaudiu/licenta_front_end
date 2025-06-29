// src/hooks/useTaskOperations.ts
import { useCallback } from 'react';
import { TaskDTO, TaskStatus } from '../types/api';
import { TaskService } from '../services/taskService';


const sortTasksById = (tasks: TaskDTO[]) =>
    tasks.sort((a, b) => (a.taskId ?? 0) - (b.taskId ?? 0));

export const useTaskOperations = (
    boardId: number,
    tasks: TaskDTO[],
    setTasks: React.Dispatch<React.SetStateAction<TaskDTO[]>>
) => {
    const toggleTaskStatus = useCallback(async (taskId: number) => {
        const originalTasks = [...tasks];
        const taskToToggle = originalTasks.find(task => task.taskId === taskId);

        if (!taskToToggle) {
            console.error(`Task with ID ${taskId} not found for toggling status.`);
            return;
        }

        const newStatus = taskToToggle.status === TaskStatus.Done ? TaskStatus.Not_Done : TaskStatus.Done;

        setTasks(prev =>
            sortTasksById(
                prev.map(task =>
                task.taskId === taskId
                    ? { ...task, status: newStatus }
                    : task
                )
            )
        );

        try {
            await TaskService.updateTaskStatus(taskId, newStatus);
        } catch (error) {
            console.error("Failed to update task status on backend", error);
            setTasks(originalTasks);
            alert("Failed to update task status. Please try again.");
        }
    }, [tasks, setTasks]);

    const deleteTask = useCallback(async (taskId: number) => {
        const originalTasks = [...tasks];
        setTasks(prev => prev.filter(task => task.taskId !== taskId));

        try {
            await TaskService.deleteTask(taskId);
        } catch (error) {
            console.error("Failed to delete task on backend", error);
            setTasks(originalTasks);
            alert("Failed to delete task. Please try again.");
        }
    }, [tasks, setTasks]);

    const addTask = useCallback(async (taskData: Omit<TaskDTO, 'taskId'>) => {
        console.log("addTask: Received taskData from modal/BoardScreen:", taskData); // Log input
        const determinedCreationDate = taskData.creationDate
            ? new Date(taskData.creationDate) // If provided (will be string "YYYY-MM-DD" from form)
            : new Date()

        const tempOptimisticId = Date.now();
        const optimisticTask: TaskDTO = {
            ...taskData,

            taskId: tempOptimisticId, // Assign temp client-side ID
            status: taskData.status || TaskStatus.Not_Done,
        };

        setTasks(prev => [...prev, optimisticTask].sort((a,b) => a.taskId - b.taskId));

        {/*de vazut cum se poate implementa sa fie setata cu cea locala daca nu este introdusa*/}
        try {
            const createdTask = await TaskService.createTask(boardId, {
                name: taskData.name,
                description: taskData.description,
                status: taskData.status,
                creationDate: determinedCreationDate,
                dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
            });

            console.log("addTask: Response from TaskService.createTask (createdTask): ", createdTask);

            if (!createdTask || createdTask.name === null || createdTask.name === undefined) {
                console.warn("addTask: Backend returned task with missing or null name:", createdTask);
            }

            setTasks(prev =>
                prev.map(t => (t.taskId === tempOptimisticId ? createdTask : t))
                    .sort((a,b) => a.taskId - b.taskId)
            );
            console.log("This is the created Task " + createdTask.toString());
            return createdTask;
        } catch (error) {
            console.error("Failed to create task on backend", error);
            setTasks(prev => prev.filter(t => t.taskId !== tempOptimisticId));
            throw error;
        }
    }, [boardId, setTasks]);

    const updateTask = useCallback(async (taskId: number, taskData: Partial<Omit<TaskDTO, 'taskId'>>) => {
        const originalTasks = [...tasks];
        const taskToUpdate = originalTasks.find(t => t.taskId === taskId);
        setTasks(prevTasks => prevTasks.map(task =>
            task.taskId === taskId ? { ...task, ...taskData, dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined } : task
        ));

        if(!taskToUpdate){
            console.error(`Task with ID ${taskId} not found for update.`);
            alert("Error: Task not found for update.");
            return;
        }

        const optimisticallyUpdatedTask: TaskDTO = {
            ...taskToUpdate,
            ...taskData,
            // Ensure dueDate is correctly typed if present in taskData
            dueDate: taskData.dueDate !== undefined
                ? (taskData.dueDate ? new Date(taskData.dueDate) : undefined)
                : taskToUpdate.dueDate,
        };

        console.log(`updateTask: Optimistically updated task for UI:`, optimisticallyUpdatedTask);

        setTasks(prevTasks => (
            prevTasks.map(task =>
                task.taskId === taskId ? optimisticallyUpdatedTask : task
            )
        ));



        try {
            let changesMadeToBackend = false;
            if (taskData.name !== undefined && taskData.name !== taskToUpdate.name) {
                await TaskService.updateTaskName(taskId, taskData.name); // Assumes this method exists
                changesMadeToBackend = true;
            }
            if (taskData.description !== undefined && taskData.description !== taskToUpdate.description) {
                await TaskService.updateTaskDescription(taskId, taskData.description);
                changesMadeToBackend = true;
            }
            if (taskData.status !== undefined && taskData.status !== taskToUpdate.status) {
                await TaskService.updateTaskStatus(taskId, taskData.status);
                changesMadeToBackend = true;
            }
            // if (taskData.dueDate !== undefined) {
            //     const oldDueDateStr = taskToUpdate.dueDate ? new Date(taskToUpdate.dueDate).toISOString().split('T')[0] : null;
            //     const newDueDateStr = taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : null;
            //     if(oldDueDateStr !== newDueDateStr) {
            //         await TaskService.updateTaskDueDate(taskId, taskData.dueDate ? new Date(taskData.dueDate) : null); // Assumes this method exists
            //         changesMadeToBackend = true;
            //     }
            // }


            if (changesMadeToBackend) {
                // Re-fetch the task to get the definitive state from the backend
                const finalUpdatedTask = await TaskService.getTaskById(taskId);
                setTasks(prev => (prev.map(t => t.taskId === taskId ? finalUpdatedTask : t)));
                return finalUpdatedTask;
            } else {
                // No actual data changes were sent to backend, return the optimistically updated one (e.g. date object normalization)
                return optimisticallyUpdatedTask;
            }

        }  catch (error) {
            console.error("Failed to update task on backend", error);
            setTasks(originalTasks);
            throw error;
        }
    }, [tasks, setTasks]);

    return {
        toggleTaskStatus,
        deleteTask,
        addTask,
        updateTask
    };
};