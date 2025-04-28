

document.addEventListener('DOMContentLoaded', () => {
    
    window.animateCards = function() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            
            card.style.animation = 'none';
            card.offsetHeight; 
            
            
            card.style.animation = `dealCard 0.5s ease forwards ${index * 0.1}s`;
        });
    };
    
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dealCard {
            0% {
                transform: translateY(-100px) rotate(-10deg);
                opacity: 0;
            }
            100% {
                transform: translateY(0) rotate(0);
                opacity: 1;
            }
        }
        
        @keyframes chipBet {
            0% {
                transform: translateY(0) scale(1);
            }
            50% {
                transform: translateY(-20px) scale(1.2);
            }
            100% {
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes cardFlip {
            0% {
                transform: rotateY(0deg);
            }
            50% {
                transform: rotateY(90deg);
            }
            100% {
                transform: rotateY(0deg);
            }
        }
        
        .card-enter {
            animation: dealCard 0.5s ease forwards;
        }
        
        .chip-bet {
            animation: chipBet 0.3s ease-out forwards;
        }
        
        .card-flip {
            animation: cardFlip 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
    
    
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            
            chip.classList.add('chip-bet');
            
            
            setTimeout(() => {
                chip.classList.remove('chip-bet');
            }, 300);
        });
    });
});
