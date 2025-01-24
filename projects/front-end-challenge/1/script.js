const form = document.getElementById('signup-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const submitButton = document.getElementById('submit-button');

submitButton.disabled = true;

const rateLimiter = {
    attempts: 0,
    lastAttempt: Date.now(),
    maxAttempts: 5,
    timeWindow: 60000,

    checkLimit() {
        const now = Date.now();
        if (now - this.lastAttempt > this.timeWindow) {
            this.attempts = 0;
        }
        this.lastAttempt = now;
        this.attempts++;
        return this.attempts <= this.maxAttempts;
    }
};

username.addEventListener('input', () => validateInput('username'));
email.addEventListener('input', () => validateInput('email'));
password.addEventListener('input', () => validateInput('password'));
confirmPassword.addEventListener('input', () => validateInput('confirmPassword'));

username.addEventListener('blur', () => validateInput('username'));
email.addEventListener('blur', () => validateInput('email'));
password.addEventListener('blur', () => validateInput('password'));
confirmPassword.addEventListener('blur', () => validateInput('confirmPassword'));

document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!rateLimiter.checkLimit()) {
        alert('Too many attempts. Please try again later.');
        return;
    }
    if (validateInputs()) {
        console.log('Form submitted successfully');
    }
});

function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

function validate_string(inputString, forbiddenChars = "", requiredChars = "", singular = false) {
    if (!forbiddenChars && !requiredChars) {
        return {
            isValid: true,
            errorMessages: []
        };
    }

    if (forbiddenChars) {
        for (let char of inputString) {
            if (forbiddenChars.includes(char)) {
                return {
                    isValid: false,
                    errorMessages: [`Character '${char}' is not allowed`]
                };
            }
        }
    }

    if (requiredChars) {
        if (singular) {
            const hasRequired = [...requiredChars].some(char => inputString.includes(char));
            if (!hasRequired) {
                return {
                    isValid: false,
                    errorMessages: [`Must contain at least one of these characters: ${requiredChars}`]
                };
            }
        } else {
            for (let char of requiredChars) {
                if (!inputString.includes(char)) {
                    return {
                        isValid: false,
                        errorMessages: [`Missing required character '${char}'`]
                    };
                }
            }
        }
    }

    return {
        isValid: true,
        errorMessages: []
    };
}

function validateInput(inputType) {
    const usernameValue = sanitizeInput(username.value.trim());
    const emailValue = sanitizeInput(email.value.trim());
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    switch (inputType) {
        case 'username':
            if (usernameValue === '' && username === document.activeElement) {
                return;
            }
            if (usernameValue === '') {
                setErrorFor(username, 'Username cannot be blank');
                return;
            }
            if (usernameValue.length < 3) {
                setErrorFor(username, 'Username must be at least 3 characters');
                return;
            }
            if (usernameValue.length > 20) {
                setErrorFor(username, 'Username must be at most 20 characters');
                return;
            }
            if (usernameValue.includes(' ')) {
                setErrorFor(username, 'Username cannot contain spaces');
                return;
            }
            const validation = validate_string(usernameValue, "!\"#$%&'()*+,/:;<=>?@[\\]^`{|}~");
            if (!validation.isValid) {
                setErrorFor(username, validation.errorMessages[0]);
                return;
            }
            setSuccessFor(username);
            break;

        case 'email':
            if (emailValue === '' && email === document.activeElement) {
                return;
            }
            if (emailValue === '') {
                setErrorFor(email, 'Email cannot be blank');
                return;
            }
            if (emailValue.includes(' ')) {
                setErrorFor(email, 'Email cannot contain spaces');
                return;
            }
            const emailValidation = validate_string(emailValue, " ", "@.");
            if (!emailValidation.isValid) {
                setErrorFor(email, emailValidation.errorMessages[0]);
                return;
            }
            setSuccessFor(email);
            break;

        case 'password':
            if (passwordValue === '' && password === document.activeElement) {
                return;
            }
            if (passwordValue === '') {
                setErrorFor(password, 'Password cannot be blank');
                return;
            }
            if (passwordValue.includes(' ')) {
                setErrorFor(password, 'Password cannot contain spaces');
                return;
            }
            const upperValidation = validate_string(passwordValue, "", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", true);
            if (!upperValidation.isValid) {
                setErrorFor(password, 'Password must contain at least one uppercase letter');
                return;
            }
            const lowerValidation = validate_string(passwordValue, "", "abcdefghijklmnopqrstuvwxyz", true);
            if (!lowerValidation.isValid) {
                setErrorFor(password, 'Password must contain at least one lowercase letter');
                return;
            }
            const numberValidation = validate_string(passwordValue, "", "0123456789", true);
            if (!numberValidation.isValid) {
                setErrorFor(password, 'Password must contain at least one number');
                return;
            }
            const specialValidation = validate_string(passwordValue, "", "!@#$%^&*", true);
            if (!specialValidation.isValid) {
                setErrorFor(password, 'Password must contain at least one special character (!@#$%^&*)');
                return;
            }
            if (passwordValue.length < 8) {
                setErrorFor(password, 'Password must be at least 8 characters');
                return;
            }
            setSuccessFor(password);
            if (confirmPasswordValue !== '') {
                validateInput('confirmPassword');
            }
            break;

        case 'confirmPassword':
            if (confirmPasswordValue === '' && confirmPassword === document.activeElement) {
                return;
            }
            if (confirmPasswordValue === '') {
                setErrorFor(confirmPassword, 'Please confirm your password');
                return;
            }
            if (confirmPasswordValue !== passwordValue) {
                setErrorFor(confirmPassword, 'Passwords do not match');
                return;
            }
            setSuccessFor(confirmPassword);
            break;
    }
}

function validateInputs() {
    validateInput('username');
    validateInput('email');
    validateInput('password');
    validateInput('confirmPassword');

    const allValid = Array.from(document.querySelectorAll('.form-group')).every(
        group => group.classList.contains('success')
    );

    return allValid;
}

function setErrorFor(input, message) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.input-message');
    errorMessage.style.color = 'red';
    formGroup.className = 'form-group error';
    errorMessage.innerText = message;
    updateProgress();
    submitButton.disabled = true;
}

function setSuccessFor(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.input-message');
    errorMessage.style.color = 'green';
    formGroup.className = 'form-group success';
    errorMessage.innerText = 'Success';
    updateProgress();

    const allValid = Array.from(document.querySelectorAll('.form-group')).every(
        group => group.classList.contains('success')
    );
    submitButton.disabled = !allValid;
}

function updateProgress() {
    const inputCount = document.querySelectorAll('.form-group').length;
    const successCount = document.querySelectorAll('.form-group.success').length;
    const completePercent = (successCount / inputCount) * 100;

    form.setAttribute('complete-percent', completePercent);
    submitButton.style.setProperty('--progress', `${completePercent}%`);
}
