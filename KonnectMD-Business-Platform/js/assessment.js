const questions = [
  {
    question: "Which best describes your business?",
    key: "industry",
    answers: [
      "Restaurant / Food Service",
      "Construction / Trades",
      "Real Estate",
      "Financial Services",
      "Medical / Dental",
      "Retail",
      "Home Services",
      "Church / Nonprofit",
      "Cleaning / Landscaping",
      "Other"
    ]
  },
  {
    question: "How many employees do you currently have?",
    key: "employees",
    answers: ["Just me", "2–10 employees", "11–25 employees", "26–50 employees", "51+ employees"]
  },
  {
    question: "How difficult has hiring been over the past 12 months?",
    key: "hiring",
    answers: ["Very difficult", "Somewhat difficult", "Not difficult", "We are not hiring right now"]
  },
  {
    question: "How difficult is it to keep good employees?",
    key: "retention",
    answers: ["Very difficult", "Somewhat difficult", "Not difficult", "Not sure"]
  },
  {
    question: "Do you currently offer employee benefits?",
    key: "benefits",
    answers: ["Yes, full benefits", "Limited benefits", "No benefits", "Looking for options"]
  },
  {
    type: "gift"
  },
  {
    question: "Which benefit do you believe your team would value most?",
    key: "valuedBenefit",
    answers: ["Healthcare access", "Mental health support", "Prescription savings", "Family support", "Paid time off", "Not sure"]
  },
  {
    question: "If you could offer affordable healthcare access without traditional group insurance, would you want to learn more?",
    key: "interest",
    answers: ["Yes", "Maybe", "Not right now"]
  },
  {
    question: "When are you planning to review employee benefits?",
    key: "timeline",
    answers: ["Immediately", "Within 30 days", "Within 3–6 months", "Just researching"]
  },
  {
    question: "What is the biggest challenge facing your business right now?",
    key: "challenge",
    answers: ["Hiring", "Retention", "Healthcare costs", "Employee satisfaction", "Profitability", "Growth"]
  }
];

let current = -1;
let responses = {};

const screen = document.getElementById("screen");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const stepText = document.getElementById("stepText");

function startAssessment() {
  current = 0;
  renderQuestion();
}

function updateProgress() {
  const percent = Math.round(((current + 1) / questions.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${percent}% Complete`;
  stepText.textContent = `Question ${Math.min(current + 1, questions.length)} of ${questions.length}`;
}

function renderQuestion() {
  updateProgress();

  const item = questions[current];

  if (item.type === "gift") {
    screen.innerHTML = `
      <div class="gift-box">
        <div class="gift-icon">🎁</div>
        <p class="eyebrow">Business Appreciation Gift</p>
        <h2>You're halfway there.</h2>
        <p>
          Complete your Employee Benefits Advantage Score™ and we'll send you a complimentary
          $50 dining certificate to one of our participating restaurant partners.
        </p>
        <button class="primary-btn" onclick="nextQuestion()">Continue My Assessment</button>
      </div>
    `;
    return;
  }

  screen.innerHTML = `
    <p class="eyebrow">Building Your Benefits Score</p>
    <h2>${item.question}</h2>
    <div class="answers">
      ${item.answers.map(answer => `
        <div class="answer-card" onclick="selectAnswer('${item.key}', '${answer.replace(/'/g, "\\'")}')">
          <strong>${answer}</strong>
          <span>Select this answer</span>
        </div>
      `).join("")}
    </div>
  `;
}

function selectAnswer(key, value) {
  responses[key] = value;
  nextQuestion();
}

function nextQuestion() {
  current++;

  if (current >= questions.length) {
    renderLeadForm();
  } else {
    renderQuestion();
  }
}

function calculateScore() {
  let score = 62;

  if (responses.employees !== "Just me") score += 8;
  if (responses.benefits === "No benefits" || responses.benefits === "Limited benefits") score += 8;
  if (responses.hiring === "Very difficult" || responses.retention === "Very difficult") score += 8;
  if (responses.interest === "Yes") score += 10;
  if (responses.timeline === "Immediately" || responses.timeline === "Within 30 days") score += 4;

  return Math.min(score, 96);
}

function renderLeadForm() {
  progressFill.style.width = "100%";
  progressText.textContent = "Assessment Complete";
  stepText.textContent = "Final Step";

  const score = calculateScore();

  screen.innerHTML = `
    <p class="eyebrow">Assessment Complete</p>
    <h2>Your Employee Benefits Advantage Score™ is ready.</h2>
    <div class="score">${score}/100</div>
    <p>
      Enter your information below and we'll send your assessment results and your complimentary
      dining certificate details.
    </p>

    <div class="form-grid">
      <input id="name" placeholder="Your Name" />
      <input id="business" placeholder="Business Name" />
      <input id="email" placeholder="Email Address" />
      <input id="phone" placeholder="Mobile Phone" />
      <button class="primary-btn" onclick="finishAssessment()">Send My Results</button>
    </div>
  `;
}

function finishAssessment() {
  const name = document.getElementById("name").value.trim();
  const business = document.getElementById("business").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !business || !email || !phone) {
    alert("Please complete all fields.");
    return;
  }

  screen.innerHTML = `
    <p class="eyebrow">Thank You, ${name}</p>
    <h2>Your results have been recorded.</h2>
    <p>
      Your dining certificate details will be sent to the email address provided.
      Based on your answers, your business may be a strong fit for an affordable employee healthcare benefit option.
    </p>

    <a class="primary-btn" href="https://b.12stoneboost.com/widget/booking/b34LtANWuxqJtjdPlRdA">
      Schedule My Free 15-Minute Review
    </a>

    <p class="note">
      Replace this button link with your calendar link.
    </p>
  `;

  console.log("Lead Responses:", {
    name,
    business,
    email,
    phone,
    responses
  });
}