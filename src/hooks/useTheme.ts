import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    
    // Verifica preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    console.log('🎨 useTheme - Aplicando tema:', theme);
    console.log('📍 Elemento root:', root);
    console.log('📋 Classes atuais do root:', root.className);
    
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('✅ Dark mode ativado - classe "dark" adicionada ao <html>');
      console.log('📋 Classes após adicionar dark:', root.className);
    } else {
      root.classList.remove('dark');
      console.log('☀️ Light mode ativado - classe "dark" removida do <html>');
      console.log('📋 Classes após remover dark:', root.className);
    }
    
    // Salva no localStorage
    localStorage.setItem('theme', theme);
    console.log('💾 Tema salvo no localStorage:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}
