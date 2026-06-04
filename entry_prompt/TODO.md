# 🌍 Country-Level Data Entry Progress

## Completed
- [x] **United States** (`US/`) — 27 cities, 10/10 each ✅

## Active
- [ ] **Croatia** (`HR/`) — Country 12/12 ✅, cities in progress

## Planned (in order)
- [ ] **United Kingdom** (`GB/`) — London, Manchester, Birmingham, Liverpool, etc.
- [ ] **Germany** (`DE/`) — Berlin, Munich, Hamburg, Frankfurt, etc.
- [ ] **France** (`FR/`) — Paris, Marseille, Lyon, Toulouse, etc.
- [ ] **Russia** (`RU/`) — Moscow, Saint Petersburg, Novosibirsk, etc.
- [ ] **China** (`CN/`) — Beijing, Shanghai, Guangzhou, Shenzhen, etc.
- [ ] **Japan** (`JP/`) — Tokyo, Osaka, Kyoto, Yokohama, etc.
- [ ] **South Korea** (`KR/`) — Seoul, Busan, Incheon, Daegu, etc.
- [ ] **India** (`IN/`) — New Delhi, Mumbai, Bangalore, Kolkata, etc.
- [ ] **Australia** (`AU/`) — Sydney, Melbourne, Brisbane, Perth, etc.
- [ ] **Canada** (`CA/`) — Toronto, Vancouver, Montreal, Calgary, etc.
- [ ] **Brazil** (`BR/`) — Brasília, São Paulo, Rio de Janeiro, etc.
- [ ] **Israel** (`IL/`) — Tel Aviv, Jerusalem, Haifa, etc.
- [ ] **Saudi Arabia** (`SA/`) — Riyadh, Jeddah, Mecca, Medina, etc.
- [ ] **Turkey** (`TR/`) — Istanbul, Ankara, Izmir, Bursa, etc.
- [ ] **Egypt** (`EG/`) — Cairo, Alexandria, Giza, Luxor, etc.
- [ ] **Iraq** (`IQ/`) — Baghdad, Basra, Mosul, Erbil, etc.
- [ ] **Afghanistan** (`AF/`) — Kabul, Kandahar, Herat, Mazar-i-Sharif, etc.
- [ ] **Syria** (`SY/`) — Damascus, Aleppo, Homs, Latakia, etc.
- [ ] **Lebanon** (`LB/`) — Beirut, Tripoli, Sidon, Tyre, etc.
- [ ] **Yemen** (`YE/`) — Sana'a, Aden, Taiz, Hodeidah, etc.
- [ ] **Palestine** (`PS/`) — Gaza, Ramallah, Hebron, Nablus, etc.
- [ ] **Bosnia and Herzegovina** (`BA/`) — Sarajevo, Banja Luka, Tuzla, Mostar, etc.

---

### Adding a New Country
1. Create folder `entry_prompt/<COUNTRY_CODE>/`
2. Copy template from `entry_prompt/US/DATA_ENTRY.md`, customizing as needed
3. Create empty `TODO.md` and `RESULT.md` with the target provinces/cities
4. Add to this file as `- [ ] **Country Name** (\`<CODE>/\`)`

### When a Country Is Complete
- Move it to a `## Completed` section at the bottom of this file
- Ensure `RESULT.md` is fully filled out
- Mark the checkbox as `[x]`
