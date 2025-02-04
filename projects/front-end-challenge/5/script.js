class PricingPlan {
    constructor(name, price, annualPrice, period, features, isPopular = false, stats = {}, buttonText = "Get Started") {
        this.name = name;
        this.price = price;
        this.annualPrice = annualPrice;
        this.period = period;
        this.features = features;
        this.isPopular = isPopular;
        this.stats = stats;
        this.buttonText = buttonText;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - Math.ceil(rating);

        let starsHtml = '<div class="star-rating">';

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<span class="star filled">★</span>';
        }

        if (hasHalfStar) {
            starsHtml += '<span class="star half">☆</span>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<span class="star">☆</span>';
        }

        starsHtml += '</div>';
        return starsHtml;
    }

    createCard() {
        const card = document.createElement('div');
        card.className = `pricing-card ${this.isPopular ? 'popular' : ''}`;

        if (this.isPopular) {
            const badge = document.createElement('div');
            badge.className = 'popular-badge';
            badge.textContent = 'Most Popular';
            card.appendChild(badge);
        }

        let timerHtml = '';
        if (this.isPopular) {
            timerHtml = `
                <div class="timer-container">
                    <span>🔥</span>
                    <span>Special offer ends in: <span class="countdown">47:59:59</span></span>
                </div>
            `;
        }

        let seatsHtml = '';
        if (this.stats.seatsLeft) {
            seatsHtml = `
                <div class="seats-left">
                    Only ${this.stats.seatsLeft} spots left at this price
                </div>
            `;
        }

        let socialProofHtml = '';
        if (this.stats.rating) {
            socialProofHtml = `
                <div class="social-proof">
                    ${this.generateStarRating(this.stats.rating)}
                    <span>${this.stats.rating.toFixed(1)} (${this.stats.reviews} reviews)</span>
                </div>
            `;
        }

        card.innerHTML += `
            <h3 class="plan-name">${this.name}</h3>
            ${timerHtml}
            ${socialProofHtml}
            <div class="plan-price">
                ${this.isPopular ? `<span class="original-price">$${this.price * 1.2}</span>` : ''}
                $${this.price}<span>/${this.period}</span>
            </div>
            ${seatsHtml}
            <ul class="features-list">
                ${this.features.map(feature => `
                    <li class="${feature.included ? '' : 'disabled'}" 
                        title="${feature.tooltip || ''}">${feature.text}</li>
                `).join('')}
            </ul>
            <button class="cta-button ${this.isPopular ? 'primary-button' : 'secondary-button'}"
                    onclick="openModal('${this.name}', ${this.price}, ${this.annualPrice})">
                ${this.buttonText}
            </button>
        `;

        return card;
    }
}

function openModal(planName, monthlyPrice, annualPrice) {
    const modal = document.getElementById('purchaseModal');
    const modalPlanName = document.getElementById('modalPlanName');
    const modalPrice = document.getElementById('modalPrice');

    modalPlanName.textContent = planName;
    updateModalPrice(monthlyPrice, annualPrice);

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('purchaseModal').classList.remove('active');
}

function updateModalPrice(monthlyPrice, annualPrice) {
    const isAnnual = document.getElementById('billingToggle').checked;
    const price = isAnnual ? annualPrice : monthlyPrice;
    const period = isAnnual ? 'year' : 'month';

    document.getElementById('modalPrice').innerHTML = `$${price}<span>/${period}</span>`;
    document.getElementById('annualSavings').style.display = isAnnual ? 'block' : 'none';
}

function startFreeTrial() {

    alert('Starting your 7-day free trial...');
    closeModal();
}

const plans = [
    new PricingPlan(
        "Basic",
        29,
        290,
        "month",
        [
            { text: "1 User", included: true, tooltip: "Perfect for individual users" },
            { text: "5GB Storage", included: true, tooltip: "Secure cloud storage for your files" },
            { text: "Basic Support", included: true, tooltip: "Email support with 24h response time" },
            { text: "API Access", included: false, tooltip: "Build custom integrations" },
            { text: "Custom Domain", included: false, tooltip: "Use your own domain name" }
        ],
        false,
        {
            rating: 2.5,
            reviews: 156
        },
        "Start Free Trial"
    ),
    new PricingPlan(
        "Pro",
        79,
        790,
        "month",
        [
            { text: "5 Users", included: true, tooltip: "Perfect for small teams" },
            { text: "20GB Storage", included: true, tooltip: "Expanded storage for your growing needs" },
            { text: "Priority Support", included: true, tooltip: "4h response time guaranteed" },
            { text: "API Access", included: true, tooltip: "Full API access with documentation" },
            { text: "Custom Domain", included: false, tooltip: "Use your own domain name" }
        ],
        true,
        {
            rating: 4.9,
            reviews: 482,
            seatsLeft: 3
        },
        "Claim Special Offer"
    ),
    new PricingPlan(
        "Enterprise",
        199,
        1990,
        "month",
        [
            { text: "Unlimited Users", included: true, tooltip: "Scale without limits" },
            { text: "100GB Storage", included: true, tooltip: "Enterprise-grade storage" },
            { text: "24/7 Support", included: true, tooltip: "Dedicated support team" },
            { text: "API Access", included: true, tooltip: "Advanced API features" },
            { text: "Custom Domain", included: true, tooltip: "Multiple custom domains" }
        ],
        false,
        {
            rating: 3.8,
            reviews: 267
        },
        "Contact Sales"
    )
];

const container = document.getElementById('pricingContainer');
plans.forEach(plan => {
    const card = plan.createCard();
    container.appendChild(card);
});

function updateCountdown() {
    const countdownElements = document.querySelectorAll('.countdown');
    countdownElements.forEach(element => {
        let [hours, minutes, seconds] = element.textContent.split(':').map(Number);

        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 47; 
                }
            }
        }

        element.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });
}

setInterval(updateCountdown, 1000);

document.getElementById('billingToggle').addEventListener('change', function() {
    const selectedPlan = document.getElementById('modalPlanName').textContent;
    const plan = plans.find(p => p.name === selectedPlan);
    if (plan) {
        updateModalPrice(plan.price, plan.annualPrice);
    }
});

document.getElementById('teamSize').addEventListener('change', recommendPlan);
document.getElementById('useCase').addEventListener('change', recommendPlan);

function recommendPlan() {
    const teamSize = document.getElementById('teamSize').value;
    const useCase = document.getElementById('useCase').value;

    let recommendedPlan = "Pro"; 

    if (teamSize === "1-5" && useCase === "personal") {
        recommendedPlan = "Basic";
    } else if (teamSize === "21+" || useCase === "enterprise") {
        recommendedPlan = "Enterprise";
    }

    document.getElementById('modalPlanName').innerHTML = 
        `${recommendedPlan} <span style="color: #10b981; font-size: 0.8em;">(Recommended)</span>`;
}
