document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            alert('💾 Dados salvos automaticamente!');
        }
        
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            ui.handleClearAll();
        }
    });

    console.log('✅ To-Do List App Inicializado!');
    console.log('📊 Total de tarefas:', storage.getTodos().length);
    console.log('💾 Dados salvos em Local Storage');
});

window.addEventListener('storage', () => {
    console.log('🔄 Dados atualizados em outra aba');
    ui.render();
});