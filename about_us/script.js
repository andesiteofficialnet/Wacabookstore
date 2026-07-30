// Smooth Micro-interactions
        document.querySelectorAll('button, a').forEach(elem => {
            elem.addEventListener('mousedown', () => {
                elem.classList.add('opacity-70', 'scale-95');
            });
            elem.addEventListener('mouseup', () => {
                elem.classList.remove('opacity-70', 'scale-95');
            });
            elem.addEventListener('mouseleave', () => {
                elem.classList.remove('opacity-70', 'scale-95');
            });
        });

        // Simple Intersection Observer for scroll reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section > div').forEach(div => {
            div.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
            observer.observe(div);
        });
