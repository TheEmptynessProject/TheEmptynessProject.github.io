document.addEventListener('DOMContentLoaded', () => {
    
    const dealerCardsEl = document.getElementById('dealer-cards');
    const playerCardsEl = document.getElementById('player-cards');
    const dealerScoreEl = document.getElementById('dealer-score');
    const playerScoreEl = document.getElementById('player-score');
    
    const dealBtn = document.getElementById('deal-btn');
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const doubleBtn = document.getElementById('double-btn');
    const splitBtn = document.getElementById('split-btn');
    
    const chips = document.querySelectorAll('.chip');
    const clearBetBtn = document.getElementById('clear-bet');
    const betAmountEl = document.getElementById('bet-amount');
    const playerBankEl = document.getElementById('player-bank');
    
    const currentCountEl = document.getElementById('current-count');
    const trueCountEl = document.getElementById('true-count');
    const decksRemainingEl = document.getElementById('decks-remaining');
    const winProbabilityEl = document.getElementById('win-probability');
    
    const resultModal = document.getElementById('game-result');
    const resultTitleEl = document.getElementById('result-title');
    const resultMessageEl = document.getElementById('result-message');
    const finalCountEl = document.getElementById('final-count');
    const finalTrueCountEl = document.getElementById('final-true-count');
    const optimalBetEl = document.getElementById('optimal-bet');
    const nextHandBtn = document.getElementById('next-hand-btn');
    
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsContent = document.querySelector('.settings-content');
    const applySettingsBtn = document.getElementById('apply-settings');
    const numDecksSelect = document.getElementById('decks');
    const penetrationRange = document.getElementById('penetration');
    const penetrationValue = document.getElementById('penetration-value');
    const countSystemSelect = document.getElementById('count-system');
    
    const advisorToggle = document.getElementById('advisor-toggle');
    const adviceDisplay = document.getElementById('advice-display');
    
    const lessonSelector = document.getElementById('lesson-selector');
    const lessonContent = document.getElementById('lesson-content');
    
    
    let gameSettings = {
        numDecks: 6,
        penetration: 75, 
        countSystem: 'hi-lo'
    };
    
    let deck = [];
    let dealerCards = [];
    let playerCards = [];
    let currentBet = 0;
    let playerBank = 1000;
    let gameInProgress = false;
    
    let cardCounting = {
        runningCount: 0,
        trueCount: 0,
        decksRemaining: gameSettings.numDecks
    };
    
    
    const countingSystems = {
        'hi-lo': {
            2: 1, 3: 1, 4: 1, 5: 1, 6: 1,
            7: 0, 8: 0, 9: 0,
            10: -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
        },
        'ko': {
            2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1,
            8: 0, 9: 0,
            10: -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
        },
        'hi-opt1': {
            2: 0, 3: 1, 4: 1, 5: 1, 6: 1,
            7: 0, 8: 0, 9: 0,
            10: -1, 'J': -1, 'Q': -1, 'K': -1, 'A': 0
        },
        'hi-opt2': {
            2: 1, 3: 1, 4: 2, 5: 2, 6: 1,
            7: 1, 8: 0, 9: 0,
            10: -2, 'J': -2, 'Q': -2, 'K': -2, 'A': 0
        }
    };
    
    
    function init() {
        resetGame();
        setupEventListeners();
        updateBankDisplay();
        loadLessonContent('intro');
    }
    
    
    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        let newDeck = [];
        
        
        for (let d = 0; d < gameSettings.numDecks; d++) {
            for (const suit of suits) {
                for (const value of values) {
                    newDeck.push({ suit, value });
                }
            }
        }
        
        
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        
        
        const cutOffPoint = Math.floor(newDeck.length * (100 - gameSettings.penetration) / 100);
        deck = newDeck.slice(0, newDeck.length - cutOffPoint);
        
        
        cardCounting.runningCount = 0;
        cardCounting.trueCount = 0;
        cardCounting.decksRemaining = gameSettings.numDecks;
        
        updateCountDisplay();
    }
    
    
    function dealInitialCards() {
        if (currentBet <= 0) {
            alert("Please place a bet first!");
            return;
        }
        
        
        if (deck.length < 10) {
            createDeck();
        }
        
        gameInProgress = true;
        clearTable();
        
        
        playerCards.push(dealCard());
        dealerCards.push(dealCard());
        playerCards.push(dealCard());
        dealerCards.push(dealCard(true)); 
        
        renderCards();
        updateScore();
        
        
        toggleGameButtons(true);
        dealBtn.disabled = true;
        
        
        if (calculateScore(playerCards) === 21) {
            setTimeout(() => handlePlayerBlackjack(), 500);
        }
        
        
        updateAIAdvice();
    }
    
    
    function dealCard(faceDown = false) {
        if (deck.length === 0) return null;
        
        const card = deck.pop();
        card.faceDown = faceDown;
        
        
        if (!faceDown) {
            updateCardCount(card);
        }
        
        
        cardCounting.decksRemaining = (deck.length / 52).toFixed(1);
        cardCounting.trueCount = (cardCounting.runningCount / cardCounting.decksRemaining).toFixed(1);
        
        updateCountDisplay();
        return card;
    }
    
    
    function updateCardCount(card) {
        const countSystem = countingSystems[gameSettings.countSystem];
        const cardValue = card.value;
        
        if (countSystem.hasOwnProperty(cardValue)) {
            cardCounting.runningCount += countSystem[cardValue];
            cardCounting.trueCount = (cardCounting.runningCount / cardCounting.decksRemaining).toFixed(1);
        }
    }
    
    
    function renderCards() {
        dealerCardsEl.innerHTML = '';
        playerCardsEl.innerHTML = '';
        
        
        dealerCards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            
            if (card.faceDown) {
                cardEl.style.backgroundImage = `url('assets/images/cards/back.png')`;
            } else {
                cardEl.style.backgroundImage = `url('assets/images/cards/${card.value}_of_${card.suit}.png')`;
            }
            
            
            cardEl.style.transform = `translateX(${index * 30}px)`;
            
            dealerCardsEl.appendChild(cardEl);
        });
        
        
        playerCards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.style.backgroundImage = `url('assets/images/cards/${card.value}_of_${card.suit}.png')`;
            
            
            cardEl.style.transform = `translateX(${index * 30}px)`;
            
            playerCardsEl.appendChild(cardEl);
        });
        
        
        animateCards();
    }
    
    
    function calculateScore(cards) {
        let score = 0;
        let aces = 0;
        
        cards.forEach(card => {
            if (!card.faceDown) {
                if (card.value === 'A') {
                    aces += 1;
                    score += 11;
                } else if (['K', 'Q', 'J'].includes(card.value)) {
                    score += 10;
                } else {
                    score += parseInt(card.value);
                }
            }
        });
        
        
        while (score > 21 && aces > 0) {
            score -= 10;
            aces -= 1;
        }
        
        return score;
    }
    
    
    function updateScore() {
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        
        playerScoreEl.textContent = playerScore;
        dealerScoreEl.textContent = dealerScore;
    }
    
    
    function playerHit() {
        const card = dealCard();
        playerCards.push(card);
        
        renderCards();
        updateScore();
        
        const playerScore = calculateScore(playerCards);
        
        
        if (playerScore > 21) {
            setTimeout(() => handlePlayerBust(), 500);
        }
        
        
        updateAIAdvice();
    }
    
    function playerStand() {
        toggleGameButtons(false);
        
        
        revealDealerCard();
        
        
        setTimeout(dealerPlay, 500);
    }
    
    function playerDouble() {
        if (playerBank < currentBet) {
            alert("Insufficient funds to double down!");
            return;
        }
        
        
        playerBank -= currentBet;
        currentBet *= 2;
        updateBetDisplay();
        updateBankDisplay();
        
        
        const card = dealCard();
        playerCards.push(card);
        
        renderCards();
        updateScore();
        
        const playerScore = calculateScore(playerCards);
        
        
        if (playerScore > 21) {
            setTimeout(() => handlePlayerBust(), 500);
        } else {
            setTimeout(() => playerStand(), 500);
        }
    }
    
    function revealDealerCard() {
        
        dealerCards.forEach(card => {
            if (card.faceDown) {
                card.faceDown = false;
                
                updateCardCount(card);
                updateCountDisplay();
            }
        });
        
        renderCards();
        updateScore();
    }
    
    function dealerPlay() {
        let dealerScore = calculateScore(dealerCards);
        
        
        if (dealerScore < 17) {
            const card = dealCard();
            dealerCards.push(card);
            
            renderCards();
            updateScore();
            
            
            setTimeout(dealerPlay, 500);
        } else {
            
            determineWinner();
        }
    }
    
    
    function handlePlayerBlackjack() {
        revealDealerCard();
        const dealerScore = calculateScore(dealerCards);
        
        if (dealerScore === 21) {
            
            endRound("Push! Both have Blackjack.", currentBet);
        } else {
            
            endRound("Blackjack! You win.", currentBet + Math.floor(currentBet * 1.5));
        }
    }
    
    function handlePlayerBust() {
        toggleGameButtons(false);
        endRound("Bust! You lose.", 0);
    }
    
    function determineWinner() {
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        
        if (dealerScore > 21) {
            
            endRound("Dealer busts! You win.", currentBet * 2);
        } else if (playerScore > dealerScore) {
            
            endRound("You win!", currentBet * 2);
        } else if (dealerScore > playerScore) {
            
            endRound("Dealer wins!", 0);
        } else {
            
            endRound("Push! It's a tie.", currentBet);
        }
    }
    
    function endRound(message, payoutAmount) {
        gameInProgress = false;
        toggleGameButtons(false);
        dealBtn.disabled = false;
        
        
        playerBank += payoutAmount;
        updateBankDisplay();
        
        
        resultTitleEl.textContent = "Round Complete";
        resultMessageEl.textContent = message;
        finalCountEl.textContent = cardCounting.runningCount;
        finalTrueCountEl.textContent = cardCounting.trueCount;
        
        
        const trueCount = parseFloat(cardCounting.trueCount);
        let betAdvice = "Minimum Bet";
        
        if (trueCount >= 2) {
            const betMultiplier = Math.min(Math.floor(trueCount), 5);
            betAdvice = `${betMultiplier}x Minimum Bet`;
        }
        
        optimalBetEl.textContent = betAdvice;
        resultModal.classList.remove('hidden');
        
        
        currentBet = 0;
        updateBetDisplay();
    }
    
    
    function addToBet(amount) {
        if (playerBank >= amount) {
            currentBet += amount;
            playerBank -= amount;
            updateBetDisplay();
            updateBankDisplay();
        } else {
            alert("Insufficient funds!");
        }
    }
    
    function clearBet() {
        playerBank += currentBet;
        currentBet = 0;
        updateBetDisplay();
        updateBankDisplay();
    }
    
    function updateBetDisplay() {
        betAmountEl.textContent = currentBet;
        
        
        dealBtn.disabled = currentBet <= 0 || gameInProgress;
    }
    
    function updateBankDisplay() {
        playerBankEl.textContent = playerBank;
    }
    
    
    function toggleGameButtons(enabled) {
        hitBtn.disabled = !enabled;
        standBtn.disabled = !enabled;
        
        
        doubleBtn.disabled = !(enabled && playerCards.length === 2);
        
        
        const canSplit = playerCards.length === 2 && 
                         playerCards[0].value === playerCards[1].value &&
                         playerBank >= currentBet;
        splitBtn.disabled = !(enabled && canSplit);
    }
    
    function clearTable() {
        dealerCards = [];
        playerCards = [];
        dealerCardsEl.innerHTML = '';
        playerCardsEl.innerHTML = '';
        dealerScoreEl.textContent = '0';
        playerScoreEl.textContent = '0';
    }
    
    function resetGame() {
        clearTable();
        createDeck();
        
        currentBet = 0;
        gameInProgress = false;
        
        updateBetDisplay();
        toggleGameButtons(false);
        dealBtn.disabled = currentBet <= 0;
    }
    
    function updateCountDisplay() {
        currentCountEl.textContent = cardCounting.runningCount;
        trueCountEl.textContent = cardCounting.trueCount;
        decksRemainingEl.textContent = cardCounting.decksRemaining;
        
        
        const trueCount = parseFloat(cardCounting.trueCount);
        let winProb;
        
        if (trueCount <= -3) winProb = "< 45%";
        else if (trueCount <= -1) winProb = "45-47%";
        else if (trueCount < 1) winProb = "48-49%";
        else if (trueCount === 1) winProb = "50%";
        else if (trueCount <= 3) winProb = "51-53%";
        else if (trueCount <= 5) winProb = "54-56%";
        else winProb = "> 56%";
        
        winProbabilityEl.textContent = winProb;
    }
    
    
    function toggleSettings() {
        settingsContent.classList.toggle('hidden');
    }
    
    function applySettings() {
        gameSettings.numDecks = parseInt(numDecksSelect.value);
        gameSettings.penetration = parseInt(penetrationRange.value);
        gameSettings.countSystem = countSystemSelect.value;
        
        
        createDeck();
        resetGame();
        settingsContent.classList.add('hidden');
    }
    
    function updatePenetrationValue() {
        penetrationValue.textContent = penetrationRange.value + '%';
    }
    
    
    function updateAIAdvice() {
        const advisorMode = advisorToggle.value;
        
        if (advisorMode === 'off') {
            adviceDisplay.innerHTML = '<p>Turn on the AI Advisor for strategic guidance.</p>';
            return;
        }
        
        const playerScore = calculateScore(playerCards);
        const dealerUpcard = dealerCards[0].faceDown ? null : dealerCards[0].value;
        const dealerValue = dealerUpcard === 'A' ? 11 : 
                            ['K', 'Q', 'J', '10'].includes(dealerUpcard) ? 10 : 
                            dealerUpcard ? parseInt(dealerUpcard) : null;
        
        let advice = '';
        
        
        if (playerScore === 21) {
            advice = "You have 21! Stand and collect your winnings.";
        } else if (!dealerValue) {
            advice = "Waiting for dealer's card to be revealed.";
        } else if (playerCards.length === 2 && playerCards[0].value === playerCards[1].value) {
            
            advice = getBasicSplittingAdvice(playerCards[0].value, dealerValue);
        } else if (containsAce(playerCards) && playerScore <= 21) {
            
            advice = getSoftTotalAdvice(playerScore, dealerValue);
        } else {
            
            advice = getHardTotalAdvice(playerScore, dealerValue);
        }
        
        
        if (advisorMode === 'counting' || advisorMode === 'full') {
            const countModification = getCountBasedModification(playerScore, dealerValue);
            
            if (countModification) {
                advice += `<br><br><strong>Count-Based Adjustment:</strong><br>${countModification}`;
            }
        }
        
        
        if (advisorMode === 'full') {
            const explanation = getStrategyExplanation(playerScore, dealerValue);
            
            if (explanation) {
                advice += `<br><br><strong>Explanation:</strong><br>${explanation}`;
            }
        }
        
        adviceDisplay.innerHTML = `<p>${advice}</p>`;
    }
    
    
    function getBasicSplittingAdvice(cardValue, dealerValue) {
        const pairValue = ['K', 'Q', 'J', '10'].includes(cardValue) ? 10 : 
                          cardValue === 'A' ? 11 : parseInt(cardValue);
        
        if (pairValue === 11) { 
            return "Split the Aces.";
        } else if (pairValue === 10) { 
            return "Don't split 10s. Stand with 20.";
        } else if (pairValue === 9) { 
            if ([2, 3, 4, 5, 6, 8, 9].includes(dealerValue)) {
                return "Split 9s against dealer 2-6, 8-9.";
            } else {
                return "Don't split 9s. Stand with 18.";
            }
        } else if (pairValue === 8) { 
            return "Always split 8s.";
        } else if (pairValue === 7) { 
            if (dealerValue <= 7) {
                return "Split 7s against dealer 2-7.";
            } else {
                return "Don't split 7s. Hit with 14.";
            }
        } else if (pairValue === 6) { 
            if (dealerValue <= 6) {
                return "Split 6s against dealer 2-6.";
            } else {
                return "Don't split 6s. Hit with 12.";
            }
        } else if (pairValue === 5) { 
            if (dealerValue <= 9) {
                return "Don't split 5s. Double down with 10.";
            } else {
                return "Don't split 5s. Hit with 10.";
            }
        } else if (pairValue === 4) { 
            if (dealerValue === 5 || dealerValue === 6) {
                return "Split 4s against dealer 5-6.";
            } else {
                return "Don't split 4s. Hit with 8.";
            }
        } else if (pairValue === 3 || pairValue === 2) { 
            if (dealerValue <= 7) {
                return `Split ${pairValue}s against dealer 2-7.`;
            } else {
                return `Don't split ${pairValue}s. Hit with ${pairValue * 2}.`;
            }
        }
        
        return "Split based on basic strategy chart.";
    }
    
    function getSoftTotalAdvice(playerScore, dealerValue) {
        if (playerScore === 20) { 
            return "Stand with soft 20.";
        } else if (playerScore === 19) { 
            if (dealerValue === 6) {
                return "Double with soft 19 against dealer 6, otherwise stand.";
            } else {
                return "Stand with soft 19.";
            }
        } else if (playerScore === 18) { 
            if (dealerValue <= 6) {
                return "Double with soft 18 against dealer 2-6.";
            } else if (dealerValue <= 8) {
                return "Stand with soft 18 against dealer 7-8.";
            } else {
                return "Hit with soft 18 against dealer 9-A.";
            }
        } else if (playerScore === 17) { 
            if (dealerValue <= 6) {
                return "Double with soft 17 against dealer 2-6, otherwise hit.";
            } else {
                return "Hit with soft 17.";
            }
        } else if (playerScore === 16 || playerScore === 15) { 
            if (dealerValue >= 4 && dealerValue <= 6) {
                return `Double with soft ${playerScore} against dealer 4-6, otherwise hit.`;
            } else {
                return `Hit with soft ${playerScore}.`;
            }
        } else { 
            if (dealerValue === 5 || dealerValue === 6) {
                return `Double with soft ${playerScore} against dealer 5-6, otherwise hit.`;
            } else {
                return `Hit with soft ${playerScore}.`;
            }
        }
    }
    
    function getHardTotalAdvice(playerScore, dealerValue) {
        if (playerScore >= 17) {
            return `Stand with ${playerScore}.`;
        } else if (playerScore >= 13) {
            if (dealerValue <= 6) {
                return `Stand with ${playerScore} against dealer 2-6.`;
            } else {
                return `Hit with ${playerScore} against dealer 7-A.`;
            }
        } else if (playerScore === 12) {
            if (dealerValue >= 4 && dealerValue <= 6) {
                return "Stand with 12 against dealer 4-6, otherwise hit.";
            } else {
                return "Hit with 12.";
            }
        } else if (playerScore === 11) {
            return "Double with 11.";
        } else if (playerScore === 10) {
            if (dealerValue <= 9) {
                return "Double with 10 against dealer 2-9, otherwise hit.";
            } else {
                return "Hit with 10.";
            }
        } else if (playerScore === 9) {
            if (dealerValue >= 3 && dealerValue <= 6) {
                return "Double with 9 against dealer 3-6, otherwise hit.";
            } else {
                return "Hit with 9.";
            }
        } else {
            return `Hit with ${playerScore}.`;
        }
    }
    
    function getCountBasedModification(playerScore, dealerValue) {
        const trueCount = parseFloat(cardCounting.trueCount);
        
        
        if (playerScore === 16 && dealerValue === 10 && trueCount >= 0) {
            return "Stand (deviation from basic strategy due to positive count)";
        } else if (playerScore === 15 && dealerValue === 10 && trueCount >= 4) {
            return "Stand (deviation from basic strategy due to high count)";
        } else if (playerScore === 12 && dealerValue === 3 && trueCount >= 2) {
            return "Stand (deviation from basic strategy due to positive count)";
        } else if (playerScore === 12 && dealerValue === 2 && trueCount >= 3) {
            return "Stand (deviation from basic strategy due to high count)";
        } else if (playerScore === 10 && dealerValue === 10 && trueCount >= 4) {
            return "Double (deviation from basic strategy due to high count)";
        } else if (playerScore === 10 && dealerValue === 11 && trueCount >= 4) {
            return "Double (deviation from basic strategy due to high count)";
        } else if (playerScore === 9 && dealerValue === 2 && trueCount >= 1) {
            return "Double (deviation from basic strategy due to positive count)";
        } else if (playerScore === 9 && dealerValue === 7 && trueCount >= 3) {
            return "Double (deviation from basic strategy due to high count)";
        }
        
        
        if (dealerValue === 11 && playerCards.length === 2 && trueCount >= 3) {
            return "Consider taking insurance due to high count";
        }
        
        return null;
    }
    
    function getStrategyExplanation(playerScore, dealerValue) {
        
        if (playerScore >= 17) {
            return "With 17 or higher, the odds favor standing. Even against a strong dealer upcard, the risk of busting is too high.";
        } else if (playerScore === 16 && dealerValue === 10) {
            return "16 vs 10 is one of the toughest hands. Basic strategy says hit, but with a positive count (more low cards dealt), stand becomes better.";
        } else if (playerScore <= 11) {
            return "With 11 or less, you cannot bust with one more card. Double down when allowed to maximize profit on favorable situations.";
        } else if (playerScore >= 12 && playerScore <= 16 && dealerValue >= 7) {
            return "This is a 'stiff hand' against a strong dealer card. While you might bust, the dealer has a better hand if they don't.";
        } else if (playerScore >= 12 && playerScore <= 16 && dealerValue <= 6) {
            return "The dealer has a good chance of busting with a 2-6 upcard. Standing with your stiff hand lets you win when the dealer busts.";
        }
        
        return null;
    }
    
    
    function containsAce(cards) {
        return cards.some(card => card.value === 'A');
    }
    
    
    function loadLessonContent(lessonKey) {
        const lessons = {
            'intro': `
                <h3>Introduction to Card Counting</h3>
                <p>Card counting is a strategy used in blackjack to determine when the player has an advantage over the house. The basic principle is that high cards (10, J, Q, K, A) are good for the player, while low cards (2-6) are good for the dealer.</p>
                <p>When there are more high cards remaining in the deck, the player has a better chance of getting blackjack, which pays 3:2. The dealer is also more likely to bust when drawing to a stiff hand.</p>
                <p>Card counting is not illegal, but casinos may ask you to leave if they suspect you're counting cards.</p>
            `,
            'hi-lo': `
                <h3>Hi-Lo Counting System</h3>
                <p>The Hi-Lo system is one of the most popular and straightforward card counting systems:</p>
                <ul>
                    <li>Cards 2-6: +1 (Low cards help the dealer)</li>
                    <li>Cards 7-9: 0 (Neutral cards)</li>
                    <li>Cards 10-A: -1 (High cards help the player)</li>
                </ul>
                <p>To use this system:</p>
                <ol>
                    <li>Start your count at 0 at the beginning of a shoe</li>
                    <li>Add or subtract from your count as each card is dealt</li>
                    <li>A positive count means more high cards remain, giving you an advantage</li>
                    <li>A negative count means more low cards remain, giving the house an advantage</li>
                </ol>
            `,
            'true-count': `
                <h3>True Count Calculation</h3>
                <p>The running count must be converted to a true count to account for multiple decks:</p>
                <p><strong>True Count = Running Count ÷ Decks Remaining</strong></p>
                <p>This conversion is essential for multi-deck games because the effect of a positive running count is diluted when there are many decks remaining.</p>
                <p>Example: If your running count is +8 and there are 4 decks remaining, your true count is +2.</p>
                <p>The true count gives you a more accurate picture of your advantage or disadvantage against the house.</p>
            `,
            'betting': `
                <h3>Betting Strategies</h3>
                <p>The true count tells you when to increase your bets:</p>
                <ul>
                    <li>True Count ≤ 0: Bet the minimum</li>
                    <li>True Count = 1: Bet 2x minimum</li>
                    <li>True Count = 2: Bet 3x minimum</li>
                    <li>True Count = 3: Bet 4x minimum</li>
                    <li>True Count ≥ 4: Bet 5x minimum</li>
                </ul>
                <p>This is known as a "spread" - the difference between your highest and lowest bets.</p>
                <p>Note: A larger spread gives you more profit but is more noticeable to casino staff.</p>
                <p>Always size your bets based on your bankroll and comfort level.</p>
            `,
            'deviations': `
                <h3>Strategy Deviations</h3>
                <p>Basic strategy remains your foundation, but you should deviate in specific situations based on the count:</p>
                <ul>
                    <li>16 vs. 10: Stand if count is 0 or higher (otherwise hit)</li>
                    <li>15 vs. 10: Stand if count is +4 or higher (otherwise hit)</li>
                    <li>12 vs. 3: Stand if count is +2 or higher (otherwise hit)</li>
                    <li>12 vs. 2: Stand if count is +3 or higher (otherwise hit)</li>
                    <li>10 vs. A: Double if count is +4 or higher (otherwise hit)</li>
                    <li>Insurance: Take it if count is +3 or higher (otherwise decline)</li>
                </ul>
                <p>These deviations can significantly increase your edge when applied correctly.</p>
            `
        };
        
        lessonContent.innerHTML = lessons[lessonKey] || '<p>Select a lesson to learn about card counting techniques.</p>';
    }
    
    
    function setupEventListeners() {
        
        dealBtn.addEventListener('click', dealInitialCards);
        hitBtn.addEventListener('click', playerHit);
        standBtn.addEventListener('click', playerStand);
        doubleBtn.addEventListener('click', playerDouble);
        splitBtn.addEventListener('click', () => alert("Split functionality coming soon!"));
        
        
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (!gameInProgress) {
                    addToBet(parseInt(chip.dataset.value));
                }
            });
        });
        
        clearBetBtn.addEventListener('click', () => {
            if (!gameInProgress) {
                clearBet();
            }
        });
        
        
        nextHandBtn.addEventListener('click', () => {
            resultModal.classList.add('hidden');
        });
        
        
        settingsToggle.addEventListener('click', toggleSettings);
        applySettingsBtn.addEventListener('click', applySettings);
        penetrationRange.addEventListener('input', updatePenetrationValue);
        
        
        advisorToggle.addEventListener('change', updateAIAdvice);
        
        
        lessonSelector.addEventListener('change', (e) => {
            loadLessonContent(e.target.value);
        });
    }
    
    
    init();
});
