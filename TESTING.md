# Testing Guide for Physical Compiler V1

This guide will help you test both the backend and frontend components of the application.

## Prerequisites

1. **Python 3.8+** with `uv` package manager (or use `venv` + `pip`)
2. **Node.js 18+** and npm (or bun if preferred)
3. **Gemini API Key** from Google AI Studio

## Step 1: Backend Setup & Testing

### 1.1 Install Dependencies

```bash
cd canvas/backend

# Option A: Using uv (recommended)
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt

# Option B: Using standard Python venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 1.2 Configure Environment Variables

Create a `.env` file in `canvas/backend/`:

```bash
# On Windows PowerShell
cd canvas/backend
New-Item -Path .env -ItemType File

# Add this line to .env:
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/apikey

### 1.3 Start the Backend Server

```bash
# Using uv
uv run uvicorn app.main:app --reload

# Or using standard Python
uvicorn app.main:app --reload
```

The backend will run on `http://localhost:8000`

### 1.4 Test Backend Endpoints

**Health Check:**
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:8000/health

# Or open in browser:
# http://localhost:8000/health
```

**Root Endpoint:**
```bash
# Browser: http://localhost:8000/
# Should return: {"message": "Physical Compiler API V1", "status": "running"}
```

**API Documentation:**
- Open in browser: `http://localhost:8000/docs` (Swagger UI)
- Or: `http://localhost:8000/redoc` (ReDoc)

### 1.5 Test Generate Endpoint (Manual)

You can test the generate endpoint using curl or PowerShell:

```powershell
# PowerShell example
$body = @{
    prompt = "Create a simple cube"
    imageBase64 = $null
    previousCode = $null
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8000/api/generate -Method POST -Body $body -ContentType "application/json"
```

## Step 2: Frontend Setup & Testing

### 2.1 Install Dependencies

```bash
cd canvas/frontend

# Install npm packages
npm install
```

### 2.2 Configure Backend URL (Optional)

If your backend runs on a different port, create a `.env` file in `canvas/frontend/`:

```bash
VITE_BACKEND_URL=http://localhost:8000
```

By default, it uses `http://localhost:8000`.

### 2.3 Start the Frontend Dev Server

```bash
# Using npm (recommended since bun isn't installed)
npm run dev

# If you have bun installed:
bun run dev
```

The frontend will run on `http://localhost:5173`

### 2.4 Verify Frontend Loads

1. Open browser: `http://localhost:5173`
2. You should see:
   - Left pane: Drawing canvas
   - Right pane: Empty 3D viewer with "CORE_SYSTEM_READY" message
   - Header: "Physical Compiler V1" with status indicators

## Step 3: End-to-End Testing

### Test Case 1: Generate a Simple 3D Model

1. **Draw or Upload an Image:**
   - In the left pane, draw a simple shape (e.g., a rectangle)
   - OR drag & drop an image file

2. **Enter a Prompt:**
   - In the text area, type: `"Create a simple smartphone stand"`

3. **Generate:**
   - Click "Initialize_Design_Sequence" button
   - Wait for generation (status shows "EXECUTING_CORE_LOGIC...")

4. **Verify:**
   - Right pane should display a 3D model
   - You can drag to rotate, scroll to zoom
   - Code appears in the validation panel at the bottom

### Test Case 2: Iterative Refinement

1. **After generating a model:**
   - Click "REC SNAPSHOT" button in the 3D viewer
   - This captures the current view

2. **Modify the Design:**
   - The snapshot appears in the left canvas
   - Enter a new prompt: `"Add a hole in the center"`
   - Click "Update_Geometry_Matrix"

3. **Verify:**
   - The model should update with the new modification
   - Status should show "REFINEMENT_MODE_ACTIVE"

### Test Case 3: Export STL

1. **After generating a model:**
   - Click "EXPORT STL" button in the 3D viewer
   - A `.stl` file should download

### Test Case 4: Reset Functionality

1. **After generating/modifying:**
   - Click "System_Reset" button in header
   - Confirm the reset
   - Everything should clear back to initial state

## Step 4: Testing Checklist

### Backend Tests
- [ ] Backend server starts without errors
- [ ] Health endpoint returns `{"status": "healthy"}`
- [ ] Root endpoint returns API info
- [ ] Generate endpoint accepts requests
- [ ] Generate endpoint returns valid JSCAD code
- [ ] CORS is configured correctly (frontend can connect)

### Frontend Tests
- [ ] Frontend dev server starts
- [ ] Page loads without console errors
- [ ] Canvas drawing works
- [ ] Image drag & drop works
- [ ] Text input accepts prompts
- [ ] Generate button triggers API call
- [ ] 3D viewer displays generated models
- [ ] Camera controls work (drag, zoom)
- [ ] Snapshot functionality works
- [ ] STL export works
- [ ] Reset button clears state

### Integration Tests
- [ ] Frontend can communicate with backend
- [ ] Generate request succeeds
- [ ] 3D model renders correctly
- [ ] Iterative refinement works
- [ ] Error handling displays properly

## Troubleshooting

### Backend Issues

**Problem: `GEMINI_API_KEY not configured`**
- Solution: Create `.env` file in `backend/` with `GEMINI_API_KEY=your_key`

**Problem: `ModuleNotFoundError`**
- Solution: Ensure virtual environment is activated and dependencies are installed

**Problem: Port 8000 already in use**
- Solution: Change port: `uvicorn app.main:app --reload --port 8001`
- Update frontend `.env`: `VITE_BACKEND_URL=http://localhost:8001`

### Frontend Issues

**Problem: `bun: command not found`**
- Solution: Use `npm run dev` instead

**Problem: Cannot connect to backend**
- Solution: 
  1. Verify backend is running on port 8000
  2. Check browser console for CORS errors
  3. Verify `VITE_BACKEND_URL` in frontend `.env`

**Problem: 3D model doesn't render**
- Solution:
  1. Check browser console for errors
  2. Verify JSCAD code is valid (check validation panel)
  3. Check network tab for API errors

**Problem: Canvas not drawing**
- Solution: Check browser console, ensure canvas element is properly initialized

### API Issues

**Problem: `429 Too Many Requests`**
- Solution: Gemini API rate limit hit. Wait a few minutes or use a different model (code tries multiple models automatically)

**Problem: Invalid JSCAD code generated**
- Solution: Check backend logs, try a more specific prompt, or report the issue

## Quick Test Commands

```powershell
# Test backend health
Invoke-WebRequest -Uri http://localhost:8000/health

# Test frontend is running
Invoke-WebRequest -Uri http://localhost:5173

# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :5173
```

## Next Steps

Once basic testing passes:
1. Test with various prompts and sketches
2. Test edge cases (empty prompts, invalid images, etc.)
3. Test error handling
4. Performance testing with larger models
5. Test on different browsers

