#!/bin/bash
set -e

ENDPOINT="http://app.iit.cloud/event"
ORDERS="http://app.iit.cloud/orders"
GAMES="http://app.iit.cloud/games"

echo "🧪  Analytics Smoke Tests on $ENDPOINT"

# 1. Page view
curl -s -o /dev/null -w "Page-View: %{http_code}\n" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"event":"page_view","path":"/","user_id":"smoke"}'

# 2. Click
curl -s -o /dev/null -w "Click: %{http_code}\n" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"event":"click","path":"/","user_id":"smoke","click_target":"#buyBtn"}'

# 3. Scroll depth
curl -s -o /dev/null -w "Scroll: %{http_code}\n" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"event":"scroll","path":"/","user_id":"smoke","scroll_depth":75}'


echo "📊 4. Row count & top pages"
curl -s "http://3.142.123.176:8123/?query=SELECT+count()+FROM+analytics.events" \
| awk '{print "Total rows:", $1}'

curl -s "http://3.142.123.176:8123/?query=SELECT+path,count()+FROM+analytics.events+WHERE+path!=%27%27+GROUP+BY+path+ORDER+BY+count()+DESC" \
| awk '{printf "  %s\t%s\n", $1, $2}'


# 2. Orders
######################
echo "🛒 2. Orders ..."
ORDER_ID=$(curl -s -X POST "$ORDERS" \
  -H "Content-Type: application/json" \
  -d '{"item":"health_potion","quantity":3,"price":2.50}' | jq -r '.id // empty')
echo "  Created order id: $ORDER_ID"

curl -s -w "  GET /orders: %{http_code}\n" -o /dev/null "$ORDERS"

# 3. Games
######################
echo "🎮 3. Games ..."
GAME_ID=$(curl -s -X POST "$GAMES" \
  -H "Content-Type: application/json" \
  -d '{"name":"CyberRacer","genre":"Racing","price":19.99}' | jq -r '.id // empty')
echo "  Created game id: $GAME_ID"

curl -s -w "  GET /games: %{http_code}\n" -o /dev/null "$GAMES"


echo "✅  Smoke tests sent"
