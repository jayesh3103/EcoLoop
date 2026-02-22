import time
import random
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

app = FastAPI(title="EcoLoop API")

# Add CORS middleware to allow React Native frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "service": "EcoLoop Hardware Scanner API"}

@app.post("/api/scan")
async def scan_hardware(image: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Simulated endpoint for processing hardware images.
    In a real scenario, this would pass the image to an ONNX/PyTorch model.
    """
    # Simply read the file to ensure we received it
    contents = await image.read()
    file_size_kb = len(contents) / 1024
    print(f"Received image: {image.filename}, Size: {file_size_kb:.2f} KB")

    # Simulate ML processing time
    time.sleep(2.0)

    # Mock responses
    mock_results = [
        "IDENTIFIED: STEPPER MOTOR [98.4%]",
        "IDENTIFIED: BROKEN PC FAN [95.1%]",
        "IDENTIFIED: LITHIUM BATTERY [92.3%]",
        "IDENTIFIED: COPPER WIRE [99.1%]"
    ]
    
    # Simple deterministic mock based on file size for testing
    if file_size_kb % 2 > 1:
        result = mock_results[0]
    else:
        result = mock_results[1]

    return {
        "success": True,
        "filename": image.filename,
        "size_kb": round(file_size_kb, 2),
        "result": result
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
