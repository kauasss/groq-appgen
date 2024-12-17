interface PromptData {
  query?: string;
  currentHtml?: string;
  currentFeedback?: string;
}

export function constructPrompt(data: PromptData): string {
  const { query = '', currentHtml = '', currentFeedback = '' } = data;
  const hasFeedback = currentFeedback.length > 0;
  
  return `${currentHtml ? `<current html>${currentHtml}</current html>` : ''}
${currentFeedback ? `<feedback>${currentFeedback}</feedback>` : ''}
${!hasFeedback && query ? `<query>Generate a single HTML file based on this query: "${query}"</query>` : ''}
${`<output instructions>
The output should be valid HTML and should be creative and well-structured.
Return the HTML content wrapped in triple backticks with 'html' language specifier, like this:
\`\`\`html
<your html code here>
\`\`\`
</output instructions>`}
`.trim();
}
