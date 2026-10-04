export type Experience = {
  role: string;
  company: string;
  location: string;
  dates: string;
  stats: { value: string; label: string }[];
  highlights: string[];
  tags: string[];
  publication?: {
    title: string;
    authors: string;
    venue: string;
    summary: string;
    href?: string;
  };
};

export const EXPERIENCE: Experience[] = [
  {
    role: "Machine Learning Engineer Intern",
    company: "VSP Vision",
    location: "Rancho Cordova, CA · Remote",
    dates: "Feb 2026 – Aug 2026",
    stats: [
      { value: "50M+", label: "rows through the pipeline" },
      { value: "2", label: "models shipped to prod" },
      { value: "0.85", label: "AUC-ROC on 1:99 imbalance" },
    ],
    highlights: [
      "Built an end-to-end pipeline over 50M+ rows — Snowflake ingest through model scoring to marketing-side export — and deployed 2 production models via Snowflake Model Registry on scheduled, YAML-configured runs.",
      "Implemented dynamic batched loading in SQL and Python for scheduled inference on 50M-row tables, and co-designed the deployment template and data contract that standardized the team's ML release process.",
      "Configured a Snowflake Cortex Agent that turns stakeholders' natural-language questions into optimized SQL, so they can generate their own graphs and tables.",
      "Built an Isolation Forest classifier on a 1:99 imbalanced dataset (0.85 AUC-ROC, 0.20 PR-AUC), plus a GAN synthetic-data pipeline that improved F1 on classification benchmarks.",
      "Hosted workshops on Gaussian Mixture Models, Transformers, GANs and Mixture of Experts for the Data Science department.",
    ],
    tags: ["Snowflake", "SQL", "Python", "Isolation Forest", "GANs", "MLOps"],
  },
  {
    role: "Quant Developer",
    company: "AlgoGators Investment Fund",
    location: "University of Florida · Gainesville, FL",
    dates: "Jan 2026 – Present",
    stats: [],
    highlights: [
      "Manage the fund's data engine on PostgreSQL, pgAdmin and Docker, orchestrating ETL pipelines for market-data ingestion and backtesting.",
      "Use Mixture-of-Experts and reinforcement learning to generate synthetic anomaly data, then train XGBoost + attention models to detect tail events.",
    ],
    tags: ["PostgreSQL", "Docker", "ETL", "XGBoost", "Reinforcement learning", "Mixture of Experts"],
  },
  {
    role: "AI Engineer Intern",
    company: "Viettel AI Center",
    location: "Hanoi, Vietnam",
    dates: "May 2025 – Aug 2025",
    stats: [
      { value: "2.6M", label: "alarms modeled" },
      { value: "3.3k", label: "fault classes" },
      { value: "85%", label: "held-out, Jamba-lite (vs 72% GRU)" },
    ],
    highlights: [
      "Trained an end-to-end PyTorch sequence model that predicts the next network fault from multi-domain alarm streams — 2.6M alarms, 126k sequences, 3.3k fault classes — selecting checkpoints by hyperparameter search on reproducible snapshots.",
      "Implemented a Jamba-lite hybrid (Mamba SSM + selective attention) against a GRU baseline — 85% vs 72% on the held-out set — and handled class imbalance with class weights, focal loss and label smoothing.",
      "Pushed single-GPU training to 80% utilization with TF32 mixed precision, pinned memory and tuned DataLoaders; reported Top-k accuracy and object-level recall dashboards.",
    ],
    tags: ["PyTorch", "Mamba / SSMs", "Sequence modeling", "TF32 / mixed precision", "Hyperparameter search"],
  },
  {
    role: "Machine Learning Research Assistant",
    company: "UF Precision Agriculture Lab",
    location: "University of Florida · Gainesville, FL",
    dates: "Aug 2024 – Present",
    stats: [
      { value: "0.924", label: "IoU on canopy segmentation" },
      { value: "90%", label: "less manual labeling" },
      { value: "+25%", label: "ripeness prediction accuracy" },
    ],
    highlights: [
      "Developed a CUDA-accelerated OpenCV pipeline integrating YOLO detection and SAM2 segmentation for video-scale plant tracking, reaching 90% reliability across full growth cycles and cutting manual labeling effort by 90%.",
      "Built a PyTorch LSTM that predicts ripeness from segmentation-derived fruit and temporal growth patterns, improving accuracy by 25%.",
    ],
    tags: ["PyTorch", "CUDA", "OpenCV", "YOLO", "SAM2", "LSTM", "Computer vision"],
    publication: {
      title: "AI-Driven Plant Tracking and Segmentation for Precise Canopy Estimation in Strawberry Field",
      authors: "Z. Huang, W. S. Lee, M. Đ. Lê",
      venue: "ASABE Annual International Meeting 2025",
      summary:
        "Field-scale strawberry canopy estimation from video: YOLOv11 detects plants, flowers and fruit; an enhanced ByteTrack tracker (moving averages + motion constraints) holds each plant's identity across frames; and Segment Anything, prompted by YOLO boxes and auto-selected exclusion points, segments each canopy. Reached 0.924 IoU without camera calibration, beating non-learning baselines.",
      href: "https://doi.org/10.13031/aim.202500347",
    },
  },
  {
    role: "FinTech Software Engineer Intern",
    company: "FPT Software",
    location: "Hanoi, Vietnam · On-site",
    dates: "Jun 2024 – Aug 2024",
    stats: [
      { value: "8B", label: "param LLaMA 3.1 assistant" },
      { value: "RAG", label: "over project documentation" },
      { value: "3 mo", label: "on-site internship" },
    ],
    highlights: [
      "Developed an internal task-management assistant using LLaMA 3.1 8B integrated with Node.js to automate and streamline task handouts in a Waterfall development model.",
      "Implemented Retrieval-Augmented Generation (RAG) to query and synthesize project documentation for context-aware task assignments.",
      "Reduced manual coordination effort, improved clarity in task delegation, and built a scalable AI integration framework for structured workflows.",
    ],
    tags: ["LLaMA 3.1", "RAG", "Node.js", "LLMs"],
  },
  {
    role: "Project Captain, Launchpad Team",
    company: "Dream Team Engineering",
    location: "Gainesville, FL · Part-time",
    dates: "Jan 2024 – Present",
    stats: [
      { value: "97%", label: "twitch-detection accuracy" },
      { value: "$3k+", label: "cost cut for small clinics" },
      { value: "5", label: "person team led" },
    ],
    highlights: [
      "Take over stalled projects to finish development, document them thoroughly, and deploy deliverables for hospital and clinical use.",
      "Gator Goes to Surgery — led a five-person team building an interactive iOS app (Xcode, Cocos2d-X, C++) that eases children's anxiety before medical procedures; coordinated with Shands Hospital on App Store release and hospital integration.",
      "Train of Four — engineered an ML + MediaPipe twitch-response evaluation system at 97% accuracy that removes manual oversight and saves mid-to-small clinics over $3,000; deployed on Android.",
      "Milk Bank Optimizer — a calculator website that helps milk bank staff split donated milk into batches that meet calorie and protein targets.",
      "RAG chatbot — built a retrieval-augmented chatbot for Dream Team Engineering and the UF College of Medicine.",
    ],
    tags: ["C++", "iOS / Cocos2d-X", "MediaPipe", "Android", "RAG", "Leadership"],
  },
  {
    role: "Research Assistant",
    company: "Hanoi University of Science and Technology",
    location: "Hanoi, Vietnam · Part-time",
    dates: "Jun 2023 – Sep 2023",
    stats: [],
    highlights: [
      "Completed an 8-week IoT and AI summer training program run by Hanoi University of Science and Technology with Makipos Electric Company.",
      "Supported senior students and professors in carrying out graduation projects and theses.",
    ],
    tags: ["C++", "IoT", "AI"],
  },
];
