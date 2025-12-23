// Question Builder Component
'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { QuestionForm } from './QuestionForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import type { CreateQuestionInput } from '../types/test.types';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionBuilderProps {
    questions: CreateQuestionInput[];
    onQuestionsChange: (questions: CreateQuestionInput[]) => void;
}

export function QuestionBuilder({ questions, onQuestionsChange }: QuestionBuilderProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleAddQuestion = (question: CreateQuestionInput) => {
        const newQuestions = [...questions, question];
        onQuestionsChange(newQuestions);
        setShowForm(false);
    };

    const handleUpdateQuestion = (index: number, question: CreateQuestionInput) => {
        const newQuestions = [...questions];
        newQuestions[index] = question;
        onQuestionsChange(newQuestions);
        setEditingIndex(null);
    };

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        // Reorder questions
        const reordered = newQuestions.map((q, i) => ({ ...q, order: i + 1 }));
        onQuestionsChange(reordered);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setShowForm(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
                <Button
                    onClick={() => {
                        setEditingIndex(null);
                        setShowForm(true);
                    }}
                    variant="outline"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                </Button>
            </div>

            {showForm && (
                <QuestionForm
                    question={editingIndex !== null ? questions[editingIndex] : undefined}
                    order={editingIndex !== null ? questions[editingIndex].order : questions.length + 1}
                    onSave={(question) => {
                        if (editingIndex !== null) {
                            handleUpdateQuestion(editingIndex, question);
                        } else {
                            handleAddQuestion(question);
                        }
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingIndex(null);
                    }}
                />
            )}

            {questions.length > 0 && (
                <div className="space-y-3">
                    {questions.map((question, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                        Question {question.order}: {question.type}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteQuestion(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{question.questionText}</p>
                                <p className="text-xs text-gray-600 mt-2">
                                    Marks: {question.marks}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QuestionBuilder;

