import { useState, useEffect } from 'react'
import AccordionRenderer from './components/AccordionRenderer'
import type { AccordionData } from './types'
import FloatingAddMenu from './components/FloatingAddMenu'
import Navbar from './components/Navbar'

function App() {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [accordions, setAccordions] = useState<AccordionData[]>([
    {
      id: 'problem-statement',
      type: 'accordion',
      question: '🧠 First: Nature of Our Problem',
      answer: 'We are dealing with **SSD SMART telemetry**, multivariate data, time-evolving degradation, and failure prediction.\n\nThis is a:\n\n> Multivariate Time-Series Reliability Prediction Problem\n\n**Data Collection:**\nEach drive has metrics like:\n- `timestamp`\n- `power_on_hours`\n- `program_erase_cycles`\n- `bad_block_count`\n\nSince we lack millions of labeled failure sequences, we must balance technical correctness with hackathon feasibility.'
    },
    {
      id: 'latex-delimiters',
      type: 'accordion',
      question: 'LaTeX Delimiters & Images',
      answer: 'Display Math using `\\[ ... \\]`: \\[ x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} \\]\n\nInline Math using `\\( ... \\)`: The value is \\( \\pi \\approx 3.14 \\).\n\nImage Test:\n![Placeholder Image](https://placehold.co/600x400)'
    },

    {
      id: 'pipeline-diagram',
      type: 'diagram',
      question: '📊 Full Pipeline Overview',
      answer: '```mermaid\ngraph TD\n    A["SMART Logs<br>(Time Series)"] --> B["Feature Engineering"]\n    B -->|Rolling Mean, Growth Rate| C["Feature Matrix"]\n    C --> D["RUL Model<br>(Regression)"]\n    C --> E["Health Classifier"]\n    C --> F["Anomaly Detector"]\n    D & E & F --> G["Health Score Engine"]\n    G --> H["Recommendation Engine"]\n    H --> I["Dashboard"]\n```'
    },
    {
      id: 'markdown-verification',
      type: 'markdown',
      question: '',
      answer: '### Markdown Rendering Verification\n\n- **Display Math**: \\[ E = mc^2 \\]\n- **Inline Math**: \\( e^{i\\pi} + 1 = 0 \\)\n\n![Test Image](https://placehold.co/400x200?text=Markdown+Image)'
    },
    {
      id: 'feature-engineering',
      type: 'accordion',
      question: '🔹 Step 2: Feature Engineering',
      answer: 'Instead of raw sequences, we compute statistical features. Tree-based models work extremely well with these.\n\n**Key Formulas:**\n\nRolling Average:\n$$ \\mu_t = \\frac{1}{N} \\sum_{i=0}^{N-1} x_{t-i} $$\n\nGrowth Rate:\n$$ \\Delta = \\frac{x_t - x_{t-1}}{\\Delta t} $$'
    },
    {
      id: 'core-modeling',
      type: 'accordion',
      question: '🎯 Core Modeling Strategy',
      answer: 'We use **3 ML modules**:\n\n**1️⃣ Remaining Useful Life (RUL)**\n- **Goal**: Predict days until failure.\n- **Model**: Random Forest Regressor / XGBoost.\n- **Why**: Handles nonlinear relationships, robust to small data, interpretable.\n\n**2️⃣ Health Classification**\n- **Goal**: Classify as Healthy, Degrading, or Critical.\n- **Model**: Random Forest Classifier.\n\n**3️⃣ Anomaly Detection**\n- **Goal**: Detect abnormal deviation.\n- **Model**: Isolation Forest (Unsupervised).'
    },
    {
      id: 'lstm-analysis',
      type: 'accordion',
      question: '🔥 Why NOT LSTM for Hackathon?',
      answer: '**If we had:** Massive failure datasets and weeks to tune, LSTM would be great for deep sequence modeling.\n\n**But for a Hackathon:**\n1.  **Risk**: Overfitting on small data.\n2.  **Complexity**: Harder to train/validate quickly.\n3.  **Explainability**: "Black box" nature is harder to justify to firmware engineers.\n\n**Our Strategy:**\n> Feature Engineering + Ensemble Tree Models > Poorly trained LSTM.\n\nWe mention LSTM as a future "Advanced Extension" for large-scale deployment.'
    },
    {
      id: 'final-selection',
      type: 'markdown',
      question: '🎯 Final Model Selection',
      answer: '| Task | Model | Reason |\n| :--- | :--- | :--- |\n| **RUL Prediction** | XGBoost / Random Forest | Nonlinear + Stable |\n| **Health Class** | Random Forest | Interpretable |\n| **Anomaly** | Isolation Forest | Unsupervised |'
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
