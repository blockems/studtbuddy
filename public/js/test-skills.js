// test-skills.js

document.getElementById('begin').addEventListener('click', startTest);

async function startTest() {
  // Extract role_ID and importance from the URL
  const pathParts = window.location.pathname.split('/');
  const roleId = pathParts[pathParts.length - 2];
  const importance = pathParts[pathParts.length - 1];

  const URL = `/skillhierarchy/questions/${roleId}/${importance}`
  const response = await fetch(URL);
  const questions = await response.json();

  let correctAnswers = 0;
  let explanations = [];
  let skillCorrectAnswers = {};

  for (const question of questions) {
    const userAnswer = await showModal(question);
    if (userAnswer === question.correct_answer) {
      correctAnswers++;

      // Update the skillCorrectAnswers object
      if (skillCorrectAnswers[question.skill_id]) {
        skillCorrectAnswers[question.skill_id]++;
      } else {
        skillCorrectAnswers[question.skill_id] = 1;
      }
    } else {
      explanations.push({
        questionText: question.questions,
        options: question.options,
        userAnswer: userAnswer,
        correctAnswer: question.correct_answer,
        explanation: question.explanation
      });
    }    
  }

  displayResults(correctAnswers, explanations);
  await sendResults(correctAnswers, explanations);
}

function showModal(question) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.display = 'block'; // Make the modal visible

      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modal.appendChild(modalContent);

      const closeButton = document.createElement('span'); // Add a close button
      closeButton.className = 'close';
      closeButton.innerHTML = '&times;';
      closeButton.onclick = () => {
        modal.remove();
      };
      modalContent.appendChild(closeButton);

      const questionText = document.createElement('h2');
      questionText.innerText = question.questions;
      modalContent.appendChild(questionText);

      const optionsList = document.createElement('ul');
      optionsList.className = 'options-list';
      modalContent.appendChild(optionsList);

      const optionsArray = JSON.parse(question.options);
      optionsArray.forEach((option) => {
        const optionItem = document.createElement('li');
        const optionButton = document.createElement('button');
        optionButton.innerText = option;
        optionButton.onclick = () => {
          modal.remove();
          resolve(option); // Resolve the selected option text
        };
        optionItem.appendChild(optionButton);
        optionsList.appendChild(optionItem);
      });

      document.body.appendChild(modal);
    });
}

function displayResults(correctAnswers, explanations) {
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results';

  const resultsHeader = document.createElement('h2');
  resultsHeader.innerText = `You answered ${correctAnswers} out of ${explanations.length + correctAnswers} questions correctly.`;
  resultsContainer.appendChild(resultsHeader);

  const wrongAnswersHeader = document.createElement('h3');
  wrongAnswersHeader.innerText = 'Incorrect Answers:';
  resultsContainer.appendChild(wrongAnswersHeader);

  const explanationsList = document.createElement('ul');
  resultsContainer.appendChild(explanationsList);

  const explanationsTable = document.createElement('table');
  resultsContainer.appendChild(explanationsTable);

  const tableHeader = document.createElement('thead');
  explanationsTable.appendChild(tableHeader);

  const headerRow = document.createElement('tr');
  tableHeader.appendChild(headerRow);

  const headers = ['Question', 'Options', 'Your Answer', 'Correct Answer', 'Explanation'];
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.innerText = header;
    headerRow.appendChild(th);
  });

  const tableBody = document.createElement('tbody');
  explanationsTable.appendChild(tableBody);

  explanations.forEach(({ questionText, options, userAnswer, correctAnswer, explanation }) => {
    const explanationRow = document.createElement('tr');
    tableBody.appendChild(explanationRow);

    const questionCell = document.createElement('td');
    questionCell.innerText = questionText;
    explanationRow.appendChild(questionCell);

    const optionsCell = document.createElement('td');
    optionsCell.innerHTML = JSON.parse(options).join('<br>');
    explanationRow.appendChild(optionsCell);

    const userAnswerCell = document.createElement('td');
    userAnswerCell.innerText = userAnswer;
    explanationRow.appendChild(userAnswerCell);

    const correctAnswerCell = document.createElement('td');
    correctAnswerCell.innerText = correctAnswer;
    explanationRow.appendChild(correctAnswerCell);

    const explanationCell = document.createElement('td');
    explanationCell.innerText = explanation;
    explanationRow.appendChild(explanationCell);
  });
  document.querySelector('.container').appendChild(resultsContainer);
}

async function sendResults(correctAnswers, explanations) {
  const URL = '/skillhierarchy/submit-results';
  const data = {
    correctAnswers,
    explanations,
  };

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    console.log('Results and explanations submitted successfully');
  } else {
    console.error('Error submitting results and explanations');
  }
}
  