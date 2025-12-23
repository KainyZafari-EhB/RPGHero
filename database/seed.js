/**
 * Database Seed Script
 * Populates the database with initial sample data
 */

const db = require('../src/config/database');

console.log('🌱 Starting database seed...');

// Clear existing data
db.prepare('DELETE FROM heroes').run();
db.prepare('DELETE FROM quests').run();
db.prepare('DELETE FROM items').run();
db.prepare("DELETE FROM sqlite_sequence WHERE name='heroes' OR name='quests' OR name='items'").run();

console.log('🧹 Cleared existing data');

// Seed Heroes
const heroes = [
    {
        name: 'Aragorn',
        class: 'warrior',
        level: 87,
        health: 500,
        mana: 100,
        strength: 95,
        intelligence: 70
    },
    {
        name: 'Gandalf',
        class: 'mage',
        level: 100,
        health: 300,
        mana: 1000,
        strength: 40,
        intelligence: 100
    },
    {
        name: 'Legolas',
        class: 'rogue',
        level: 75,
        health: 350,
        mana: 150,
        strength: 70,
        intelligence: 60
    },
    {
        name: 'Elrond',
        class: 'healer',
        level: 90,
        health: 400,
        mana: 800,
        strength: 50,
        intelligence: 95
    },
    {
        name: 'Gimli',
        class: 'warrior',
        level: 70,
        health: 550,
        mana: 50,
        strength: 90,
        intelligence: 40
    }
];

const insertHero = db.prepare(`
    INSERT INTO heroes (name, class, level, health, mana, strength, intelligence)
    VALUES (@name, @class, @level, @health, @mana, @strength, @intelligence)
`);

for (const hero of heroes) {
    insertHero.run(hero);
}

console.log(`✅ Seeded ${heroes.length} heroes`);

// Seed Items
const items = [
    {
        name: 'Iron Sword',
        type: 'weapon',
        damage: 15,
        weight: 5,
        rarity: 'common',
        hero_id: 1 // Aragorn
    },
    {
        name: 'Healing Potion',
        type: 'consumable',
        damage: 0,
        weight: 1,
        rarity: 'common',
        hero_id: 1 // Aragorn
    },
    {
        name: 'Staff of Light',
        type: 'weapon',
        damage: 40,
        weight: 8,
        rarity: 'epic',
        hero_id: 2 // Gandalf
    },
    {
        name: 'Elven Bow',
        type: 'weapon',
        damage: 25,
        weight: 3,
        rarity: 'rare',
        hero_id: 3 // Legolas
    },
    {
        name: 'Mithril Mail',
        type: 'armor',
        damage: 0,
        weight: 2,
        rarity: 'legendary',
        hero_id: null // Unassigned
    }
];

const insertItem = db.prepare(`
    INSERT INTO items (name, type, damage, weight, rarity, hero_id)
    VALUES (@name, @type, @damage, @weight, @rarity, @hero_id)
`);

for (const item of items) {
    insertItem.run(item);
}

console.log(`✅ Seeded ${items.length} items`);

// Seed Quests
const quests = [
    {
        title: 'Destroy the Ring',
        description: 'Take the One Ring to Mordor and cast it into the fires of Mount Doom.',
        difficulty: 'legendary',
        reward_gold: 10000,
        reward_xp: 50000,
        min_level: 50,
        is_active: 1
    },
    {
        title: 'Defend Minas Tirith',
        description: 'Protect the white city from the armies of Mordor.',
        difficulty: 'hard',
        reward_gold: 5000,
        reward_xp: 25000,
        min_level: 40,
        is_active: 1
    },
    {
        title: 'Escort Hobbits to Bree',
        description: 'Guide the Hobbits safely to the Prancing Pony inn.',
        difficulty: 'medium',
        reward_gold: 500,
        reward_xp: 1000,
        min_level: 10,
        is_active: 0
    },
    {
        title: 'Clear Rats from Cellar',
        description: 'The innkeeper needs help clearing giant rats validatfrom his cellar.',
        difficulty: 'easy',
        reward_gold: 50,
        reward_xp: 100,
        min_level: 1,
        is_active: 1
    },
    {
        title: 'Find the Lost Palantir',
        description: 'Recover the seeing stone lost in the Anduin river.',
        difficulty: 'hard',
        reward_gold: 2000,
        reward_xp: 8000,
        min_level: 30,
        is_active: 1
    }
];

const insertQuest = db.prepare(`
    INSERT INTO quests (title, description, difficulty, reward_gold, reward_xp, min_level, is_active)
    VALUES (@title, @description, @difficulty, @reward_gold, @reward_xp, @min_level, @is_active)
`);

for (const quest of quests) {
    insertQuest.run(quest);
}

console.log(`✅ Seeded ${quests.length} quests`);
console.log('✨ Database seeding completed!');
