# Timeline — Master Data

> **For Claude Code:** This is the data for the **Time Scrubber** (see DESIGN.md → HUD). Each row is one marker. `sortYear` is a number for sorting and positioning (negative = BCE/years ago). `zone` says where on the tree it sits. `leaf` links to the full leaf in the content files; clicking a marker should fly the camera to that leaf and open it. Convert this table to `src/data/timeline.json`. Don't add events that aren't here.

| sortYear | Display date | Event | Zone | Leaf | Sources |
|---|---|---|---|---|---|
| -3390000 | ~3.4 million yrs ago | Possible first butchery marks, Dikika, Ethiopia | taproot | evo-1 | wong-dikika, mcpherron2010 |
| -2600000 | 2.6–1.2 million yrs ago | East African butchery sites (re-counted in 2022) | taproot | evo-3 | barr2022 |
| -2000000 | ~2 million yrs ago | *Homo erectus*; "meat vs. cooking" debate | taproot | evo-2, evo-4 | aiello1995, wrangham2009, barr2022 |
| -50000 | Neanderthal era | Neanderthals cook and eat plants (Shanidar) | taproot | evo-5 | henry2011 |
| -1500 | c. 1500–500 BCE | Vedic India: sacrifice and meat eating; ahimsa slowly emerges | root-india | ind-1 | bryant2006 |
| -599 | c. 6th c. BCE (trad. 599 BCE) | Mahavira and Jain non-violence | root-india | ind-2 | natgeo-jainism |
| -530 | c. 530 BCE | Pythagoras's community: the "Pythagorean diet" | root-greece | grk-1 | duncombe2024, avey2014 |
| -450 | c. 5th c. BCE | The Buddha's "seen, heard, suspected" rule | root-india | ind-3 | jivaka-mn55 |
| -260 | c. 260 BCE | Ashoka's Rock Edict I limits animal killing | root-india | ind-4 | livius-ashoka |
| -200 | Date debated | Yoga Sutras: ahimsa is the first yama | root-india | ind-5 | yogasutras-johnston |
| -50 | 1st c. BCE | Sextius: meat makes cruelty a habit | root-greece | grk-2 | duncombe2024 |
| 8 | 8 CE | Ovid's *Metamorphoses*, Pythagoras's speech | root-greece | grk-3 | ovid-kline |
| 62 | c. 62 CE | Seneca's letter on vegetarian arguments | root-greece | grk-2 | duncombe2024 |
| 100 | c. 100 CE | Plutarch, *On the Eating of Flesh* | root-greece | grk-4 | plutarch-flesh |
| 270 | 3rd c. CE | Porphyry, *On Abstinence from Animal Food* | root-greece | grk-5 | avey2014, duncombe2024 |
| 520 | c. 520 CE | Emperor Wu bans meat for Chinese Buddhist monks | root-india | ind-7 | scmp-wu |
| 1637 | 1637 | Descartes: animals as machines | branch-3 | b3-10 | descartes1637 |
| 1745 | 1745 | Pythagoras's teachings translated into English | root-greece | grk-7 | avey2014 |
| 1806 | 1806 | Lambe & Shelley object to eggs and dairy | trunk-green | trk-g1 | vegansociety-history |
| 1809 | 1809 | Bible Christian Church (England) | trunk-green | trk-g2 | avey2014 |
| 1817 | 1817 | First U.S. vegetarian church, Philadelphia | trunk-green | trk-g2 | avey2014 |
| 1847 | Sept. 29, 1847 | Vegetarian Society founded; the word "vegetarian" | trunk-green | trk-g3, grk-7 | avey2014 |
| 1850 | 1850 | American Vegetarian Society (Sylvester Graham) | trunk-green | trk-g3 | avey2014 |
| 1889 | 1889 | Only 512 plains bison left | taproot / branch-2 | evo-8, b2-8 | wwf-bison |
| 1894 | 1890s | Eugen Sandow, first fitness influencer | trunk-gold | trk-y1 | klein2026-sandow |
| 1899 | 1899 | Macfadden's *Physical Culture* magazine | trunk-gold | trk-y2 | smithsonian-bodybuilders |
| 1901 | 1901 | First major bodybuilding contest, Royal Albert Hall | trunk-gold | trk-y1 | smithsonian-bodybuilders |
| 1906 | 1906 | *The Jungle* exposes meatpacking | trunk-green | trk-g4 | avey2014, sinclair1906 |
| 1910 | Early 1900s | Kellogg promotes vegetarianism; "protose" meat substitute | trunk-green | trk-g5 | avey2014 |
| 1920 | 1920 | Yogananda arrives in America | root-india (upper) | ind-8 | yogananda1946 |
| 1928 | 1928 | "Reach for a Lucky instead of a sweet" | trunk-pink | trk-p1 | stanford-lucky |
| 1931 | Nov. 20, 1931 | Gandhi: "not physical, but moral" | root-india (upper) | ind-9 | gandhi1931 |
| 1944 | Nov. 1944 | Vegan Society founded; "vegan" coined | trunk-green | trk-g6 | vegansociety-history |
| 1946 | 1946 | *Autobiography of a Yogi* published | root-india (upper) | ind-8 | yogananda1946 |
| 1951 | 1951–1985 | Jack LaLanne's TV fitness show | trunk-gold | trk-y3 | smithsonian-bodybuilders |
| 1955 | 1950s–70s | Camp 4 "dirtbag" climbing culture | branch-1 | b1-4 | nunn2022 |
| 1968 | 1968 | Virginia Slims launched for women | trunk-pink | trk-p2 | stanford-virginia-slims |
| 1971 | 1971 | *Diet for a Small Planet* | trunk-green | trk-g7 | lappe1971 |
| 1975 | 1975 | Singer's *Animal Liberation* | trunk-green | trk-g8 | singer1975 |
| 1990 | 1990 | Adams's *The Sexual Politics of Meat*; Arnold heads President's fitness council | trunk-pink / trunk-gold | trk-p4, trk-y4 | adams1990, smithsonian-bodybuilders |
| 2001 | c. 2001 | Climber Steph Davis goes vegan | branch-1 | b1-5 | potts2011 |
| 2003 | 2003 | Fish nociceptors found; Davis's "least harm" paper; Camp 4 on National Register | branch-2 / branch-3 / branch-1 | b2-5, b3-9, b1-4 | sneddon2003, davis2003, nunn2022 |
| 2012 | 2012 | "Is Meat Male?"; "do-gooder derogation"; Honnold pledges 1/3 of income | trunk-red / branch-2 / branch-1 | trk-r1, b2-T3, b1-3 | rozin2012, minson2012, olano2024 |
| 2013 | 2013 | FAO: livestock ≈ 14.5% of emissions; "Real Men Don't Eat Quiche" study; Honnold stops eating meat (approx.) | trunk-green / trunk-red / branch-1 | trk-g9, trk-r2, b1-2 | gerber2013, rothgerber2013, hirsh2024 |
| 2015 | 2015 | WHO: processed meat carcinogenic; Rogan's "Eat What You Kill" | branch-1 / branch-3 | b1-9, b3-1 | paho-iarc2015, obrien2015 |
| 2016 | 2016 | Academy of Nutrition & Dietetics position on vegetarian diets | branch-1 | b1-7 | melina2016 |
| 2017 | 2017 | Honnold free-solos El Capitan (3h 56m); "soy boy" insult spreads; 86% of feed inedible study | branch-1 / trunk-red / branch-3 | b1-1, trk-r3, b3-8 | gaffney2026, hathaway2017, mottet2017 |
| 2018 | 2018 | *Free Solo* released; Poore & Nemecek study | branch-1 / branch-2 | b1-1, b2-1 | freesolo2018, poore2018 |
| 2019 | 2019 | *Game Changers* on Netflix; Beyond Meat IPO +163%; Rogan hosts Wilks vs. Kresser; stroke/heart study | trunk-green / branch-3 / branch-1 | trk-g10, b3-3, b1-9 | gamechangers2018, bloomberg-beyond2019, starostinetskaya2019, tong2019 |
| 2020 | 2020 | Rogan's carnivore month; That Vegan Teacher goes viral; Dalai Lama on NPR; fracture study; mood review | branch-3 / branch-2 | b3-2, b2-T1, b2-10, b3-6, b3-7 | bi-rogan2022, asarch2021, npr-dalai2020, tong2020, dobersek2021 |
| 2021 | 2021 | That Vegan Teacher banned from TikTok; UK recognizes crabs, lobsters, octopus as sentient; Pew India survey | branch-2 / roots | b2-T2, b2-5 | asarch2021, baker2021, pew2021 |
| 2022 | 2022 | "Meat made us human" challenged; Liver King admits steroids | taproot / trunk-gold | evo-3, trk-y5 | barr2022, hearing2022 |
| 2023 | 2023 | Stanford twin study; Gallup: 4% vegetarian, 1% vegan | branch-1 / trunk-green | b1-8, trk-g11 | landry2023, gallup2023 |
| 2024 | 2024 | New York Declaration on Animal Consciousness; masculinity & meat review | branch-2 / trunk-red | b2-5, trk-r4 | nydeclaration2024, velzeboer2024 |
| 2025 | 2025 | EAT-Lancet 2.0; 71% of Americans chasing protein | branch-2 / trunk-gold | b2-4, trk-y6 | eatlancet2025, ific2025 |
| 2026 | Jan. 2026 | Food pyramid flipped; Honnold free-solos Taipei 101 live | trunk-gold / branch-1 | trk-y7, b1-6 | fbn2026, gaffney2026 |
