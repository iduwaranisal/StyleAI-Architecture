import { useState, useRef } from 'react'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const uploadSectionRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setLoading(true)
    
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.success) {
        setResult(data)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Server connection failed. Please ensure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  // Premium, Responsive UI without images, using pure CSS abstract animations
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body { background-color: #030712; color: #f9fafb; overflow-x: hidden; }
    
    /* Navbar */
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: rgba(3, 7, 18, 0.8); backdrop-filter: blur(12px); position: fixed; top: 0; width: 100%; z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .logo { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; }
    .logo span { background: linear-gradient(135deg, #3b82f6, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    
    /* Hero Section */
    .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 0 20px; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%); z-index: -1; }
    .badge { background: rgba(59, 130, 246, 0.1); color: #60a5fa; padding: 8px 16px; border-radius: 20px; font-size: 0.875rem; font-weight: 600; margin-bottom: 24px; border: 1px solid rgba(59, 130, 246, 0.2); }
    .hero h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 24px; max-width: 900px; letter-spacing: -1px; }
    .hero h1 span { background: linear-gradient(135deg, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: clamp(1rem, 1.5vw, 1.25rem); color: #9ca3af; max-width: 600px; margin-bottom: 40px; line-height: 1.6; }
    .primary-btn { background: #fff; color: #030712; border: none; padding: 16px 32px; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 10px; }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,255,255,0.2); }
    
    /* Main Content Section */
    .main-section { padding: 100px 5%; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
    .section-title { font-size: 2rem; font-weight: 700; margin-bottom: 40px; text-align: center; }
    
    .upload-card { background: #111827; border: 1px solid #1f2937; border-radius: 24px; padding: 40px; width: 100%; max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; transition: all 0.3s ease; }
    .upload-area { border: 2px dashed #374151; border-radius: 16px; padding: 40px 20px; position: relative; cursor: pointer; transition: all 0.3s ease; background: rgba(17, 24, 39, 0.5); margin-bottom: 24px; }
    .upload-area:hover { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
    .file-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
    
    .preview-container { display: flex; justify-content: center; margin-top: 20px; }
    .preview-img { width: 220px; height: 220px; object-fit: cover; border-radius: 50%; border: 4px solid #1f2937; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    
    .action-btn { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border: none; padding: 16px; width: 100%; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39); display: flex; justify-content: center; align-items: center; }
    .action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5); }
    .action-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    
    /* Results Section */
    .results-container { width: 100%; margin-top: 80px; animation: slideUp 0.6s ease-out forwards; }
    .results-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; text-align: center; }
    .detected-shape { font-size: 2.5rem; font-weight: 800; color: #fff; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px; }
    
    /* New Abstract Animated Cards Grid */
    .styles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; width: 100%; }
    
    .animated-style-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      overflow: hidden;
      position: relative;
      min-height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
      transition: all 0.4s ease;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    }
    
    .animated-style-card:hover {
      transform: translateY(-8px);
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.25);
    }

    /* Dummy Background Animations */
    .abstract-anim {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      z-index: 0;
      opacity: 0.2;
      pointer-events: none;
    }
    
    /* Animation Type 1: Blue Glow */
    .anim-0 {
      background: radial-gradient(ellipse at center, #3b82f6 0%, transparent 60%);
      animation: morphBlob 8s ease-in-out infinite alternate;
    }
    
    /* Animation Type 2: Purple Glow */
    .anim-1 {
      background: radial-gradient(ellipse at center, #a855f7 0%, transparent 60%);
      animation: morphBlob 10s ease-in-out infinite alternate-reverse;
    }

    @keyframes morphBlob {
      0% { transform: scale(1) rotate(0deg) translate(0, 0); }
      50% { transform: scale(1.3) rotate(180deg) translate(5%, 10%); }
      100% { transform: scale(0.9) rotate(360deg) translate(-5%, -10%); }
    }

    /* Content perfectly centered inside the animation */
    .style-info-overlay {
      position: relative;
      z-index: 1;
    }
    
    .style-name {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 15px;
      background: linear-gradient(135deg, #ffffff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .style-reason {
      color: #cbd5e1;
      font-size: 1.1rem;
      line-height: 1.7;
    }
    
    /* Footer */
    .footer { text-align: center; padding: 40px 20px; border-top: 1px solid #1f2937; color: #6b7280; font-size: 0.9rem; margin-top: 60px; }
    
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    
    /* Loader Spinner */
    .loader { display: inline-block; width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 1s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <nav className="navbar">
        <div className="logo">✂️ <span>StyleAI</span> Architecture</div>
      </nav>

      <header className="hero">
        <div className="badge">Powered by Deep Learning & Computer Vision</div>
        <h1>Discover Your Perfect Haircut based on <span>Facial Geometry</span></h1>
        <p>Our advanced AI analyzes your facial structure to recommend hairstyles that perfectly balance and enhance your natural proportions.</p>
        <button className="primary-btn" onClick={scrollToUpload}>
          Get Started Now
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </button>
      </header>

      <main className="main-section" ref={uploadSectionRef}>
        <h2 className="section-title">Upload Your Portrait</h2>
        
        <div className="upload-card">
          <div className="upload-area">
            <input type="file" accept="image/*" className="file-input" onChange={handleFileChange} />
            {!previewUrl ? (
              <div style={{ padding: '20px 0' }}>
                <svg width="48" height="48" fill="none" stroke="#6b7280" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <h3 style={{ fontSize: '1.2rem', color: '#e5e7eb', margin: '0 0 8px 0' }}>Drag & drop your photo</h3>
                <p style={{ color: '#6b7280', margin: '0', fontSize: '0.9rem' }}>Or click to browse files (JPG, PNG)</p>
              </div>
            ) : (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="preview-img" />
              </div>
            )}
          </div>

          <button className="action-btn" onClick={handleUpload} disabled={loading || !selectedFile}>
            {loading ? <span className="loader"></span> : "Analyze Facial Structure"}
          </button>
        </div>

        {result && (
          <div className="results-container">
            <div className="results-header">
              <span style={{ color: '#9ca3af', fontSize: '1.1rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Analysis Complete</span>
              <h2 className="detected-shape">{result.face_shape} Shape</h2>
            </div>
            
            <div className="styles-grid">
              {result.recommendations.map((rec, index) => (
                <div className="animated-style-card" key={index}>
                  {/* Dynamic Dummy Animation Background based on the index */}
                  <div className={`abstract-anim anim-${index % 2}`}></div>
                  
                  {/* Result text over the animation */}
                  <div className="style-info-overlay">
                    <h3 className="style-name">{rec.name}</h3>
                    <p className="style-reason">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} StyleAI Architecture. Built with React & FastAPI.</p>
      </footer>
    </>
  )
}

export default App