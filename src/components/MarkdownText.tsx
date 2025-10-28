import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownTextProps {
  content: string;
  fontSize?: number;
}

export default function MarkdownText({ content, fontSize = 16 }: MarkdownTextProps) {
  return (
    <div 
      className="markdown-content prose prose-sm max-w-none dark:prose-invert"
      style={{ fontSize: `${fontSize}px` }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Customizar renderização de elementos
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-gray-800 dark:text-gray-200">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700 dark:text-gray-300">
              {children}
            </em>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6 text-blue-600 dark:text-blue-400">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3 mt-5 text-blue-600 dark:text-blue-400">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2 mt-4 text-blue-600 dark:text-blue-400">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 text-gray-800 dark:text-gray-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-800 dark:text-gray-200">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 my-3 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          code: ({ inline, children }: any) =>
            inline ? (
              <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded my-2 text-sm font-mono overflow-x-auto text-gray-800 dark:text-gray-200">
                {children}
              </code>
            ),
          mark: ({ children }: any) => (
            <mark className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">
              {children}
            </mark>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
