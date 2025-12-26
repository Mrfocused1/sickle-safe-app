
const API_KEY = process.env.EXPO_PUBLIC_GLM_API_KEY;

// Placeholder base URL - replace with actual GLM API endpoint
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'; // Common endpoint for GLM/ZhipuAI

export const glmService = {
    /**
     * Generic fetcher for GLM API
     */
    async fetchNewsAndEvents(query: string) {
        if (!API_KEY) {
            console.warn('GLM_API_KEY is missing. Please check your .env file.');
            return null;
        }

        try {
            // Example structure - this would need to be adapted to the specific GLM 4.7 API specs
            const response = await fetch(`${BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "glm-4", // Assuming glm-4 family
                    messages: [
                        {
                            role: "user",
                            content: `Fetch the latest news and events regarding: ${query}`
                        }
                    ]
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data from GLM:', error);
            throw error;
        }
    },
    /**
     * Fetch structured data for educational purposes (quizzes, news, etc.)
     */
    async fetchStructuredData(type: 'news' | 'quiz' | 'education', context?: string) {
        if (!API_KEY) {
            console.warn('GLM_API_KEY is missing.');
            return null;
        }

        const prompts = {
            news: "Generate 3-4 news items about Sickle Cell Disease research and community updates in 2025. Return ONLY a valid JSON array of objects with keys: id, title, source, time, image (unsplash health url), content.",
            quiz: "Generate 3 Sickle Cell Disease true/false or multiple choice questions. Return ONLY a valid JSON array of objects with keys: question, options (array), answer (string), explanation.",
            education: "Generate a list of 4 essential Sickle Cell self-care tips. Return ONLY a valid JSON array of objects with keys: title, content, icon (MaterialIcons name)."
        };

        try {
            const response = await fetch(`${BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "glm-4",
                    messages: [
                        {
                            role: "system",
                            content: "You are a medical knowledge assistant specializing in Sickle Cell Disease. Always return valid JSON."
                        },
                        {
                            role: "user",
                            content: prompts[type] + (context ? ` Context: ${context}` : "")
                        }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                const text = data.choices[0].message?.content || "";
                // Attempt to parse JSON from the response text
                const jsonMatch = text.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
            }
            return null;
        } catch (error) {
            console.error('Error in GLM fetch:', error);
            return null;
        }
    }
};
