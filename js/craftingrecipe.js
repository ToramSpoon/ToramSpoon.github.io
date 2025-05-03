"use strict"

const CRAFT_TYPE = {
	"PlayerCraft":"Player Craft", 
	"NPCCraft":"Non-Player Craft"
}

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

const EVENT_NAME = {
	"Eventless":"Eventless",
	"Easter":"Easter",
	"GoldenWeek":"Golden Week",
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

let fillCraftType = () => {
	// Empty the CraftType Select
	$('select[id="craft_type"]').empty()

	// Populate the CraftType Select
	$('select[id="craft_type"]').append(fillOptionsModified(Object.keys(CRAFT_TYPE), Object.values(CRAFT_TYPE)))
}

let fillEventName = () => {
	// Empty the EventName Select
	$('select[id="event_name"]').empty()

	let CraftType = $('select[id="craft_type"]').val()

	// Filter the EventName
	let FILTERED_EVENT_NAME = Object.fromEntries(Object.entries(EVENT_NAME).filter((e)=>{
		if (undefined !== RecipeCompendium[CraftType][e[0]]){
			return e
		}
	}))

	// Populate the EventName Select
	$('select[id="event_name"]').append(fillOptionsModified(Object.keys(FILTERED_EVENT_NAME), Object.values(FILTERED_EVENT_NAME)))
}

let fillItemType = () => {
	// Empty the ItemType Select
	$('select[id="item_type"]').empty()

	let CraftType = $('select[id="craft_type"]').val()
	let EventName = $('select[id="event_name"]').val()

	let FILTERED_ITEM_TYPE = Object.fromEntries(Object.entries(ITEM_TYPE).filter((e)=>{
		if (undefined !== RecipeCompendium[CraftType][EventName][e[0]]){
			return e
		}
	}))

	// Populate the ItemType Select
	$('select[id="item_type"]').append(fillOptionsModified(Object.keys(FILTERED_ITEM_TYPE), Object.values(FILTERED_ITEM_TYPE)))
}

let fillItemName = () => {
	// Empty the ItemName Select
	$('select[id="item_name"]').empty()

	let CraftType = $('select[id="craft_type"]').val()
	let EventName = $('select[id="event_name"]').val()
	let ItemType = $('select[id="item_type"]').val()

	// Get the ItemList
	let ItemList = RecipeCompendium[CraftType][EventName][ItemType]
	let ItemNames = ItemList.map((e)=>{
		if (e.ItemInformation.ItemName){
			return e.ItemInformation.ItemName
		}
	})

	// Put Default 
	ItemNames = (1 == ItemNames.length && !!!ItemNames[0]) ? ["None"] : ItemNames

	// Populate the ItemName Select
	$('select[id="item_name"]').append(fillOptionsModified(ItemNames))
}

let fillItemInfo = () => {
	// Empty ItemInfo Div
	$('div[id="item_info"]').empty()

	let CraftType = $('select[id="craft_type"]').val()
	let EventName = $('select[id="event_name"]').val()
	let ItemType = $('select[id="item_type"]').val()
	let ItemName = $('select[id="item_name"]').val()

	// Get the ItemList
	let ItemList = RecipeCompendium[CraftType][EventName][ItemType]
	let SelectedItem = null

	// Find ItemName in ItemList
	ItemList.forEach((item)=>{
		if (ItemName === item.ItemInformation.ItemName){
			if (!SelectedItem) {
				SelectedItem = item
			}
			else {
				console.log(`Item Info already been found, but another version is found ${item}`)
			}
		}
	})

	// If SelectedItem is undefined or null, do nothing and return
	if (!SelectedItem) {
		return
	}

	// Prepare ItemInfoDisplay

	let ItemInfoDisplay = document.createElement("ul")
	
	if ("boolean" === typeof SelectedItem.IsUntradable){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let IsUntradable = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Is Untradable")
		Caption.classList.add("align-left")
		IsUntradable.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		IsUntradable.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(SelectedItem.IsUntradable ? "Yes" : "No")
		if (SelectedItem.IsUntradable){
			Answer.id = "isUntradable"
			Answer.classList.add("red")
		}
		else {
			Answer.id = "isNotUntradable"
			Answer.classList.add("green")
		}
		Answer.classList.add("align-left")
		IsUntradable.append(Answer)

		ListElement.append(IsUntradable)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem.ItemInformation["Stability"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let Stability = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Stability")
		Caption.classList.add("align-left")
		Stability.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		Stability.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(`${SelectedItem.ItemInformation.Stability} %`)
		Answer.id = "stability"
		Answer.classList.add("blue")
		Answer.classList.add("align-left")
		Stability.append(Answer)
		
		ListElement.append(Stability)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem.ItemInformation["BaseATK"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let BaseATK = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Base ATK")
		Caption.classList.add("align-left")
		BaseATK.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		BaseATK.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(SelectedItem.ItemInformation.BaseATK)
		Answer.id = "base-atk"
		Answer.classList.add("align-left")
		BaseATK.append(Answer)
		
		ListElement.append(BaseATK)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem.ItemInformation["BaseDEF"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let BaseDEF = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Base DEF")
		Caption.classList.add("align-left")
		BaseDEF.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		BaseDEF.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(SelectedItem.ItemInformation.BaseDEF)
		Answer.id = "base-def"
		Answer.classList.add("align-left")
		BaseDEF.append(Answer)
		
		ListElement.append(BaseDEF)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem.ItemInformation["BasePotential"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let BasePotential = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Base Potential")
		Caption.classList.add("align-left")
		BasePotential.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		BasePotential.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(SelectedItem.ItemInformation.BasePotential)
		Answer.id = "base-potential"
		Answer.classList.add("align-left")
		BasePotential.append(Answer)
		
		ListElement.append(BasePotential)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem.ItemInformation["ItemLevel"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let ItemLevel = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Item Level")
		Caption.classList.add("align-left")
		ItemLevel.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		ItemLevel.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(SelectedItem.ItemInformation.ItemLevel)
		Answer.id = "item-level"
		Answer.classList.add("align-left")
		ItemLevel.append(Answer)
		
		ListElement.append(ItemLevel)
		ItemInfoDisplay.append(ListElement)
	}

	if (0 === SelectedItem.ItemInformation["ItemDifficulty"] || SelectedItem.ItemInformation["ItemDifficulty"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let ItemDifficulty = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Item Difficulty")
		Caption.classList.add("align-left")
		ItemDifficulty.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		ItemDifficulty.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(SelectedItem.ItemInformation.ItemDifficulty)
		Answer.id = "item-difficulty"
		Answer.classList.add("align-left")
		ItemDifficulty.append(Answer)
		
		ListElement.append(ItemDifficulty)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem.ItemInformation["Stats"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let Header = document.createElement("span")
		Header.append("Stats")
		ListElement.append(Header)

		let StatList = document.createElement("ul")
		Object.entries(SelectedItem.ItemInformation.Stats).forEach((stat)=>{
			let InnerListElement = document.createElement("li")

			let Caption = document.createElement("span")
			Caption.append(stat[0])
			Caption.classList.add("align-left")
			InnerListElement.append(Caption)

			let Colon = document.createElement("span")
			Colon.append(":")
			Colon.classList.add("cust-mar-0")
			InnerListElement.append(Colon)

			let Answer = document.createElement("span")

			if ("object" === typeof stat[1]){
				Answer = document.createElement("ul")
				Object.entries(stat[1]).forEach((innerStat)=>{
					let InnerInnerListElement = document.createElement("li")

					let InnerCaption = document.createElement("span")
					InnerCaption.append(innerStat[0])
					InnerCaption.classList.add("align-left")
					InnerInnerListElement.append(InnerCaption)

					let InnerColon = document.createElement("span")
					InnerColon.append(":")
					InnerColon.classList.add("cust-mar-0")
					InnerInnerListElement.append(Colon)

					let InnerAnswer = document.createElement("span")
					InnerAnswer.append(innerStat[1])
					if (0 < innerStat[1]) {
						InnerAnswer.classList.add("green")
					}
					else if (0 > innerStat[1]){
						InnerAnswer.classList.add("red")
					}
					InnerAnswer.classList.add("align-left")
					InnerInnerListElement.append(InnerAnswer)
					Answer.append(InnerInnerListElement)
				})
			}
			else {
				Answer.append(stat[1])
				if (0 < stat[1]) {
					Answer.classList.add("green")
				}
				else if (0 > stat[1]){
					Answer.classList.add("red")
				}
				Answer.classList.add("align-left")
			}
			InnerListElement.append(Answer)

			StatList.append(InnerListElement)
		})
		ListElement.append(StatList)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem["ItemMaterials"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let Header = document.createElement("span")
		Header.append("Materials")
		ListElement.append(Header)

		let StatList = document.createElement("ul")
		Object.entries(SelectedItem.ItemMaterials).forEach((stat)=>{
			let InnerListElement = document.createElement("li")

			let Caption = document.createElement("span")
			Caption.append(stat[0])
			Caption.classList.add("align-left")
			InnerListElement.append(Caption)

			let Colon = document.createElement("span")
			Colon.append(":")
			Colon.classList.add("cust-mar-0")
			InnerListElement.append(Colon)

			let Answer = document.createElement("span")
			Answer.append(stat[1])
			Answer.classList.add("align-left")
			InnerListElement.append(Answer)

			StatList.append(InnerListElement)
		})
		ListElement.append(StatList)
		ItemInfoDisplay.append(ListElement)
	}

	if (SelectedItem["CraftingFee"]){
		let ListElement = document.createElement("li")
		ListElement.classList.add("cust-mar-1")
		let CraftingFee = document.createElement("div")

		let Caption = document.createElement("span")
		Caption.append("Crafting Fee")
		Caption.classList.add("align-left")
		CraftingFee.append(Caption)

		let Colon = document.createElement("span")
		Colon.append(":")
		Colon.classList.add("cust-mar-0")
		CraftingFee.append(Colon)

		let Answer = document.createElement("span")
		Answer.append(`${SelectedItem.CraftingFee} Spina`)
		Answer.id = "crafting-fee"
		Answer.classList.add("align-left")
		CraftingFee.append(Answer)
		
		ListElement.append(CraftingFee)
		ItemInfoDisplay.append(ListElement)
	}

	// Populate ItemInfo Div
	$('div[id="item_info"]').append(ItemInfoDisplay)
}

$(document).ready(()=>{

	fillCraftType()
	fillEventName()
	fillItemType()
	fillItemName()
	fillItemInfo()

	$('select[id="craft_type"]').change(fillEventName)
	$('select[id="craft_type"]').change(fillItemType)
	$('select[id="craft_type"]').change(fillItemName)
	$('select[id="craft_type"]').change(fillItemInfo)

	$('select[id="event_name"]').change(fillItemType)
	$('select[id="event_name"]').change(fillItemName)
	$('select[id="event_name"]').change(fillItemInfo)

	$('select[id="item_type"]').change(fillItemName)
	$('select[id="item_type"]').change(fillItemInfo)

	$('select[id="item_name"]').change(fillItemInfo)
});

let RecipeCompendium = 
{
	PlayerCraft:{
		Eventless:{
			OHS: 
			[
				{
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
		},
	},
	NPCCraft:{
		Eventless:{
			OHS:
			[
				{
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
			ADD: [

			],
			SPC:
			[
				{
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
		},
		Easter: {
			ADD:
			[
				{
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
		},
		GoldenWeek: {
			THS: 
			[
				{
					IsUntradable:true,
					ItemInformation: {
						ItemName:"Golden Greatsword",
						Stability:80,
						BaseATK:40,
						Stats: {
							"MaxHP":250,
							"INT":3,
							"Attack Speed":250,
							"Accuracy":5,
							"Guard Recharge %":5,
						}
					},
					ItemMaterials:{
						"Golden Apple":1,
						"Metal":50,
						"Wood":30,
						"Mana":10,
					},
					CraftingFee:100,
				},
			],
			HB: 
			[
				{
					IsUntradable:true,
					ItemInformation: {
						ItemName:"Golden Lance",
						Stability:60,
						BaseATK:45,
						Stats: {
							"MaxHP":100,
							"MaxMP":100,
							"INT":3,
							"Critical Rate":5,
							"Accuracy":10,
							"Guard Recharge %":5,
						}
					},
					ItemMaterials:{
						"Golden Apple":1,
						"Metal":50,
						"Wood":30,
						"Mana":10,
					},
					CraftingFee:100,
				},
			],
			KTN: 
			[
				{
					IsUntradable:true,
					ItemInformation: {
						ItemName:"Golden Katana",
						Stability:70,
						BaseATK:12,
						Stats: {
							"MaxMP":250,
							"INT":3,
							"Critical Rate":10,
							"Attack Speed":100,
							"Guard Recharge %":5,
						}
					},
					ItemMaterials:{
						"Golden Apple":1,
						"Metal":50,
						"Wood":30,
						"Mana":10,
					},
					CraftingFee:100,
				},
			],
			SHD: 
			[
				{
					IsUntradable:true,
					ItemInformation: {
						ItemName:"Travel Bag",
						BaseDEF:130,
						Stats: {
							"Guard Recharge %":40,
							"Guard Power %":20,
							"MaxHP":4000,
							"MaxMP":200,
							"Physical Barrier":1000,
							"EXP Gain %":10,
							"Drop Rate %":1,
						}
					},
					ItemMaterials:{
						"Golden Shiny Stone":1,
						"Cloth":1000,
					},
					CraftingFee:5000,
				},
			],
			ARM: 
			[
				{
					IsUntradable:false,
					ItemInformation: {
						ItemName:"Panda Costume",
						BaseDEF:345,
						Stats: {
							"MaxHP":5000,
							"MaxMP":500,
							"Dodge":50,
							"EXP Gain %":5,
						}
					},
					ItemMaterials:{
						"Golden Bamboo":1,
						"Cloth":1500,
					},
					CraftingFee:1500,
				},
			],
			ADD: 
			[
				{
					IsUntradable:true,
					ItemInformation: {
						ItemName:"Golden Fake Greatsword",
						BaseDEF:10,
						Stats: {
							"MaxHP":250,
							"INT":3,
							"Attack Speed":250,
							"Accuracy":5,
							"Guard Recharge %":5,
						}
					},
					ItemMaterials:{
						"Golden Apple":1,
						"Metal":50,
						"Wood":30,
						"Mana":10,
					},
					CraftingFee:100,
				},
				{
					IsUntradable:true,
					ItemInformation: {
						ItemName:"Origami Kabuto",
						BaseDEF:1,
						Stats: {
							"MaxMP":100,
							"Attack MP Recovery":1,
							"Fire Resistance %":-10,
							"During Event Period":{
								"EXP Gain %":10
							},
						}
					},
					ItemMaterials:{
						"Wood":10,
						"Medicine":10,
					},
					CraftingFee:10,
				},
			],
		},
	},
}

