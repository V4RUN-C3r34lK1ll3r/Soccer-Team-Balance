let userRole = localStorage.getItem("renegadesUserRoleV1") || "WINGER";

function currentFormationRoles() {
  const base = [
    { id: "GK", label: "GOALKEEPER" },
    { id: "LB", label: "LB" },
    { id: "RB", label: "RB" }
  ];
  return userRole === "CDM"
    ? [...base, { id: "MW", label: "MID / WING 1" }, { id: "MW", label: "MID / WING 2" }]
    : [...base, { id: "CDM", label: "CDM" }, { id: "MW", label: "MID / WING" }];
}

const anchorPlans = {
  "Pradnyal Gandhi": { target: "48-56", cap: 70 },
  "Vishnu Mohan": { target: "42-48", cap: 62 },
  "Chirag": { target: "46-52", cap: 65 }
};

const goalkeeperPlans = {
  "Vignesh": { target: "20-24", cap: 28, note: "Best dedicated keeper profile." },
  "Ashu": { target: "16-20", cap: 24, note: "Best utility option; preserve him for multiple roles when possible." },
  "Ketan Shilimkar": { target: "10-14", cap: 18, note: "Recognized keeper option at a controlled price." },
  "Preetesh Duvvuri": { target: "5-8", cap: 12, note: "Lowest-cost dedicated fallback." }
};

const mockOpponentMarket = {
  "Ayush": ["Nasiq", 6], "Dhananjay": ["Nasiq", 26],
  "Shailesh": ["Nasiq", 8], "Kaushik Apte": ["Nasiq", 30],
  "Chirag": ["Nasiq", 60], "Kartik": ["Nasiq", 52],
  "Vivek": ["Nasiq", 2], "Kishor Ghadge": ["Nasiq", 2],
  "Prajna": ["Amrit", 14], "Dhruv": ["Amrit", 44],
  "Taranjot Singh Dang": ["Amrit", 12], "Pradnyal Gandhi": ["Amrit", 78],
  "Minti": ["Amrit", 20], "Ketan Shilimkar": ["Amrit", 18],
  "Jitendra": ["Amrit", 2], "Preetesh Duvvuri": ["Bhagyesh", 6],
  "Vija": ["Bhagyesh", 26], "Rishabh Devgon": ["Bhagyesh", 42],
  "Sagar SJ": ["Bhagyesh", 28], "Sandeep Naik": ["Bhagyesh", 6],
  "Bilal Yaser": ["Bhagyesh", 20], "Vignesh": ["Bhagyesh", 22],
  "Rajeev Singh": ["Bhagyesh", 2]
};

const mockSaleByPlayer = {
  ...Object.fromEntries(Object.entries(mockOpponentMarket).map(([name, value]) => [name, value[1]])),
  "Sangram Ghewade": 10, "Rohith": 10, "Vamshi": 26,
  "Ketan Gaikwad": 6, "Ashu": 10, "Sagar": 18,
  "Vishnu Mohan": 52, "Dheeraj R Vatti": 36, "Nuhu Okikiri": 32
};

const fixedRiskCaps = {
  "Pradnyal Gandhi": 60, "Chirag": 55, "Vishnu Mohan": 52,
  "Dhruv": 46, "Rishabh Devgon": 44, "Dheeraj R Vatti": 38,
  "Vignesh": 28, "Dhananjay": 30, "Vamshi": 29,
  "Nuhu Okikiri": 32, "Prajna": 26, "Ashu": 24,
  "Sagar SJ": 30, "Sagar": 24, "Taranjot Singh Dang": 22,
  "Minti": 22, "Sangram Ghewade": 20, "Kartik": 28,
  "Shailesh": 18, "Rohith": 18, "Ketan Shilimkar": 18,
  "Ayush": 16, "Kaushik Apte": 15, "Ketan Gaikwad": 14,
  "Sandeep Naik": 14, "Rajeev Singh": 12, "Preetesh Duvvuri": 12,
  "Vija": 20, "Ajinkya P": 14, "Bilal Yaser": 16,
  "Vivek": 9, "Jitendra": 9, "Kishor Ghadge": 8
};

const roleWeights = {
  GK: { Defense: .35, Physicality: .25, Mental: .20, Passing: .12, Dribbling: .08 },
  LB: { Defense: .40, Mental: .22, Stamina: .20, Passing: .13, Dribbling: .05 },
  RB: { Defense: .40, Mental: .22, Stamina: .20, Passing: .13, Dribbling: .05 },
  CDM: { Passing: .30, Defense: .28, Mental: .25, Stamina: .12, Dribbling: .05 },
  MW: { Passing: .25, Mental: .20, Stamina: .15, Dribbling: .22, Shooting: .13, Defense: .05 }
};

let unavailablePlayers = JSON.parse(localStorage.getItem("renegadesUnavailableV1") || "[]");
let jsonPlayerSet = new Set();
const opponentTeams = ["Nasiq", "Amrit", "Bhagyesh"];
let opponentPicks = JSON.parse(localStorage.getItem("renegadesOpponentPicksV1") || "null") || {
  Nasiq: [], Amrit: [], Bhagyesh: []
};
opponentTeams.forEach(team => { if (!Array.isArray(opponentPicks[team])) opponentPicks[team] = []; });

function roleScore(name, role) {
  const player = ratings[name];
  if (!player) return 0;
  const values = { ...player, Stamina: player.Physicality || 0 };
  return Object.entries(roleWeights[role]).reduce((sum, [field, weight]) => sum + (values[field] || 0) * weight, 0);
}

function auctionPlayerNames() {
  const selectNames = [...new Set([...slots[0].querySelectorAll("option")].map(option => option.value).filter(Boolean))];
  return jsonPlayerSet.size ? selectNames.filter(name => jsonPlayerSet.has(name)) : selectNames;
}

function chosenPlayers() {
  return [...new Set(slots.map(slot => slot.querySelector("select").value).filter(Boolean))];
}

function opponentPickedNames() {
  return new Set(opponentTeams.flatMap(team => opponentPicks[team].map(pick => pick.name)));
}

function contestedLabel(name) {
  const market = mockOpponentMarket[name];
  return market ? ` · mock ${market[0]} ${market[1]}` : "";
}

function rankedOptions(role, excluded) {
  const pool = role === "GK" ? Object.keys(goalkeeperPlans) : auctionPlayerNames();
  const opponentNames = opponentPickedNames();
  const pradnyalOwned = chosenPlayers().includes("Pradnyal Gandhi");
  return pool
    .filter(name => ratings[name] && !excluded.has(name) && !unavailablePlayers.includes(name) && !opponentNames.has(name))
    .filter(name => !(pradnyalOwned && ["Chirag", "Vishnu Mohan"].includes(name) && ["LB", "RB", "CDM"].includes(role)))
    .map(name => ({ name, score: roleScore(name, role) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function bestFormation(players) {
  const formationRoles = currentFormationRoles();
  let best = { score: -1, assignments: [] };
  function search(roleIndex, used, score, assignments) {
    if (roleIndex === formationRoles.length) {
      if (score > best.score) best = { score, assignments: [...assignments] };
      return;
    }
    const role = formationRoles[roleIndex];
    search(roleIndex + 1, used, score, [...assignments, null]);
    players.forEach(name => {
      if (used.has(name)) return;
      const nextUsed = new Set(used);
      nextUsed.add(name);
      search(roleIndex + 1, nextUsed, score + roleScore(name, role.id), [...assignments, name]);
    });
  }
  search(0, new Set(), 0, []);
  return best.assignments;
}

function renderFormationNeeds() {
  const formationRoles = currentFormationRoles();
  const selected = chosenPlayers();
  const selectedSet = new Set(selected);
  const assignments = bestFormation(selected);
  const cards = formationRoles.map((role, index) => {
    const starter = assignments[index];
    const options = rankedOptions(role.id, selectedSet).slice(0, 3);
    const fallbacks = options.length
      ? options.map(option => `${option.name} ${Math.round(option.score)}${contestedLabel(option.name)}`).join("<br>")
      : "No available fallback";
    return `<div class="coverage-slot ${starter ? "filled" : "missing"}">
      <div class="role">${role.label}</div>
      <div class="starter">${starter || "NEEDS PICK"}</div>
      ${starter ? `<div class="small">Fit ${Math.round(roleScore(starter, role.id))} · Conditioning ${ratings[starter].Physicality}</div>` : ""}
      <div class="fallbacks"><b>${starter ? "Next options" : "Best options"}</b><br>${fallbacks}</div>
    </div>`;
  }).join("");
  document.querySelector("#formationCoverage").innerHTML = cards;

  const missing = assignments.filter(name => !name).length;
  const weak = assignments.reduce((count, name, index) => count + (name && roleScore(name, formationRoles[index].id) < 62 ? 1 : 0), 0);
  const summary = document.querySelector("#coverageSummary");
  if (missing) {
    summary.className = "need-alert";
    summary.innerHTML = `<b>${missing} starting slot${missing === 1 ? "" : "s"} still need picks.</b> You cover ${userRole === "CDM" ? "CDM" : "one MID/WINGER role"}. After filling the five slots above, add four rotation players.`;
  } else {
    summary.className = weak ? "need-alert" : "need-good";
    summary.innerHTML = weak
      ? `<b>Starting shape is filled, but ${weak} slot${weak === 1 ? "" : "s"} score below 62.</b> Look for an upgrade before buying depth.`
      : `<b>All five supporting starter slots are covered.</b> You cover ${userRole === "CDM" ? "CDM" : "one MID/WINGER role"}; use the remaining purchases for rotation and availability cover.`;
  }
  renderGoalkeeperAdvice();
  renderAnchorStrategy();
}

function setUserRole(role, button) {
  userRole = role;
  localStorage.setItem("renegadesUserRoleV1", role);
  document.querySelectorAll("#userRoleTabs button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  document.querySelector("#userRoleExplanation").textContent = role === "CDM"
    ? "You cover CDM; the auction must supply two MID/WINGER starters."
    : "You cover one MID/WINGER role; the auction must supply the CDM starter.";
  renderFormationNeeds();
}

function renderAnchorStrategy() {
  const target = document.querySelector("#anchorStrategy");
  if (!target) return;
  const owned = new Set(chosenPlayers());
  const gone = new Set([...unavailablePlayers, ...opponentPickedNames()]);
  const { left, open } = budgetState();
  const safeCap = Math.max(0, left - Math.max(0, open - 1));
  if (owned.has("Pradnyal Gandhi")) {
    target.className = "need-good";
    target.innerHTML = `<b>Pradnyal secured: defensive anchor solved.</b> Chirag and Vishnu are now optional rather than required. Use the remaining ${left} points on goalkeeper, width, and depth; the fallback board removes Chirag/Vishnu from defensive recommendations.`;
    return;
  }
  if (owned.has("Chirag") || owned.has("Vishnu Mohan")) {
    const anchor = owned.has("Chirag") ? "Chirag" : "Vishnu Mohan";
    target.className = "need-good";
    target.innerHTML = `<b>${anchor} secured: anchor contingency covered.</b> Pradnyal is now a luxury. Do not create a second premium bidding war unless the price stays well below ${anchorPlans["Pradnyal Gandhi"].target}.`;
    return;
  }
  if (gone.has("Pradnyal Gandhi")) {
    const fallbacks = ["Vishnu Mohan", "Chirag"].filter(name => !gone.has(name));
    target.className = "need-alert";
    if (!fallbacks.length) {
      target.innerHTML = `<b>Pradnyal, Vishnu, and Chirag are all gone.</b> Stop saving premium-anchor money and build a two-player defensive pairing from the live LB/RB/CDM alternatives.`;
      return;
    }
    const reserve = Math.min(Math.max(anchorPlans["Vishnu Mohan"].cap, anchorPlans.Chirag.cap), safeCap);
    target.innerHTML = `<b>Pradnyal missed: preserve up to ${reserve} points for ${fallbacks.join(" or ")}.</b> Current remaining budget is ${left}. Do not spend the anchor reserve on rotation picks first.`;
    return;
  }
  const pradnyalCap = Math.min(anchorPlans["Pradnyal Gandhi"].cap, safeCap);
  target.className = "need-good";
  target.innerHTML = `<b>Plan A: Pradnyal, target ${anchorPlans["Pradnyal Gandhi"].target}, hard max now ${pradnyalCap}.</b> The S-tier ceiling includes a 10-point bidding-war buffer. If he is lost, immediately protect up to 65 for Vishnu or Chirag.`;
}

let goalkeeperView = "best";

function budgetState() {
  let spent = 0;
  let filled = 0;
  slots.forEach(slot => {
    const name = slot.querySelector("select").value;
    const price = slot.querySelector("input").value;
    if (name && price !== "") {
      spent += Number(price);
      filled += 1;
    }
  });
  return { left: 200 - spent, open: 9 - filled };
}

function baseRiskCap(name) {
  if (fixedRiskCaps[name]) return fixedRiskCaps[name] + (tierForPlayer(name) === "S" ? 10 : 0);
  const player = ratings[name];
  if (!player) return 0;
  const best = Math.max(...["LB", "RB", "CDM", "MW"].map(role => roleScore(name, role)));
  return Math.max(8, Math.min(45, Math.round(best * .55)));
}

function maxRiskStatus(name) {
  const owned = new Set(chosenPlayers());
  if (owned.has(name)) return "OWNED";
  const gone = new Set([...unavailablePlayers, ...opponentPickedNames()]);
  if (gone.has(name)) return "SOLD";
  const { left, open } = budgetState();
  const anchorsOwned = ["Pradnyal Gandhi", "Chirag", "Vishnu Mohan"].some(player => owned.has(player));
  let reserve = 0;
  if (!anchorsOwned) {
    if (!gone.has("Pradnyal Gandhi") && name !== "Pradnyal Gandhi") reserve = anchorPlans["Pradnyal Gandhi"].cap;
    else if (gone.has("Pradnyal Gandhi") && name !== "Chirag" && name !== "Vishnu Mohan" && (!gone.has("Chirag") || !gone.has("Vishnu Mohan"))) reserve = Math.max(anchorPlans["Vishnu Mohan"].cap, anchorPlans.Chirag.cap);
  }
  const liveRoom = Math.max(0, left - Math.max(0, open - 1) - reserve);
  return Math.min(baseRiskCap(name), liveRoom);
}

function attachPlayerCardClick(card) {
  const flipCard = () => {
    card.classList.toggle("flipped");
    const name = card.dataset.playerName;
    const player = ratings[name];
    document.querySelector("#ratings").textContent = player
      ? `${name} · Control ${player.Dribbling} · Passing ${player.Passing} · Mental ${player.Mental} · Defense ${player.Defense} · Shooting ${player.Shooting} · Physicality ${player.Physicality} · Pace ${player.Pace}`
      : `${name} is not present in auctions.json.`;
  };
  card.onclick = flipCard;
  card.onkeydown = event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    flipCard();
  };
}

function cleanPlayerCard(card) {
  if (card.dataset.playerName) {
    attachPlayerCardClick(card);
    return;
  }
  const heading = card.querySelector("h3");
  if (!heading) return;
  const name = heading.textContent.trim();
  const role = card.querySelector("small")?.textContent.trim() || "FLEX";
  const badge = card.querySelector("div")?.outerHTML || "";
  const mock = mockSaleByPlayer[name];
  const premium = card.dataset.tier === "S" ? `<div class="premium-buffer">+10 BIDDING-WAR BUFFER</div>` : "";
  card.dataset.playerName = name;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${name}: flip card for auction values`);
  card.innerHTML = `<div class="card-inner"><div class="card-face card-front">${badge}<h3>${name}</h3><div class="player-role">${role}</div><div class="flip-hint">Tap to reveal auction values</div></div><div class="card-face card-back"><div class="mock-corner">MOCK SALE<strong>${mock ?? "-"}</strong></div><h3>${name}</h3>${premium}<div class="risk-block"><span>BEST PRICE · MAX NOW</span><strong data-risk-player="${name}">-</strong></div><div class="card-metrics" data-metrics-player="${name}">Loading auctions.json...</div><div class="flip-hint">Tap to return</div></div></div>`;
  attachPlayerCardClick(card);
}

function cleanPlayerCards() {
  document.querySelectorAll(".card").forEach(cleanPlayerCard);
}

function syncAuctionSelects(players) {
  const names = players.map(player => player.Name).sort((a, b) => a.localeCompare(b));
  slots.forEach((slot, index) => {
    const select = slot.querySelector("select");
    const saved = state[index]?.name || "";
    const current = select.value || saved;
    const previous = current === "Rishab" ? "Rishabh Devgon" : current;
    select.innerHTML = `<option value="">Choose player</option>${names.map(name => `<option value="${name}">${name}</option>`).join("")}`;
    if (names.includes(previous)) select.value = previous;
  });
}

function inferredRole(name) {
  if (Object.hasOwn(goalkeeperPlans, name)) return "GK / UTILITY";
  const labels = { LB: "LB / DEF", RB: "RB / DEF", CDM: "CDM", MW: "MID / WING" };
  const best = ["LB", "RB", "CDM", "MW"]
    .map(role => ({ role, score: roleScore(name, role) }))
    .sort((a, b) => b.score - a.score)[0];
  return labels[best.role];
}

function tierForPlayer(name) {
  if (["Pradnyal Gandhi", "Chirag", "Vishnu Mohan", "Dhruv", "Rishabh Devgon"].includes(name)) return "S";
  if (["Vignesh", "Dheeraj R Vatti", "Dhananjay", "Prajna", "Vamshi", "Ashu"].includes(name)) return "A";
  if (["Sagar", "Shailesh", "Nuhu Okikiri", "Taranjot Singh Dang", "Sagar SJ", "Ayush", "Sangram Ghewade", "Minti", "Bilal Yaser"].includes(name)) return "B";
  return "C";
}

function ensureJsonPlayerCards(players) {
  const section = [...document.querySelectorAll("section")]
    .find(item => item.querySelector("h2")?.textContent.includes("Color-coded tier board"));
  const grid = section?.querySelector(".grid");
  if (!grid) return;
  const existing = new Set([...grid.querySelectorAll(".card[data-player-name]")].map(card => card.dataset.playerName));
  const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
  [...players].sort((a, b) => tierOrder[tierForPlayer(a.Name)] - tierOrder[tierForPlayer(b.Name)] || a.Name.localeCompare(b.Name)).forEach(player => {
    if (existing.has(player.Name)) return;
    const tier = tierForPlayer(player.Name);
    const tierLabel = { S: "S PREMIUM", A: "A STARTER", B: "B VALUE", C: "C ROTATION" }[tier];
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.tier = tier;
    const darkHorse = ["Ashu", "Vishnu Mohan"].includes(player.Name) ? ` <span class="horse">DARK HORSE</span>` : "";
    card.innerHTML = `<div><span class="badge ${tier}">${tierLabel}</span>${darkHorse}</div><h3>${player.Name}</h3><small>${inferredRole(player.Name)}</small>`;
    grid.appendChild(card);
    cleanPlayerCard(card);
  });
}

function updatePlayerRiskCards() {
  document.querySelectorAll(".card[data-player-name]").forEach(card => {
    const name = card.dataset.playerName;
    if (jsonPlayerSet.size && !jsonPlayerSet.has(name)) {
      card.style.display = "none";
      return;
    }
    const risk = maxRiskStatus(name);
    const riskNode = card.querySelector("[data-risk-player]");
    riskNode.textContent = risk;
    riskNode.classList.toggle("sold", risk === "SOLD");
    const player = ratings[name];
    if (player) {
      const bestFit = Math.round(Math.max(...["LB", "RB", "CDM", "MW"].map(role => roleScore(name, role))));
      card.querySelector("[data-metrics-player]").innerHTML = `<span>FIT <b>${bestFit}</b></span><span>PASS <b>${player.Passing}</b></span><span>CTRL <b>${player.Dribbling}</b></span><span>SHOT <b>${player.Shooting}</b></span><span>DEF <b>${player.Defense}</b></span><span>MENT <b>${player.Mental}</b></span>`;
    }
  });
}

function setGoalkeeperView(view, button) {
  goalkeeperView = view;
  document.querySelectorAll("#goalkeeperTabs button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  renderGoalkeeperAdvice();
}

function renderGoalkeeperAdvice() {
  const target = document.querySelector("#goalkeeperAdvice");
  if (!target) return;
  const selected = new Set(chosenPlayers());
  const { left, open } = budgetState();
  let candidates = Object.entries(goalkeeperPlans)
    .filter(([name]) => !unavailablePlayers.includes(name))
    .map(([name, plan]) => {
      const score = roleScore(name, "GK");
      const affordableCap = Math.max(0, left - Math.max(0, open - 1));
      return { name, ...plan, score, liveCap: selected.has(name) ? "OWNED" : Math.min(plan.cap, affordableCap) };
    });
  if (goalkeeperView === "value") {
    candidates.sort((a, b) => (b.score / b.cap) - (a.score / a.cap));
  } else if (goalkeeperView === "utility") {
    candidates.sort((a, b) => (a.name === "Ashu" ? -1 : b.score - a.score));
  } else {
    candidates.sort((a, b) => b.score - a.score);
  }
  target.innerHTML = candidates.map((candidate, index) => `<div class="goalie-row">
    <span><b>${index + 1}. ${candidate.name}</b><br><small>${candidate.note}</small></span>
    <span>Fit <b>${Math.round(candidate.score)}</b><br><small>Target ${candidate.target}</small></span>
    <span>Max now<br><strong>${candidate.liveCap}</strong></span>
  </div>`).join("") || `<div class="warning">All four goalkeeper options are marked unavailable.</div>`;
}

function refreshUnavailableSelect() {
  const select = document.querySelector("#missedPlayer");
  const selected = new Set(chosenPlayers());
  const opponentNames = opponentPickedNames();
  const current = select.value;
  const choices = auctionPlayerNames().filter(name => !selected.has(name) && !unavailablePlayers.includes(name) && !opponentNames.has(name));
  select.innerHTML = `<option value="">Choose missed / sold player</option>${choices.map(name => `<option value="${name}">${name}${contestedLabel(name)}</option>`).join("")}`;
  if (choices.includes(current)) select.value = current;
}

function renderUnavailable() {
  document.querySelector("#unavailableList").innerHTML = unavailablePlayers.length
    ? unavailablePlayers.map(name => `<span class="sold-chip">${name}</span>`).join("")
    : `<span class="small">No players marked unavailable.</span>`;
}

function markMissed() {
  const select = document.querySelector("#missedPlayer");
  if (!select.value) return;
  unavailablePlayers.push(select.value);
  unavailablePlayers = [...new Set(unavailablePlayers)];
  localStorage.setItem("renegadesUnavailableV1", JSON.stringify(unavailablePlayers));
  updateLiveBoard();
}

function undoMissed() {
  unavailablePlayers.pop();
  localStorage.setItem("renegadesUnavailableV1", JSON.stringify(unavailablePlayers));
  updateLiveBoard();
}

function clearMissed() {
  unavailablePlayers = [];
  localStorage.removeItem("renegadesUnavailableV1");
  updateLiveBoard();
}

function saveOpponentPicks() {
  localStorage.setItem("renegadesOpponentPicksV1", JSON.stringify(opponentPicks));
}

function trackerId(team) {
  return team.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function renderOpponentTracker() {
  const target = document.querySelector("#opponentTrackers");
  if (!target) return;
  const ourPlayers = new Set(chosenPlayers());
  const allOpponentNames = opponentPickedNames();
  target.innerHTML = opponentTeams.map(team => {
    const id = trackerId(team);
    const picks = opponentPicks[team];
    const spent = picks.reduce((sum, pick) => sum + Number(pick.price || 0), 0);
    const available = auctionPlayerNames().filter(name => !ourPlayers.has(name) && !allOpponentNames.has(name) && !unavailablePlayers.includes(name));
    const rows = picks.length ? picks.map((pick, index) => `<div class="team-pick-row"><span>${pick.name}</span><b>${pick.price}</b><button aria-label="Remove ${pick.name}" onclick="removeOpponentPick('${team}',${index})">×</button></div>`).join("") : `<div class="team-empty">No live picks entered.</div>`;
    return `<article class="team-tracker"><div class="team-tracker-head"><h3>${team}</h3><strong>${spent} / 200 · ${Math.max(0, 9 - picks.length)} open</strong></div><div class="team-pick-controls"><select id="${id}-player" aria-label="${team} player"><option value="">Choose player</option>${available.map(name => `<option value="${name}">${name}</option>`).join("")}</select><input id="${id}-price" aria-label="${team} price" type="number" min="1" max="200" placeholder="Price"><button onclick="addOpponentPick('${team}')">Add pick</button></div>${rows}${spent > 200 ? `<div class="warning">Over 200 by ${spent - 200}</div>` : ""}</article>`;
  }).join("");

  const allPicks = opponentTeams.flatMap(team => opponentPicks[team].map(pick => ({ ...pick, team })));
  const summary = document.querySelector("#liveMarketSummary");
  if (!allPicks.length) {
    summary.className = "need-good";
    summary.innerHTML = `<b>Live market is empty.</b> Add every opponent purchase as it happens; sold players will disappear from all fallback lists.`;
    return;
  }
  const topPick = [...allPicks].sort((a, b) => Number(b.price) - Number(a.price))[0];
  const spendByTeam = opponentTeams.map(team => ({ team, spent: opponentPicks[team].reduce((sum, pick) => sum + Number(pick.price || 0), 0) })).sort((a, b) => b.spent - a.spent);
  summary.className = "need-good";
  summary.innerHTML = `<b>${allPicks.length} opponent picks tracked.</b> Highest sale: ${topPick.name} to ${topPick.team} for ${topPick.price}. ${spendByTeam[0].team} has spent the most (${spendByTeam[0].spent}); watch the teams with the largest remaining budgets late.`;
}

function addOpponentPick(team) {
  const id = trackerId(team);
  const player = document.querySelector(`#${id}-player`).value;
  const price = Number(document.querySelector(`#${id}-price`).value);
  if (!player || !Number.isFinite(price) || price < 1) return;
  if (chosenPlayers().includes(player) || opponentPickedNames().has(player)) return;
  opponentPicks[team].push({ name: player, price });
  unavailablePlayers = unavailablePlayers.filter(name => name !== player);
  localStorage.setItem("renegadesUnavailableV1", JSON.stringify(unavailablePlayers));
  saveOpponentPicks();
  updateLiveBoard();
}

function removeOpponentPick(team, index) {
  opponentPicks[team].splice(index, 1);
  saveOpponentPicks();
  updateLiveBoard();
}

function clearOpponentTracker() {
  if (!confirm("Clear every opponent pick from the live tracker?")) return;
  opponentPicks = { Nasiq: [], Amrit: [], Bhagyesh: [] };
  saveOpponentPicks();
  updateLiveBoard();
}

function loadOpponentMock() {
  opponentPicks = {
    Nasiq: [{ name: "Ayush", price: 6 }, { name: "Dhananjay", price: 26 }, { name: "Shailesh", price: 8 }, { name: "Kaushik Apte", price: 30 }, { name: "Chirag", price: 60 }, { name: "Kartik", price: 52 }, { name: "Vivek", price: 2 }, { name: "Kishor Ghadge", price: 2 }],
    Amrit: [{ name: "Prajna", price: 14 }, { name: "Dhruv", price: 44 }, { name: "Taranjot Singh Dang", price: 12 }, { name: "Pradnyal Gandhi", price: 78 }, { name: "Minti", price: 20 }, { name: "Ketan Shilimkar", price: 18 }, { name: "Jitendra", price: 2 }],
    Bhagyesh: [{ name: "Preetesh Duvvuri", price: 6 }, { name: "Vija", price: 26 }, { name: "Rishabh Devgon", price: 42 }, { name: "Sagar SJ", price: 28 }, { name: "Sandeep Naik", price: 6 }, { name: "Bilal Yaser", price: 20 }, { name: "Vignesh", price: 22 }, { name: "Rajeev Singh", price: 2 }]
  };
  saveOpponentPicks();
  updateLiveBoard();
}

async function copyAuctionSnapshot() {
  const ownPicks = slots.map(slot => ({
    name: slot.querySelector("select").value,
    price: Number(slot.querySelector("input").value || 0)
  })).filter(pick => pick.name);
  const snapshot = {
    version: 1,
    exportedAt: new Date().toISOString(),
    budget: 200,
    rosterSize: 9,
    formation: userRole === "CDM"
      ? ["GK", "LB", "RB", "MID/WING", "MID/WING", "YOU: CDM"]
      : ["GK", "LB", "RB", "CDM", "MID/WING", "YOU: MID/WING"],
    userRole,
    ownPicks,
    opponentPicks,
    unavailablePlayers
  };
  const status = document.querySelector("#snapshotStatus");
  try {
    await navigator.clipboard.writeText(JSON.stringify(snapshot));
    status.textContent = "AI snapshot copied. Paste it into ChatGPT or Codex and ask it to sync the auction state.";
  } catch (error) {
    status.textContent = "Clipboard access failed. Use a secure HTTPS tab and try again.";
  }
}

function updateLiveBoard() {
  refreshUnavailableSelect();
  renderUnavailable();
  renderFormationNeeds();
  renderOpponentTracker();
  updatePlayerRiskCards();
}

slots.forEach(slot => {
  slot.addEventListener("input", updateLiveBoard);
  slot.addEventListener("change", updateLiveBoard);
});

const originalClearSlots = clearSlots;
clearSlots = function () { originalClearSlots(); updateLiveBoard(); };
const originalLoadMock = loadMock;
loadMock = function () { originalLoadMock(); updateLiveBoard(); };
filter = function (tier, button) {
  const section = button.closest("section");
  section.querySelectorAll(".controls button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  section.querySelectorAll(".card").forEach(card => {
    card.style.display = tier === "all" || card.dataset.tier === tier ? "" : "none";
  });
  updatePlayerRiskCards();
};

cleanPlayerCards();

document.querySelectorAll("#userRoleTabs button").forEach(button => {
  const isActive = button.textContent.includes(userRole);
  button.classList.toggle("active", isActive);
});
document.querySelector("#userRoleExplanation").textContent = userRole === "CDM"
  ? "You cover CDM; the auction must supply two MID/WINGER starters."
  : "You cover one MID/WINGER role; the auction must supply the CDM starter.";

document.querySelector("#liveModelNote").textContent =
  "Loading ratings from auctions.json...";
updateLiveBoard();

fetch("auctions.json", { cache: "no-store" })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(players => {
    jsonPlayerSet = new Set(players.map(player => player.Name));
    players.forEach(player => { ratings[player.Name] = player; });
    syncAuctionSelects(players);
    ensureJsonPlayerCards(players);
    recalc();
    document.querySelector("#liveModelNote").textContent =
      `Loaded ${players.length} players from auctions.json. Scores use passing, mental awareness, defense, control, and Physicality as the conditioning/stamina proxy. Pace is excluded.`;
    updateLiveBoard();
  })
  .catch(error => {
    document.querySelector("#liveModelNote").innerHTML =
      `<span class="warning">Could not load auctions.json (${error.message}). Reload the hosted dashboard before relying on recommendations.</span>`;
  });
