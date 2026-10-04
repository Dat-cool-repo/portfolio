export type ResearchItem = {
  title: string;
  venue: string;
  summary: string;
  year: string;
  href?: string;
};

export const RESEARCH: ResearchItem[] = [
  {
    title: "Tracing fine-tuned behavior back to training tokens",
    venue: "Theoretical ML Researcher · University of Florida",
    summary:
      "A gradient-based model-diffing method that decomposes a fine-tuned model's weight update into a sparse sum of per-token gradient atoms — attributing behaviors learned during fine-tuning to specific tokens, sentences and documents in the training data. I built the multi-GPU gradient extraction pipeline (PyTorch, CUDA, DDP, LoRA, EKFAC) for Gemma-3 12B, computing per-token gradients across 406K+ completion tokens and 2.2M LoRA parameters.",
    year: "2026–Now",
  },
  {
    title: "AI-driven plant tracking for canopy estimation",
    venue: "UF/IFAS Precision Agriculture Lab · ASABE 2025",
    summary:
      "Manual canopy measurement doesn't scale to whole strawberry fields. We combined YOLOv11 detection, an enhanced ByteTrack tracker (moving averages + motion constraints) and Segment Anything with better prompt selection to track and segment every plant through its growth cycle — 0.924 IoU, published at the 2025 ASABE Annual International Meeting.",
    year: "2024–2025",
  },
];
