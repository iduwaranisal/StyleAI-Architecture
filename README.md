<div align="center">

# ✂️ StyleAI Architecture

**Intelligent Facial Geometry Analysis & AI-Driven Haircut Recommender**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-007ACC?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)

<p align="center">
  <b>StyleAI Architecture</b> is a full-stack computer vision application that detects facial landmarks from user portraits, analyzes facial proportions using geometric computer vision algorithms, classifies face shapes, and delivers curated haircut recommendations designed to complement natural facial aesthetics.
</p>

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Facial Geometry & Classification Logic](#-facial-geometry--classification-logic)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [API Reference](#-api-reference)
- [Face Shapes & Recommendation Catalog](#-face-shapes--recommendation-catalog)
- [Roadmap & Enhancements](#-roadmap--enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Choosing the right hairstyle is an art rooted in geometry. Traditional haircut advice relies on subjective assessments of face shapes. **StyleAI Architecture** automates this process using **Google MediaPipe's Face Landmarker (New Tasks API)** to extract 3D facial coordinates, measure biometric ratios (length-to-width, jaw-to-cheek, forehead-to-cheek), determine facial morphology, and match users with cuts that balance their silhouette.

---

## ✨ Key Features

- **Automated Landmark Extraction**: Leverages MediaPipe's high-precision 468+ facial landmark mesh model (`face_landmarker.task`) with automatic asset download.
- **Geometric Morphology Analysis**: Evaluates biometric distance ratios between key facial landmarks (forehead, cheekbones, jawline, and chin).
- **Face Shape Classification**: Accurately categorizes face shapes into:
  - **Oblong**
  - **Square**
  - **Heart**
  - **Oval**
  - **Round**
- **Curated Haircut Guidance**: Offers tailored hairstyle recommendations accompanied by visual and aesthetic rationales explaining *why* each style balances the user's features.
- **Modern Responsive UI**: Premium glassmorphic interface built with **React 19** and **Vite**, featuring smooth drag-and-drop file upload, portrait preview, and abstract dynamic CSS animations.
- **High-Performance Asynchronous API**: Built with **FastAPI** for low latency and high-throughput processing.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (React 19 + Vite)"]
        A[User Uploads Portrait] --> B[File Validation & Image Preview]
        B --> C[HTTP POST /predict with multipart/form-data]
        H[Render Dynamic Result Cards & Advice] <-- G[Receive JSON Response]
    end

    subgraph Server["Backend (FastAPI)"]
        C --> D[PIL Image Processing & Normalization]
        D --> E[MediaPipe FaceLandmarker Task]
        E --> F[Geometric Ratio Classifier]
        F --> G
    end
```

---

## 📐 Facial Geometry & Classification Logic

The system measures Euclidean distances across key MediaPipe facial landmark points:

| Landmark Point | MediaPipe Index | Anatomical Feature |
| :--- | :--- | :--- |
| `top_of_head` | Index `10` | Upper Forehead / Hairline Center |
| `bottom_of_chin` | Index `152` | Chin Tip |
| `left_cheek` / `right_cheek` | Index `234` / `454` | Zygomatic Arch (Cheekbones) |
| `left_jaw` / `right_jaw` | Index `132` / `361` | Mandible / Jaw Angles |
| `left_forehead` / `right_forehead` | Index `103` / `332` | Supraorbital Margin (Forehead Width) |

### Classification Rules

1. **Length-to-Width Ratio**: $\text{Face Length} / \text{Cheek Width}$
2. **Jaw-to-Cheek Ratio**: $\text{Jaw Width} / \text{Cheek Width}$
3. **Forehead-to-Cheek Ratio**: $\text{Forehead Width} / \text{Cheek Width}$

```
                  ┌──────────────────────────────┐
                  │ Calculate Biometric Ratios  │
                  └──────────────┬───────────────┘
                                 │
                 Is Length/Cheek Ratio > 1.35?
                    ├──────────► YES: [ Oblong ]
                    ▼ NO
                 Is Jaw/Cheek Ratio > 0.85?
                    ├──────────► YES: [ Square ]
                    ▼ NO
       Is Forehead/Cheek > 0.80 AND Jaw/Cheek < 0.70?
                    ├──────────► YES: [ Heart ]
                    ▼ NO
        Is Length/Cheek > 1.2 AND Jaw/Cheek < 0.85?
                    ├──────────► YES: [ Oval ]
                    ▼ NO
                 Default Fallback: [ Round ]
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Bundler & Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: Modern Vanilla CSS, Glassmorphism, CSS keyframe animations, `@font-face` Plus Jakarta Sans
- **Linting**: ESLint 10

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **Computer Vision**: [Google MediaPipe](https://developers.google.com/mediapipe) (Vision Tasks API), [Pillow](https://python-pillow.org/), [NumPy](https://numpy.org/), [OpenCV Headless](https://github.com/opencv/opencv-python)
- **Form/File Parsing**: `python-multipart`

---

## 📁 Project Directory Structure

```text
StyleAI-Architecture/
├── backend/
│   ├── face_landmarker.task   # MediaPipe face landmarker model (auto-downloaded)
│   ├── main.py                # FastAPI app, classification logic & endpoints
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/                # Static assets & icons
│   ├── src/
│   │   ├── App.jsx            # Main React component with UI & API integration
│   │   ├── App.css            # Stylesheet
│   │   ├── index.css          # Base styles
│   │   └── main.jsx           # React DOM entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend package dependencies and scripts
│   └── vite.config.js         # Vite configuration
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- **Python 3.10+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** and **npm**: [Download Node.js](https://nodejs.org/)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create and activate a virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   > 💡 *On first startup, the server will automatically download `face_landmarker.task` (~3.7MB) if it is not already present.*

   - **API Base URL**: `http://127.0.0.1:8000`
   - **Interactive API Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

1. Open a separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser at `http://localhost:5173` (or the URL provided by Vite).

---

## 🔌 API Reference

### Face Shape & Haircut Prediction

- **Endpoint**: `POST /predict`
- **Content-Type**: `multipart/form-data`

#### Request
| Parameter | Type | In | Description |
| :--- | :--- | :--- | :--- |
| `file` | `binary / File` | `formData` | Clear portrait image (JPG, PNG, WebP) |

#### Example `curl` Request

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@portrait.jpg"
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "face_shape": "Oval",
  "recommendations": [
    {
      "name": "Pompadour",
      "image": "https://images.unsplash.com/photo-1506804886640-3af7b8022bbd?w=400",
      "reason": "Highlights the balanced proportions of a highly versatile face shape."
    },
    {
      "name": "Quiff",
      "image": "https://images.unsplash.com/photo-1520155707862-5b328153d109?w=400",
      "reason": "Adds stylish volume to the front while maintaining a neat, modern look."
    }
  ]
}
```

#### Error Response (`400 Bad Request`)

```json
{
  "success": false,
  "error": "400: No face detected in the image. Please upload a clear portrait."
}
```

---

## ✂️ Face Shapes & Recommendation Catalog

| Face Shape | Recommended Cuts | Styling Rationale |
| :--- | :--- | :--- |
| **Oval** | Pompadour, Quiff | Balanced proportions allow versatility; volume on top maintains symmetry. |
| **Round** | High Skin Fade, Faux Hawk | Short sides create the illusion of elongation; top height breaks circularity. |
| **Square** | Classic Side Part, French Crop | Softens a prominent, angular jawline while keeping a masculine structure. |
| **Oblong** | Buzz Cut, Crew Cut | Keeps vertical proportions compact to prevent lengthening the silhouette. |
| **Heart** | Textured Fringe, Side Part | Balances a wider forehead with a pointed chin by creating visual weight lower down. |

---

## 🔮 Roadmap & Enhancements

- [ ] **Virtual Hairstyle Try-On**: Integrate generative AI or 3D AR overlays to preview hairstyles directly on user portraits.
- [ ] **Expanded Facial Typologies**: Support diamond, triangle, and pear face shapes.
- [ ] **Beard & Eyewear Matching**: Add facial hair and glasses recommendations tailored to facial geometry.
- [ ] **Hair Texture Customization**: Factor in hair density, curl pattern (straight, wavy, curly, coily), and thickness.
- [ ] **Dockerization**: Provide `docker-compose.yml` for unified single-command deployment.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add awesome feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/awesome-feature
   ```
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use, modify, and distribute it in your own projects.
