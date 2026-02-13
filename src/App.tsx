import { useState, useEffect } from 'react'
import AccordionContainer, { type AccordionData } from './components/Accordion/AccordionContainer'
import FloatingAddMenu from './components/FloatingAddMenu'
import Navbar from './components/Navbar'

function App() {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [accordions, setAccordions] = useState<AccordionData[]>([
    {
      id: '1',
      type: 'accordion',
      question: 'Gradient Descent Derivation',
      answer: 'Here is the derivation using aligned equations:\n\n\\begin{align}\nJ(\\theta) &= \\frac{1}{2m} \\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)})^2 \\\\\n\\frac{\\partial J}{\\partial \\theta_j} &= \\frac{1}{m} \\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)}) x_j^{(i)}\n\\end{align}'
    },
    {
      id: '2',
      type: 'accordion',
      question: 'Can I edit?',
      answer: 'Yes, if you have permissions.'
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
        <AccordionContainer
          accordions={accordions}
          canEdit={true}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
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
