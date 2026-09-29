import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.dirname(serverDir);
const playersPath = path.join(repoDir, "auctions.json");
const statePath = process.env.RENEGADES_STATE_PATH || path.join(serverDir, "auction-state.json");

const teams = ["Varun", "Nasiq", "Amrit", "Bhagyesh"];
function formationRoles(userRole = "WINGER") {
  return userRole === "CDM" ? ["GK", "LB", "RB", "MW", "MW"] : ["GK", "LB", "RB", "CDM", "MW"];
}
const goalkeeperPlans = {
  "Vignesh": { target: "20-24", cap: 28 },
  "Ashu": { target: "16-20", cap: 24 },
  "Ketan Shilimkar": { target: "10-14", cap: 18 },
  "Preetesh Duvvuri": { target: "5-8", cap: 12 }
};
const roleWeights = {
  GK: { Defense: .35, Physicality: .25, Mental: .20, Passing: .12, Dribbling: .08 },
  LB: { Defense: .40, Mental: .22, Physicality: .20, Passing: .13, Dribbling: .05 },
  RB: { Defense: .40, Mental: .22, Physicality: .20, Passing: .13, Dribbling: .05 },
  CDM: { Passing: .30, Defense: .28, Mental: .25, Physicality: .12, Dribbling: .05 },
  MW: { Passing: .25, Mental: .20, Physicality: .15, Dribbling: .22, Shooting: .13, Defense: .05 }
};

function emptyState() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    budget: 200,
    rosterSize: 9,
    formation: ["GK", "LB", "RB", "CDM", "MID/WING", "YOU: MID/WING"],
    userRole: "WINGER",
    ownPicks: [],
    opponentPicks: { Nasiq: [], Amrit: [], Bhagyesh: [] },
    unavailablePlayers: []
  };
}

function readPlayers() {
  const players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
  return new Map(players.map(player => [player.Name, player]));
}

function readState() {
  if (!fs.existsSync(statePath)) return emptyState();
  return { ...emptyState(), ...JSON.parse(fs.readFileSync(statePath, "utf8")) };
}

function writeState(state) {
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  return state;
}

function allPicks(state) {
  return [
    ...(state.ownPicks || []).map(pick => ({ ...pick, team: "Varun" })),
    ...Object.entries(state.opponentPicks || {}).flatMap(([team, picks]) => (picks || []).map(pick => ({ ...pick, team })))
  ];
}

function normalizeSnapshot(snapshot) {
  const value = typeof snapshot === "string" ? JSON.parse(snapshot) : snapshot;
  if (!value || typeof value !== "object") throw new Error("Snapshot must be a JSON object.");
  const state = emptyState();
  state.ownPicks = Array.isArray(value.ownPicks) ? value.ownPicks : [];
  for (const team of ["Nasiq", "Amrit", "Bhagyesh"]) {
    state.opponentPicks[team] = Array.isArray(value.opponentPicks?.[team]) ? value.opponentPicks[team] : [];
  }
  state.unavailablePlayers = Array.isArray(value.unavailablePlayers) ? [...new Set(value.unavailablePlayers)] : [];
  state.userRole = value.userRole === "CDM" ? "CDM" : "WINGER";
  return state;
}

function validatePick(state, team, player, price) {
  if (!teams.includes(team)) throw new Error(`Unknown team: ${team}`);
  if (!readPlayers().has(player)) throw new Error(`${player} is not present in auctions.json.`);
  if (!Number.isFinite(price) || price < 1) throw new Error("Price must be a positive number.");
  const existing = allPicks(state).find(pick => pick.name === player);
  if (existing) throw new Error(`${player} is already assigned to ${existing.team}.`);
  const teamPicks = team === "Varun" ? state.ownPicks : state.opponentPicks[team];
  if (teamPicks.length >= state.rosterSize) throw new Error(`${team} already has ${state.rosterSize} picks.`);
  const spent = teamPicks.reduce((sum, pick) => sum + Number(pick.price || 0), 0);
  if (spent + price > state.budget) throw new Error(`${team} would exceed ${state.budget} by ${spent + price - state.budget}.`);
}

function roleScore(player, role) {
  return Object.entries(roleWeights[role]).reduce((sum, [field, weight]) => sum + Number(player[field] || 0) * weight, 0);
}

function bestFormation(names, players, roles) {
  let best = { score: -1, assignments: [] };
  function search(index, used, score, assignments) {
    if (index === roles.length) {
      if (score > best.score) best = { score, assignments: [...assignments] };
      return;
    }
    search(index + 1, used, score, [...assignments, null]);
    for (const name of names) {
      if (used.has(name) || !players.has(name)) continue;
      const next = new Set(used);
      next.add(name);
      search(index + 1, next, score + roleScore(players.get(name), roles[index]), [...assignments, name]);
    }
  }
  search(0, new Set(), 0, []);
  return best.assignments;
}

function recommendations(state, limit = 3) {
  const players = readPlayers();
  const roles = formationRoles(state.userRole);
  const owned = new Set((state.ownPicks || []).map(pick => pick.name));
  const unavailable = new Set([
    ...(state.unavailablePlayers || []),
    ...Object.values(state.opponentPicks || {}).flatMap(picks => (picks || []).map(pick => pick.name))
  ]);
  const assignments = bestFormation([...owned], players, roles);
  const roleCoverage = roles.map((role, index) => ({
    role,
    player: assignments[index],
    score: assignments[index] ? Math.round(roleScore(players.get(assignments[index]), role)) : null
  }));
  const spent = (state.ownPicks || []).reduce((sum, pick) => sum + Number(pick.price || 0), 0);
  const open = Math.max(0, state.rosterSize - (state.ownPicks || []).length);
  const safeNextBid = Math.max(0, state.budget - spent - Math.max(0, open - 1));
  const available = [...players.keys()].filter(name => !owned.has(name) && !unavailable.has(name));
  const byRole = {};
  const pradnyalOwned = owned.has("Pradnyal Gandhi");
  for (const role of [...new Set(roles)]) {
    let pool = role === "GK" ? available.filter(name => goalkeeperPlans[name]) : available;
    if (pradnyalOwned && ["LB", "RB", "CDM"].includes(role)) pool = pool.filter(name => !["Chirag", "Vishnu Mohan"].includes(name));
    byRole[role] = pool
      .map(name => ({
        name,
        score: Math.round(roleScore(players.get(name), role)),
        target: goalkeeperPlans[name]?.target,
        maximum: goalkeeperPlans[name] ? Math.min(goalkeeperPlans[name].cap, safeNextBid) : undefined
      }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, Math.max(1, Math.min(10, limit)));
  }
  return {
    budget: { spent, remaining: state.budget - spent, openSlots: open, safeNextBid },
    userRole: state.userRole,
    formationNote: state.userRole === "CDM" ? "You occupy CDM; buy two MID/WINGER starters." : "You occupy one MID/WINGER position; buy the CDM starter.",
    anchorStrategy: pradnyalOwned
      ? "Pradnyal is secured; Chirag and Vishnu are optional. Spend next on goalkeeper, width, and depth."
      : unavailable.has("Pradnyal Gandhi")
        ? "Pradnyal is gone; preserve up to 65 points for Vishnu or Chirag before buying rotation depth. This includes the S-tier 10-point bidding-war buffer."
        : "Protect up to 70 points for Pradnyal. If he is lost, transfer up to 65 points to Vishnu or Chirag. These ceilings include the S-tier 10-point bidding-war buffer.",
    roleCoverage,
    recommendations: byRole
  };
}

const tools = [
  {
    name: "get_auction_state",
    description: "Read all Renegades and opponent auction picks, budgets, and unavailable players.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "sync_auction_state",
    description: "Replace MCP state with a JSON snapshot copied from the Renegades dashboard.",
    inputSchema: {
      type: "object",
      properties: { snapshot: { description: "Dashboard snapshot as an object or JSON string" } },
      required: ["snapshot"], additionalProperties: false
    }
  },
  {
    name: "record_pick",
    description: "Record one auction purchase and enforce unique players, 200 points, and nine roster slots.",
    inputSchema: {
      type: "object",
      properties: {
        team: { type: "string", enum: teams },
        player: { type: "string" },
        price: { type: "number", minimum: 1 }
      },
      required: ["team", "player", "price"], additionalProperties: false
    }
  },
  {
    name: "remove_pick",
    description: "Remove a recorded auction purchase from a team.",
    inputSchema: {
      type: "object",
      properties: { team: { type: "string", enum: teams }, player: { type: "string" } },
      required: ["team", "player"], additionalProperties: false
    }
  },
  {
    name: "recommend_next_pick",
    description: "Recommend JSON-based goalkeeper, LB, RB, CDM, and MID/WINGER alternatives from the current live state.",
    inputSchema: {
      type: "object",
      properties: { limit: { type: "integer", minimum: 1, maximum: 10, default: 3 } },
      additionalProperties: false
    }
  },
  {
    name: "set_user_role",
    description: "Set whether Varun will play WINGER or CDM so the required auction slots recalculate.",
    inputSchema: {
      type: "object",
      properties: { role: { type: "string", enum: ["WINGER", "CDM"] } },
      required: ["role"], additionalProperties: false
    }
  },
  {
    name: "reset_auction",
    description: "Clear all MCP auction picks and restore an empty 200-point state.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  }
];

function textResult(value) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

function callTool(name, args = {}) {
  if (name === "get_auction_state") return textResult(readState());
  if (name === "sync_auction_state") return textResult(writeState(normalizeSnapshot(args.snapshot)));
  if (name === "record_pick") {
    const state = readState();
    validatePick(state, args.team, args.player, Number(args.price));
    const pick = { name: args.player, price: Number(args.price) };
    if (args.team === "Varun") state.ownPicks.push(pick);
    else state.opponentPicks[args.team].push(pick);
    return textResult({ state: writeState(state), advice: recommendations(state, 3) });
  }
  if (name === "remove_pick") {
    const state = readState();
    const list = args.team === "Varun" ? state.ownPicks : state.opponentPicks[args.team];
    if (!list) throw new Error(`Unknown team: ${args.team}`);
    const before = list.length;
    const filtered = list.filter(pick => pick.name !== args.player);
    if (before === filtered.length) throw new Error(`${args.player} is not recorded for ${args.team}.`);
    if (args.team === "Varun") state.ownPicks = filtered;
    else state.opponentPicks[args.team] = filtered;
    return textResult({ state: writeState(state), advice: recommendations(state, 3) });
  }
  if (name === "recommend_next_pick") return textResult(recommendations(readState(), args.limit || 3));
  if (name === "set_user_role") {
    const state = readState();
    state.userRole = args.role;
    return textResult({ state: writeState(state), advice: recommendations(state, 3) });
  }
  if (name === "reset_auction") return textResult(writeState(emptyState()));
  throw new Error(`Unknown tool: ${name}`);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function handle(message) {
  if (!message || message.jsonrpc !== "2.0") return;
  if (message.method?.startsWith("notifications/")) return;
  try {
    let result;
    if (message.method === "initialize") {
      result = {
        protocolVersion: message.params?.protocolVersion || "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "renegades-auction", version: "0.1.0" },
        instructions: "Use the dashboard snapshot or record each live pick, then call recommend_next_pick. Ratings come only from auctions.json."
      };
    } else if (message.method === "ping") {
      result = {};
    } else if (message.method === "tools/list") {
      result = { tools };
    } else if (message.method === "tools/call") {
      result = callTool(message.params?.name, message.params?.arguments || {});
    } else {
      throw Object.assign(new Error(`Method not found: ${message.method}`), { code: -32601 });
    }
    if (message.id !== undefined) send({ jsonrpc: "2.0", id: message.id, result });
  } catch (error) {
    if (message.id !== undefined) {
      send({
        jsonrpc: "2.0",
        id: message.id,
        error: { code: error.code || -32000, message: error.message }
      });
    }
  }
}

const input = readline.createInterface({ input: process.stdin, terminal: false });
input.on("line", line => {
  if (!line.trim()) return;
  try { handle(JSON.parse(line)); }
  catch (error) { send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: error.message } }); }
});
