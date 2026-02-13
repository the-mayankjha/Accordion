import { useState } from 'react'
import AccordionContainer, { type AccordionData } from './components/Accordion/AccordionContainer'
import FloatingAddMenu from './components/FloatingAddMenu'

function App() {
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
    setAccordions([...accordions, { id: newId, type: 'accordion', question: '', answer: '' }]);
  };

  const handleAddDiagram = () => {
    const newId = String(Date.now());
    const template = "```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;\n```";
    setAccordions([...accordions, { id: newId, type: 'diagram', question: '', answer: template }]);
  };

  const handleAddMarkdown = () => {
     const newId = String(Date.now());
    setAccordions([...accordions, { id: newId, type: 'markdown', question: '', answer: '' }]);
  };

  const handleUpdate = (id: string, data: Partial<AccordionData>) => {
    setAccordions(accordions.map(acc => acc.id === id ? { ...acc, ...data } : acc))
  }

  const handleDelete = (id: string) => {
    setAccordions(accordions.filter(acc => acc.id !== id))
  }

  return (
    <div className="min-h-screen bg-notion-bg p-section text-notion-text-DEFAULT transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-xl">
        <header className="text-center space-y-md">
          <h1 className="text-4xl font-bold text-notion-text-DEFAULT tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-notion-text-secondary text-lg">
            Interactive accordion system with Markdown & LaTeX support
          </p>
        </header>

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
