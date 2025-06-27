from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_valid_profile():
    response = client.post("/api/profile/save", json={
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane.doe@example.com",
        "phone": "9876543210",
        "age": 22,
        "education": "B.Tech",
        "experience": "2 years",
        "resumePath": "resume.pdf"
    })
    assert response.status_code == 200
    assert "results" in response.json()
