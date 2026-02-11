from fastapi import APIRouter, Response
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

router = APIRouter()

REQUEST_COUNT = Counter(
    "app_requests_total",
    "Total number of requests"
)

@router.get("/metrics")
def metrics():
    REQUEST_COUNT.inc()
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )
