import { useState, useEffect } from 'react'
import AccordionRenderer from './components/AccordionRenderer'
import type { AccordionData } from './types'
import FloatingAddMenu from './components/FloatingAddMenu'
import Navbar from './components/Navbar'

function App() {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [accordions, setAccordions] = useState<AccordionData[]>([
    {
      id: 'what-is-firmware',
      type: 'accordion',
      question: '🧠 1️⃣ What is Firmware?',
      answer: '**Firmware** is low-level software embedded inside hardware devices.\n\nIn SSDs, firmware:\n*   Runs on the SSD controller (a small processor inside the drive)\n*   Manages how data is written, read, erased\n*   Handles NAND memory operations\n*   Controls error correction and wear management\n\nIt is **NOT** Windows/macOS software.\nIt runs inside the SSD itself.'
    },
    {
      id: 'firmware-architecture',
      type: 'diagram',
      question: '🧩 2️⃣ How SSD Firmware Works (Architecture)',
      answer: '```mermaid\ngraph TD\n    Host["💻 Host (Laptop / Server)"] --> Controller["⚙️ SSD Controller (Firmware runs here)"]\n    Controller --> FTL["🗺️ Flash Translation Layer (FTL)"]\n    FTL --> NAND["💾 NAND Flash Memory"]\n```'
    },
    {
      id: 'firmware-functions',
      type: 'accordion',
      question: '🔹 What Firmware Does (Internals)',
      answer: '### 1️⃣ Flash Translation Layer (FTL)\nMaps logical addresses → physical NAND blocks.\n*   NAND cannot overwrite directly.\n*   Must erase before writing.\n\n### 2️⃣ Wear Leveling\nEnsures writes are distributed evenly so no block wears out too early.\n\n### 3️⃣ Garbage Collection\nCleans invalid data pages to free up space.\n\n### 4️⃣ Error Correction (ECC)\nCorrects bit errors from NAND degradation.\n\n### 5️⃣ SMART Monitoring\nTracks health metrics like **Bad block count**, **P/E cycles**, and **Temperature**.\n\n> ⚠️ **Limitation**: Current firmware uses mostly **static threshold-based logic** (e.g., `if bad_block_count > 100 then alert`).'
    },
    {
      id: 'limitations',
      type: 'accordion',
      question: '⚠️ 3️⃣ Why Current Firmware Monitoring is Limited',
      answer: 'Firmware today:\n*   Uses **fixed thresholds**\n*   Does not predict trends\n*   Cannot correlate multiple metrics intelligently\n*   Does not estimate Remaining Useful Life (RUL)\n\n**Example:**\nA drive might show:\n1.  Slight temperature instability\n2.  Gradual error rate increase\n3.  Rising write amplification\n\n**Individually fine. Together → early degradation pattern.**\n\nCurrent firmware doesn’t detect this multi-factor relationship.'
    },
    {
      id: 'ai-solution',
      type: 'accordion',
      question: '🚀 4️⃣ What Our AI Solution Does Differently',
      answer: 'Instead of **Rule-based threshold alerts**, we implement **Pattern-based predictive intelligence**.\n\nWe analyze:\n*   Trend over time\n*   Metric correlations\n*   Degradation slope\n*   Abnormal deviations\n\nOur system predicts:\n*   **Remaining Useful Life (RUL)**\n*   **Failure probability**\n*   **Risk score**\n\nThis is true **Predictive Maintenance**.'
    },
    {
      id: 'communication',
      type: 'accordion',
      question: '🧠 5️⃣ How Firmware Communicates with AI',
      answer: '### 🏗 OPTION A: Enterprise Monitoring Layer (Most Practical)\n\n1.  **Firmware** collects SMART telemetry and exports logs.\n2.  **Enterprise Storage Server** aggregates these logs.\n3.  **Our AI Engine** processes the logs to generate Prediction & Health Scoring.\n4.  **Dashboard** displays predictive alerts to the admin.\n\n> This requires **NO firmware modification** and is realistic for data centers.\n\n### 🏗 OPTION B: AI-Assisted Firmware Optimization (Advanced)\n\nFuture possibility: Firmware runs a lightweight ML model onboard to adjust wear leveling dynamically based on predicted degradation.'
    },
    {
      id: 'ml-pipeline',
      type: 'diagram',
      question: '📊 Complete ML Pipeline',
      answer: '```mermaid\ngraph TD\n    A["SMART Logs (Time Series)"] --> B["Feature Engineering<br>(Rolling Mean, Slope, Volatility)"]\n    B --> C["Feature Matrix"]\n    C --> D["RUL Model<br>(XGBoost/RF)"]\n    C --> E["Health Classifier<br>(Random Forest)"]\n    C --> F["Anomaly Detector<br>(Isolation Forest)"]\n    D & E & F --> G["Health Score Engine"]\n    G --> H["Recommendation Engine"]\n    H --> I["Dashboard"]\n```'
    },
    {
      id: 'model-strategy',
      type: 'accordion',
      question: '🎯 Core Modeling Strategy',
      answer: '### 1️⃣ Remaining Useful Life (RUL)\n*   **Goal**: Predict days until failure.\n*   **Model**: **XGBoost** or **Random Forest Regressor**.\n*   **Why**: Handles nonlinear relationships, works with small data, interpretable.\n\n### 2️⃣ Health Classification\n*   **Goal**: Classify as Healthy, Degrading, or Critical.\n*   **Model**: **Random Forest Classifier**.\n\n### 3️⃣ Anomaly Detection\n*   **Goal**: Detect abnormal deviation.\n*   **Model**: **Isolation Forest** (Unsupervised).\n\n### 🔥 Why NOT LSTM?\nLSTM is great for deep sequences but requires massive datasets and is hard to interpret. For this hackathon, **Feature Engineering + Tree Ensembles** offers better stability, training speed, and explainability for firmware engineers.'
    },
    {
      id: 'hackathon-scope',
      type: 'accordion',
      question: '🎯 For Hackathon — What We Are Building',
      answer: 'We are building:\n\n> **An AI engine that analyzes SMART telemetry exported by SSD firmware and provides predictive failure intelligence to enterprise management systems.**\n\n### 🏆 Value for SanDisk\n*   Moves from **Reactive** to **Predictive**.\n*   Offers AI-enhanced enterprise SSD solutions.\n*   Reduces unexpected failures.\n*   Markets "AI-powered reliability".'
    },
    {
      id: 'technical-summary',
      type: 'markdown',
      question: '📊 Technical Difference Summary',
      answer: '### 📊 Technical Difference Summary\n\n| Firmware Today | Our AI System |\n| :--- | :--- |\n| Rule-based | **ML-based** |\n| Static thresholds | **Adaptive prediction** |\n| Local detection | **Global analytics** |\n| Binary alerts | **Continuous health score** |\n| No RUL | **Remaining Life Estimation** |'
    },
    {
      id: 'final-pitch',
      type: 'accordion',
      question: '💎 FlashSentinel AI: The Pitch',
      answer: '### 🥇 Name: FlashSentinel AI\n\n> "FlashSentinel AI is a predictive health intelligence engine for NAND-based SSDs that estimates remaining useful life and enables proactive failure prevention."\n\n**Simple Explanation:**\n*   **Firmware** = Internal SSD manager (collects raw telemetry).\n*   **FlashSentinel AI** = Intelligent health prediction brain (turns data into insights).'
    }
  ])

  const handleCreate = () => {
    const newId = String(Date.now());
    setAccordions((prev) => [...prev, { id: newId, type: 'accordion', question: '', answer: '' }]);
  };

  const handleAddDiagram = () => {
    const newId = String(Date.now());
    const template = "```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```";
    setAccordions((prev) => [...prev, { id: newId, type: 'diagram', question: '', answer: template }]);
  };

  const handleAddMarkdown = () => {
     const newId = String(Date.now());
    setAccordions((prev) => [...prev, { id: newId, type: 'markdown', question: '', answer: '' }]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shortcutsEnabled) return;
      
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case "1":
          handleCreate();
          break;
        case "2":
          handleAddDiagram();
          break;
        case "3":
          handleAddMarkdown();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutsEnabled]);

  const handleUpdate = (id: string, data: Partial<AccordionData>) => {
    setAccordions(accordions.map(acc => acc.id === id ? { ...acc, ...data } : acc))
  }

  const handleDelete = (id: string) => {
    setAccordions(accordions.filter(acc => acc.id !== id))
  }

  return (
    <div className="min-h-screen bg-notion-bg text-notion-text-DEFAULT transition-colors duration-300">
      <Navbar shortcutsEnabled={shortcutsEnabled} setShortcutsEnabled={setShortcutsEnabled} />
      
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12 space-y-xl">
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12 space-y-xl">
        <AccordionRenderer
          accordions={accordions}
          canEdit={true}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
      </div>
      <FloatingAddMenu
        onAddQuestion={handleCreate}
        onAddMarkdown={handleAddMarkdown}
        onAddDiagram={handleAddDiagram}
      />
    </div>
  )
}

export default App
