---
name: weather
description: Check current weather for Tucuman, Argentina. Use when user asks "what's the weather", "weather today", "clima", or similar, without needing an explicit city.
---

# Weather

Default city: **Tucuman, Argentina**. If user names another city, use that instead.

## Steps

1. WebFetch `https://wttr.in/Tucuman,Argentina?format=3` for current one-line summary.
2. WebFetch `https://wttr.in/Tucuman,Argentina?format=j1` and extract `weather[0..2]` (date, `maxtempC`, `mintempC`, `hourly[4].weatherDesc[0].value` as representative condition) for next 3 days forecast.
3. Report back: current condition first (temp, condition, wind), same as before. Then append a markdown table with 3 columns (Date, Condition, Temp) and one row per day.

```bash
curl -s "https://wttr.in/Tucuman,Argentina?format=3"
curl -s "https://wttr.in/Tucuman,Argentina?format=j1"
```
