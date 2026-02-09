from fastapi import FastAPI
from app.routes.tasks import router as tasks_router
from app.health import router as health_router
from app.metrics import router as metrics_router

app = FastAPI(title="Cloud Native Task API")

app.include_router(tasks_router)
app.include_router(health_router)
app.include_router(metrics_router)

@app.get("/")
def root():
    return {"message": "Cloud Native Backend Running"}
