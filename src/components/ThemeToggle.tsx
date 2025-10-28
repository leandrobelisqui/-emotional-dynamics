interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Alternar tema"
      title={theme === 'light' ? 'Ativar modo noturno' : 'Ativar modo claro'}
    >
      {theme === 'light' ? (
        <i className="fas fa-moon text-gray-700 dark:text-gray-300 text-xl"></i>
      ) : (
        <i className="fas fa-sun text-yellow-400 text-xl"></i>
      )}
    </button>
  );
}
