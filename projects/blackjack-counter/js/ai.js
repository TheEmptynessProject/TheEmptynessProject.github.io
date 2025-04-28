


document.addEventListener('DOMContentLoaded', () => {
    
    

    
    const basicStrategy = {
        hard: {
            
            21: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            18: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            17: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            16: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
            15: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
            14: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
            13: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
            12: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
            11: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
            10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
            9:  ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
            8:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
            7:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
            6:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
            5:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H']
        },
        soft: {
            
            21: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
            19: ['S', 'S', 'S', 'S', 'S', 'D', 'S', 'S', 'S', 'S'],
            18: ['D', 'D', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H'],
            17: ['H', 'D', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H'],
            16: ['H', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H'],
            15: ['H', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H'],
            14: ['H', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H'],
            13: ['H', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H']
        },
        pairs: {
            
            11: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'], 
            10: ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'], 
            9:  ['Y', 'Y', 'Y', 'Y', 'Y', 'N', 'Y', 'Y', 'N', 'N'], 
            8:  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'], 
            7:  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N', 'N'], 
            6:  ['Y', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'N', 'N', 'N'], 
            5:  ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'N', 'N'], 
            4:  ['H', 'H', 'H', 'Y', 'Y', 'N', 'H', 'H', 'H', 'H'], 
            3:  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'H', 'H'], 
            2:  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'N', 'N', 'H', 'H']  
        }
    };

    
    const countDeviations = [
        { playerHand: { type: 'hard', value: 16 }, dealerCard: 10, countThreshold: 0, strategy: 'S' },
        { playerHand: { type: 'hard', value: 15 }, dealerCard: 10, countThreshold: 4, strategy: 'S' },
        { playerHand: { type: 'hard', value: 12 }, dealerCard: 3, countThreshold: 2, strategy: 'S' },
        { playerHand: { type: 'hard', value: 12 }, dealerCard: 2, countThreshold: 3, strategy: 'S' },
        { playerHand: { type: 'hard', value: 11 }, dealerCard: 11, countThreshold: 1, strategy: 'D' },
        { playerHand: { type: 'hard', value: 10 }, dealerCard: 10, countThreshold: 4, strategy: 'D' },
        { playerHand: { type: 'hard', value: 10 }, dealerCard: 11, countThreshold: 4, strategy: 'D' },
        { playerHand: { type: 'hard', value: 9 }, dealerCard: 2, countThreshold: 1, strategy: 'D' },
        { playerHand: { type: 'hard', value: 9 }, dealerCard: 7, countThreshold: 3, strategy: 'D' }
        
    ];

    
    window.calculateOptimalBet = function(trueCount, minBet) {
        if (trueCount <= 0) return minBet;
        
        const betMultiplier = Math.min(Math.floor(trueCount), 5);
        return minBet * Math.max(betMultiplier, 1);
    };

    
    window.calculatePlayerAdvantage = function(trueCount) {
        
        return -0.5 + (trueCount * 0.5);
    };

    
    window.getBasicStrategy = function(playerHand, dealerCard, isSoft, isPair) {
        
        let dealerIndex;
        if (dealerCard === 'A') {
            dealerIndex = 9;
        } else if (['10', 'J', 'Q', 'K'].includes(dealerCard)) {
            dealerIndex = 8;
        } else {
            dealerIndex = parseInt(dealerCard) - 2;
        }

        
        let handType, handValue;
        
        if (isPair) {
            handType = 'pairs';
            
            if (playerHand[0] === 'A') {
                handValue = 11;
            } else if (['10', 'J', 'Q', 'K'].includes(playerHand[0])) {
                handValue = 10;
            } else {
                handValue = parseInt(playerHand[0]);
            }
        } else if (isSoft) {
            handType = 'soft';
            handValue = parseInt(playerHand);
        } else {
            handType = 'hard';
            handValue = parseInt(playerHand);
        }

        
        const recommendation = basicStrategy[handType][handValue]?.[dealerIndex];
        
        
        switch (recommendation) {
            case 'H': return 'Hit';
            case 'S': return 'Stand';
            case 'D': return 'Double down if allowed, otherwise hit';
            case 'Y': return 'Split';
            case 'N': return 'Do not split';
            default: return 'Unknown';
        }
    };

    
    window.getCountBasedDeviation = function(playerTotal, dealerCard, trueCount, isSoft) {
        
        let dealerValue;
        if (dealerCard === 'A') {
            dealerValue = 11;
        } else if (['10', 'J', 'Q', 'K'].includes(dealerCard)) {
            dealerValue = 10;
        } else {
            dealerValue = parseInt(dealerCard);
        }

        
        for (const deviation of countDeviations) {
            if (deviation.playerHand.value === playerTotal && 
                deviation.dealerCard === dealerValue &&
                trueCount >= deviation.countThreshold &&
                deviation.playerHand.type === (isSoft ? 'soft' : 'hard')) {
                
                
                switch (deviation.strategy) {
                    case 'H': return 'Hit (deviation)';
                    case 'S': return 'Stand (deviation)';
                    case 'D': return 'Double down (deviation)';
                    default: return deviation.strategy;
                }
            }
        }

        return null; 
    };

    
    window.getHandExplanation = function(playerTotal, dealerCard, isSoft) {
        
        const explanations = {
            hardHighHand: "With a hard 17 or higher, your risk of busting is high, and you already have a strong hand. Standing is almost always correct.",
            hardStiffVsStrong: "With a stiff hand (12-16) against a dealer's strong card (7-A), basic strategy recommends hitting. The dealer has a better chance of making a strong hand, so you need to improve your hand despite the risk of busting.",
            hardStiffVsWeak: "With a stiff hand (12-16) against a dealer's weak card (2-6), basic strategy recommends standing. The dealer has a high chance of busting, so you should minimize your own bust risk.",
            alwaysHit: "With 11 or less, you cannot bust with one more card, so always hit to improve your hand.",
            softTotal: "Soft hands (containing an Ace) are powerful because you cannot bust with one hit. You can always count the Ace as 1 if needed to avoid busting.",
            doubleDown: "Doubling down allows you to double your bet but you receive exactly one more card. This maximizes profit in favorable situations.",
            insurancePositive: "Insurance is a side bet that pays 2:1 if the dealer has blackjack. It's usually a bad bet, but becomes profitable when the true count is +3 or higher because there are more 10-value cards remaining in the deck.",
            insuranceNegative: "Insurance is a side bet that pays 2:1 if the dealer has blackjack. At a true count below +3, this is a negative expectation bet and should be avoided."
        };

        
        if (playerTotal >= 17 && !isSoft) {
            return explanations.hardHighHand;
        } else if (playerTotal >= 12 && playerTotal <= 16 && !isSoft) {
            if (['7', '8', '9', '10', 'J', 'Q', 'K', 'A'].includes(dealerCard)) {
                return explanations.hardStiffVsStrong;
            } else {
                return explanations.hardStiffVsWeak;
            }
        } else if (playerTotal <= 11 && !isSoft) {
            return explanations.alwaysHit;
        } else if (isSoft) {
            return explanations.softTotal;
        }

        return "Apply basic strategy for optimal play.";
    };
});
