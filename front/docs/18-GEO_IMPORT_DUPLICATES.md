# Geo import — leftover records and duplicates

The world import (`ignore-scripts/_geo_import.py`) ran against production and loaded 250 countries, 5,308 provinces and 152,970 cities. It name-matched **countries and provinces** against the records already in the database and reused them, but it never name-matched **cities**. This report lists the hand-entered records that survive alongside the imported ones and says which of them are now duplicates.

Every imported record carries one fixed ObjectId timestamp, so imported records are identifiable by the `_id` prefix `6955b900`. Anything else was entered by hand before the import.

## Summary

| level | hand-entered | duplicate of an import | kept (no duplicate) | carry hand-written war content |
|---|---|---|---|---|
| provinces | 38 | **12** | 26 | 32 |
| cities | 83 | **77** | 6 | 76 |

> **Do not delete anything yet.** 32 of the provinces and 76 of the cities carry hand-written war-history text (`wars_history`, `conflict_timeline`, …). Of the duplicates, 70 cities and 10 provinces hold that content — it has to be moved onto the imported record before the old one is removed.

## Province duplicates

A province is a duplicate when the import did **not** find its name and so created an English-named twin beside it. The other hand-entered provinces were matched and reused, so they have no twin and must be kept.

| hand-entered id | name | english_name | country | imported twin (suggested) | war fields |
|---|---|---|---|---|---|
| `6a3e91fee7f6b703f2d1b09b` | النبطية | Nabatieh Governorate | لبنان | Nabatieh | 10 |
| `6a3e8cbbe7f6b703f2d1b099` | محافظة البقاع | Beqaa Governorate | لبنان | Beqaa | 10 |
| `6a365e3501497993907c8561` | محافظة الشمال | North Governorate | لبنان | North | 8 |
| `6a26c0dbcf597f7ec55684bb` | Zadarska | Zadar County | Hrvatska | Zadar | 4 |
| `6a256366cf597f7ec55684b5` | Sisačko-moslavačka | Sisak-Moslavina County | Hrvatska | Sisak-Moslavina | 10 |
| `6a255c60cf597f7ec55684b3` | Splitsko-dalmatinska | Split-Dalmatia County | Hrvatska | Split-Dalmatia | 10 |
| `6a22c486cf597f7ec55684b0` | Osječko-baranjska županija | Osijek-Baranja County | Hrvatska | Osijek-Baranja | 10 |
| `6a227230cf597f7ec55684a2` | Dubrovačko-neretvanska županija | Dubrovnik-Neretva County | Hrvatska | Dubrovnik-Neretva | 10 |
| `6a21d83ffa501fcbe2807b34` | Vukovarsko-srijemska županija | Vukovar-Srijem County | Hrvatska | Vukovar-Syrmia | 0 |
| `6a21d6a5fa501fcbe2807b32` | Grad Zagreb | City of Zagreb | Hrvatska | Zagreb | 0 |
| `6a1f3d20c1b216fc5349f90a` | Washington DC | Washington DC | United States | District of Columbia | 10 |
| `6a1293f584ffe580f176d0e4` | Srednjobosanski kanton | Central Bosnia Canton | Bosna i Hercegovina | Federation of Bosnia and Herzegovina | 10 |

**Srednjobosanski kanton** (Central Bosnia Canton) needs a closer look: the dataset divides Bosnia into three units, so its twin is the far larger *Federation of Bosnia and Herzegovina*. That is a granularity mismatch rather than a like-for-like duplicate.

## City duplicates

77 of the 83 hand-entered cities have an imported twin. Most match by name; the rest are named in native script (`اهواز` → *Ahvaz*) or use a variant (`مدينة غزة` → *Gaza City*, `Dubrovnik` → *Grad Dubrovnik*).

| hand-entered id | name | english_name | country | province | imported twin id | war fields |
|---|---|---|---|---|---|---|
| `6a227238cf597f7ec55684a3` | Dubrovnik | Dubrovnik | Hrvatska | Dubrovačko-neretvanska županija | `6955b900b1ee33b7a06b0003` | 10 |
| `6a21d6b0fa501fcbe2807b33` | Zagreb | Zagreb | Hrvatska | Grad Zagreb | `6955b900fe0671ee67a80045` | 10 |
| `6a22c48dcf597f7ec55684b1` | Osijek | Osijek | Hrvatska | Osječko-baranjska županija | `6955b9003138423cb82d0029` | 10 |
| `6a256366cf597f7ec55684b6` | Sisak | Sisak | Hrvatska | Sisačko-moslavačka | `6955b900f776d1739e970015` | 10 |
| `6a255c6ecf597f7ec55684b4` | Split | Split | Hrvatska | Splitsko-dalmatinska | `6955b900adb66efa57f90040` | 10 |
| `6a21d847fa501fcbe2807b35` | Vukovar | Vukovar | Hrvatska | Vukovarsko-srijemska županija | `6955b90001eb1e6fe9910027` | 10 |
| `6a26c0f2cf597f7ec55684bc` | Zadar | Zadar | Hrvatska | Zadarska | `6955b9005b9a431aa5ec0021` | 0 |
| `6a21d66dfa501fcbe2807b31` | Birmingham | Birmingham | United States | Alabama | `6955b900debe3cfe60e50018` | 10 |
| `6a21fb8780f5d4f2fb74203f` | Huntsville | Huntsville | United States | Alabama | `6955b900debe3cfe60e50098` | 10 |
| `6a21f8a880f5d4f2fb74203e` | Mobile | Mobile | United States | Alabama | `6955b900debe3cfe60e500be` | 10 |
| `6a21dff9fa501fcbe2807b36` | Montgomery | Montgomery | United States | Alabama | `6955b900debe3cfe60e500c1` | 8 |
| `6a21fdf480f5d4f2fb742041` | Anchorage | Anchorage | United States | Alaska | `6955b900f0d1204e91640002` | 10 |
| `6a22583e80f5d4f2fb742042` | Fairbanks | Fairbanks | United States | Alaska | `6955b900987c2efd56a0001e` | 10 |
| `6a225a3a80f5d4f2fb742043` | Juneau | Juneau | United States | Alaska | `6955b900987c2efd56a0002d` | 10 |
| `6a225f3d80f5d4f2fb742049` | Flagstaff | Flagstaff | United States | Arizona | `6955b900b56934e56ada0040` | 10 |
| `6a225e4180f5d4f2fb742048` | Mesa | Mesa | United States | Arizona | `6955b900b56934e56ada006d` | 10 |
| `6a225c4e80f5d4f2fb742045` | Phoenix | Phoenix | United States | Arizona | `6955b900b56934e56ada0083` | 10 |
| `6a225d4e80f5d4f2fb742047` | Tucson | Tucson | United States | Arizona | `6955b900b56934e56ada00be` | 10 |
| `6a225d4880f5d4f2fb742046` | Tucson | Tucson | United States | Arizona | `6955b900b56934e56ada00be` | 0 |
| `6a227e44cf597f7ec55684a5` | Denver | Denver | United States | Arkansas | `6955b900f74bee5e37760046` | 0 |
| `6a2261f780f5d4f2fb74204c` | Fayetteville | Fayetteville | United States | Arkansas | `6955b900debe3cfe60e50063` | 10 |
| `6a227c53cf597f7ec55684a4` | Fort Smith | Fort Smith | United States | Arkansas | `6955b900bac8303527bb0045` | 10 |
| `6a22611a80f5d4f2fb74204b` | Little Rock | Little Rock | United States | Arkansas | `6955b900bac8303527bb0077` | 10 |
| `6a1f2ac3c1b216fc5349f8fc` | Los Angeles | Los Angeles | United States | California | `6955b900b08432bd7da5021b` | 10 |
| `6a1f2f88c1b216fc5349f8fe` | San Diego | San Diego | United States | California | `6955b900b08432bd7da5032f` | 10 |
| `6a1f2be4c1b216fc5349f8fd` | San Francisco | San Francisco | United States | California | `6955b900b08432bd7da50333` | 10 |
| `6a1fe6e8c1b216fc5349f91c` | San Jose | San Jose | United States | California | `6955b900b08432bd7da50338` | 10 |
| `6a227ed7cf597f7ec55684a9` | Aurora | Aurora | United States | Colorado | `6955b900ad22cdfbc450001b` | 10 |
| `6a227ed8cf597f7ec55684aa` | Boulder | Boulder | United States | Colorado | `6955b900aaf068be9ee40013` | 10 |
| `6a227ed7cf597f7ec55684a8` | Colorado Springs | Colorado Springs | United States | Colorado | `6955b900aaf068be9ee4002f` | 10 |
| `6a227ecccf597f7ec55684a7` | Denver | Denver | United States | Colorado | `6955b900f74bee5e37760046` | 10 |
| `6a228c0ccf597f7ec55684ae` | Bridgeport | Bridgeport | United States | Connecticut | `6955b900f416439943e00025` | 10 |
| `6a228c03cf597f7ec55684ac` | Hartford | Hartford | United States | Connecticut | `6955b900f0d1204e91640069` | 10 |
| `6a228c0ccf597f7ec55684ad` | New Haven | New Haven | United States | Connecticut | `6955b900d09946f5259f005f` | 10 |
| `6a228c0ccf597f7ec55684af` | Stamford | Stamford | United States | Connecticut | `6955b9007407721351c7008d` | 10 |
| `6a26bacbcf597f7ec55684b9` | Dover | Dover | United States | Delaware | `6955b900e2b4276ad0bb0023` | 10 |
| `6a26bacbcf597f7ec55684ba` | Newark | Newark | United States | Delaware | `6955b900bac8303527bb0099` | 10 |
| `6a258971cf597f7ec55684b8` | Wilmington | Wilmington | United States | Delaware | `6955b900b08432bd7da50411` | 10 |
| `6a1f431fc1b216fc5349f912` | Miami | Miami | United States | Florida | `6955b900b56934e56ada006f` | 10 |
| `6a1f431fc1b216fc5349f913` | Orlando | Orlando | United States | Florida | `6955b9007a2dc9c5503001ed` | 10 |
| `6a1f3e4dc1b216fc5349f90c` | Atlanta | Atlanta | United States | Georgia | `6955b900c76adb86e0b4000d` | 10 |
| `6a211ac1c1b216fc5349f928` | Augusta | Augusta | United States | Georgia | `6955b900f0d1204e91640007` | 10 |
| `6a1f3e4fc1b216fc5349f90d` | Savannah | Savannah | United States | Georgia | `6955b9005ca1adc0f72400eb` | 10 |
| `6a2115bbc1b216fc5349f926` | Aurora | Aurora | United States | Illinois | `6955b900ad22cdfbc450001b` | 10 |
| `6a1f3a56c1b216fc5349f906` | Chicago | Chicago | United States | Illinois | `6955b900ad22cdfbc4500075` | 10 |
| `6a210f9dc1b216fc5349f925` | Springfield | Springfield | United States | Illinois | `6955b900f0d1204e916400e9` | 10 |
| `6a1fd622c1b216fc5349f919` | Detroit | Detroit | United States | Michigan | `6955b900c76adb86e0b40065` | 10 |
| `6a1fd623c1b216fc5349f91a` | Flint | Flint | United States | Michigan | `6955b900c76adb86e0b40087` | 2 |
| `6a1fd623c1b216fc5349f91b` | Grand Rapids | Grand Rapids | United States | Michigan | `6955b900c76adb86e0b4009d` | 0 |
| `6a207a77c1b216fc5349f923` | Albany | Albany | United States | New York | `6955b900f4f33bb0b05c0003` | 10 |
| `6a20205ec1b216fc5349f922` | Buffalo | Buffalo | United States | New York | `6955b900f74bee5e3776001f` | 10 |
| `6a1f383dc1b216fc5349f904` | New York City | New York City | United States | New York | `6955b9004c24470ac70d025c` | 10 |
| `6a208247c1b216fc5349f924` | Rochester | Rochester | United States | New York | `6955b900f416439943e00126` | 10 |
| `6a1fcc20c1b216fc5349f917` | Cincinnati | Cincinnati | United States | Ohio | `6955b900aabde60bbb0d006e` | 10 |
| `6a1fcc1fc1b216fc5349f916` | Cleveland | Cleveland | United States | Ohio | `6955b900debe3cfe60e5003b` | 10 |
| `6a1fcc1fc1b216fc5349f915` | Columbus | Columbus | United States | Ohio | `6955b900aabde60bbb0d007b` | 10 |
| `6a2130bbc1b216fc5349f929` | Allentown | Allentown | United States | Pennsylvania | `6955b9007bc9303eb3940002` | 8 |
| `6a1f4048c1b216fc5349f90f` | Philadelphia | Philadelphia | United States | Pennsylvania | `6955b9004c24470ac70d02b2` | 10 |
| `6a1f404ec1b216fc5349f910` | Pittsburgh | Pittsburgh | United States | Pennsylvania | `6955b9001c628f8c5dd702b1` | 10 |
| `6a1f345cc1b216fc5349f902` | Austin | Austin | United States | Texas | `6955b900bac8303527bb0008` | 10 |
| `6a1f33bfc1b216fc5349f901` | Dallas | Dallas | United States | Texas | `6955b900ada9937ca10c002e` | 10 |
| `6a1f3165c1b216fc5349f900` | Houston | Houston | United States | Texas | `6955b900987c2efd56a0002c` | 10 |
| `6a20037bc1b216fc5349f921` | San Antonio | San Antonio | United States | Texas | `6955b900d3c8fb98e03100d8` | 10 |
| `6a2117c4c1b216fc5349f927` | Arlington | Arlington | United States | Virginia | `6955b900f416439943e0000a` | 10 |
| `6a1f3ba8c1b216fc5349f908` | Richmond | Richmond | United States | Virginia | `6955b900f0d1204e916400d4` | 10 |
| `6a1f3baac1b216fc5349f909` | Virginia Beach | Virginia Beach | United States | Virginia | `6955b9009c522b7e94ca016b` | 10 |
| `6a0ed9fc67c85d8ba0c217b4` | آبادان | Abadan | ایران  | خوزستان | `6955b900ea462b7ddbfa0000` | 0 |
| `6a0eda6a67c85d8ba0c217b7` | اهواز | Ahvaz | ایران  | خوزستان | `6955b900ea462b7ddbfa0004` | 10 |
| `6a0ed9de67c85d8ba0c217b3` | خرمشهر | Khorramshahr | ایران  | خوزستان | `6955b900ea462b7ddbfa002c` | 3 |
| `6a0eda1667c85d8ba0c217b5` | دزفول | Dezful | ایران  | خوزستان | `6955b900ea462b7ddbfa0017` | 0 |
| `6a0eda4c67c85d8ba0c217b6` | شوش | Shush | ایران  | خوزستان | `6955b900ea462b7ddbfa004a` | 0 |
| `6a128a5184ffe580f176d0de` | مدينة غزة | Gaza | فلسطين | غزة | `6955b9004b4026d156c30001` | 10 |
| `6a300201cf597f7ec55684c6` | بيروت | Beirut | لبنان | بيروت | `6955b900ee134468f9500000` | 10 |
| `6a32b54801497993907c855f` | بعبدا | Baabda | لبنان | جبل لبنان | `6955b9002825682591990000` | 10 |
| `6a3e8cbbe7f6b703f2d1b09a` | زحلة | Zahlé | لبنان | محافظة البقاع | `6955b900143d6b14840e0001` | 10 |
| `6a366dbc01497993907c8562` | طرابلس | Tripoli | لبنان | محافظة الشمال | `6955b900dfe7494364680002` | 10 |
| `6a11e66a84ffe580f176d0d6` | ارحب | Arhab | يمن | صَنعاء | `6955b9004dd0cf7538e50004` | 10 |

## Keep — no imported twin

These 6 hand-entered cities have no counterpart in the dataset (it covers Lebanon and Bosnia sparsely), so nothing duplicates them:

- **بنت جبيل** (Bint Jbeil) — لبنان / النبطية — 8 war fields
- **النبطية** (Nabatieh) — لبنان / النبطية — 10 war fields
- **بشرّي** (Bsharri) — لبنان / محافظة الشمال — 10 war fields
- **البترون** (Batroun) — لبنان / محافظة الشمال — 10 war fields
- **عاليه** (Aley) — لبنان / جبل لبنان — 10 war fields
- **Ahmići** (Ahmići) — Bosna i Hercegovina / Srednjobosanski kanton — 3 war fields

The 26 hand-entered provinces that the import matched and reused are also kept as-is — they are the only record of those places, not duplicates:

- جبل لبنان (Mount Lebanon) — لبنان
- بيروت (Beirut) — لبنان
- Delaware (Delaware) — United States
- Connecticut (Connecticut) — United States
- Colorado (Colorado) — United States
- Arkansas (Arkansas) — United States
- Arizona (Arizona) — United States
- Alaska (Alaska) — United States
- Alabama (Alabama) — United States
- Michigan (Michigan) — United States
- Ohio (Ohio) — United States
- Florida (Florida) — United States
- Pennsylvania (Pennsylvania) — United States
- Georgia (Georgia) — United States
- Virginia (Virginia) — United States
- Illinois (Illinois) — United States
- New York (New York) — United States
- Texas (Texas) — United States
- California (California) — United States
- غزة (Gaza) — فلسطين
- صَنعاء (Sana'a) — يمن
- بوشهر (Bushehr) — ایران 
- کرمانشاه (Kermanshah) — ایران 
- ایلام (Ilam) — ایران 
- خوزستان (Khuzestan) — ایران 
- تهران ( Tehran) — ایران 

## How to reproduce

```sh
# provinces only — a few seconds
python3 ignore-scripts/_geo_dupes.py --provinces-only

# full run, including the per-city twin lookup (~13 minutes)
python3 ignore-scripts/_geo_dupes.py --json ignore-scripts/.cache/dupes.json

# re-test only the cities a previous run could not match
python3 ignore-scripts/_geo_dupes.py --recheck-misses ignore-scripts/.cache/dupes.json
```
