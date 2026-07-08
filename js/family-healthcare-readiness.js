const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfFjHRXaalRE6y-vAXLtdAySPBuqgKZy0VGKUaJcxJ7H6B7xvwl0lb8Q0y5qzsDcmwCQ/exec";

const questions = [
  {
    question: "Over the past two years, has the rising cost of healthcare affected your family's monthly budget?",
    answers: ["Yes, significantly", "Somewhat", "Very little", "Not at all"]
  },
  {
    question: "Have you or someone in your family delayed medical care because of the cost?",
    answers: ["Yes", "No"]
  },
  {
    question: "If an unexpected $1,000 medical expense occurred this month, how prepared would your family be?",
    answers: ["Very prepared", "Somewhat prepared", "Not prepared", "Unsure"]
  },
  {
    question: "Does your employer currently provide health insurance?",
    answers: ["Yes", "No", "Self-employed", "Retired"]
  },
  {
    question: "Does your employer offer an Employee Assistance Program, also known as an EAP?",
    answers: ["Yes", "No", "I'm not sure", "Does not apply"]
  },
  {
    question: "If your employment changed tomorrow, would your family still have affordable healthcare access?",
    answers: ["Yes", "Maybe", "Probably not", "No"]
  },
  {
    question: "How long does it usually take to schedule an appointment with your primary care physician?",
    answers: ["Same day", "1–3 days", "More than one week", "I do not have a primary care doctor"]
  },
  {
    question: "Have you visited urgent care or the emergency room because you could not get a doctor's appointment quickly enough?",
    answers: ["Yes", "No"]
  },
  {
    question: "Would 24/7 virtual access to a licensed physician be valuable to your family?",
    answers: ["Extremely valuable", "Somewhat valuable", "Not important"]
  },
  {
    question: "Have prescription costs ever caused you to delay or skip filling a medication?",
    answers: ["Yes", "No", "Not applicable"]
  },
  {
    question: "Does your current healthcare plan include mental health or counseling services?",
    answers: ["Yes", "No", "I'm not sure"]
  },
  {
    question: "If multiple family members could use one affordable healthcare membership, would that interest you?",
    answers: ["Very interested", "Somewhat interested", "Not interested"]
  }
];

let currentQuestion = 0;
let selectedAnswer = null;
let responses = [];

const surveySection = document.getElementById("surveySection");
const leadSection = document.getElementById("leadSection");
const thankyouSection = document.getElementById("thankyouSection");
const questionTitle = document.getElementById("questionTitle");
const answerOptions = document.getElementById("answerOptions");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const startSurveyBtn = document.getElementById("startSurvey");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const leadForm = document.getElementById("leadForm");

startSurveyBtn.addEventListener("click", () => {
  surveySection.style.display = "block";
  loadQuestion();

  window.scrollTo({
    top: surveySection.offsetTop - 40,
    behavior: "smooth"
  });
});

function loadQuestion() {
  selectedAnswer = responses[currentQuestion] || null;
  const q = questions[currentQuestion];

  questionTitle.textContent = q.question;
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  answerOptions.innerHTML = "";

  q.answers.forEach(answer => {
    const option = document.createElement("div");
    option.className = "answer-option";
    option.textContent = answer;

    if (selectedAnswer === answer) {
      option.classList.add("selected");
    }

    option.addEventListener("click", () => {
      document.querySelectorAll(".answer-option").forEach(item => {
        item.classList.remove("selected");
      });

      option.classList.add("selected");
      selectedAnswer = answer;
    });

    answerOptions.appendChild(option);
  });
}

nextBtn.addEventListener("click", () => {
  if (!selectedAnswer) {
    alert("Please select an answer before continuing.");
    return;
  }

  responses[currentQuestion] = selectedAnswer;
  currentQuestion++;

  if (currentQuestion >= questions.length) {
    surveySection.style.display = "none";
    leadSection.style.display = "block";

    window.scrollTo({
      top: leadSection.offsetTop - 40,
      behavior: "smooth"
    });

    return;
  }

  loadQuestion();
});

backBtn.addEventListener("click", () => {
  if (currentQuestion === 0) return;

  currentQuestion--;
  loadQuestion();

  window.scrollTo({
    top: surveySection.offsetTop - 40,
    behavior: "smooth"
  });
});

leadForm.addEventListener("submit", event => {
  event.preventDefault();

  const submitButton = leadForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  const form = event.target;
  const payload = new FormData();

  payload.append("leadSource", "2026 American Family Healthcare Readiness Survey");
  payload.append("firstName", form.firstName.value.trim());
  payload.append("lastName", form.lastName.value.trim());
  payload.append("email", form.email.value.trim());
  payload.append("phone", form.phone.value.trim());
  payload.append("zip", form.zip.value.trim());
  payload.append("submittedAt", new Date().toISOString());

  questions.forEach((q, index) => {
    payload.append(`q${index + 1}`, responses[index] || "");
  });

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: payload
  });

  leadSection.style.display = "none";
  thankyouSection.style.display = "block";

  window.scrollTo({
    top: thankyouSection.offsetTop - 40,
    behavior: "smooth"
  });
});