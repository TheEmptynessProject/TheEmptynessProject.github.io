document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const code = button.nextElementSibling.textContent;
            try {
                await navigator.clipboard.writeText(code);
                const originalText = button.querySelector('.copy-text').textContent;
                button.querySelector('.copy-text').textContent = 'Copied!';
                button.style.background = 'var(--accent-color)';
                setTimeout(() => {
                    button.querySelector('.copy-text').textContent = originalText;
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
});