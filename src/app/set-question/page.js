"use client";
import { useState } from 'react';
import { createCodingTest } from "../../../utils/firefunction";
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
      
          await createCodingTest(exam, codingTest);
      
          // Reset form fields
          setCodingTest({
            date: '',
            endDate: '',
            name: '',
          });
      
          setExam({
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

                <label className="block font-medium">Exam Name</label>
                <input name="examName" value={exam.examName} onChange={handleExamChange} placeholder="Exam Name" className="border p-2 w-full" required />

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