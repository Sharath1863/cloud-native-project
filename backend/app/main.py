from fastapi import FastAPI
from app.routes.tasks import router as tasks_router
from app.health import router as health_router
from app.metrics import router as metrics_router
from fastapi.middleware.cors import CORSMiddleware

# 1️⃣ Create app first
app = FastAPI(title="Cloud Native Task API")

# 2️⃣ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3️⃣ Include routers
app.include_router(tasks_router)
app.include_router(health_router)
app.include_router(metrics_router)

@app.get("/")
def root():
    return {"message": "Cloud Native Backend Running"}
