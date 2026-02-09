from fastapi import APIRouter
from typing import List

router = APIRouter()

tasks = []

@router.get("/tasks")
def get_tasks():
    return tasks

@router.post("/tasks")
def create_task(task: dict):
    tasks.append(task)
    return {"message": "Task created", "task": task}

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if task_id < len(tasks):
        removed = tasks.pop(task_id)
        return {"message": "Task deleted", "task": removed}
    return {"error": "Task not found"}
