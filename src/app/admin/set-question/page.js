"use client";
import { useState } from 'react';
import { createCodingTest } from "../../../../utils/firefunction";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { scala } from '@codemirror/legacy-modes/mode/clike';
import { StreamLanguage } from '@codemirror/language';
import { basicDark } from "@uiw/codemirror-theme-basic";

const CodingTestForm = () => {
    const [codingTest, setCodingTest] = useState({
        date: '',
        endDate: '',
        name: '',
    });

    const [exam, setExam] = useState({
        examName: '',
        title: '',
        description: '',
        input: '',
        output: '',
        constraints: ['', '', '', ''],
        examples: [{ input: '', output: '' }, { input: '', output: '' }],
        problemId: '',
        javaTemplate: '',
        pythonTemplate: '',
        scalaTemplate: '',
        maxPoints: '',
        timeLimit: '',
        memoryLimit: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCodingTestChange = (e) => {
        setCodingTest({ ...codingTest, [e.target.name]: e.target.value });
    };

    const handleExamChange = (e) => {
        setExam({ ...exam, [e.target.name]: e.target.value });
    };

    const handleConstraintChange = (index, value) => {
        const updated = [...exam.constraints];
        updated[index] = value;
        setExam({ ...exam, constraints: updated });
    };

    const handleExampleChange = (index, field, value) => {
        const updated = [...exam.examples];
        updated[index][field] = value;
        setExam({ ...exam, examples: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Start loading
      
        try {
          // Normalize line breaks
          exam.scalaTemplate = exam.scalaTemplate.replace(/\\n/g, "\n");
          exam.javaTemplate = exam.javaTemplate.replace(/\\n/g, "\n");
          exam.pythonTemplate = exam.pythonTemplate.replace(/\\n/g, "\n");
          exam.examName = codingTest.name;
          await createCodingTest(exam, codingTest);
            
          // Reset form fields
          setCodingTest({
            date: '',
            endDate: '',
            name: '',
          });
      
          setExam({
            examName: '',
            description: '',
            input: '',
            output: '',
            constraints: ['', '', '', ''],
            examples: [{ input: '', output: '' }, { input: '', output: '' }],
            problemId: '',
            javaTemplate: '',
            pythonTemplate: '',
            scalaTemplate: '',
            maxPoints: '',
            timeLimit: '',
            memoryLimit: '',
          });
        } catch (error) {
          console.error("Submission error:", error);
        } finally {
          setIsSubmitting(false); // Stop loading
        }
      };
      

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create Coding Test</h1>
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* CodingTest Fields */}
                <h2 className="font-semibold">Coding Test Info</h2>
                <label className="block font-medium">Test Name</label>
                <input name="name" value={codingTest.name} onChange={handleCodingTestChange} placeholder="Test Name" className="border p-2 w-full" required />

                <label className="block font-medium">Start Date & Time</label>
                <input type="datetime-local" name="date" value={codingTest.date} onChange={handleCodingTestChange} className="border p-2 w-full" required />

                <label className="block font-medium">End Date & Time</label>
                <input type="datetime-local" name="endDate" value={codingTest.endDate} onChange={handleCodingTestChange} className="border p-2 w-full" required />

                {/* Exam Fields */}
                <h2 className="font-semibold">Exam Problem Info</h2>

                {/* <label className="block font-medium">Exam Name</label>
                <input name="examName" value={exam.examName} onChange={handleExamChange} placeholder="Exam Name" className="border p-2 w-full" required /> */}

                <label className="block font-medium">Problem Title</label>
                <input name="title" value={exam.title} onChange={handleExamChange} placeholder="Title" className="border p-2 w-full" required />

                <label className="block font-medium">Problem Description</label>
                <textarea name="description" value={exam.description} onChange={handleExamChange} placeholder="Description" className="border p-2 w-full" required />

                <label className="block font-medium">Input Description</label>
                <textarea name="input" value={exam.input} onChange={handleExamChange} placeholder="Input Description" className="border p-2 w-full" required />

                <label className="block font-medium">Output Description</label>
                <textarea name="output" value={exam.output} onChange={handleExamChange} placeholder="Output Description" className="border p-2 w-full" required />

                <h3 className="font-medium">Constraints</h3>
                {exam.constraints.map((c, i) => (
                    <div key={i}>
                        <label className="block font-medium">{`Constraint ${i + 1}`}</label>
                        <input value={c} onChange={(e) => handleConstraintChange(i, e.target.value)} placeholder={`Constraint ${i + 1}`} className="border p-2 w-full mb-1" />
                    </div>
                ))}

                <h3 className="font-medium">Examples</h3>
                {exam.examples.map((ex, i) => (
                    <div key={i}>
                        <label className="block font-medium">{`Example ${i + 1} Input`}</label>
                        <input value={ex.input} onChange={(e) => handleExampleChange(i, 'input', e.target.value)} placeholder="Example input" className="border p-2 w-full mb-1" />
                        <label className="block font-medium">{`Example ${i + 1} Output`}</label>
                        <input value={ex.output} onChange={(e) => handleExampleChange(i, 'output', e.target.value)} placeholder="Example output" className="border p-2 w-full" />
                    </div>
                ))}

                <label className="block font-medium">Problem ID</label>
                <input name="problemId" value={exam.problemId} onChange={handleExamChange} placeholder="Problem ID" className="border p-2 w-full" required />

                <label className="block font-medium">Java Template</label>
                <CodeMirror
                    value={exam.javaTemplate}
                    height="200px"
                    extensions={[java()]}
                    theme={basicDark}
                    onChange={(value) =>
                        setExam((prev) => ({ ...prev, javaTemplate: value }))
                    }
                />

                <label className="block font-medium">Python Template</label>
                <CodeMirror
                    value={exam.pythonTemplate}
                    height="200px"
                    extensions={[python()]}
                    theme={basicDark}
                    onChange={(value) =>
                        setExam((prev) => ({ ...prev, pythonTemplate: value }))
                    }
                />

                <label className="block font-medium">Scala Template</label>
                <CodeMirror
                    value={exam.scalaTemplate}
                    height="200px"
                    extensions={[StreamLanguage.define(scala)]}
                    theme={basicDark}
                    onChange={(value) =>
                        setExam((prev) => ({ ...prev, scalaTemplate: value }))
                    }
                />

                <label className="block font-medium">Max Points</label>
                <input name="maxPoints" type="number" value={exam.maxPoints} onChange={handleExamChange} placeholder="Max Points" className="border p-2 w-full" />

                <label className="block font-medium">Time Limit</label>
                <input name="timeLimit" value={exam.timeLimit} onChange={handleExamChange} placeholder="Time Limit" className="border p-2 w-full" />

                <label className="block font-medium">Memory Limit</label>
                <input name="memoryLimit" value={exam.memoryLimit} onChange={handleExamChange} placeholder="Memory Limit" className="border p-2 w-full" />

                <button
                    type="submit"
                    className={`bg-blue-600 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <img src="/loading.gif" alt="Loading..." width="20" height="20" />
                    ) : (
                        "Submit"
                    )}
                </button>

            </form>
        </div>

    );
}

export default CodingTestForm;



// "use client";
// import { useState } from 'react';

// const CodingTestForm = () => {
//     const [codingTest, setCodingTest] = useState({
//         date: '',
//         endDate: '',
//         name: '',
//     });

//     const [exam, setExam] = useState({
//         examName: '',
//         title: '',
//         description: '',
//         input: '',
//         output: '',
//         constraints: ['', '', '', ''],
//         examples: [{ input: '', output: '' }, { input: '', output: '' }],
//         problemId: '',
//         javaTemplate: '',
//         pythonTemplate: '',
//         scalaTemplate: '',
//         maxPoints: '',
//         timeLimit: '',
//         memoryLimit: '',
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [activeTab, setActiveTab] = useState('basic');

//     const handleCodingTestChange = (e) => {
//         setCodingTest({ ...codingTest, [e.target.name]: e.target.value });
//     };

//     const handleExamChange = (e) => {
//         setExam({ ...exam, [e.target.name]: e.target.value });
//     };

//     const handleConstraintChange = (index, value) => {
//         const updated = [...exam.constraints];
//         updated[index] = value;
//         setExam({ ...exam, constraints: updated });
//     };

//     const handleExampleChange = (index, field, value) => {
//         const updated = [...exam.examples];
//         updated[index][field] = value;
//         setExam({ ...exam, examples: updated });
//     };

//     const handleSubmit = async () => {
//         setIsSubmitting(true);
      
//         try {
//           // Simulate form submission
//           exam.scalaTemplate = exam.scalaTemplate.replace(/\\n/g, "\n");
//           exam.javaTemplate = exam.javaTemplate.replace(/\\n/g, "\n");
//           exam.pythonTemplate = exam.pythonTemplate.replace(/\\n/g, "\n");
//           exam.examName = codingTest.name;
          
//           // Replace with actual function call
//           // await createCodingTest(exam, codingTest);
          
//           // Simulate API delay
//           await new Promise(resolve => setTimeout(resolve, 2000));
            
//           setCodingTest({
//             date: '',
//             endDate: '',
//             name: '',
//           });
      
//           setExam({
//             examName: '',
//             title: '',
//             description: '',
//             input: '',
//             output: '',
//             constraints: ['', '', '', ''],
//             examples: [{ input: '', output: '' }, { input: '', output: '' }],
//             problemId: '',
//             javaTemplate: '',
//             pythonTemplate: '',
//             scalaTemplate: '',
//             maxPoints: '',
//             timeLimit: '',
//             memoryLimit: '',
//           });
          
//           alert('Coding test created successfully!');
//         } catch (error) {
//           console.error("Submission error:", error);
//           alert('Error creating test. Please try again.');
//         } finally {
//           setIsSubmitting(false);
//         }
//     };

//     const tabs = [
//         { id: 'basic', name: 'Basic Info', icon: '📝' },
//         { id: 'problem', name: 'Problem Details', icon: '🧩' },
//         { id: 'examples', name: 'Examples & Constraints', icon: '📋' },
//         { id: 'templates', name: 'Code Templates', icon: '💻' },
//         { id: 'settings', name: 'Test Settings', icon: '⚙️' },
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//             <div className="container mx-auto px-4 py-8 max-w-5xl">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <div className="flex items-center space-x-4 mb-4">
//                         <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//                             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
//                             </svg>
//                         </div>
//                         <div>
//                             <h1 className="text-4xl font-bold text-gray-900">Create Coding Test</h1>
//                             <p className="text-gray-600 mt-1">Design comprehensive coding assessments for students</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
//                     {/* Tab Navigation */}
//                     <div className="border-b border-gray-200 bg-gray-50">
//                         <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
//                                         activeTab === tab.id
//                                             ? 'border-blue-500 text-blue-600'
//                                             : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                     }`}
//                                 >
//                                     <span className="mr-2">{tab.icon}</span>
//                                     {tab.name}
//                                 </button>
//                             ))}
//                         </nav>
//                     </div>

//                     <div className="p-8">
//                         {/* Basic Info Tab */}
//                         {activeTab === 'basic' && (
//                             <div className="space-y-6">
//                                 <div className="grid grid-cols-1 gap-6">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Test Name
//                                         </label>
//                                         <input
//                                             name="name"
//                                             value={codingTest.name}
//                                             onChange={handleCodingTestChange}
//                                             placeholder="Enter test name (e.g., Data Structures Final)"
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 Start Date & Time
//                                             </label>
//                                             <input
//                                                 type="datetime-local"
//                                                 name="date"
//                                                 value={codingTest.date}
//                                                 onChange={handleCodingTestChange}
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 End Date & Time
//                                             </label>
//                                             <input
//                                                 type="datetime-local"
//                                                 name="endDate"
//                                                 value={codingTest.endDate}
//                                                 onChange={handleCodingTestChange}
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Problem Details Tab */}
//                         {activeTab === 'problem' && (
//                             <div className="space-y-6">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Problem Title
//                                     </label>
//                                     <input
//                                         name="title"
//                                         value={exam.title}
//                                         onChange={handleExamChange}
//                                         placeholder="Enter problem title (e.g., Two Sum Problem)"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Problem Description
//                                     </label>
//                                     <textarea
//                                         name="description"
//                                         value={exam.description}
//                                         onChange={handleExamChange}
//                                         placeholder="Provide a detailed description of the problem..."
//                                         rows="5"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Input Description
//                                         </label>
//                                         <textarea
//                                             name="input"
//                                             value={exam.input}
//                                             onChange={handleExamChange}
//                                             placeholder="Describe the input format..."
//                                             rows="4"
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Output Description
//                                         </label>
//                                         <textarea
//                                             name="output"
//                                             value={exam.output}
//                                             onChange={handleExamChange}
//                                             placeholder="Describe the expected output format..."
//                                             rows="4"
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Problem ID
//                                     </label>
//                                     <input
//                                         name="problemId"
//                                         value={exam.problemId}
//                                         onChange={handleExamChange}
//                                         placeholder="Enter unique problem ID (e.g., PROB_001)"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Examples & Constraints Tab */}
//                         {activeTab === 'examples' && (
//                             <div className="space-y-8">
//                                 {/* Constraints Section */}
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                                         <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
//                                             <span className="text-yellow-600 text-sm">⚠️</span>
//                                         </span>
//                                         Constraints
//                                     </h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {exam.constraints.map((constraint, index) => (
//                                             <div key={index}>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                     Constraint {index + 1}
//                                                 </label>
//                                                 <input
//                                                     value={constraint}
//                                                     onChange={(e) => handleConstraintChange(index, e.target.value)}
//                                                     placeholder={`Enter constraint ${index + 1} (e.g., 1 ≤ n ≤ 10^5)`}
//                                                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                                                 />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Examples Section */}
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                                         <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
//                                             <span className="text-green-600 text-sm">📋</span>
//                                         </span>
//                                         Test Examples
//                                     </h3>
//                                     <div className="space-y-6">
//                                         {exam.examples.map((example, index) => (
//                                             <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//                                                 <h4 className="font-semibold text-gray-800 mb-4">Example {index + 1}</h4>
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                     <div>
//                                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                             Input
//                                                         </label>
//                                                         <textarea
//                                                             value={example.input}
//                                                             onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
//                                                             placeholder="Enter example input..."
//                                                             rows="3"
//                                                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
//                                                         />
//                                                     </div>
//                                                     <div>
//                                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                             Output
//                                                         </label>
//                                                         <textarea
//                                                             value={example.output}
//                                                             onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
//                                                             placeholder="Enter expected output..."
//                                                             rows="3"
//                                                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Code Templates Tab */}
//                         {activeTab === 'templates' && (
//                             <div className="space-y-8">
//                                 <div className="text-center mb-6">
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Templates</h3>
//                                     <p className="text-gray-600">Provide starter code templates for different programming languages</p>
//                                 </div>

//                                 {/* Java Template */}
//                                 <div className="bg-gray-50 rounded-xl p-6">
//                                     <div className="flex items-center mb-4">
//                                         <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
//                                             <span className="text-orange-600 font-bold text-sm">J</span>
//                                         </div>
//                                         <label className="text-lg font-semibold text-gray-900">Java Template</label>
//                                     </div>
//                                     <textarea
//                                         value={exam.javaTemplate}
//                                         onChange={(e) => setExam(prev => ({ ...prev, javaTemplate: e.target.value }))}
//                                         placeholder="Enter Java starter code template..."
//                                         rows="8"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm bg-gray-800 text-green-400"
//                                     />
//                                 </div>

//                                 {/* Python Template */}
//                                 <div className="bg-gray-50 rounded-xl p-6">
//                                     <div className="flex items-center mb-4">
//                                         <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                                             <span className="text-blue-600 font-bold text-sm">P</span>
//                                         </div>
//                                         <label className="text-lg font-semibold text-gray-900">Python Template</label>
//                                     </div>
//                                     <textarea
//                                         value={exam.pythonTemplate}
//                                         onChange={(e) => setExam(prev => ({ ...prev, pythonTemplate: e.target.value }))}
//                                         placeholder="Enter Python starter code template..."
//                                         rows="8"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm bg-gray-800 text-green-400"
//                                     />
//                                 </div>

//                                 {/* Scala Template */}
//                                 <div className="bg-gray-50 rounded-xl p-6">
//                                     <div className="flex items-center mb-4">
//                                         <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
//                                             <span className="text-red-600 font-bold text-sm">S</span>
//                                         </div>
//                                         <label className="text-lg font-semibold text-gray-900">Scala Template</label>
//                                     </div>
//                                     <textarea
//                                         value={exam.scalaTemplate}
//                                         onChange={(e) => setExam(prev => ({ ...prev, scalaTemplate: e.target.value }))}
//                                         placeholder="Enter Scala starter code template..."
//                                         rows="8"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm bg-gray-800 text-green-400"
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Test Settings Tab */}
//                         {activeTab === 'settings' && (
//                             <div className="space-y-6">
//                                 <div className="text-center mb-6">
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Configuration</h3>
//                                     <p className="text-gray-600">Configure scoring and resource limits for the test</p>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                     <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
//                                         <div className="text-center">
//                                             <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//                                                 </svg>
//                                             </div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 Max Points
//                                             </label>
//                                             <input
//                                                 name="maxPoints"
//                                                 type="number"
//                                                 value={exam.maxPoints}
//                                                 onChange={handleExamChange}
//                                                 placeholder="100"
//                                                 className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
//                                         <div className="text-center">
//                                             <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                             </div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 Time Limit
//                                             </label>
//                                             <input
//                                                 name="timeLimit"
//                                                 value={exam.timeLimit}
//                                                 onChange={handleExamChange}
//                                                 placeholder="2 seconds"
//                                                 className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-center"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
//                                         <div className="text-center">
//                                             <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//                                                 </svg>
//                                             </div>
//                                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                                 Memory Limit
//                                             </label>
//                                             <input
//                                                 name="memoryLimit"
//                                                 value={exam.memoryLimit}
//                                                 onChange={handleExamChange}
//                                                 placeholder="256 MB"
//                                                 className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Navigation & Submit */}
//                         <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
//                             <div className="flex space-x-3">
//                                 {activeTab !== 'basic' && (
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
//                                             if (currentIndex > 0) {
//                                                 setActiveTab(tabs[currentIndex - 1].id);
//                                             }
//                                         }}
//                                         className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
//                                     >
//                                         ← Previous
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="flex space-x-3">
//                                 {activeTab !== 'settings' && (
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
//                                             if (currentIndex < tabs.length - 1) {
//                                                 setActiveTab(tabs[currentIndex + 1].id);
//                                             }
//                                         }}
//                                         className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
//                                     >
//                                         Next →
//                                     </button>
//                                 )}

//                                 <button
//                                     type="button"
//                                     onClick={handleSubmit}
//                                     disabled={isSubmitting}
//                                     className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
//                                         isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
//                                     }`}
//                                 >
//                                     {isSubmitting ? (
//                                         <>
//                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                             <span>Creating Test...</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                             </svg>
//                                             <span>Create Test</span>
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CodingTestForm;