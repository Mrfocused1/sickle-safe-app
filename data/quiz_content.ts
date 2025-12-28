export interface QuizQuestion {
    id: string;
    question: string;
    type: 'true-false' | 'multiple-choice';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    icon: string;
    questions: QuizQuestion[];
    passingScore: number;
}

export const quizzes: Quiz[] = [
    {
        id: 'myth-reality',
        title: 'Myth vs. Reality',
        subtitle: 'Weekly Challenge',
        description: 'Test your knowledge on common misconceptions about SCD.',
        color: '#f59e0b',
        icon: 'auto-awesome',
        passingScore: 70,
        questions: [
            {
                id: 'myth-1',
                question: 'Sickle cell disease is contagious and can be caught like a cold.',
                type: 'true-false',
                options: ['True', 'False'],
                correctAnswer: 'False',
                explanation: 'SCD is a genetic condition inherited from parents. It cannot be caught from others.',
                difficulty: 'easy'
            },
            {
                id: 'myth-2',
                question: 'People with sickle cell trait have the disease and need treatment.',
                type: 'true-false',
                options: ['True', 'False'],
                correctAnswer: 'False',
                explanation: 'People with the trait carry one gene but usually do not have symptoms or need treatment.',
                difficulty: 'easy'
            },
            {
                id: 'myth-3',
                question: 'Drinking plenty of water can help prevent sickle cell crises.',
                type: 'true-false',
                options: ['True', 'False'],
                correctAnswer: 'True',
                explanation: 'Hydration helps keep blood less viscous, allowing sickled cells to flow more easily.',
                difficulty: 'easy'
            },
            {
                id: 'myth-4',
                question: 'Sickle cell disease only affects people of African descent.',
                type: 'true-false',
                options: ['True', 'False'],
                correctAnswer: 'False',
                explanation: 'While common in African descent, it also affects Mediterranean, Middle Eastern, and Indian populations.',
                difficulty: 'medium'
            }
        ]
    },
    {
        id: 'genetics-quiz',
        title: 'Genetics Mastery',
        subtitle: 'Advanced Learning',
        description: 'Deep dive into inheritance patterns and genetic markers.',
        color: '#3b82f6',
        icon: 'biotech',
        passingScore: 80,
        questions: [
            {
                id: 'gen-1',
                question: 'If both parents have sickle cell trait, what is the chance their child will have SCD?',
                type: 'multiple-choice',
                options: ['0%', '25%', '50%', '75%'],
                correctAnswer: '25%',
                explanation: 'Each pregnancy has a 25% chance of the child inheriting two sickle genes (SS).',
                difficulty: 'medium'
            }
        ]
    }
];
