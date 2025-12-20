// Question Form Component
'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import type { CreateQuestionInput, MCQOptions } from '../types/test.types';
import { X } from 'lucide-react';

interface QuestionFormProps {
    question?: CreateQuestionInput;
    order: number;
    onSave: (question: CreateQuestionInput) => void;
    onCancel?: () => void;
}

export function QuestionForm({ question, order, onSave, onCancel }: QuestionFormProps) {
    const [type, setType] = useState<'MCQ' | 'SHORT_ANSWER'>(
        question?.type || 'MCQ'
    );
    const [questionText, setQuestionText] = useState(question?.questionText || '');
    const [questionTextAssamese, setQuestionTextAssamese] = useState(
        question?.questionTextAssamese || ''
    );
    const [marks, setMarks] = useState(question?.marks || 1);
    const [mcqOptions, setMcqOptions] = useState<MCQOptions>(
        (question?.options as MCQOptions) || {
            A: '',
            B: '',
            C: '',
            D: '',
            correct: 'A',
        }
    );
    const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || '');

    const handleSave = () => {
        if (!questionText.trim()) {
            alert('Question text is required');
            return;
        }

        const questionData: CreateQuestionInput = {
            questionText,
            questionTextAssamese: questionTextAssamese || null,
            type,
            marks,
            order,
            options: type === 'MCQ' ? mcqOptions : null,
            correctAnswer: type === 'SHORT_ANSWER' ? correctAnswer : null,
        };

        onSave(questionData);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Question {order}</CardTitle>
                    {onCancel && (
                        <Button variant="ghost" size="sm" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select
                    label="Question Type"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'MCQ' | 'SHORT_ANSWER')}
                    options={[
                        { label: 'Multiple Choice (MCQ)', value: 'MCQ' },
                        { label: 'Short Answer', value: 'SHORT_ANSWER' },
                    ]}
                />

                <Textarea
                    label="Question Text (English)"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={3}
                    required
                />

                <Textarea
                    label="Question Text (Assamese) - Optional"
                    value={questionTextAssamese}
                    onChange={(e) => setQuestionTextAssamese(e.target.value)}
                    rows={3}
                />

                <Input
                    label="Marks"
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    min={1}
                    required
                />

                {type === 'MCQ' && (
                    <div className="space-y-3 p-4 border rounded-lg">
                        <p className="text-sm font-medium">Options</p>
                        {(['A', 'B', 'C', 'D'] as const).map((option) => (
                            <div key={option} className="flex items-center gap-2">
                                <Input
                                    value={mcqOptions[option]}
                                    onChange={(e) =>
                                        setMcqOptions({ ...mcqOptions, [option]: e.target.value })
                                    }
                                    placeholder={`Option ${option}`}
                                    className="flex-1"
                                />
                                <input
                                    type="radio"
                                    name="correct"
                                    checked={mcqOptions.correct === option}
                                    onChange={() =>
                                        setMcqOptions({ ...mcqOptions, correct: option })
                                    }
                                />
                                <label className="text-sm">Correct</label>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'SHORT_ANSWER' && (
                    <Textarea
                        label="Correct Answer (for reference)"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        rows={2}
                    />
                )}

                <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave}>Save Question</Button>
                    {onCancel && (
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default QuestionForm;

