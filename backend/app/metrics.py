from fastapi import APIRouter
from prometheus_client import Counter, generate_latest

router = APIRouter()

REQUEST_COUNT = Counter(
    "app_requests_total",
    "Total number of requests"
)

@router.get("/metrics")
def metrics():
    REQUEST_COUNT.inc()
    return generate_latest()

