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
      "Canopy size drives strawberry yield prediction, but measuring it by hand doesn't scale to whole fields. Our workflow runs in three stages over field video, with no camera calibration and no fine-tuning of SAM. First, YOLOv11 detects every plant, plus its flowers and fruit, in each frame. Second, an enhanced ByteTrack tracker keeps each plant's identity across frames. ByteTrack matches both high- and low-confidence detections against Kalman-predicted tracks, and we added moving averages and motion constraints so identities stay stable from frame to frame. Third, Segment Anything (SAM) segments each canopy, prompted with the plant's YOLO box plus automatically selected point prompts that exclude overlapping neighbors, flowers and fruit. The result is 0.924 IoU, beating the non-learning baselines. Published at the 2025 ASABE Annual International Meeting (paper 2500347).",
    year: "2024–2025",
    href: "https://doi.org/10.13031/aim.202500347",
  },
];
