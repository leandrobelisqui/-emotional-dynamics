interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center"
      aria-label="Alternar tema"
      title={theme === 'light' ? 'Ativar modo noturno' : 'Ativar modo claro'}
    >
      {theme === 'light' ? (
        <i className="fas fa-moon text-gray-500 text-sm"></i>
      ) : (
        <i className="fas fa-sun text-amber-400 text-sm"></i>
      )}
    </button>
  );
}
