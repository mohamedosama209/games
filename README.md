# Web Dev Quiz

A fast quiz to test your HTML, CSS and JavaScript basics. Pick a topic, answer eight questions against a 15-second timer, and learn from an explanation after every answer. Faster answers earn more points, and your best score for each topic is saved in your browser.

**Live demo:** _add your link here_

## Why I built it
Quizzes are a good way to find gaps in what you know. I wanted one made for web developers where every question teaches something, even when you get it wrong.

## Features
- Three topics: HTML, CSS and JavaScript (8 questions each)
- Questions and answer options are shuffled every time
- 15-second timer per question, with a progress bar
- Points depend on speed (100 points plus a time bonus)
- Instant feedback with a short explanation
- Results screen that reviews every question you missed
- Best score per topic saved in `localStorage`
- Keyboard support: press 1 to 4 to answer, Enter for the next question
- Each topic has its own color, and the layout works on phones

## Built with
HTML, CSS (custom properties, grid, flexbox) and vanilla JavaScript. No frameworks or libraries.

## What I practiced
- Modeling data as arrays and rendering the UI from it
- The Fisher-Yates shuffle algorithm
- Managing app state across three screens (home, quiz, results)
- Timers with `setInterval`, and clearing them to avoid bugs
- Building DOM safely with `textContent`
- Keyboard accessibility and focus management

## Adding your own questions
Open `script.js` and add an item to a topic in `QUESTIONS`:
`[question, [option1, option2, option3, option4], indexOfCorrectOption, explanation]`

## Run it locally
Download the folder and open `index.html` in your browser.
