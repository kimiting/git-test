const namesInput = document.getElementById('names');
const teamSizeInput = document.getElementById('teamSize');
const shuffleBtn = document.getElementById('shuffleBtn');
const copyBtn = document.getElementById('copyBtn');
const resultEl = document.getElementById('result');
const copyStatusEl = document.getElementById('copyStatus');

let latestTextResult = '';

function shuffleArray(items) {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function buildTeams(names, teamSize) {
  const cleanNames = names
    .split(/\n|\r\n/)
    .map((name) => name.trim())
    .filter((name) => name !== '');

  if (cleanNames.length === 0) {
    return [];
  }

  const shuffled = shuffleArray(cleanNames);
  const teams = [];

  for (let i = 0; i < shuffled.length; i += teamSize) {
    teams.push(shuffled.slice(i, i + teamSize));
  }

  return teams;
}

function getTeamsText(teams) {
  return teams
    .map((team, index) => `チーム ${index + 1}\n${team.join('\n')}`)
    .join('\n\n');
}

function renderTeams(teams) {
  if (teams.length === 0) {
    latestTextResult = '';
    resultEl.innerHTML = '<p class="empty">名前を入力してください。</p>';
    copyStatusEl.textContent = '';
    return;
  }

  latestTextResult = getTeamsText(teams);

  const html = `
    <div class="teams">
      ${teams
        .map(
          (team, index) => `
            <div class="team">
              <h3>チーム ${index + 1}</h3>
              <ul>
                ${team.map((name) => `<li>${name}</li>`).join('')}
              </ul>
            </div>
          `
        )
        .join('')}
    </div>
  `;

  resultEl.innerHTML = html;
  copyStatusEl.textContent = '';
}

async function copyResult() {
  if (!latestTextResult) {
    copyStatusEl.textContent = 'まず結果を作成してください';
    return;
  }

  try {
    await navigator.clipboard.writeText(latestTextResult);
    copyStatusEl.textContent = 'コピーしました';
  } catch (error) {
    const temp = document.createElement('textarea');
    temp.value = latestTextResult;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    copyStatusEl.textContent = 'コピーしました';
  }
}

shuffleBtn.addEventListener('click', () => {
  const teamSize = Number(teamSizeInput.value);

  if (!teamSize || teamSize < 1) {
    latestTextResult = '';
    resultEl.innerHTML = '<p class="empty">1チームの人数は1以上で入力してください。</p>';
    copyStatusEl.textContent = '';
    return;
  }

  const teams = buildTeams(namesInput.value, teamSize);
  renderTeams(teams);
});

copyBtn.addEventListener('click', copyResult);
