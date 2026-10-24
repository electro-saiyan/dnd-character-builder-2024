// 2024 spells from dnd2024.wikidot.com's spell list (mechanics only).
// Row format: Name|School|Spell lists|Casting Time|Range|Components|Duration
//   Casting Time "… or R" = ritual; "(*)" = has a trigger. Components "M(C)" = costly, "M(C*)" = consumed.
//   Duration "C, up to …" = concentration.
// Spells not in the 2024 Player's Handbook are tagged source "Other" (see NOT_PHB) and left out of
// the default registry.

const ROWS = {
  0: `
Acid Splash|Evocation|Artificer, Sorcerer, Wizard|Action|60 feet|V, S|Instantaneous
Blade Ward|Abjuration|Bard, Sorcerer, Warlock, Wizard|Action|Self|V, S|C, up to 1 minute
Chill Touch|Necromancy|Sorcerer, Warlock, Wizard|Action|Touch|V, S|Instantaneous
Dancing Lights|Illusion|Artificer, Bard, Sorcerer, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Druidcraft|Transmutation|Druid|Action|30 feet|V, S|Instantaneous
Eldritch Blast|Evocation|Warlock|Action|120 feet|V, S|Instantaneous
Elementalism|Transmutation|Artificer, Druid, Sorcerer, Wizard|Action|30 feet|V, S|Instantaneous
Fire Bolt|Evocation|Artificer, Sorcerer, Wizard|Action|120 feet|V, S|Instantaneous
Friends|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|10 feet|S, M|C, up to 1 minute
Guidance|Divination|Artificer, Cleric, Druid|Action|Touch|V, S|C, up to 1 minute
Light|Evocation|Artificer, Bard, Cleric, Sorcerer, Wizard|Action|Touch|V, M|1 hour
Mage Hand|Conjuration|Artificer, Bard, Sorcerer, Warlock, Wizard|Action|30 feet|V, S|1 minute
Mending|Transmutation|Bard, Cleric, Druid, Sorcerer, Wizard|1 minute|Touch|V, S, M|Instantaneous
Message|Transmutation|Artificer, Bard, Druid, Sorcerer, Wizard|Action|120 feet|S, M|1 round
Mind Sliver|Enchantment|Sorcerer, Warlock, Wizard|Action|60 feet|V|1 round
Minor Illusion|Illusion|Bard, Sorcerer, Warlock, Wizard|Action|30 feet|S, M|1 minute
Poison Spray|Necromancy|Artificer, Druid, Sorcerer, Warlock, Wizard|Action|30 feet|V, S|Instantaneous
Prestidigitation|Transmutation|Artificer, Bard, Sorcerer, Warlock, Wizard|Action|10 feet|V, S|Up to 1 hour
Produce Flame|Conjuration|Druid|Bonus Action|Self|V, S|10 minutes
Ray of Frost|Evocation|Artificer, Sorcerer, Wizard|Action|60 feet|V, S|Instantaneous
Resistance|Abjuration|Artificer, Cleric, Druid|Action|Touch|V, S|C, up to 1 minute
Sacred Flame|Evocation|Cleric|Action|60 feet|V, S|Instantaneous
Shillelagh|Transmutation|Druid|Bonus Action|Self|V, S, M|1 minute
Shocking Grasp|Evocation|Artificer, Sorcerer, Wizard|Action|Touch|V, S|Instantaneous
Sorcerous Burst|Evocation|Sorcerer|Action|120 feet|V, S|Instantaneous
Spare the Dying|Necromancy|Artificer, Cleric, Druid|Action|15 feet|V, S|Instantaneous
Starry Wisp|Evocation|Bard, Druid|Action|60 feet|V, S|Instantaneous
Thaumaturgy|Transmutation|Cleric|Action|30 feet|V|Up to 1 minute
Thorn Whip|Transmutation|Artificer, Druid|Action|30 feet|V, S, M|Instantaneous
Thunderclap|Evocation|Artificer, Bard, Druid, Sorcerer, Warlock, Wizard|Action|Self|S|Instantaneous
Toll the Dead|Necromancy|Cleric, Warlock, Wizard|Action|60 feet|V, S|Instantaneous
True Strike|Divination|Artificer, Bard, Sorcerer, Warlock, Wizard|Action|Self|S, M|Instantaneous
Vicious Mockery|Enchantment|Bard|Action|60 feet|V|Instantaneous
Word of Radiance|Evocation|Cleric|Action|Self|V, M|Instantaneous`,
  1: `
Alarm|Abjuration|Artificer, Ranger, Wizard|1 minute or R|30 feet|V, S, M|8 hours
Animal Friendship|Enchantment|Bard, Druid, Ranger|Action|30 feet|V, S, M|24 hours
Armor of Agathys|Abjuration|Warlock|Bonus Action|Self|V, S, M|1 hour
Arms of Hadar|Conjuration|Warlock|Action|Self|V, S|Instantaneous
Bane|Enchantment|Bard, Cleric, Warlock|Action|30 feet|V, S, M|C, up to 1 minute
Bless|Enchantment|Cleric, Paladin|Action|30 feet|V, S, M(C)|C, up to 1 minute
Burning Hands|Evocation|Sorcerer, Wizard|Action|Self|V, S|Instantaneous
Buzzing Bee|Conjuration|Druid, Ranger, Sorcerer, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Charm Person|Enchantment|Bard, Druid, Sorcerer, Warlock, Wizard|Action|30 feet|V, S|1 hour
Chromatic Orb|Evocation|Sorcerer, Wizard|Action|90 feet|V, S, M(C)|Instantaneous
Color Spray|Illusion|Bard, Sorcerer, Wizard|Action|Self|V, S, M|Instantaneous
Command|Enchantment|Bard, Cleric, Paladin|Action|60 feet|V|Instantaneous
Compelled Duel|Enchantment|Paladin|Bonus Action|30 feet|V|C, up to 1 minute
Comprehend Languages|Divination|Bard, Sorcerer, Warlock, Wizard|Action or R|Self|V, S, M|1 hour
Create or Destroy Water|Transmutation|Cleric, Druid|Action|30 feet|V, S, M|Instantaneous
Cure Wounds|Abjuration|Artificer, Bard, Cleric, Druid, Paladin, Ranger|Action|Touch|V, S|Instantaneous
Detect Evil and Good|Divination|Cleric, Paladin|Action|Self|V, S|C, up to 10 minutes
Detect Magic|Divination|Artificer, Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard|Action or R|Self|V, S|C, up to 10 minutes
Detect Poison and Disease|Divination|Cleric, Druid, Paladin, Ranger|Action or R|Self|V, S, M|C, up to 10 minutes
Disguise Self|Illusion|Artificer, Bard, Sorcerer, Wizard|Action|Self|V, S|1 hour
Dissonant Whispers|Enchantment|Bard|Action|60 feet|V|Instantaneous
Divine Favor|Transmutation|Paladin|Bonus Action|Self|V, S|1 minute
Divine Smite|Evocation|Paladin|Bonus Action(*)|Self|V|Instantaneous
Ensnaring Strike|Conjuration|Ranger|Bonus Action(*)|Self|V|C, up to 1 minute
Entangle|Conjuration|Druid, Ranger|Action|90 feet|V, S|C, up to 1 minute
Expeditious Retreat|Transmutation|Artificer, Sorcerer, Warlock, Wizard|Bonus Action|Self|V, S|C, up to 10 minutes
Faerie Fire|Evocation|Artificer, Bard, Druid|Action|60 feet|V|C, up to 1 minute
False Life|Necromancy|Artificer, Sorcerer, Wizard|Action|Self|V, S, M|Instantaneous
Feather Fall|Transmutation|Artificer, Bard, Sorcerer, Wizard|Reaction(*)|60 feet|V, M|1 minute
Feign Interest|Illusion|Wizard|Action|Self|V|1 hour
Find Familiar|Conjuration|Wizard|1 hour or R|10 feet|V, S, M(C*)|Instantaneous
Fog Cloud|Conjuration|Druid, Ranger, Sorcerer, Wizard|Action|120 feet|V, S|C, up to 1 hour
Goodberry|Conjuration|Druid, Ranger|Action|Self|V, S, M|24 hours
Grease|Conjuration|Artificer, Sorcerer, Wizard|Action|60 feet|V, S, M|1 minute
Guiding Bolt|Evocation|Cleric|Action|120 feet|V, S|1 round
Hail of Thorns|Conjuration|Ranger|Bonus Action(*)|Self|V|Instantaneous
Healing Word|Abjuration|Bard, Cleric, Druid|Bonus Action|60 feet|V|Instantaneous
Hellish Rebuke|Evocation|Warlock|Reaction(*)|60 feet|V, S|Instantaneous
Heroism|Enchantment|Bard, Paladin|Action|Touch|V, S|C, up to 1 minute
Hex|Enchantment|Warlock|Bonus Action|90 feet|V, S, M|C, up to 1 hour
Hunter's Mark|Divination|Ranger|Bonus Action|90 feet|V|C, up to 1 hour
Ice Knife|Conjuration|Druid, Sorcerer, Wizard|Action|60 feet|S, M|Instantaneous
Identify|Divination|Artificer, Bard, Wizard|1 minute or R|Touch|V, S, M(C)|Instantaneous
Illusory Script|Illusion|Bard, Warlock, Wizard|1 minute or R|Touch|S, M(C*)|10 days
Inflict Wounds|Necromancy|Cleric|Action|Touch|V, S|Instantaneous
Insidious Rhythm|Enchantment|Bard|Action|120 feet|V, S|C, up to 1 minute
Jump|Transmutation|Artificer, Druid, Ranger, Sorcerer, Wizard|Bonus Action|Touch|V, S, M|1 minute
Longstrider|Transmutation|Artificer, Bard, Druid, Ranger, Wizard|Action|Touch|V, S, M|1 hour
Mage Armor|Abjuration|Sorcerer, Wizard|Action|Touch|V, S, M|8 hours
Magic Missile|Evocation|Sorcerer, Wizard|Action|120 feet|V, S|Instantaneous
Protection from Evil and Good|Abjuration|Cleric, Druid, Paladin, Warlock, Wizard|Action|Touch|V, S, M(C*)|C, up to 10 minutes
Purify Food and Drink|Transmutation|Artificer, Cleric, Druid, Paladin|Action or R|10 feet|V, S|Instantaneous
Quick Clothier|Transmutation|Artificer, Bard, Wizard|Action|Touch|V, S, M|24 hours
Ray of Sickness|Necromancy|Sorcerer, Wizard|Action|60 feet|V, S|Instantaneous
Sanctuary|Abjuration|Artificer, Cleric|Bonus Action|30 feet|V, S, M|1 minute
Searing Smite|Evocation|Paladin|Bonus Action(*)|Self|V|1 minute
Shield|Abjuration|Sorcerer, Wizard|Reaction(*)|Self|V, S|1 round
Shield of Faith|Abjuration|Cleric, Paladin|Bonus Action|60 feet|V, S, M|C, up to 10 minutes
Silent Image|Illusion|Bard, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 10 minutes
Sleep|Enchantment|Bard, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 1 minute
Speak with Animals|Divination|Bard, Druid, Ranger, Warlock|Action or R|Self|V, S|10 minutes
Spellfire Flare|Evocation|Sorcerer, Wizard|Action|60 feet|V, S|Instantaneous
Tasha's Hideous Laughter|Enchantment|Bard, Warlock, Wizard|Action|30 feet|V, S, M|C, up to 1 minute
Tenser's Floating Disk|Conjuration|Wizard|Action or R|30 feet|V, S, M|1 hour
Thunderous Smite|Evocation|Paladin|Bonus Action(*)|Self|V|Instantaneous
Thunderwave|Evocation|Bard, Druid, Sorcerer, Wizard|Action|Self|V, S|Instantaneous
Unseen Servant|Conjuration|Bard, Warlock, Wizard|Action or R|60 feet|V, S, M|1 hour
Wardaway|Abjuration|Bard, Cleric, Paladin, Wizard|Action|60 feet|V, S, M|Instantaneous
Witch Bolt|Evocation|Sorcerer, Warlock, Wizard|Action|60 feet|V, S, M|C, up to 1 minute
Wrathful Smite|Necromancy|Paladin|Bonus Action(*)|Self|V|1 minute`,
  2: `
Aid|Abjuration|Artificer, Bard, Cleric, Druid, Paladin, Ranger|Action|30 feet|V, S, M|8 hours
Alter Self|Transmutation|Artificer, Sorcerer, Wizard|Action|Self|V, S|C, up to 1 hour
Animal Messenger|Enchantment|Bard, Druid, Ranger|Action or R|30 feet|V, S, M|24 hours
Arcane Lock|Abjuration|Artificer, Wizard|Action|Touch|V, S, M(C*)|Until dispelled
Arcane Vigor|Abjuration|Artificer, Sorcerer, Wizard|Bonus Action|Self|V, S|Instantaneous
Augury|Divination|Cleric, Druid, Wizard|1 minute or R|Self|V, S, M(C)|Instantaneous
Barkskin|Transmutation|Druid, Ranger|Bonus Action|Touch|V, S, M|1 hour
Battle Familiar|Conjuration|Druid, Warlock, Wizard|Action|10 feet|V, S, M(C)|1 hour
Beast Sense|Divination|Druid, Ranger|Action or R|Touch|S|C, up to 1 hour
Blindness/Deafness|Transmutation|Bard, Cleric, Sorcerer, Wizard|Action|120 feet|V|1 minute
Blur|Illusion|Artificer, Sorcerer, Wizard|Action|Self|V|C, up to 1 minute
Calm Emotions|Enchantment|Bard, Cleric|Action|60 feet|V, S|C, up to 1 minute
Cloud of Daggers|Conjuration|Bard, Sorcerer, Warlock, Wizard|Action|60 feet|V, S, M|C, up to 1 minute
Conjure Tools|Conjuration|Artificer, Bard, Ranger, Wizard|Action|30 feet|V, S|8 hours
Continual Flame|Evocation|Artificer, Cleric, Druid, Wizard|Action|Touch|V, S, M(C*)|Until dispelled
Cordon of Arrows|Transmutation|Ranger|Action|Touch|V, S, M|8 hours
Crown of Madness|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|120 feet|V, S|C, up to 1 minute
Darkness|Evocation|Sorcerer, Warlock, Wizard|Action|60 feet|V, M|C, up to 10 minutes
Darkvision|Transmutation|Artificer, Druid, Ranger, Sorcerer, Wizard|Action|Touch|V, S, M|8 hours
Death Armor|Necromancy|Sorcerer, Wizard|Action|Touch|V, S, M(C*)|1 hour
Deryan's Helpful Homunculi|Conjuration|Cleric, Wizard|Action or R|Self|V, S, M(C*)|8 hours
Detect Thoughts|Divination|Bard, Sorcerer, Wizard|Action|Self|V, S, M|C, up to 1 minute
Disruptive Tune|Abjuration|Bard, Sorcerer, Wizard|Action|120 feet|V, S|C, up to 1 minute
Dragon's Breath|Transmutation|Artificer, Sorcerer, Wizard|Bonus Action|Touch|V, S, M|C, up to 1 minute
Dueling Ground|Abjuration|Artificer, Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard|10 minutes or R|Touch|V, S, M(C)|1 hour
Elminster's Elusion|Abjuration|Wizard|Bonus Action|Self|V, S|C, up to 10 minutes
Enhance Ability|Transmutation|Artificer, Bard, Cleric, Druid, Ranger, Sorcerer, Wizard|Action|Touch|V, S, M|C, up to 1 hour
Enlarge/Reduce|Transmutation|Artificer, Bard, Druid, Sorcerer, Wizard|Action|30 feet|V, S, M|C, up to 1 minute
Enthrall|Enchantment|Bard, Warlock|Action|60 feet|V, S|C, up to 1 minute
Find Steed|Conjuration|Paladin|Action|30 feet|V, S|Instantaneous
Find Traps|Divination|Cleric, Druid, Ranger|Action|120 feet|V, S|Instantaneous
Flame Blade|Evocation|Druid, Sorcerer|Bonus Action|Self|V, S, M|C, up to 10 minutes
Flaming Sphere|Conjuration|Druid, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 1 minute
Gentle Repose|Necromancy|Cleric, Paladin, Wizard|Action or R|Touch|V, S, M(C)|10 days
Gust of Wind|Evocation|Druid, Ranger, Sorcerer, Wizard|Action|Self|V, S, M|C, up to 1 minute
Heat Metal|Transmutation|Artificer, Bard, Druid|Action|60 feet|V, S, M|C, up to 1 minute
Hold Person|Enchantment|Bard, Cleric, Druid, Sorcerer, Warlock, Wizard|Action|60 feet|V, S, M|C, up to 1 minute
Homunculus Servant|Conjuration|Artificer|1 hour or R|10 feet|V, S, M(C)|Instantaneous
Invisibility|Illusion|Artificer, Bard, Sorcerer, Warlock, Wizard|Action|Touch|V, S, M|C, up to 1 hour
Knock|Transmutation|Bard, Sorcerer, Wizard|Action|60 feet|V|Instantaneous
Lesser Restoration|Abjuration|Artificer, Bard, Cleric, Druid, Paladin, Ranger|Bonus Action|Touch|V, S|Instantaneous
Levitate|Transmutation|Artificer, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 10 minutes
Locate Animals or Plants|Divination|Bard, Druid, Ranger|Action or R|Self|V, S, M|Instantaneous
Locate Object|Divination|Bard, Cleric, Druid, Paladin, Ranger, Wizard|Action|Self|V, S, M|C, up to 10 minutes
Magic Mouth|Illusion|Artificer, Bard, Wizard|1 minute or R|30 feet|V, S, M(C*)|Until dispelled
Magic Weapon|Transmutation|Artificer, Paladin, Ranger, Sorcerer, Wizard|Bonus Action|Touch|V, S|1 hour
Melf's Acid Arrow|Evocation|Wizard|Action|90 feet|V, S, M|Instantaneous
Mind Spike|Divination|Sorcerer, Warlock, Wizard|Action|120 feet|S|C, up to 1 hour
Mirror Image|Illusion|Bard, Sorcerer, Warlock, Wizard|Action|Self|V, S|1 minute
Misty Step|Conjuration|Sorcerer, Warlock, Wizard|Bonus Action|Self|V|Instantaneous
Moonbeam|Evocation|Druid|Action|120 feet|V, S, M|C, up to 1 minute
Nystul's Magic Aura|Illusion|Wizard|Action|Touch|V, S, M|24 hours
Pass without Trace|Abjuration|Druid, Ranger|Action|Self|V, S, M|C, up to 1 hour
Phantasmal Force|Illusion|Bard, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 1 minute
Pinky Swear|Abjuration|Bard, Paladin, Wizard|Action|Touch|V, S|24 hours
Prayer of Healing|Abjuration|Cleric, Paladin|10 minutes|30 feet|V|Instantaneous
Protection from Poison|Abjuration|Artificer, Cleric, Druid, Paladin, Ranger|Action|Touch|V, S|1 hour
Ray of Enfeeblement|Necromancy|Warlock, Wizard|Action|60 feet|V, S|C, up to 1 minute
Rope Trick|Transmutation|Artificer, Wizard|Action|Touch|V, S, M|1 hour
Scorching Ray|Evocation|Sorcerer, Wizard|Action|120 feet|V, S|Instantaneous
Searing Orb|Evocation|Cleric, Paladin|Action|60 feet|S, M|Instantaneous
See Invisibility|Divination|Artificer, Bard, Sorcerer, Wizard|Action|Self|V, S, M|1 hour
Shatter|Evocation|Bard, Sorcerer, Wizard|Action|60 feet|V, S, M|Instantaneous
Shining Smite|Transmutation|Paladin|Bonus Action(*)|Self|V|C, up to 1 minute
Silence|Illusion|Bard, Cleric, Ranger|Action or R|120 feet|V, S|C, up to 10 minutes
Spider Climb|Transmutation|Artificer, Sorcerer, Warlock, Wizard|Action|Touch|V, S, M|C, up to 1 hour
Spike Growth|Transmutation|Druid, Ranger|Action|150 feet|V, S, M|C, up to 10 minutes
Spiritual Weapon|Evocation|Cleric|Bonus Action|60 feet|V, S|C, up to 1 minute
Suggestion|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|30 feet|V, M|C, up to 8 hours
Summon Beast|Conjuration|Druid, Ranger|Action|90 feet|V, S, M(C)|C, up to 1 hour
Tortoise Shell|Abjuration|Artificer, Druid, Ranger|Action|Touch|V, S|C, up to 1 minute
Uncertain Footing|Illusion|Artificer, Bard, Warlock, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Warding Bond|Abjuration|Cleric, Paladin|Action|Touch|V, S, M(C)|1 hour
Web|Conjuration|Artificer, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 1 hour
Wither and Bloom|Necromancy|Druid, Sorcerer, Wizard|Action|60 feet|V, S, M|Instantaneous
Zone of Truth|Enchantment|Bard, Cleric, Paladin|Action|60 feet|V, S|10 minutes`,
  3: `
Animate Dead|Necromancy|Cleric, Wizard|1 minute|10 feet|V, S, M|Instantaneous
Astral Flood|Evocation|Bard, Cleric, Sorcerer, Warlock, Wizard|Action|Self|V, S, M|Instantaneous
Aura of Vitality|Abjuration|Cleric, Druid, Paladin|Action|Self|V|C, up to 1 minute
Beacon of Hope|Abjuration|Cleric|Action|30 feet|V, S|C, up to 1 minute
Bestow Curse|Necromancy|Bard, Cleric, Wizard|Action|Touch|V, S|C, up to 1 minute
Blinding Smite|Evocation|Paladin|Bonus Action|Self|V|1 minute
Blink|Transmutation|Artificer, Sorcerer, Wizard|Action|Self|V, S|1 minute
Cacophonic Shield|Evocation|Bard, Sorcerer, Wizard|Action|Self|V, S|C, up to 10 minutes
Call Lightning|Conjuration|Druid|Action|120 feet|V, S|C, up to 10 minutes
Catnap|Enchantment|Artificer, Bard, Sorcerer, Wizard|Action|30 feet|S, M|10 minutes
Clairvoyance|Divination|Bard, Cleric, Sorcerer, Wizard|10 minutes|1 mile|V, S, M(C)|C, up to 10 minutes
Conjure Animals|Conjuration|Druid, Ranger|Action|60 feet|V, S|C, up to 10 minutes
Conjure Barrage|Conjuration|Ranger|Action|Self|V, S, M(C)|Instantaneous
Conjure Constructs|Conjuration|Wizard|Action|60 feet|V, S, M|C, up to 10 minutes
Counterspell|Abjuration|Sorcerer, Warlock, Wizard|Reaction(*)|60 feet|S|Instantaneous
Create Food and Water|Conjuration|Artificer, Cleric, Paladin|Action|30 feet|V, S|Instantaneous
Crusader's Mantle|Evocation|Paladin|Action|Self|V|C, up to 1 minute
Daylight|Evocation|Cleric, Druid, Paladin, Ranger, Sorcerer|Action|60 feet|V, S|1 hour
Dispel Magic|Abjuration|Artificer, Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard|Action|120 feet|V, S|Instantaneous
Elemental Weapon|Transmutation|Artificer, Druid, Paladin, Ranger|Action|Touch|V, S|C, up to 1 hour
Fear|Illusion|Bard, Sorcerer, Warlock, Wizard|Action|Self|V, S, M|C, up to 1 minute
Feign Death|Necromancy|Bard, Cleric, Druid, Wizard|Action or R|Touch|V, S, M|1 hour
Fireball|Evocation|Sorcerer, Wizard|Action|150 feet|V, S, M|Instantaneous
Fly|Transmutation|Artificer, Sorcerer, Warlock, Wizard|Action|Touch|V, S, M|C, up to 10 minutes
Gaseous Form|Transmutation|Sorcerer, Warlock, Wizard|Action|Touch|V, S, M|C, up to 1 hour
Glyph of Warding|Abjuration|Artificer, Bard, Cleric, Wizard|1 hour|Touch|V, S, M(C*)|Until dispelled or triggered
Haste|Transmutation|Artificer, Sorcerer, Wizard|Action|30 feet|V, S, M|C, up to 1 minute
Hunger of Hadar|Conjuration|Warlock|Action|150 feet|V, S, M|C, up to 1 minute
Hypnotic Pattern|Illusion|Bard, Sorcerer, Warlock, Wizard|Action|120 feet|S, M|C, up to 1 minute
Inflict Doubt|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|120 feet|V, S|C, up to 1 minute
Laeral's Silver Lance|Evocation|Cleric, Sorcerer, Wizard|Action|Self|V, S, M(C)|Instantaneous
Leomund's Tiny Hut|Evocation|Bard, Wizard|1 minute or R|Self|V, S, M|8 hours
Lightning Arrow|Transmutation|Ranger|Bonus Action(*)|Self|V, S|Instantaneous
Lightning Bolt|Evocation|Sorcerer, Wizard|Action|Self|V, S, M|Instantaneous
Magic Circle|Abjuration|Cleric, Paladin, Warlock, Wizard|1 minute|10 feet|V, S, M(C*)|1 hour
Major Image|Illusion|Bard, Sorcerer, Warlock, Wizard|Action|120 feet|V, S, M|C, up to 10 minutes
Mass Healing Word|Abjuration|Bard, Cleric|Bonus Action|60 feet|V|Instantaneous
Meld into Stone|Transmutation|Cleric, Druid, Ranger|Action or R|Touch|V, S|8 hours
Nondetection|Abjuration|Bard, Ranger, Wizard|Action|Touch|V, S, M(C*)|8 hours
Phantom Steed|Illusion|Wizard|1 minute or R|30 feet|V, S|1 hour
Plant Growth|Transmutation|Bard, Druid, Ranger|Action (Overgrowth) or 8 hours (Enrichment)|150 feet|V, S|Instantaneous
Protection from Energy|Abjuration|Artificer, Cleric, Druid, Ranger, Sorcerer, Wizard|Action|Touch|V, S|C, up to 1 hour
Remove Curse|Abjuration|Cleric, Paladin, Warlock, Wizard|Action|Touch|V, S|Instantaneous
Revivify|Necromancy|Artificer, Cleric, Druid, Paladin, Ranger|Action|Touch|V, S, M(C*)|Instantaneous
Sending|Divination|Bard, Cleric, Wizard|Action|Unlimited|V, S, M|Instantaneous
Sleet Storm|Conjuration|Druid, Sorcerer, Wizard|Action|150 feet|V, S, M|C, up to 1 minute
Slow|Transmutation|Bard, Sorcerer, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Speak with Dead|Necromancy|Bard, Cleric, Wizard|Action|10 feet|V, S, M|10 minutes
Speak with Plants|Transmutation|Bard, Druid, Ranger|Action|Self|V, S|10 minutes
Spirit Guardians|Conjuration|Cleric|Action|Self|V, S, M|C, up to 10 minutes
Stinking Cloud|Conjuration|Bard, Sorcerer, Wizard|Action|90 feet|V, S, M|C, up to 1 minute
Summon Fey|Conjuration|Druid, Ranger, Warlock, Wizard|Action|90 feet|V, S, M(C)|C, up to 1 hour
Summon Undead|Necromancy|Warlock, Wizard|Action|90 feet|V, S, M(C)|C, up to 1 hour
Sylune's Viper|Conjuration|Druid, Wizard|Bonus Action|Self|V, S, M|1 hour
Tongues|Divination|Bard, Cleric, Sorcerer, Warlock, Wizard|Action|Touch|V, M|1 hour
Vampiric Touch|Necromancy|Sorcerer, Warlock, Wizard|Action|Self|V, S|C, up to 1 minute
Water Breathing|Transmutation|Artificer, Druid, Ranger, Sorcerer, Wizard|Action or R|30 feet|V, S, M|24 hours
Water Walk|Transmutation|Artificer, Cleric, Druid, Ranger, Sorcerer|Action or R|30 feet|V, S, M|1 hour
Wind Wall|Evocation|Druid, Ranger|Action|120 feet|V, S, M|C, up to 1 minute`,
  4: `
Arcane Eye|Divination|Artificer, Wizard|Action|30 feet|V, S, M|C, up to 1 hour
Aura of Life|Abjuration|Cleric, Paladin|Action|Self|V|C, up to 10 minutes
Aura of Purity|Abjuration|Cleric, Paladin|Action|Self|V|C, up to 10 minutes
Backlash|Abjuration|Bard, Sorcerer, Warlock, Wizard|Reaction|60 feet|V|Instantaneous
Banishment|Abjuration|Cleric, Paladin, Sorcerer, Warlock, Wizard|Action|30 feet|V, S, M|C, up to 1 minute
Blight|Necromancy|Druid, Sorcerer, Warlock, Wizard|Action|30 feet|V, S|Instantaneous
Charm Monster|Enchantment|Bard, Druid, Sorcerer, Warlock, Wizard|Action|30 feet|V, S|1 hour
Compulsion|Enchantment|Bard|Action|30 feet|V, S|C, up to 1 minute
Confusion|Enchantment|Bard, Druid, Sorcerer, Wizard|Action|90 feet|V, S, M|C, up to 1 minute
Conjure Minor Elementals|Conjuration|Druid, Wizard|Action|Self|V, S|C, up to 10 minutes
Conjure Woodland Beings|Conjuration|Druid, Ranger|Action|Self|V, S|C, up to 10 minutes
Control Water|Transmutation|Cleric, Druid, Wizard|Action|300 feet|V, S, M|C, up to 10 minutes
Death Ward|Abjuration|Cleric, Paladin|Action|Touch|V, S|8 hours
Dimension Door|Conjuration|Bard, Sorcerer, Warlock, Wizard|Action|500 feet|V|Instantaneous
Distorted Distance|Illusion|Artificer, Bard, Warlock, Wizard|Action|120 feet|V, S|C, up to 10 minutes
Divination|Divination|Cleric, Druid, Wizard|Action or R|Self|V, S, M(C*)|Instantaneous
Dominate Beast|Enchantment|Druid, Ranger, Sorcerer|Action|60 feet|V, S|C, up to 1 minute
Doomtide|Conjuration|Bard, Cleric, Warlock|Action|120 feet|V, S, M|C, up to 1 minute
Evard's Black Tentacles|Conjuration|Wizard|Action|90 feet|V, S, M|C, up to 1 minute
Fabricate|Transmutation|Artificer, Wizard|10 minutes|120 feet|V, S|Instantaneous
Festering Blast|Necromancy|Druid, Sorcerer, Warlock, Wizard|Action|Self|V, S|1 minute
Fire Shield|Evocation|Druid, Sorcerer, Wizard|Action|Self|V, S, M|10 minutes
Fount of Moonlight|Evocation|Bard, Druid|Action|Self|V, S|C, up to 10 minutes
Freedom of Movement|Abjuration|Artificer, Bard, Cleric, Druid, Ranger|Action|Touch|V, S, M|1 hour
Giant Insect|Conjuration|Druid|Action|60 feet|V, S|C, up to 10 minutes
Grasping Vine|Conjuration|Druid, Ranger|Bonus Action|60 feet|V, S|C, up to 1 minute
Greater Invisibility|Illusion|Bard, Sorcerer, Wizard|Action|Touch|V, S|C, up to 1 minute
Guardian of Faith|Conjuration|Cleric|Action|30 feet|V|8 hours
Hallucinatory Terrain|Illusion|Bard, Druid, Warlock, Wizard|10 minutes|300 feet|V, S, M|24 hours
Ice Storm|Evocation|Druid, Sorcerer, Wizard|Action|300 feet|V, S, M|Instantaneous
Leomund's Secret Chest|Conjuration|Artificer, Wizard|Action|Touch|V, S, M(C)|Until dispelled
Locate Creature|Divination|Bard, Cleric, Druid, Paladin, Ranger, Wizard|Action|Self|V, S, M|C, up to 1 hour
Mordenkainen's Faithful Hound|Conjuration|Artificer, Wizard|Action|30 feet|V, S, M|8 hours
Mordenkainen's Private Sanctum|Abjuration|Artificer, Wizard|10 minutes|120 feet|V, S, M|24 hours
Otiluke's Resilient Sphere|Abjuration|Artificer, Wizard|Action|30 feet|V, S, M|C, up to 1 minute
Phantasmal Killer|Illusion|Bard, Wizard|Action|120 feet|V, S|C, up to 1 minute
Polymorph|Transmutation|Bard, Druid, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 1 hour
Spellfire Storm|Evocation|Sorcerer, Wizard|Action|60 feet|V, S|C, up to 1 minute
Staggering Smite|Enchantment|Paladin|Bonus Action(*)|Self|V|Instantaneous
Sticks to Snakes|Transmutation|Cleric, Druid, Ranger|Action|90 feet|V, S, M|C, up to 1 minute
Stone Shape|Transmutation|Artificer, Cleric, Druid, Wizard|Action|Touch|V, S, M|Instantaneous
Stoneskin|Transmutation|Artificer, Druid, Ranger, Sorcerer, Wizard|Action|Touch|V, S, M(C*)|C, up to 1 hour
Summon Aberration|Conjuration|Warlock, Wizard|Action|90 feet|V, S, M(C)|C, up to 1 hour
Summon Construct|Conjuration|Artificer, Wizard|Action|90 feet|V, S, M(C)|C, up to 1 hour
Summon Elemental|Conjuration|Druid, Ranger, Wizard|Action|90 feet|V, S, M(C)|C, up to 1 hour
Vitriolic Sphere|Evocation|Sorcerer, Wizard|Action|150 feet|V, S, M|Instantaneous
Wall of Fire|Evocation|Druid, Sorcerer, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Zone of Amicability|Enchantment|Bard, Warlock|Action|Self|V, S|10 minutes`,
  5: `
Alustriel's Mooncloak|Abjuration|Bard, Druid, Ranger, Wizard|Action|Self|V, S, M(C)|C, up to 1 minute
Animate Objects|Transmutation|Artificer, Bard, Sorcerer, Wizard|Action|120 feet|V, S|C, up to 1 minute
Antilife Shell|Abjuration|Druid|Action|Self|V, S|C, up to 1 hour
Awaken|Transmutation|Bard, Druid|8 hours|Touch|V, S, M(C*)|Instantaneous
Banishing Smite|Conjuration|Paladin|Bonus Action|Self|V|C, up to 1 minute
Bigby's Hand|Evocation|Artificer, Sorcerer, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Circle of Power|Abjuration|Artificer, Cleric, Paladin, Wizard|Action|Self|V|C, up to 10 minutes
Cloudkill|Conjuration|Sorcerer, Wizard|Action|120 feet|V, S|C, up to 10 minutes
Commune|Divination|Cleric|1 minute or R|Self|V, S, M|1 minute
Commune with Nature|Divination|Druid, Ranger|1 minute or R|Self|V, S|Instantaneous
Cone of Cold|Evocation|Druid, Sorcerer, Wizard|Action|Self|V, S, M|Instantaneous
Conjure Elemental|Conjuration|Druid, Wizard|Action|60 feet|V, S|C, up to 10 minutes
Conjure Volley|Conjuration|Ranger|Action|150 feet|V, S, M|Instantaneous
Contact Other Plane|Divination|Warlock, Wizard|1 minute or R|Self|V|1 minute
Contagion|Necromancy|Cleric, Druid|Action|Touch|V, S|7 days
Creation|Illusion|Artificer, Sorcerer, Wizard|1 minute|30 feet|V, S, M|Special
Destructive Wave|Evocation|Paladin|Action|Self|V|Instantaneous
Dispel Evil and Good|Abjuration|Cleric, Paladin|Action|Self|V, S, M|C, up to 1 minute
Dominate Person|Enchantment|Bard, Sorcerer, Wizard|Action|60 feet|V, S|C, up to 1 minute
Dream|Illusion|Bard, Warlock, Wizard|1 minute|Special|V, S, M|8 hours
Enervation|Necromancy|Sorcerer, Warlock, Wizard|Action|60 feet|V, S|C, up to 1 minute
Flame Strike|Evocation|Cleric|Action|60 feet|V, S, M|Instantaneous
Geas|Enchantment|Bard, Cleric, Druid, Paladin, Wizard|1 minute|60 feet|V|30 days
Grave Ground|Necromancy|Cleric, Warlock, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Greater Restoration|Abjuration|Artificer, Bard, Cleric, Druid, Paladin, Ranger|Action|Touch|V, S, M(C*)|Instantaneous
Hallow|Abjuration|Cleric|24 hours|Touch|V, S, M(C*)|Until dispelled
Hold Monster|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|90 feet|V, S, M|C, up to 1 minute
Insect Plague|Conjuration|Cleric, Druid, Sorcerer|Action|300 feet|V, S, M|C, up to 10 minutes
Jallarzi's Storm of Radiance|Evocation|Warlock, Wizard|Action|120 feet|V, S, M|C, up to 1 minute
Legend Lore|Divination|Bard, Cleric, Wizard|10 minutes|Self|V, S, M(C*)|Instantaneous
Mass Cure Wounds|Abjuration|Bard, Cleric, Druid|Action|60 feet|V, S|Instantaneous
Mislead|Illusion|Bard, Warlock, Wizard|Action|Self|S|C, up to 1 hour
Modify Memory|Enchantment|Bard, Wizard|Action|30 feet|V, S|C, up to 1 minute
Mordenkainen's Lucubration|Divination|Wizard|Action|Self|V, S|Instantaneous
Negative Energy Flood|Necromancy|Warlock, Wizard|Action|60 feet|V, M|Instantaneous
Passwall|Transmutation|Wizard|Action|30 feet|V, S, M|1 hour
Planar Binding|Abjuration|Bard, Cleric, Druid, Warlock, Wizard|1 hour|60 feet|V, S, M(C*)|24 hours
Raise Dead|Necromancy|Bard, Cleric, Paladin|1 hour|Touch|V, S, M(C*)|Instantaneous
Rary's Telepathic Bond|Divination|Bard, Wizard|Action or R|30 feet|V, S, M|1 hour
Reincarnate|Necromancy|Druid|1 hour|Touch|V, S, M(C*)|Instantaneous
Scrying|Divination|Bard, Cleric, Druid, Warlock, Wizard|10 minutes|Self|V, S, M(C)|C, up to 10 minutes
Seeming|Illusion|Bard, Sorcerer, Wizard|Action|30 feet|V, S|8 hours
Songal's Elemental Suffusion|Transmutation|Druid, Sorcerer, Wizard|Action|Self|V, S, M(C)|C, up to 1 minute
Spirit Lantern|Necromancy|Artificer, Cleric, Warlock, Wizard|Action|Self|V, S, M|10 minutes
Steel Wind Strike|Conjuration|Ranger, Wizard|Action|30 feet|S, M|Instantaneous
Summon Celestial|Conjuration|Cleric, Paladin|Action|90 feet|V, S, M(C)|C, up to 1 hour
Summon Dragon|Conjuration|Wizard|Action|60 feet|V, S, M(C)|C, up to 1 hour
Summon Plant|Conjuration|Druid, Ranger|Action|90 feet|V, S, M(C)|C, up to 1 hour
Swift Quiver|Transmutation|Ranger|Bonus Action|Self|V, S, M|C, up to 1 minute
Synaptic Static|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|120 feet|V, S|Instantaneous
Telekinesis|Transmutation|Sorcerer, Wizard|Action|60 feet|V, S|C, up to 10 minutes
Teleportation Circle|Conjuration|Bard, Sorcerer, Warlock, Wizard|1 minute|10 feet|V, M(C*)|1 round
Tree Stride|Conjuration|Druid, Ranger|Action|Self|V, S|C, up to 1 minute
Wall of Force|Evocation|Wizard|Action|120 feet|V, S, M|C, up to 10 minutes
Wall of Stone|Evocation|Artificer, Druid, Sorcerer, Wizard|Action|120 feet|V, S, M|C, up to 10 minutes
Waves of Exhaustion|Necromancy|Sorcerer, Warlock, Wizard|Bonus Action|Self|V, S, M|C, up to 1 minute
Yolande's Regal Presence|Enchantment|Bard, Wizard|Action|Self|V, S, M|C, up to 1 minute`,
  6: `
Arcane Gate|Conjuration|Sorcerer, Warlock, Wizard|Action|500 feet|V, S|C, up to 10 minutes
Blade Barrier|Evocation|Cleric|Action|90 feet|V, S|C, up to 10 minutes
Chain Lightning|Evocation|Sorcerer, Wizard|Action|150 feet|V, S, M|Instantaneous
Circle of Death|Necromancy|Sorcerer, Warlock, Wizard|Action|150 feet|V, S, M(C)|Instantaneous
Conjure Fey|Conjuration|Druid|Action|60 feet|V, S|C, up to 10 minutes
Contingency|Abjuration|Wizard|10 minutes|Self|V, S, M(C)|10 days
Create Undead|Necromancy|Cleric, Warlock, Wizard|1 minute|10 feet|V, S, M(C)|Instantaneous
Dirge|Enchantment|Bard, Cleric|Action|Self|V|C, up to 1 minute
Disintegrate|Transmutation|Sorcerer, Wizard|Action|60 feet|V, S, M|Instantaneous
Drawmij's Instant Summons|Conjuration|Wizard|1 minute or R|Touch|V, S, M(C)|Until dispelled
Elminster's Effulgent Spheres|Evocation|Druid, Sorcerer, Wizard|Action|Self|V, S, M(C)|1 hour
Eyebite|Necromancy|Bard, Sorcerer, Warlock, Wizard|Action|Self|V, S|C, up to 1 minute
Find the Path|Divination|Bard, Cleric, Druid|1 minute|Self|V, S, M(C*)|C, up to 1 day
Flesh to Stone|Transmutation|Druid, Sorcerer, Wizard|Action|60 feet|V, S, M|C, up to 1 minute
Forbiddance|Abjuration|Cleric|10 minutes or R|Touch|V, S, M(C)|1 day
Globe of Invulnerability|Abjuration|Sorcerer, Wizard|Action|Self|V, S, M|C, up to 1 minute
Guards and Wards|Abjuration|Bard, Wizard|1 hour|Touch|V, S, M|24 hours
Harm|Necromancy|Cleric|Action|60 feet|V, S|Instantaneous
Heal|Abjuration|Cleric, Druid|Action|60 feet|V, S|Instantaneous
Heroes' Feast|Conjuration|Bard, Cleric, Druid|10 minutes|Self|V, S, M(C*)|Instantaneous
Leomund's Lamentable Belaborment|Enchantment|Bard, Sorcerer, Wizard|Action|30 feet|V|1 minute
Magic Jar|Necromancy|Wizard|1 minute|Self|V, S, M(C)|Until dispelled
Mass Suggestion|Enchantment|Bard, Sorcerer, Wizard|Action|60 feet|V, M|24 hours
Move Earth|Transmutation|Druid, Sorcerer, Wizard|Action|120 feet|V, S, M|C, up to 2 hours
Otiluke's Freezing Sphere|Evocation|Sorcerer, Wizard|Action|300 feet|V, S, M|Instantaneous
Otto's Irresistible Dance|Enchantment|Bard, Wizard|Action|30 feet|V|C, up to 1 minute
Planar Ally|Conjuration|Cleric|10 minutes|60 feet|V, S|Instantaneous
Programmed Illusion|Illusion|Bard, Wizard|Action|120 feet|V, S, M|Until dispelled
Summon Dinosaur|Conjuration|Druid|Action|90 feet|V, S, M(C)|C, up to 1 hour
Summon Fiend|Conjuration|Warlock, Wizard|Action|90 feet|V, S, M(C)|C, up to 1 hour
Sunbeam|Evocation|Cleric, Druid, Sorcerer, Wizard|Action|Self|V, S, M|C, up to 1 minute
Tasha's Bubbling Cauldron|Conjuration|Warlock, Wizard|Action|5 feet|V, S, M(C)|10 minutes
Transport via Plants|Conjuration|Druid|Action|10 feet|V, S|1 minute
True Seeing|Divination|Bard, Cleric, Sorcerer, Warlock, Wizard|Action|Touch|V, S, M(C*)|1 hour
Wall of Ice|Evocation|Wizard|Action|120 feet|V, S, M|C, up to 10 minutes
Wall of Thorns|Conjuration|Druid|Action|120 feet|V, S, M|C, up to 10 minutes
Wind Walk|Transmutation|Druid|1 minute|30 feet|V, S, M|8 hours
Word of Recall|Conjuration|Cleric|Action|5 feet|V|Instantaneous`,
  7: `
Aura of Evasion|Abjuration|Sorcerer, Warlock, Wizard|Action|Self|V, S|C, up to 1 minute
Conjure Celestial|Conjuration|Cleric|Action|90 feet|V, S|C, up to 10 minutes
Delayed Blast Fireball|Evocation|Sorcerer, Wizard|Action|150 feet|V, S, M|C, up to 1 minute
Divine Word|Evocation|Cleric|Bonus Action|30 feet|V|Instantaneous
Etherealness|Conjuration|Bard, Cleric, Sorcerer, Warlock, Wizard|Action|Self|V, S|Up to 8 hours
Finger of Death|Necromancy|Sorcerer, Warlock, Wizard|Action|60 feet|V, S|Instantaneous
Fire Storm|Evocation|Cleric, Druid, Sorcerer|Action|150 feet|V, S|Instantaneous
Forcecage|Evocation|Bard, Warlock, Wizard|Action|100 feet|V, S, M(C*)|C, up to 1 hour
Fractured Awareness|Divination|Bard, Sorcerer, Warlock, Wizard|Action|120 feet|V, S|C, up to 1 minute
Mirage Arcane|Illusion|Bard, Druid, Wizard|10 minutes|Sight|V, S|10 days
Mordenkainen's Magnificent Mansion|Conjuration|Bard, Wizard|1 minute|300 feet|V, S, M|24 hours
Mordenkainen's Sword|Evocation|Bard, Wizard|Action|90 feet|V, S, M(C)|C, up to 1 minute
Plane Shift|Conjuration|Cleric, Druid, Sorcerer, Warlock, Wizard|Action|Touch|V, S, M(C)|Instantaneous
Power Word Fortify|Enchantment|Bard, Cleric|Action|60 feet|V|Instantaneous
Power Word Pain|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|60 feet|V|1 minute
Prismatic Spray|Evocation|Bard, Sorcerer, Wizard|Action|Self|V, S|Instantaneous
Project Image|Illusion|Bard, Wizard|Action|500 miles|V, S, M|C, up to 1 day
Regenerate|Transmutation|Bard, Cleric, Druid|1 minute|Touch|V, S, M|1 hour
Resurrection|Necromancy|Bard, Cleric|1 hour|Touch|V, S, M(C*)|Instantaneous
Reverse Gravity|Transmutation|Druid, Sorcerer, Wizard|Action|100 feet|V, S, M|C, up to 1 minute
Reweave Fate|Divination|Bard, Cleric, Warlock, Wizard|Reaction|60 feet|S|Instantaneous
Sequester|Transmutation|Wizard|Action|Touch|V, S, M(C*)|Until dispelled
Simbul's Synostodweomer|Transmutation|Sorcerer, Wizard|Action|Touch|V, S|1 hour
Simulacrum|Illusion|Wizard|12 hours|Touch|V, S, M(C*)|Until dispelled
Symbol|Abjuration|Bard, Cleric, Druid, Wizard|1 minute|Touch|V, S, M(C*)|Until dispelled or triggered
Teleport|Conjuration|Bard, Sorcerer, Wizard|Action|10 feet|V|Instantaneous
Transfix|Enchantment|Bard, Warlock, Wizard|Action|Self|V, S|C, up to 1 minute
Void Star|Necromancy|Warlock, Wizard|Action|120 feet|V, S, M|Instantaneous`,
  8: `
Animal Shapes|Transmutation|Druid|Action|30 feet|V, S|24 hours
Antimagic Field|Abjuration|Cleric, Wizard|Action|Self|V, S, M|C, up to 1 hour
Antipathy/Sympathy|Enchantment|Bard, Druid, Wizard|1 hour|60 feet|V, S, M|10 days
Befuddlement|Enchantment|Bard, Druid, Warlock, Wizard|Action|150 feet|V, S, M|Instantaneous
Clone|Necromancy|Wizard|1 hour|Touch|V, S, M(C*)|Instantaneous
Control Weather|Transmutation|Cleric, Druid, Wizard|10 minutes|Self|V, S, M|C, up to 8 hours
Demiplane|Conjuration|Sorcerer, Warlock, Wizard|Action|60 feet|S|1 hour
Dominate Monster|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|60 feet|V, S|C, up to 1 hour
Earthquake|Transmutation|Cleric, Druid, Sorcerer|Action|500 feet|V, S, M|C, up to 1 minute
Entrancing Mirrors|Illusion|Bard, Sorcerer, Warlock, Wizard|Action|90 feet|V, S, M|C, up to 1 minute
Glibness|Enchantment|Bard, Warlock|Action|Self|V|1 hour
Holy Aura|Abjuration|Cleric|Action|Self|V, S, M(C)|C, up to 1 minute
Holy Star of Mystra|Evocation|Cleric, Wizard|Bonus Action|Self|V, S|C, up to 1 minute
Illusory Dragon|Illusion|Wizard|Action|120 feet|S|C, up to 1 minute
Incendiary Cloud|Conjuration|Druid, Sorcerer, Wizard|Action|150 feet|V, S|C, up to 1 minute
Iron Body|Transmutation|Sorcerer, Warlock, Wizard|Action|Touch|V, S, M(C*)|C, up to 1 hour
Lightning Ring|Evocation|Druid, Sorcerer, Warlock, Wizard|Bonus Action|Self|V, S, M|C, up to 10 minutes
Maze|Conjuration|Wizard|Action|60 feet|V, S|C, up to 10 minutes
Mind Blank|Abjuration|Bard, Wizard|Action|Touch|V, S|24 hours
Moment of Prescience|Divination|Wizard|Reaction|Self|V, S|Instantaneous
Power Word Stun|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|60 feet|V|Instantaneous
Sunburst|Evocation|Cleric, Druid, Sorcerer, Wizard|Action|150 feet|V, S, M|Instantaneous
Telepathy|Divination|Wizard|Action|Unlimited|V, S, M|24 hours
Tsunami|Conjuration|Druid|1 minute|1 mile|V, S|C, up to 6 rounds`,
  9: `
Astral Projection|Necromancy|Cleric, Warlock, Wizard|1 hour|10 feet|V, S, M(C*)|Until dispelled
Blade of Disaster|Conjuration|Sorcerer, Warlock, Wizard|Bonus Action|60 feet|V, S|C, up to 1 minute
Detonate|Evocation|Sorcerer, Warlock, Wizard|Action|500 feet|V, S, M|Instantaneous
Foresight|Divination|Bard, Druid, Warlock, Wizard|1 minute|Touch|V, S, M|8 hours
Gate|Conjuration|Cleric, Sorcerer, Warlock, Wizard|Action|60 feet|V, S, M(C)|C, up to 1 minute
Hindsight|Divination|Wizard|10 minutes|500 feet|V, S, M(C*)|C, up to 1 hour
Imprisonment|Abjuration|Warlock, Wizard|1 minute|30 feet|V, S, M(C)|Until dispelled
Invulnerability|Abjuration|Wizard|Action|Self|V, S, M(C*)|C, up to 10 minutes
Mass Heal|Abjuration|Cleric|Action|60 feet|V, S|Instantaneous
Meteor Swarm|Evocation|Sorcerer, Wizard|Action|1 mile|V, S|Instantaneous
Power Word Heal|Enchantment|Bard, Cleric|Action|60 feet|V|Instantaneous
Power Word Kill|Enchantment|Bard, Sorcerer, Warlock, Wizard|Action|60 feet|V|Instantaneous
Prismatic Wall|Abjuration|Bard, Wizard|Action|60 feet|V, S|10 minutes
Shapechange|Transmutation|Druid, Wizard|Action|Self|V, S, M(C)|C, up to 1 hour
Storm of Vengeance|Conjuration|Druid|Action|1 mile|V, S|C, up to 1 minute
Time Stop|Transmutation|Sorcerer, Wizard|Action|Self|V|Instantaneous
True Polymorph|Transmutation|Bard, Warlock, Wizard|Action|30 feet|V, S, M|C, up to 1 hour
True Resurrection|Necromancy|Cleric, Druid|1 hour|Touch|V, S, M(C*)|Instantaneous
Vision of Elapsing Eons|Illusion|Bard, Sorcerer, Warlock, Wizard|Action|120 feet|V, S|1 minute
Wail of the Banshee|Necromancy|Sorcerer, Warlock, Wizard|Action|60 feet|V|Instantaneous
Weird|Illusion|Warlock, Wizard|Action|120 feet|V, S|C, up to 1 minute
Wish|Conjuration|Sorcerer, Wizard|Action|Self|V|Instantaneous`,
};

// On the wiki list but not in the 2024 Player's Handbook (Forgotten Realms, Xanathar's, Tasha's,
// Eberron, etc.).
export const NOT_PHB = new Set([
  "Buzzing Bee", "Feign Interest", "Insidious Rhythm", "Quick Clothier", "Spellfire Flare", "Wardaway",
  "Battle Familiar", "Conjure Tools", "Death Armor", "Deryan's Helpful Homunculi", "Disruptive Tune", "Dueling Ground",
  "Elminster's Elusion", "Homunculus Servant", "Pinky Swear", "Searing Orb", "Tortoise Shell", "Uncertain Footing",
  "Wither and Bloom",
  "Astral Flood", "Cacophonic Shield", "Catnap", "Conjure Constructs", "Inflict Doubt", "Laeral's Silver Lance", "Sylune's Viper",
  "Backlash", "Distorted Distance", "Doomtide", "Festering Blast", "Spellfire Storm", "Sticks to Snakes", "Zone of Amicability",
  "Alustriel's Mooncloak", "Enervation", "Grave Ground", "Jallarzi's Storm of Radiance", "Mordenkainen's Lucubration",
  "Negative Energy Flood", "Songal's Elemental Suffusion", "Spirit Lantern", "Summon Plant",
  "Dirge", "Elminster's Effulgent Spheres", "Leomund's Lamentable Belaborment", "Summon Dinosaur", "Tasha's Bubbling Cauldron",
  "Aura of Evasion", "Fractured Awareness", "Power Word Pain", "Reweave Fate", "Simbul's Synostodweomer", "Transfix", "Void Star",
  "Entrancing Mirrors", "Holy Star of Mystra", "Illusory Dragon", "Lightning Ring",
  "Blade of Disaster", "Detonate", "Hindsight", "Invulnerability", "Vision of Elapsing Eons",
]);

// Damaging cantrips (for the sheet's "Weapons & Damage Cantrips" table). Dice scale at levels 5, 11, 17
// (Eldritch Blast adds beams instead). attack: "melee" | "ranged" spell attack; save: ability.
export const CANTRIP_DAMAGE = {
  "acid-splash": { save: "dex", die: "d6", type: "acid" },
  "chill-touch": { attack: "melee", die: "d10", type: "necrotic" },
  "eldritch-blast": { attack: "ranged", die: "d10", type: "force", beams: true },
  "fire-bolt": { attack: "ranged", die: "d10", type: "fire" },
  "mind-sliver": { save: "int", die: "d6", type: "psychic" },
  "poison-spray": { attack: "ranged", die: "d12", type: "poison" },
  "produce-flame": { attack: "ranged", die: "d8", type: "fire" },
  "ray-of-frost": { attack: "ranged", die: "d8", type: "cold" },
  "sacred-flame": { save: "dex", die: "d8", type: "radiant" },
  "shocking-grasp": { attack: "melee", die: "d8", type: "lightning" },
  "sorcerous-burst": { attack: "ranged", die: "d8", type: "chosen element" },
  "starry-wisp": { attack: "ranged", die: "d8", type: "radiant" },
  "thorn-whip": { attack: "melee", die: "d6", type: "piercing" },
  "thunderclap": { save: "con", die: "d6", type: "thunder" },
  "toll-the-dead": { save: "wis", die: "d8", type: "necrotic", note: "d12 if target is missing HP" },
  "vicious-mockery": { save: "wis", die: "d6", type: "psychic" },
  "word-of-radiance": { save: "con", die: "d6", type: "radiant" },
};

const CLASS_LISTS = new Set(["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"]);

const slug = (name) => name.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function parseRow(line, level) {
  const [name, school, lists, castingRaw, range, componentsRaw, durationRaw] = line.split("|").map((s) => s.trim());
  const ritual = /\bor R$/.test(castingRaw);
  const trigger = castingRaw.includes("(*)");
  const castingTime = castingRaw.replace(/\s*or R$/, "").replace("(*)", "").trim();
  const m = /M\s*\((C\*?)\)/.exec(componentsRaw);
  const components = {
    v: /\bV\b/.test(componentsRaw),
    s: /\bS\b/.test(componentsRaw),
    m: /\bM\b/.test(componentsRaw),
    costly: !!m, consumed: m?.[1] === "C*",
  };
  const concentration = /^C[, ]/.test(durationRaw);
  const duration = concentration ? durationRaw.replace(/^C,?\s*/, "") : durationRaw;
  return {
    id: slug(name), name, level, school: school.toLowerCase(),
    classes: lists.split(",").map((s) => s.trim().toLowerCase()).filter((c) => CLASS_LISTS.has(c)),
    castingTime, trigger, range, components, duration, concentration, ritual,
    source: NOT_PHB.has(name) ? "Other" : "PHB 2024",
    damage: CANTRIP_DAMAGE[slug(name)] ?? null,
    text: "", notes: "",
  };
}

export const ALL_SPELLS = Object.entries(ROWS).flatMap(([level, block]) =>
  block.trim().split("\n").map((line) => parseRow(line, Number(level))));

export const SPELLS = ALL_SPELLS.filter((s) => s.source === "PHB 2024");
