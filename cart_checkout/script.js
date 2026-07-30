function handleOrder() {
            // Get form values (basic validation placeholder)
            const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], textarea');
            let isValid = true;
            inputs.forEach(input => {
                if(!input.value && input.placeholder !== 'Opsional: Ingin dibungkus kado') {
                    input.classList.add('border-error');
                    isValid = false;
                } else {
                    input.classList.remove('border-error');
                }
            });

            if(!isValid) {
                alert('Mohon lengkapi data pengiriman Anda.');
                return;
            }

            // Create WhatsApp message (Simplified)
            const text = "Halo Wacabookstore! Saya ingin memesan:\n1. The Great Gatsby (Rp 125.000)\n2. Norwegian Wood (x2) (Rp 190.000)\n\nTotal: Rp 315.000\n\nTerima kasih.";
            const encodedText = encodeURIComponent(text);
            window.open(`https://wa.me/6281234567890?text=${encodedText}`, '_blank');
        }

        // Add micro-interactions for the form focus
        const textInputs = document.querySelectorAll('input, textarea');
        textInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('scale-[1.01]');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('scale-[1.01]');
            });
        });
