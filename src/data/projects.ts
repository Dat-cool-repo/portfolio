export type Project = {
  title: string;
  blurb: string;
  tags: string[];
  year: string;
  href?: string;
  /** Screenshot in /public; replaces the splash art when set. */
  image?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: "AgentFork",
    blurb:
      "A counterfactual debugger for black-box LLM agents in stateful environments. Tracing tells you what an agent did; AgentFork tells you what would have happened otherwise. Fork a recorded trajectory at any step, rebuild the Postgres world exactly as it was, change one thing (the model, what retrieval returned, a tool's reply, what memory held), then run it forward N times to get an outcome distribution instead of a guess. Agents are recorded as OpenTelemetry GenAI spans with content-addressed payloads at 0.0037% overhead. Replays fan out over a Redis Streams queue with leases, reclaim on worker death, idempotent results and a shared token-bucket rate limiter, each in its own isolated database across five isolation strategies that are ablated for leaks by state hashing. On injected faults with no oracle access, adding replay-based intervention to trace analysis raised layer-attribution accuracy from 79.7% to 96.9% (McNemar p < 0.001), and a regression gate replays past incidents to block bad config changes.",
    tags: ["Python", "PostgreSQL", "Redis Streams", "OpenTelemetry", "MCP", "LLM agents", "Causal inference"],
    year: "2026",
    featured: true,
  },
  {
    title: "transPEAKtation",
    blurb:
      "Routes a whole city around congestion before it forms. The app pulls events and road data from across town into MongoDB for persistence, then runs the time-series logic on Tiger Data. On top of that, we built and trained a deep learning model from scratch that forecasts congestion across all of San Francisco at horizons from 10–30 minutes out to 1–3 hours. Dynamic Dijkstra finds the 24 best road options, then a PPO reinforcement-learning policy or a heuristic load balancer assigns a route to every person in the traffic flow so everyone gets home as fast as possible. At 30% participation, our users get home 30% faster; at 100% participation, traffic drops by 60%. Built with a four-person team at ShellHacks — won 2nd Place Best Use of AWS and Best Use of Tiger Data.",
    tags: ["Deep learning", "PPO / RL", "Dijkstra", "MongoDB", "Tiger Data", "AWS", "Hackathon"],
    year: "2026",
    href: "https://yowaymo.us/about",
    featured: true,
  },
  {
    title: "Clinical Action Prediction",
    blurb:
      "A spatio-temporal graph neural network in PyTorch Geometric with CUDA graphs that predicts a patient's next 5 clinical actions at 82% precision. Integrated PubMedBERT embeddings with the Athena database and applied outlier-sensitive min-max scaling, reducing noise by 18%. Built with Dream Team Engineering.",
    tags: ["PyTorch Geometric", "CUDA", "GNNs", "PubMedBERT"],
    year: "2024–Now",
  },
  {
    title: "Train of Four",
    blurb:
      "An Android app that replaces expensive train-of-four monitoring hardware with a phone camera. During the train-of-four procedure, MediaPipe hand-landmark tracking detects the patient's thumb twitches in response to nerve stimulation and scores them automatically: 97% accuracy, no manual oversight, and over $3,000 saved for mid-to-small clinics. Built natively in Kotlin with Dream Team Engineering.",
    tags: ["Kotlin", "Android", "MediaPipe", "Computer vision", "Healthcare"],
    year: "2025",
  },
  {
    title: "Milk Bank Optimizer",
    blurb:
      "A calculator website for milk bank staff that works out how to split donated milk into suitable batches, combining donations into pools that meet calorie and protein targets instead of balancing them by hand. Built in React and hosted on Firebase with Dream Team Engineering.",
    tags: ["React", "JavaScript", "Firebase", "Optimization", "Healthcare"],
    year: "2025",
  },
  {
    title: "Gator Goes to Surgery",
    blurb:
      "An interactive iOS game that eases children's anxiety before medical procedures. I led a five-person team building it in C++ on Cocos2d-X and coordinated with UF Health Shands Hospital on App Store release and hospital integration.",
    tags: ["C++", "Cocos2d-X", "iOS", "Xcode", "Healthcare"],
    year: "",
  },
  {
    title: "Horus",
    blurb:
      "The eye for the blind: a real-time navigation assistant on a Raspberry Pi that warns visually impaired users about obstacles and reads signs aloud, combining YOLO object detection, depth estimation and PaddleOCR. AWS EC2/S3 infrastructure provisioned with Terraform for device monitoring and over-the-air model updates. Won Best Use of Terraform at SwampHacks.",
    tags: ["Raspberry Pi", "C++", "OpenCV", "YOLO", "Terraform", "AWS", "Hackathon"],
    year: "2024",
  },
  {
    title: "At-Home Range of Motion",
    blurb:
      "Range-of-motion testing without the trip to the clinic: native Android (Kotlin) and iOS (Swift) apps that run MediaPipe pose tracking on-device so patients can take a ROM test at home, skipping the time and cost of commuting to a clinical facility. Tested on external rotation, forward elevation, external rotation at 90° and abduction.",
    tags: ["Kotlin", "Swift", "MediaPipe", "Android", "iOS", "Pose estimation"],
    year: "2026",
  },
  {
    title: "Dermatology Diagnosis",
    blurb:
      "Upload a photo of a skin lesion and get the three most likely diagnoses across seven lesion types, from benign keratosis and melanocytic nevi to melanoma and basal cell carcinoma. I built a CNN ensemble of ResNet-50, EfficientNet and YOLO, trained in PyTorch on 10K+ medical images with OpenCV preprocessing, which boosted top-1 accuracy by 12% and top-3 accuracy by 18%. The top-3 predictions are served through a FastAPI REST endpoint, containerized with Docker and deployed on AWS ECS at 99.9% uptime.",
    tags: ["PyTorch", "OpenCV", "ResNet-50", "EfficientNet", "YOLO", "FastAPI", "Docker", "AWS"],
    year: "2024",
  },
  {
    title: "SET Robot",
    blurb:
      "A robot built with UF's SASE Engineering Team. I worked on the electrical side, wiring the robot's electronics: Arduino Uno and Nano controllers, motor drivers for the drive wheels, and the stepper motor and servos that move the arm. I also handled the lidar data processing. Distance and signal-strength frames from a TF-series lidar are read over serial, paired with the stepper's sweep angle, and converted from polar readings into x–y points the navigation code can use.",
    tags: ["Arduino", "C++", "Python", "Lidar", "Electronics", "Robotics"],
    year: "2023–2024",
  },
];
