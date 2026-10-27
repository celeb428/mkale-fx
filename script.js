/* =========================================================
   WebDev – Member Registration
   SPI 2201 – Web Application Development I
   ========================================================= */

// ---------------------------------------------------------
// 2. Grab all required DOM references
// ---------------------------------------------------------
const form          = document.getElementById('regform');
const nameInput     = document.getElementById('name');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput  = document.getElementById('confirm-password');
const genderSelect  = document.getElementById('gender');
const dobInput      = document.getElementById('dob');
const countryInput  = document.getElementById('country');
const phoneInput    = document.getElementById('phone');
const bioTextarea   = document.getElementById('bio');

const nameError     = document.getElementById('nameError');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError  = document.getElementById('confirmError');
const genderError   = document.getElementById('genderError');
const dobError      = document.getElementById('dobError');
const countryError  = document.getElementById('countryError');
const phoneError    = document.getElementById('phoneError');
const bioError      = document.getElementById('bioError');

const successMsg    = document.getElementById('successMsg');
const memberList    = document.getElementById('memberList');
const countSpan     = document.getElementById('count');
const emptyNote     = document.getElementById('emptyNote');
const themeBtn      = document.getElementById('theme');

// Quick console check that everything was found
console.log({
  form, nameInput, emailInput, passwordInput, confirmInput,
  genderSelect, dobInput, countryInput, phoneInput, bioTextarea,
  nameError, emailError, passwordError, confirmError,
  genderError, dobError, countryError, phoneError, bioError,
  successMsg, memberList, countSpan, emptyNote, themeBtn
});

// ---------------------------------------------------------
// Helper: show / clear a single field error
// ---------------------------------------------------------
function showError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  inputEl.classList.add('invalid');
}

function clearError(inputEl, errorEl) {
  errorEl.textContent = '';
  inputEl.classList.remove('invalid');
}

// ---------------------------------------------------------
// 5. Clear errors as the user fixes them (live feedback)
// ---------------------------------------------------------
const fields = [
  { input: nameInput,     error: nameError },
  { input: emailInput,    error: emailError },
  { input: passwordInput, error: passwordError },
  { input: confirmInput,  error: confirmError },
  { input: genderSelect,  error: genderError },
  { input: dobInput,      error: dobError },
  { input: countryInput,  error: countryError },
  { input: phoneInput,    error: phoneError },
  { input: bioTextarea,   error: bioError }
];

fields.forEach(({ input, error }) => {
  const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
  input.addEventListener(eventType, () => clearError(input, error));
});

// ---------------------------------------------------------
// 4. Validate every field
// ---------------------------------------------------------
function validateForm() {
  let isValid = true;

  // Full Name
  if (nameInput.value.trim() === '') {
    showError(nameInput, nameError, 'Full name is required');
    isValid = false;
  } else if (nameInput.value.trim().length < 3) {
    showError(nameInput, nameError, 'Name must be at least 3 characters');
    isValid = false;
  }

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() === '') {
    showError(emailInput, emailError, 'Email is required');
    isValid = false;
  } else if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, emailError, 'Please enter a valid email');
    isValid = false;
  }

  // Password
  if (passwordInput.value === '') {
    showError(passwordInput, passwordError, 'Password is required');
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    showError(passwordInput, passwordError, 'Password must be at least 6 characters');
    isValid = false;
  }

  // Confirm Password
  if (confirmInput.value === '') {
    showError(confirmInput, confirmError, 'Please confirm your password');
    isValid = false;
  } else if (confirmInput.value !== passwordInput.value) {
    showError(confirmInput, confirmError, 'Passwords do not match');
    isValid = false;
  }

  // Gender
  if (genderSelect.value === '') {
    showError(genderSelect, genderError, 'Please select a gender');
    isValid = false;
  }

  // Date of Birth
  if (dobInput.value === '') {
    showError(dobInput, dobError, 'Date of birth is required');
    isValid = false;
  } else {
    const birthDate = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 13) {
      showError(dobInput, dobError, 'You must be at least 13 years old');
      isValid = false;
    }
  }

  // Country
  if (countryInput.value.trim() === '') {
    showError(countryInput, countryError, 'Country is required');
    isValid = false;
  }

  // Phone
  const phonePattern = /^\+?[\d\s\-()]{7,20}$/;
  if (phoneInput.value.trim() === '') {
    showError(phoneInput, phoneError, 'Phone number is required');
    isValid = false;
  } else if (!phonePattern.test(phoneInput.value.trim())) {
    showError(phoneInput, phoneError, 'Please enter a valid phone number');
    isValid = false;
  }

  // Bio (optional but if present, keep it reasonable)
  if (bioTextarea.value.trim().length > 500) {
    showError(bioTextarea, bioError, 'Bio cannot exceed 500 characters');
    isValid = false;
  }

  return isValid;
}

// ---------------------------------------------------------
// 6 + 7 + 8. Register member (DOM creation), update counter,
//            show success message and reset form
// ---------------------------------------------------------
function registerMember() {
  // Create the list item
  const li = document.createElement('li');
  li.className = 'member-item';

  const info = document.createElement('div');
  info.className = 'info';

  const strong = document.createElement('strong');
  strong.textContent = nameInput.value.trim();

  const span = document.createElement('span');
  span.textContent = `${emailInput.value.trim()} · ${countryInput.value.trim()}`;

  info.appendChild(strong);
  info.appendChild(span);

  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove';
  removeBtn.type = 'button';
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => removeMember(li));

  li.appendChild(info);
  li.appendChild(removeBtn);

  // Hide empty note and append the new member
  if (emptyNote) {
    emptyNote.classList.add('hidden');
  }
  memberList.appendChild(li);

  // Update counter
  updateCounter();

  // Success message
  successMsg.textContent = `Welcome, ${nameInput.value.trim()}! You have been registered.`;
  successMsg.classList.remove('hidden');

  // Auto-hide success after 4 seconds
  setTimeout(() => {
    successMsg.classList.add('hidden');
  }, 4000);

  // Reset the form
  form.reset();
}

// ---------------------------------------------------------
// 7. Update the member counter
// ---------------------------------------------------------
function updateCounter() {
  // Count only real member items (ignore the empty note)
  const members = memberList.querySelectorAll('.member-item');
  countSpan.textContent = members.length;

  // Show empty note again if list becomes empty
  if (members.length === 0 && emptyNote) {
    emptyNote.classList.remove('hidden');
  }
}

// ---------------------------------------------------------
// 9. Remove a member
// ---------------------------------------------------------
function removeMember(li) {
  li.remove();
  updateCounter();
}

// ---------------------------------------------------------
// 3. Capture the form submission
// ---------------------------------------------------------
form.addEventListener('submit', function (e) {
  e.preventDefault();                 // stop page reload

  // Clear any previous success message
  successMsg.classList.add('hidden');

  if (validateForm()) {
    registerMember();
  }
});

// ---------------------------------------------------------
// 10. Dark Mode toggle
// ---------------------------------------------------------
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  // Update button text
  if (document.body.classList.contains('dark')) {
    themeBtn.textContent = 'Light Mode';
  } else {
    themeBtn.textContent = 'Dark Mode';
  }
});
