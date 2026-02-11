from fastapi import FastAPI
from app.routes.tasks import router as tasks_router
from app.health import router as health_router
from app.metrics import router as metrics_router
from fastapi.middleware.cors import CORSMiddleware
# Add this import!
from prometheus_fastapi_instrumentator import Instrumentator

# 1️⃣ Create app
app = FastAPI(title="Cloud Native Task API")

# 2️⃣ Initialize Prometheus Instrumentator
# This "plugs in" the metrics tracker to your FastAPI app
instrumentator = Instrumentator().instrument(app)

# 3️⃣ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4️⃣ Include routers
app.include_router(tasks_router)
app.include_router(health_router)
app.include_router(metrics_router)

# 5️⃣ Expose the /metrics endpoint
# This creates the page that Prometheus reads from
@app.on_event("startup")
async def _startup():
    instrumentator.expose(app)

@app.get("/")
def root():
    return {"message": "Cloud Native Backend Running"}