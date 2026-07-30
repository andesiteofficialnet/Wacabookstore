// Simple Interaction logic for category buttons
        const catButtons = document.querySelectorAll('.overflow-x-auto button');
        catButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                catButtons.forEach(b => {
                    b.classList.remove('bg-primary-container', 'text-on-primary-container');
                    b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
                });
                btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                btn.classList.add('bg-primary-container', 'text-on-primary-container');
            });
        });

        // Search highlight micro-interaction
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('scale-[1.02]');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('scale-[1.02]');
        });
