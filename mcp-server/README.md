# Renegades Auction MCP

Local MCP server for the Renegades auction dashboard. It reads player ratings only from `../auctions.json` and stores live auction state in `auction-state.json`.

Tools:

- `get_auction_state`
- `sync_auction_state`
- `record_pick`
- `remove_pick`
- `recommend_next_pick`
- `reset_auction`

The GitHub Pages dashboard remains static. Use **Copy AI snapshot** and pass the copied JSON to `sync_auction_state` to transfer the browser state into Codex. A hosted state service is required for automatic phone-to-MCP synchronization.

