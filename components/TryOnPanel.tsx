
import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Zap, Shield, Sparkles, Loader2, X, ShoppingBag, Bookmark, Target, Maximize2 } from 'lucide-react';
import { Product, UserStatus } from '../types';
import { PRODUCTS } from '../constants';
import { ARCHIVE_PRODUCTS } from '../extraMockData';
import { GoogleGenAI } from "@google/genai";

interface TryOnPanelProps {
  userStatus: UserStatus;
  onAddToCart: (id: string) => void;
  onAddToVault: (id: string) => void;
  initialProductId?: string;
}

export const TryOnPanel: React.FC<TryOnPanelProps> = ({ userStatus, onAddToCart, onAddToVault, initialProductId }) => {
  const allProducts = [...PRODUCTS, ...ARCHIVE_PRODUCTS];
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    allProducts.find(p => p.id === initialProductId) || allProducts[0]
  );
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const analyzeIdentityFit = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    setAnalysis(null);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context && videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // Fixed: Use 'gemini-3-flash-preview' for vision analysis tasks instead of TTS model.
        // Also adjusted contents structure to match multimodal examples in the guidelines.
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                text: `Analyze this user's silhouette and posture in relation to the "${selectedProduct.name}". 
                Explain why this piece enhances their "Status Hierarchy" as a ${userStatus}. 
                Mention specific visual alignment like 'architectural shoulder profile' or 'chromatic resonance'.
                Tone: Brutalist, elite, tactical. Max 30 words.`,
              },
            ],
          },
        });
        const text = response.text;
        setAnalysis(text);
      } catch (err) {
        setAnalysis("Geometric alignment confirmed. The silhouette reinforces tactical dominance while preserving the mystery of the collective.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 px-4 md:px-24 flex flex-col lg:flex-row gap-8 overflow-hidden">
      {/* HUD / Camera Viewport */}
      <div className="flex-1 relative aspect-video lg:aspect-auto bg-stone-900 rounded-sm border border-white/5 overflow-hidden group shadow-2xl">
        {!isCameraActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
            <Camera size={48} className="text-stone-700" strokeWidth={1} />
            <button 
              onClick={startCamera}
              className="bg-white text-black px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
            >
              Initialize Optical Sensors
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover grayscale transition-all duration-1000"
            />
            {/* HUD Overlay Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50">Rec // Optical Synthesis</span>
              </div>
              
              {/* Product Overlay Mask (Stylized) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-1/2 h-4/5 border-x-[0.5px] border-white/20 relative">
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-white/10" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-white/10" />
                </div>
              </div>

              {/* Tactical Corners */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-white/20" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-white/20" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-white/20" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-white/20" />
            </div>

            {/* Analysis Result (Float) */}
            {analysis && (
              <div className="absolute top-8 right-8 w-64 p-6 bg-black/60 backdrop-blur-xl border border-white/10 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={14} className="text-amber-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Identity Audit</span>
                </div>
                <p className="text-xs font-serif italic text-stone-200 leading-relaxed mb-4">
                  "{analysis}"
                </p>
                <div className="h-px w-full bg-white/5 mb-4" />
                <p className="text-[8px] uppercase tracking-widest text-stone-600">Verification Hash: 88A-Z01</p>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-6 h-full shrink-0">
        <div className="bg-[#0D0D0D] border border-white/10 p-8 rounded-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-500">Tactical Deployment</h2>
            <h3 className="text-3xl font-serif">Virtual Try-On</h3>
          </div>

          {/* Product Selector */}
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-widest text-stone-600">Selected Silhouette</p>
            <div className="flex items-center gap-4 bg-black/40 p-3 border border-white/5 rounded-sm">
              <div className="w-16 h-20 bg-stone-900 grayscale">
                <img src={selectedProduct.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{selectedProduct.name}</h4>
                <p className="text-[9px] uppercase tracking-tighter text-stone-500">GH₵{selectedProduct.price}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={analyzeIdentityFit}
              disabled={isAnalyzing || !isCameraActive}
              className="w-full bg-white text-black py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-stone-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              Analyze Compatibility
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => onAddToCart(selectedProduct.id)}
                className="flex-1 border border-white/10 py-5 text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                Deploy
              </button>
              <button 
                onClick={() => onAddToVault(selectedProduct.id)}
                className="p-5 border border-white/10 hover:bg-white/5 flex items-center justify-center"
              >
                <Bookmark size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Browser Collection */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[40vh] lg:max-h-none custom-scrollbar">
          <p className="text-[9px] uppercase tracking-[0.4em] text-stone-600 px-2">Rotation Queue</p>
          {allProducts.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className={`flex items-center gap-4 p-4 border transition-all cursor-pointer group ${selectedProduct.id === p.id ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
            >
              <div className={`w-12 h-16 bg-stone-900 grayscale group-hover:grayscale-0 transition-all ${selectedProduct.id === p.id ? 'grayscale-0' : ''}`}>
                <img src={p.image} className="w-full h-full object-cover" />
              </div>
              <div>
                <h5 className="text-[11px] font-medium uppercase tracking-widest">{p.name}</h5>
                <p className="text-[9px] text-stone-500">{p.mood} // {p.fitConfidence}% Match</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
