"use strict"

const CRAFT_TYPE = {"PC":"Player Craft", "NPC":"Non-Player Craft"}
const ITEM_TYPE = {
	"OHS":"One-Handed Sword",
	"THS":"Two-Handed Sword",
	"BOW":"Bow","BWG":"Bowgun",
	"STF":"Staff",
	"MD":"Magic Device",
	"KN":"Knuckle",
	"HB":"Halberd",
	"KTN":"Katana",
	"SHD":"Shield",
	"DG":"Dagger",
	"ARW":"Arrow",
	"ARM":"Armor",
	"ADD":"Additional",
	"SPC":"Special",
}

let fillOptionsModified = (values, keys=null, selected=false) => {
    if (values.length == 0) {
        return;
    }

    let s = "";
    if (keys != null) {
        for (var i = 0; i < values.length; i++) {
            s += `<option value="${values[i]}">${keys[i]}</option>\n`;
        }
    }
    else {
        for (var i = 0; i < values.length; i++) {
            s += `<option value="${values[i]}">${values[i]}</option>\n`;
        }
    }
    return s;
}

let fillItemType = () => {
	// Empty the ItemType Select
	$('select[id="item_type"]').empty()

	// Populate the ItemType Select
	if ("NPC" === $('select[id="craft_type"]').val()){
		$('select[id="item_type"]').append(fillOptionsModified(Object.keys(ITEM_TYPE), Object.values(ITEM_TYPE)))
	}
	else {
		// Hide NPC Exclusive ItemType
		let FILTERED_ITEM_TYPE = Object.fromEntries(Object.entries(ITEM_TYPE).filter((e)=>{
			if (!("SHD" == e[0] || "DG" == e[0] || "ARW" == e[0] || "ADD" == e[0] || "SPC" == e[0])){
				return e
			}
		}))
		$('select[id="item_type"]').append(fillOptionsModified(Object.keys(FILTERED_ITEM_TYPE), Object.values(FILTERED_ITEM_TYPE)))
	}
}

let fillItemName = () => {
	// Get the ItemList
	let ItemList = CraftDB[ ("PC" == $('select[id="craft_type"]').val()) ? "PlayerCraft" : "NPCCraft" ][$('select[id="item_type"]').val()]
	let ItemNames = ItemList.map((e)=>{
		if (e.ItemInformation.ItemName){
			return e.ItemInformation.ItemName
		}
	})

	// Put Default 
	ItemNames = (1 == ItemNames.length && !!!ItemNames[0]) ? ["None"] : ItemNames

	// Empty the ItemName Select
	$('select[id="item_name"]').empty()

	// Populate the ItemName Select
	$('select[id="item_name"]').append(fillOptionsModified(ItemNames))
}

let fillItemInfo = () => {
	// Get the ItemList
	let ItemList = CraftDB[ ("PC" == $('select[id="craft_type"]').val()) ? "PlayerCraft" : "NPCCraft" ][$('select[id="item_type"]').val()]
	let ItemInfo = ItemList.filter((e)=>{
		if ($('select[id="item_name"]').val() == e.ItemInformation.ItemName) {
			return e
		}
	})[0]

	// Empty ItemInfo Div
	$('div[id="item_info"]').empty()

	// If ItemInfo is undefined or null, do nothing and return
	if (!ItemInfo) {
		return
	}

	// Prepare ItemInfoDisplay

	let ItemInfoDisplay = ""
	ItemInfoDisplay += `<label>Is Event Exclusive?</label><span>${(ItemInfo.IsEventExclusive[0]) ? "Yes, "+ItemInfo.IsEventExclusive[1] : "No."}</span>`
	
	if (ItemInfo.IsUntradable){
		ItemInfoDisplay += `<label>Is Untradable?</label><span>${(ItemInfo.ItemInformation.IsUntradable)? "Yes" : "No"}</span>`
	}

	ItemInfoDisplay += `<label>Stability</label><span>${ItemInfo.ItemInformation.Stability}%</span>`
	ItemInfoDisplay += `<label>Base ATK</label><span>${ItemInfo.ItemInformation.BaseATK}</span>`

	if ("PC" == $('select[id="craft_type"]').val()){
		ItemInfoDisplay += `<label>Base Potential</label><span>${ItemInfo.ItemInformation.BasePotential}</span>`
		ItemInfoDisplay += `<label>Item Level</label><span>${ItemInfo.ItemInformation.ItemLevel}</span>`
		ItemInfoDisplay += `<label>Item Difficulty</label><span>${ItemInfo.ItemInformation.ItemDifficulty}</span>`
	}
	else {
		// For NPC Craft, Check if Stat Exist
		if (ItemInfo.ItemInformation.Stats){
			// Prepare List of Stat
			let ItemStat = (0 === Object.entries(ItemInfo.ItemInformation.Stats).length) ? "<ul>" : ""
			Object.entries(ItemInfo.ItemInformation.Stats).forEach((e,v)=>{
				ItemStat += `<li><label>${e[0]}</label><span>${(e[1] > 0)? "+" : ""}${e[1]}</span>`
			})
			ItemStat = ("" === ItemStat) ? "" : ItemStat + "</ul>" 
			ItemInfoDisplay += `<h3>Stats</h3>` + ItemStat
		}
	}
	
	// Prepare List of Materials
	let Materials = (0 === Object.entries(ItemInfo.ItemMaterials).length) ? "<ul>" : ""
	Object.entries(ItemInfo.ItemMaterials).forEach((e,v)=>{
		let isMaterialPts = ("Metal" === e[0] || "Cloth" === e[0] || "Beast" === e[0] || "Wood" === e[0] || "Medicine" === e[0] || "Mana" === e[0])
		Materials += `<li><label>${e[0]}</label><span>${e[1]}${(isMaterialPts)?"pts":""}</span>`
	})
	Materials = ("" === Materials) ? "" : Materials + "</ul>" 

	// Add List of Materials to ItemInfoDisplay
	ItemInfoDisplay += `<h3>Materials</h3>` + Materials

	if (ItemInfo.CraftingFee){
		ItemInfoDisplay += `<div><label>Crafting Fee</label><span>${ItemInfo.CraftingFee} Spina</span></div>`
	}

	// Populate ItemInfo Div
	$('div[id="item_info"]').append(ItemInfoDisplay)
}

$(document).ready(()=>{
	$('select[id="craft_type"]').append(fillOptionsModified(Object.keys(CRAFT_TYPE), Object.values(CRAFT_TYPE)))
	fillItemType()
	fillItemName()
	fillItemInfo()
	$('select[id="craft_type"]').change(fillItemType)
	$('select[id="craft_type"]').change(fillItemName)
	$('select[id="craft_type"]').change(fillItemInfo)
	$('select[id="item_type"]').change(fillItemName)
	$('select[id="item_type"]').change(fillItemInfo)
	$('select[id="item_name"]').change(fillItemInfo)
});

let CraftDB = 
{
	PlayerCraft:{
		OHS: 
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Wood Sword",
					Stability:40,
					BaseATK:10,
					BasePotential:15,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"Wood":25,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Shortsword",
					Stability:80,
					BaseATK:10,
					BasePotential:15,
					ItemLevel:1,
					ItemDifficulty:1,
				},
				ItemMaterials:{
					"Metal":3,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Longsword",
					Stability:80,
					BaseATK:17,
					BasePotential:16,
					ItemLevel:5,
					ItemDifficulty:10,
				},
				ItemMaterials:{
					"Small Hilt":20,
					"Metal":25,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Gladius",
					Stability:80,
					BaseATK:25,
					BasePotential:18,
					ItemLevel:15,
					ItemDifficulty:20,
				},
				ItemMaterials:{
					"Jagged Fang":25,
					"Nicked Blade":25,
					"Metal":50,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Sabre",
					Stability:80,
					BaseATK:34,
					BasePotential:19,
					ItemLevel:25,
					ItemDifficulty:30,
				},
				ItemMaterials:{
					"Fatigued Blade":20,
					"Sharp Fang":30,
					"Metal":75,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Brutal Dragon Sword",
					Stability:80,
					BaseATK:27,
					BasePotential:20,
					ItemLevel:30,
					ItemDifficulty:35,
				},
				ItemMaterials:{
					"Brutal Dragon Tail":1,
					"Brutal Dragon Claw":4,
					"Metal":100,
					"Beast":75,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Adel Sword",
					Stability:80,
					BaseATK:40,
					BasePotential:21,
					ItemLevel:35,
					ItemDifficulty:40,
				},
				ItemMaterials:{
					"Goblin Claw":25,
					"Potum Fin":15,
					"Metal":75,
					"Wood":25,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Rapier",
					Stability:80,
					BaseATK:56,
					BasePotential:23,
					ItemLevel:45,
					ItemDifficulty:50,
				},
				ItemMaterials:{
					"Fine Sand":5,
					"Dragon Bone":30,
					"Metal":100,
					"Wood":25,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Sword of Sin",
					Stability:80,
					BaseATK:61,
					BasePotential:23,
					ItemLevel:50,
					ItemDifficulty:55,
				},
				ItemMaterials:{
					"Nail of Demon's Gate":1,
					"Lonogo Stone":25,
					"Metal":350,
					"Beast":200,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Scimitar",
					Stability:80,
					BaseATK:70,
					BasePotential:24,
					ItemLevel:55,
					ItemDifficulty:60,
				},
				ItemMaterials:{
					"Damascus Ore":10,
					"Quicksand Crystal":5,
					"Metal":100,
					"Beast":50,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Phyto Blade",
					Stability:90,
					BaseATK:74,
					BasePotential:26,
					ItemLevel:65,
					ItemDifficulty:70,
				},
				ItemMaterials:{
					"Grass Dragon's Scale":3,
					"Grass Dragon's Petal":1,
					"Metal":500,
					"Wood":200,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Blitz Sword",
					Stability:80,
					BaseATK:80,
					BasePotential:26,
					ItemLevel:65,
					ItemDifficulty:70,
				},
				ItemMaterials:{
					"Big Bolt":30,
					"Evil Spirit Claw":20,
					"Metal":500,
					"Wood":200,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Black Sword of Delusion",
					Stability:80,
					BaseATK:94,
					BasePotential:28,
					ItemLevel:75,
					ItemDifficulty:80,
				},
				ItemMaterials:{
					"Ominous Crystal":1,
					"Evil Energy of Delusion":2,
					"Metal":500,
					"Beast":250,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Ilwoon",
					Stability:70,
					BaseATK:100,
					BasePotential:28,
					ItemLevel:75,
					ItemDifficulty:80,
				},
				ItemMaterials:{
					"Mithril Ore":5,
					"Rusty Huge Axe":30,
					"Metal":150,
					"Wood":50,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Icebrand Glacier",
					Stability:80,
					BaseATK:101,
					BasePotential:28,
					ItemLevel:80,
					ItemDifficulty:85,
				},
				ItemMaterials:{
					"Ice Rose":1,
					"Twilight Dragon Wing":5,
					"Evil Crystal Beast Claw":3,
					"Mana":425,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Indigo Sword",
					Stability:80,
					BaseATK:109,
					BasePotential:29,
					ItemLevel:85,
					ItemDifficulty:90,
				},
				ItemMaterials:{
					"Heated Sword Fin":1,
					"Deformed Blade":5,
					"Metal":125,
					"Beast":100,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Dark General's Sword",
					Stability:80,
					BaseATK:130,
					BasePotential:31,
					ItemLevel:95,
					ItemDifficulty:100,
				},
				ItemMaterials:{
					"Broken Dark Greatsword":1,
					"High-Purity Magic Crystal":5,
					"Metal":750,
					"Beast":250,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Soldier Sword",
					Stability:80,
					BaseATK:125,
					BasePotential:31,
					ItemLevel:95,
					ItemDifficulty:100,
				},
				ItemMaterials:{
					"Curved Blade":20,
					"Cracked Stone Skin":20,
					"Metal":150,
					"Beast":100,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Leve Fang",
					Stability:70,
					BaseATK:154,
					BasePotential:32,
					ItemLevel:105,
					ItemDifficulty:110,
				},
				ItemMaterials:{
					"Proto Leon's Hammer Bit":2,
					"Crystallized Huge Claw":4,
					"Beast":900,
					"Metal":200,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Imperial Sword",
					Stability:80,
					BaseATK:140,
					BasePotential:32,
					ItemLevel:105,
					ItemDifficulty:110,
				},
				ItemMaterials:{
					"Green Pearl":5,
					"Hard Claw":30,
					"Metal":200,
					"Wood":75,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Wind Rapier",
					Stability:90,
					BaseATK:145,
					BasePotential:34,
					ItemLevel:115,
					ItemDifficulty:120,
				},
				ItemMaterials:{
					"Scattered Crystal":5,
					"Spiky Fang":20,
					"Metal":150,
					"Beast":150,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Zahhak Sword",
					Stability:80,
					BaseATK:180,
					BasePotential:36,
					ItemLevel:125,
					ItemDifficulty:130,
				},
				ItemMaterials:{
					"Twin Head Dragon Heart":1,
					"Twin Head Dragon Tail":2,
					"Metal":1000,
					"Beast":300,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Elfin Sword",
					Stability:80,
					BaseATK:179,
					BasePotential:36,
					ItemLevel:125,
					ItemDifficulty:130,
				},
				ItemMaterials:{
					"White Wood":20,
					"Dragon Azul Sphere":5,
					"Metal":200,
					"Wood":125,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Clarity Rose",
					Stability:70,
					BaseATK:190,
					BasePotential:37,
					ItemLevel:130,
					ItemDifficulty:135,
				},
				ItemMaterials:{
					"Ether Metal":1,
					"Chief BK Emblem":1,
					"Machina Blood":10,
					"Metal":1350,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Calibur",
					Stability:80,
					BaseATK:199,
					BasePotential:37,
					ItemLevel:135,
					ItemDifficulty:140,
				},
				ItemMaterials:{
					"Divine Metal":5,
					"Glossy Black Leather":20,
					"Metal":200,
					"Wood":150,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Lil Empress Sword",
					Stability:75,
					BaseATK:229,
					BasePotential:38,
					ItemLevel:140,
					ItemDifficulty:145,
				},
				ItemMaterials:{
					"Lil Accessory Chip":2,
					"Lil Empress Horn":1,
					"Metal":1000,
					"Mana":450,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Maton Saber",
					Stability:80,
					BaseATK:200,
					BasePotential:38,
					ItemLevel:140,
					ItemDifficulty:145,
				},
				ItemMaterials:{
					"Old Type Blade Material":2,
					"Slebinian Magic Torch":1,
					"Metal":1200,
					"Medicine":250,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Fluck Sword",
					Stability:80,
					BaseATK:220,
					BasePotential:39,
					ItemLevel:145,
					ItemDifficulty:150,
				},
				ItemMaterials:{
					"Blue Rock Fragment":1,
					"Vivid Crest":2,
					"Beast":1000,
					"Metal":500,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Shotel",
					Stability:80,
					BaseATK:220,
					BasePotential:39,
					ItemLevel:145,
					ItemDifficulty:150,
				},
				ItemMaterials:{
					"Broken Stem":5,
					"Climbing Claw":20,
					"Metal":200,
					"Beast":175,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Holy Sword",
					Stability:80,
					BaseATK:242,
					BasePotential:41,
					ItemLevel:155,
					ItemDifficulty:160,
				},
				ItemMaterials:{
					"Inanis Stone":15,
					"Illegible Academic Book":20,
					"Metal":250,
					"Wood":150,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Dark Dragon Fang Sword",
					Stability:80,
					BaseATK:253,
					BasePotential:41,
					ItemLevel:160,
					ItemDifficulty:165,
				},
				ItemMaterials:{
					"Dark Gemstone":1,
					"Finstern Horns":1,
					"Beast":1200,
					"Metal":450,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Catafnia Sword",
					Stability:80,
					BaseATK:265,
					BasePotential:42,
					ItemLevel:165,
					ItemDifficulty:170,
				},
				ItemMaterials:{
					"Black Rock Crystal":4,
					"Sturdy Core":4,
					"Metal":300,
					"Beast":125,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Sapphire Mace",
					Stability:90,
					BaseATK:260,
					BasePotential:44,
					ItemLevel:175,
					ItemDifficulty:180,
				},
				ItemMaterials:{
					"Sapphire Roga Core":1,
					"Sapphire Roga Horns":2,
					"Metal":1200,
					"Beast":600,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Reptilian Sword",
					Stability:80,
					BaseATK:289,
					BasePotential:44,
					ItemLevel:175,
					ItemDifficulty:180,
				},
				ItemMaterials:{
					"Sharp Monkey Horn":10,
					"Long Mane":20,
					"Metal":300,
					"Beast":150,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Laguna Sword",
					Stability:80,
					BaseATK:314,
					BasePotential:45,
					ItemLevel:185,
					ItemDifficulty:190,
				},
				ItemMaterials:{
					"Thick Hippo Fang":15,
					"Geometric Armor Bit":15,
					"Metal":300,
					"Wood":175,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Demon Empress Sword",
					Stability:80,
					BaseATK:327,
					BasePotential:46,
					ItemLevel:190,
					ItemDifficulty:195,
				},
				ItemMaterials:{
					"Empress Ogre Accessory Chip":2,
					"Empress Ogre Fang":2,
					"Metal":1400,
					"Mana":550,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Arachnid Sword",
					Stability:75,
					BaseATK:340,
					BasePotential:47,
					ItemLevel:195,
					ItemDifficulty:200,
				},
				ItemMaterials:{
					"Radiant Miracle Water":2,
					"Evil Spirit Crystal":1,
					"Metal":1250,
					"Beast":750,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Luster Sword",
					Stability:80,
					BaseATK:340,
					BasePotential:47,
					ItemLevel:195,
					ItemDifficulty:200,
				},
				ItemMaterials:{
					"Wyvern Horn":20,
					"Dragon Hardstone":20,
					"Metal":300,
					"Wood":200,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Gemma Spada",
					Stability:80,
					BaseATK:353,
					BasePotential:48,
					ItemLevel:200,
					ItemDifficulty:205,
				},
				ItemMaterials:{
					"Gemma's Jewel":1,
					"Starlight of Desire":1,
					"Metal":1750,
					"Mana":300,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Aeria Spada",
					Stability:80,
					BaseATK:367,
					BasePotential:49,
					ItemLevel:205,
					ItemDifficulty:210,
				},
				ItemMaterials:{
					"Boma Konda Ore":15,
					"Kiton's Wing":15,
					"Metal":275,
					"Wood":250,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Eradicator Bayonet",
					Stability:80,
					BaseATK:395,
					BasePotential:50,
					ItemLevel:215,
					ItemDifficulty:220,
				},
				ItemMaterials:{
					"Velum's Crystal Reactor":1,
					"Spherical Carapace":2,
					"Metal":1500,
					"Wood":700,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Luxurie Sword",
					Stability:80,
					BaseATK:395,
					BasePotential:50,
					ItemLevel:215,
					ItemDifficulty:220,
				},
				ItemMaterials:{
					"Pointed Tentacle":5,
					"Glossy Shell":15,
					"Metal":250,
					"Beast":250,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Profound Sword",
					Stability:80,
					BaseATK:424,
					BasePotential:52,
					ItemLevel:225,
					ItemDifficulty:230,
				},
				ItemMaterials:{
					"Uneven Wood":15,
					"Tektite":20,
					"Metal":375,
					"Beast":200,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Filrocas Sword",
					Stability:80,
					BaseATK:454,
					BasePotential:54,
					ItemLevel:235,
					ItemDifficulty:240,
				},
				ItemMaterials:{
					"Filrocas' Blue Eye":1,
					"Strange Crystal Fang":2,
					"Beast":1400,
					"Metal":1000,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Erde Sword",
					Stability:80,
					BaseATK:454,
					BasePotential:54,
					ItemLevel:235,
					ItemDifficulty:240,
				},
				ItemMaterials:{
					"Dark Red Ear":15,
					"Duck Spur":15,
					"Metal":300,
					"Beast":300,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Amnis Rapier",
					Stability:70,
					BaseATK:517,
					BasePotential:57,
					ItemLevel:255,
					ItemDifficulty:260,
				},
				ItemMaterials:{
					"Thorny Hammer Tail":1,
					"Extremely Scary Face":2,
					"Beast":1800,
					"Medicine":800,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Anguish Sword",
					Stability:70,
					BaseATK:584,
					BasePotential:60,
					ItemLevel:275,
					ItemDifficulty:280,
				},
				ItemMaterials:{
					"Inlaid Purple Eye":1,
					"Corroded Tree Bark":2,
					"Beast":1500,
					"Metal":1300,
				},
			},
		],
		THS:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Iron Blade",
					Stability:70,
					BaseATK:15,
					BasePotential:15,
					ItemLevel:1,
					ItemDifficulty:1,
				},
				ItemMaterials:{
					"Small Hilt":20,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Heavy Blade",
					Stability:70,
					BaseATK:25,
					BasePotential:16,
					ItemLevel:5,
					ItemDifficulty:10,
				},
				ItemMaterials:{
					"Thick Beak":20,
					"Metal":20,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Great Sword",
					Stability:70,
					BaseATK:37,
					BasePotential:18,
					ItemLevel:15,
					ItemDifficulty:20,
				},
				ItemMaterials:{
					"Broken Metal":25,
					"Nisel Wood":15,
					"Metal":50,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Longblade",
					Stability:70,
					BaseATK:50,
					BasePotential:19,
					ItemLevel:25,
					ItemDifficulty:30,
				},
				ItemMaterials:{
					"Sharp Fang":30,
					"Fatigued Blade":20,
					"Metal":60,
					"Wood":15,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Volcanic Sword",
					Stability:70,
					BaseATK:65,
					BasePotential:21,
					ItemLevel:35,
					ItemDifficulty:40,
				},
				ItemMaterials:{
					"Flare Volg Horn":2,
					"Fiery Gemstone":1,
					"Metal":175,
					"Mana":25,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Bone Blade",
					Stability:70,
					BaseATK:66,
					BasePotential:21,
					ItemLevel:35,
					ItemDifficulty:40,
				},
				ItemMaterials:{
					"Cracked Stick":30,
					"Saw-Toothed Edge":20,
					"Beast":100,
					"Wood":50,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Fortis Blade",
					Stability:70,
					BaseATK:82,
					BasePotential:23,
					ItemLevel:45,
					ItemDifficulty:50,
				},
				ItemMaterials:{
					"Outer World Arm":15,
					"Dusky Ore":30,
					"Metal":100,
					"Wood":25,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Iron Exoskeleton Sword",
					Stability:70,
					BaseATK:90,
					BasePotential:23,
					ItemLevel:50,
					ItemDifficulty:55,
				},
				ItemMaterials:{
					"Mineral Scissor":1,
					"Crustacean Steel":4,
					"Metal":500,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Flamberge",
					Stability:70,
					BaseATK:100,
					BasePotential:24,
					ItemLevel:55,
					ItemDifficulty:60,
				},
				ItemMaterials:{
					"Broken Clock Hand":20,
					"Hard Scissor":15,
					"Metal":100,
					"Wood":50,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Berserker Blade",
					Stability:70,
					BaseATK:109,
					BasePotential:25,
					ItemLevel:60,
					ItemDifficulty:65,
				},
				ItemMaterials:{
					"Greatsword Fragment":3,
					"Heavy Tough Chain":2,
					"Metal":500,
					"Beast":150,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Hammerfall",
					Stability:70,
					BaseATK:120,
					BasePotential:26,
					ItemLevel:65,
					ItemDifficulty:70,
				},
				ItemMaterials:{
					"Goblin's Big Nail":1,
					"Broken Huge Scythe":20,
					"Metal":150,
					"Wood":25,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Desert Anfel",
					Stability:75,
					BaseATK:124,
					BasePotential:27,
					ItemLevel:70,
					ItemDifficulty:75,
				},
				ItemMaterials:{
					"Goovua's Mask Fragment":3,
					"Goovua's Shoulder Pad":2,
					"Metal":400,
					"Wood":350,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Flame Blade",
					Stability:70,
					BaseATK:140,
					BasePotential:28,
					ItemLevel:75,
					ItemDifficulty:80,
				},
				ItemMaterials:{
					"Stone of Sublimation":6,
					"Gemstone of Sublimation":3,
					"Scorching Onion":1,
					"Metal":200,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Frostbrand Rime",
					Stability:80,
					BaseATK:151,
					BasePotential:28,
					ItemLevel:80,
					ItemDifficulty:85,
				},
				ItemMaterials:{
					"Ice Rose":1,
					"Twilight Dragon Wing":5,
					"Evil Crystal Beast Claw":3,
					"Mana":425,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Deseperanza",
					Stability:70,
					BaseATK:164,
					BasePotential:29,
					ItemLevel:85,
					ItemDifficulty:90,
				},
				ItemMaterials:{
					"Deformed Blade":5,
					"Jet-Black Shield Fragment":20,
					"Darkness Mushroom":20,
					"Metal":225,
				},
			},
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"Wind Plunder",
					Stability:70,
					BaseATK:182,
					BasePotential:31,
					ItemLevel:95,
					ItemDifficulty:100,
				},
				ItemMaterials:{
					"Crest of Dark Captain":3,
					"Magic Crystal Wing Fragment":2,
					"Windblast Gemstone":1,
					"Metal":1000,
				},
			},
		],
		BOW:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		],
		BWG:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		],
		STF:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		],
		MD:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		],
		KN:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		],
		HB:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		],
		KTN:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		],
		ARM:
		[
			{
				IsEventExclusive: [false,null],
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					BasePotential:0,
					ItemLevel:1,
					ItemDifficulty:0,
				},
				ItemMaterials:{
					"a":0,
				},
			},
		]
	},
	NPCCraft:{
		OHS:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Shortsword",
					Stability:80,
					BaseATK:10,
					Stats: null
				},
				ItemMaterials:{
					"Metal":3,
				},
				CraftingFee:5,
			},
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Longsword",
					Stability:80,
					BaseATK:17,
					Stats: {
						"MaxHP":50,
						"Accuracy":1,
					}
				},
				ItemMaterials:{
					"Small Hilt":20,
					"Metal":25,
				},
				CraftingFee:50,
			},
		],
		THS:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		BOW:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		BWG:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		STF:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		MD:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		KN:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		HB:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		KTN:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		SHD:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					BaseDEF:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		DG:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		ARW:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					Stability:0,
					BaseATK:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		ARM:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					BaseDEF:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		],
		ADD:
		[
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Eggshell Hat",
					BaseDEF:30,
					Stats: {
						"MaxHP":300,
						"Guard Power %":5,
						"Physical Resistance %":10,
						"Magic Resistance %":-10,
					}
				},
				ItemMaterials:{
					"Egg":10,
					"Metal":30,
					"Wood":15,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Eggshell Pants",
					BaseDEF:30,
					Stats: {
						"MaxMP":100,
						"Guard Recharge %":5,
						"Magic Resistance %":10,
						"Physical Resistance %":-10,
					}
				},
				ItemMaterials:{
					"Egg":10,
					"Metal":30,
					"Cloth":15,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Easter Balloons",
					BaseDEF:1,
					Stats: {
						"Unsheathe Attack":100,
						"DEF %":-100,
						"MDEF %":-100,
					}
				},
				ItemMaterials:{
					"Potum Nail":9,
					"Egg":3,
					"Medicine":30,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Sunny Side Beret",
					BaseDEF:10,
					Stats: {
						"MaxHP":3000,
						"Physical Resistance %":-10,
						"Magic Resistance %":-10,
						"Guard Recharge %":-20,
						"Guard Power %":-20,
					}
				},
				ItemMaterials:{
					"Egg":8,
					"Linen Cloth":4,
					"High-Quality Wool":2,
					"Cloth":30,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Easter Bunny",
					BaseDEF:50,
					Stats: {
						"MaxMP":300,
						"Attack MP Recovery":6,
						"Accuracy":40,
						"Ailment Resistance %":-12,
					}
				},
				ItemMaterials:{
					"Strange Egg":20,
					"Sheeting Fabric":12,
					"Wooden Doll":3,
					"Cloth":150,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Wing Egg Bag",
					BaseDEF:40,
					Stats: {
						"Unsheathe Attack":100,
						"Unsheathe Attack %":4,
						"Critical Rate %":8,
						"Evasion Recharge %":-25,
						"MaxHP %":-50,
					}
				},
				ItemMaterials:{
					"Hard Eggshell":20,
					"Jade Raptor Armor Fur":1,
					"Charmed Cloth":10,
					"Cloth":300,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Rabbit Ear Glasses",
					BaseDEF:6,
					Stats: {
						"Critical Rate":20,
						"AGI %":2,
						"Barrier Cooldown %":-10,
					}
				},
				ItemMaterials:{
					"Small Egg":10,
					"Media Lense":2,
					"Long Thin Iron Plate":4,
					"Metal":125,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Bunny Beanie",
					BaseDEF:40,
					Stats: {
						"MaxMP":300,
						"Evasion Recharge %":15,
						"Dodge %":10,
						"Absolute Dodge %":5,
					}
				},
				ItemMaterials:{
					"Fluck Egg":1,
					"Knit Fabric":15,
					"Carrot":30,
					"Cloth":250,
				},
				CraftingFee:10,
			},
			{
				IsEventExclusive: [true,"Easter Event"],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"Easter Egg Pom Bag",
					BaseDEF:80,
					Stats: {
						"Unsheathe Attack":100,
						"Unsheathe Attack %":6,
						"MaxMP":300,
						"MaxHP %":-40,
					}
				},
				ItemMaterials:{
					"Cracked Eggshell":20,
					"High Grade Frill Fabric":2,
					"Potum Ear":2,
					"Cloth":400,
				},
				CraftingFee:10,
			},
		],
		SPC:
		[
			{
				IsEventExclusive: [false,null],
				IsUntradable:true,
				ItemInformation: {
					ItemName:"",
					BaseDEF:0,
					Stats: null
				},
				ItemMaterials:{
					"a":0,
				},
				CraftingFee:0,
			},
		]
	}
}