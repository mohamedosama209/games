const KEY = 'web-dev-quiz-v1';
const TIME = 15;
const NAMES = { html: 'HTML', css: 'CSS', js: 'JavaScript' };
const $ = (id) => document.getElementById(id);

// [question, options, index of correct option, explanation]
const QUESTIONS = {
  html: [
    ['Which element holds everything that is visible on the page?', ['<head>', '<body>', '<meta>', '<title>'], 1, 'The <body> holds the visible content. The <head> holds information about the page.'],
    ['Which attribute gives an image a text description for screen readers?', ['src', 'alt', 'title', 'href'], 1, 'alt describes the image for screen readers and is shown if the image fails to load.'],
    ['Which tag creates the largest heading?', ['<h6>', '<head>', '<h1>', '<heading>'], 2, '<h1> is the top-level heading and <h6> is the smallest.'],
    ['Which element is best for a group of navigation links?', ['<div>', '<nav>', '<section>', '<aside>'], 1, '<nav> is a semantic element that tells browsers and assistive tools this is navigation.'],
    ['Which input type shows a date picker?', ['text', 'calendar', 'date', 'picker'], 2, '<input type="date"> gives you a built-in date picker.'],
    ['What does <!DOCTYPE html> do?', ['Adds a comment to the page', 'Tells the browser to use standards mode (HTML5)', 'Links the CSS file', 'Creates the head section'], 1, 'It tells the browser to render the page in standards mode instead of quirks mode.'],
    ['Which attribute opens a link in a new tab?', ['rel="new"', 'target="_blank"', 'open="tab"', 'href="_new"'], 1, 'target="_blank" opens the link in a new tab. Add rel="noopener" for safety.'],
    ['Which element should you use for an action, like "Save"?', ['<a>', '<button>', '<span>', '<div>'], 1, 'Use <button> for actions and <a> for navigation. Buttons also work with the keyboard by default.'],
  ],
  css: [
    ['Which property changes the color of text?', ['font-color', 'text-color', 'color', 'fill'], 2, 'color sets the text color. background-color sets the background.'],
    ['How do you turn an element into a flex container?', ['display: flex', 'flex: container', 'position: flex', 'layout: flex'], 0, 'display: flex makes the element a flex container and its children flex items.'],
    ['What is the box model order, from the inside out?', ['content, padding, border, margin', 'content, border, padding, margin', 'margin, border, padding, content', 'padding, content, border, margin'], 0, 'Content is in the middle, then padding, then border, then margin on the outside.'],
    ['What does box-sizing: border-box do?', ['Adds a border to the element', 'Includes padding and border in the width and height', 'Removes the margin', 'Makes the element a square'], 1, 'With border-box, width and height include padding and border, which makes layouts easier to predict.'],
    ['Which selector targets elements with the class "card"?', ['#card', '.card', 'card', '*card'], 1, 'A dot selects classes, # selects ids, and a bare name selects elements.'],
    ['Which unit is relative to the width of the viewport?', ['px', 'rem', 'vw', 'cm'], 2, '1vw equals 1% of the viewport width.'],
    ['Which property controls which positioned element appears on top?', ['order', 'z-index', 'layer', 'stack'], 1, 'z-index sets the stacking order. It works on positioned elements and flex or grid items.'],
    ['Which rule applies styles only on screens up to 600px wide?', ['@media (min-width: 600px)', '@screen (600px)', '@media (max-width: 600px)', '@responsive (600px)'], 2, 'max-width: 600px matches screens 600px wide or smaller.'],
  ],
  js: [
    ['Which keyword declares a variable that cannot be reassigned?', ['var', 'let', 'const', 'static'], 2, 'const prevents reassignment. The contents of an object or array can still change.'],
    ['What does typeof null return?', ['"null"', '"undefined"', '"object"', '"number"'], 2, 'This is a well-known quirk in JavaScript. typeof null returns "object".'],
    ['What does === check?', ['Value only', 'Value and type', 'Type only', 'Memory address only'], 1, '=== compares value and type with no conversion, so 5 === "5" is false.'],
    ['Which method adds an item to the end of an array?', ['push()', 'pop()', 'shift()', 'unshift()'], 0, 'push() adds to the end. unshift() adds to the start. pop() and shift() remove items.'],
    ['What does [1, 2, 3].map(n => n * 2) return?', ['[1, 2, 3]', '[2, 4, 6]', '12', 'undefined'], 1, 'map() returns a new array with the function applied to every item.'],
    ['Which call selects an element by its id?', ['document.getElementById("x")', 'document.getId("x")', 'document.selectById("x")', 'document.element("x")'], 0, 'getElementById returns the element, or null if there is none. querySelector("#x") also works.'],
    ['What does JSON.stringify() do?', ['Parses text into an object', 'Converts a value into a JSON string', 'Sorts an object', 'Sends data to a server'], 1, 'It turns a value into a JSON string. JSON.parse() does the opposite.'],
    ['What does await do inside an async function?', ['Stops the whole page', 'Waits for a promise to settle before continuing', 'Runs code twice', 'Creates a new thread'], 1, 'await pauses that function until the promise settles, while the rest of the page keeps running.'],
  ],
};

let cat, list, i, score, correctCount, missed, locked, current, endAt, timer;
let best = read();

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function write() {
  try { localStorage.setItem(KEY, JSON.stringify(best)); } catch {}
}
function shuffle(arr) {
  const a = [...arr];
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}
function show(id) {
  ['home', 'game', 'result'].forEach(s => { $(s).hidden = s !== id; });
}
function drawBest() {
  Object.keys(NAMES).forEach(c => {
    $('best-' + c).textContent = best[c] ? `Best: ${best[c].score} points` : 'Not played yet';
  });
}

function start(c) {
  cat = c;
  list = shuffle(QUESTIONS[c]);
  i = 0; score = 0; correctCount = 0; missed = [];
  document.body.dataset.cat = c;
  $('catName').textContent = NAMES[c];
  show('game');
  showQuestion();
}

function showQuestion() {
  locked = false;
  const q = list[i];
  current = shuffle(q[1].map((text, idx) => ({ text, ok: idx === q[2] })));
  $('qNum').textContent = `Question ${i + 1} of ${list.length}`;
  $('score').textContent = `${score} pts`;
  $('question').textContent = q[0];
  $('feedback').hidden = true;

  const box = $('options');
  box.replaceChildren();
  current.forEach((o, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opt';
    b.dataset.n = n;
    const key = document.createElement('kbd');
    key.textContent = n + 1;
    b.append(key, document.createTextNode(o.text));
    box.append(b);
  });

  clearInterval(timer);
  endAt = Date.now() + TIME * 1000;
  $('timerFill').style.width = '100%';
  timer = setInterval(() => {
    const left = Math.max(0, (endAt - Date.now()) / 1000);
    $('timerFill').style.width = (left / TIME * 100) + '%';
    if (left <= 0) answer(null);
  }, 100);
}

function answer(n) {
  if (locked) return;
  locked = true;
  clearInterval(timer);
  const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
  const q = list[i];
  const buttons = [...document.querySelectorAll('.opt')];
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (current[idx].ok) b.classList.add('right');
  });

  let text;
  if (n !== null && current[n].ok) {
    const pts = 100 + left * 5;
    score += pts;
    correctCount++;
    text = `Correct! +${pts} points. ${q[3]}`;
  } else {
    if (n !== null) buttons[n].classList.add('wrong');
    missed.push({ q: q[0], yours: n === null ? 'No answer' : current[n].text, right: q[1][q[2]], why: q[3] });
    text = `${n === null ? 'Time is up.' : 'Not quite.'} ${q[3]}`;
  }
  $('score').textContent = `${score} pts`;
  $('fbText').textContent = text;
  $('nextBtn').textContent = i === list.length - 1 ? 'See results' : 'Next question';
  $('feedback').hidden = false;
  $('nextBtn').focus();
}

function results() {
  show('result');
  $('resCat').textContent = NAMES[cat] + ' quiz';
  $('resScore').textContent = `${correctCount} / ${list.length}`;
  $('resPoints').textContent = `${score} points`;
  $('resMsg').textContent = correctCount >= 7 ? 'Excellent. You know your basics.'
    : correctCount >= 5 ? 'Good job. Review the questions you missed below.'
    : 'Keep practicing, then try again.';

  const isBest = !best[cat] || score > best[cat].score;
  if (isBest) { best[cat] = { score }; write(); }
  $('resBest').textContent = isBest ? 'New best score!' : `Your best: ${best[cat].score} points`;

  const box = $('missed');
  box.replaceChildren();
  missed.forEach(m => {
    const d = document.createElement('div');
    d.className = 'miss';
    [['q', m.q], ['no', 'Your answer: ' + m.yours], ['yes', 'Correct answer: ' + m.right], ['', m.why]].forEach(([cls, t]) => {
      const p = document.createElement('p');
      if (cls) p.className = cls;
      p.textContent = t;
      d.append(p);
    });
    box.append(d);
  });
  drawBest();
}

document.querySelectorAll('.cat').forEach(b => b.addEventListener('click', () => start(b.dataset.cat)));
$('options').addEventListener('click', (e) => {
  const b = e.target.closest('.opt');
  if (b) answer(Number(b.dataset.n));
});
$('nextBtn').addEventListener('click', () => {
  if (i === list.length - 1) results();
  else { i++; showQuestion(); }
});
$('againBtn').addEventListener('click', () => start(cat));
$('homeBtn').addEventListener('click', () => { delete document.body.dataset.cat; show('home'); });
document.addEventListener('keydown', (e) => {
  if (!$('game').hidden && !locked && /^[1-4]$/.test(e.key)) answer(Number(e.key) - 1);
});

drawBest();
