var tokunoTreasuresItemsPerReward = 10;
var tokunoTreasuresRewardEra = 1;

var tokunoTreasuresGreaterRewardsByEra = [
	[],
	[
		"tot_swords_of_prosperity",
		"tot_sword_of_the_stampede",
		"tot_winds_edge",
		"tot_darkened_sky",
		"tot_the_horselord",
		"tot_rune_beetle_carapace",
		"tot_kasa_of_the_rajin",
		"tot_stormgrip",
		"tot_tome_of_lost_knowledge",
		"tot_pigments_reward_menu"
	],
	[
		"tot_swords_of_prosperity",
		"tot_sword_of_the_stampede",
		"tot_winds_edge",
		"tot_darkened_sky",
		"tot_the_horselord",
		"tot_rune_beetle_carapace",
		"tot_kasa_of_the_rajin",
		"tot_stormgrip",
		"tot_tome_of_lost_knowledge",
		"tot_pigments_reward_menu"
	],
	[
		"tot_swords_of_prosperity",
		"tot_sword_of_the_stampede",
		"tot_winds_edge",
		"tot_darkened_sky",
		"tot_the_horselord",
		"tot_rune_beetle_carapace",
		"tot_kasa_of_the_rajin",
		"tot_stormgrip",
		"tot_tome_of_lost_knowledge"
	]
];

var tokunoTreasuresPigmentRewardsByEra = [
	[],
	[
		"tot_pigment_paragon_gold",
		"tot_pigment_violet_courage_purple",
		"tot_pigment_invulnerability_blue",
		"tot_pigment_luna_white",
		"tot_pigment_dryad_green",
		"tot_pigment_shadow_dancer_black",
		"tot_pigment_berserker_red",
		"tot_pigment_nox_green",
		"tot_pigment_rum_red",
		"tot_pigment_fire_orange"
	],
	[
		"tot_pigment_faded_coal",
		"tot_pigment_coal",
		"tot_pigment_faded_gold",
		"tot_pigment_storm_bronze",
		"tot_pigment_rose",
		"tot_pigment_midnight_coal",
		"tot_pigment_faded_bronze",
		"tot_pigment_faded_rose",
		"tot_pigment_deep_rose"
	],
	[
		"tot_pigment_paragon_gold",
		"tot_pigment_violet_courage_purple",
		"tot_pigment_invulnerability_blue",
		"tot_pigment_luna_white",
		"tot_pigment_dryad_green",
		"tot_pigment_shadow_dancer_black",
		"tot_pigment_berserker_red",
		"tot_pigment_nox_green",
		"tot_pigment_rum_red",
		"tot_pigment_fire_orange"
	]
];

var tokunoTreasuresSectionInfo = {
	"tot_ancient_farmers_kasa": { name: "Ancient Farmer's Kasa", itemID: 0x2798, hue: 0 },
	"tot_ancient_samurai_do": { name: "Ancient Samurai Do", itemID: 0x277D, hue: 0 },
	"tot_ancient_urn": { name: "Ancient Urn", itemID: 0x241D, hue: 0 },
	"tot_arms_of_tactical_excellence": { name: "Arms of Tactical Excellence", itemID: 0x2777, hue: 0 },
	"tot_black_lotus_hood": { name: "Black Lotus Hood", itemID: 0x278E, hue: 0 },
	"tot_chest_of_heirlooms": { name: "Chest of heirlooms", itemID: 0x2811, hue: 0 },
	"tot_daimyos_helm": { name: "Daimyo's Helm", itemID: 0x2785, hue: 0 },
	"tot_darkened_sky": { name: "Darkened Sky", itemID: 0x27AD, hue: 0 },
	"tot_demon_forks": { name: "Demon Forks", itemID: 0x27AF, hue: 0 },
	"tot_dragon_nunchaku": { name: "Dragon Nunchaku", itemID: 0x27AE, hue: 0 },
	"tot_exiler": { name: "Exiler", itemID: 0x27A6, hue: 0 },
	"tot_flute_of_renewal": { name: "Flute of Renewal", itemID: 0x2805, hue: 0 },
	"tot_gloves_of_the_sun": { name: "Gloves of the Sun", itemID: 0x2792, hue: 0 },
	"tot_hanzos_bow": { name: "Hanzo's Bow", itemID: 0x27A5, hue: 0 },
	"tot_honorable_swords": { name: "Honorable Swords", itemID: 0x2853, hue: 0 },
	"tot_kasa_of_the_rajin": { name: "Kasa of the Raj-in", itemID: 0x2798, hue: 0 },
	"tot_legs_of_stability": { name: "Legs of Stability", itemID: 0x2788, hue: 0 },
	"tot_lesser_pigments_random": { name: "Lesser Pigments of Tokuno", itemID: 0x0EFF, hue: 0 },
	"tot_leurocians_mempo_of_fortune": { name: "Leurocian's mempo of fortune", itemID: 0x27B0, hue: 0x501 },
	"tot_metal_pigments_random": { name: "Metal Pigments of Tokuno", itemID: 0x0EFF, hue: 0 },
	"tot_peasants_bokuto": { name: "Peasant's Bokuto", itemID: 0x27A8, hue: 0 },
	"tot_pigment_berserker_red": { name: "Pigments of Tokuno - Berserker Red", itemID: 0x0EFF, hue: 0x21 },
	"tot_pigment_coal": { name: "Pigments of Tokuno - Coal", itemID: 0x0EFF, hue: 0x96B },
	"tot_pigment_deep_rose": { name: "Pigments of Tokuno - Deep Rose", itemID: 0x0EFF, hue: 0x97E },
	"tot_pigment_dryad_green": { name: "Pigments of Tokuno - Dryad Green", itemID: 0x0EFF, hue: 0x48F },
	"tot_pigment_faded_bronze": { name: "Pigments of Tokuno - Faded Bronze", itemID: 0x0EFF, hue: 0x975 },
	"tot_pigment_faded_coal": { name: "Pigments of Tokuno - Faded Coal", itemID: 0x0EFF, hue: 0x96A },
	"tot_pigment_faded_gold": { name: "Pigments of Tokuno - Faded Gold", itemID: 0x0EFF, hue: 0x972 },
	"tot_pigment_faded_rose": { name: "Pigments of Tokuno - Faded Rose", itemID: 0x0EFF, hue: 0x97B },
	"tot_pigment_fire_orange": { name: "Pigments of Tokuno - Fire Orange", itemID: 0x0EFF, hue: 0x54F },
	"tot_pigment_invulnerability_blue": { name: "Pigments of Tokuno - Invulnerability Blue", itemID: 0x0EFF, hue: 0x4F2 },
	"tot_pigment_luna_white": { name: "Pigments of Tokuno - Luna White", itemID: 0x0EFF, hue: 0x47E },
	"tot_pigment_midnight_coal": { name: "Pigments of Tokuno - Midnight Coal", itemID: 0x0EFF, hue: 0x96C },
	"tot_pigment_nox_green": { name: "Pigments of Tokuno - Nox Green", itemID: 0x0EFF, hue: 0x58C },
	"tot_pigment_paragon_gold": { name: "Pigments of Tokuno - Paragon Gold", itemID: 0x0EFF, hue: 0x501 },
	"tot_pigment_rose": { name: "Pigments of Tokuno - Rose", itemID: 0x0EFF, hue: 0x97C },
	"tot_pigment_rum_red": { name: "Pigments of Tokuno - Rum Red", itemID: 0x0EFF, hue: 0x66C },
	"tot_pigment_shadow_dancer_black": { name: "Pigments of Tokuno - Shadow Dancer Black", itemID: 0x0EFF, hue: 0x455 },
	"tot_pigment_storm_bronze": { name: "Pigments of Tokuno - Storm Bronze", itemID: 0x0EFF, hue: 0x977 },
	"tot_pigment_violet_courage_purple": { name: "Pigments of Tokuno - Violet Courage Purple", itemID: 0x0EFF, hue: 0x486 },
	"tot_pigments_none": { name: "Pigments of Tokuno", itemID: 0x0EFF, hue: 0 },
	"tot_pilfered_dancer_fans": { name: "Pilfered Dancer Fans", itemID: 0x27A3, hue: 0 },
	"tot_rune_beetle_carapace": { name: "Rune Beetle Carapace", itemID: 0x277D, hue: 0 },
	"tot_stormgrip": { name: "Stormgrip", itemID: 0x2792, hue: 0 },
	"tot_sword_of_the_stampede": { name: "Sword of the Stampede", itemID: 0x27A2, hue: 0 },
	"tot_swords_of_prosperity": { name: "Swords of Prosperity", itemID: 0x27A9, hue: 0 },
	"tot_the_destroyer": { name: "The Destroyer", itemID: 0x27A2, hue: 0 },
	"tot_the_horselord": { name: "The Horselord", itemID: 0x27A5, hue: 0 },
	"tot_tome_of_enlightenment": { name: "Tome of Enlightenment", itemID: 0x0EFA, hue: 0x455 },
	"tot_tome_of_lost_knowledge": { name: "Tome of Lost Knowledge", itemID: 0x0EFA, hue: 0x530 },
	"tot_winds_edge": { name: "Wind's Edge", itemID: 0x27A3, hue: 0 }
};

function onCharDoubleClick( player, targetCharacter, nonMouseClickEvent )
{
	if( !ValidateObject( player ) || !ValidateObject( targetCharacter ))
		return true;

	if( targetCharacter.GetTag( "ToTIharaSoko" ) != 1 )
		return true;

	ShowTokunoCollectorGump( player, targetCharacter );
	return false;
}

function onGumpPress( socket, buttonID, gumpData )
{
	var player = socket.currentChar;
	if( !ValidateObject( player ))
		return;

	if( buttonID == 0 )
		return;

	if( buttonID >= 1000 && buttonID < 1100 )
	{
		HandleTokunoTurnInButton( player, buttonID - 1000 );
		return;
	}

	if( buttonID >= 2000 && buttonID < 2100 )
	{
		HandleTokunoRewardButton( player, buttonID - 2000 );
		return;
	}

	if( buttonID >= 3000 && buttonID < 3100 )
	{
		HandleTokunoPigmentRewardButton( player, buttonID - 3000 );
		return;
	}
}

function ShowTokunoCollectorGump( player, collector )
{
	if( player.socket == null )
		return;

	player.SetTempTag( "ToTCollectorSerial", collector.serial );

	var turnedInCount = player.GetTag( "ToTItemsTurnedIn" );
	if( turnedInCount >= tokunoTreasuresItemsPerReward )
	{
		collector.TextMessage( "Congratulations! You have turned in enough minor treasures to earn a greater reward." );
		ShowTokunoRewardGump( player );
		return;
	}

	var redeemableItems = FindTokunoRedeemableItems( player );
	if( redeemableItems.length == 0 )
	{
		if( turnedInCount == 0 )
			collector.TextMessage( "Bring me 10 of the lost treasures of Tokuno and I will reward you with a valuable item." );
		else
			collector.TextMessage( "You have turned in " + turnedInCount + " minor artifacts. Turn in " + tokunoTreasuresItemsPerReward + " to receive a reward." );

		player.SysMessage( "You do not have any minor Tokuno artifacts in your backpack." );
		return;
	}

	ShowTokunoTurnInGump( player, redeemableItems );
}

function ShowTokunoTurnInGump( player, redeemableItems )
{
	var buttonData = [];
	var itemIndex;

	for( itemIndex = 0; itemIndex < redeemableItems.length; itemIndex++ )
	{
		var redeemableItem = redeemableItems[itemIndex];
		player.SetTempTag( "ToTTurnInItem" + itemIndex, redeemableItem.serial );

		buttonData[buttonData.length] = {
			buttonID: 1000 + itemIndex,
			itemID: redeemableItem.id,
			hue: redeemableItem.color,
			label: redeemableItem.name
		};
	}

	ShowTokunoImageTileButtonGump( player, "Click a minor artifact to give it to Ihara Soko.", buttonData );
}

function ShowTokunoRewardGump( player )
{
	var rewardList = tokunoTreasuresGreaterRewardsByEra[tokunoTreasuresRewardEra];
	if( rewardList == null || rewardList.length == 0 )
		return;

	var buttonData = [];
	var rewardIndex;

	for( rewardIndex = 0; rewardIndex < rewardList.length; rewardIndex++ )
	{
		var sectionID = rewardList[rewardIndex];
		var sectionInfo = GetTokunoSectionInfo( sectionID );

		buttonData[buttonData.length] = {
			buttonID: 2000 + rewardIndex,
			itemID: sectionInfo.itemID,
			hue: sectionInfo.hue,
			label: sectionInfo.name
		};
	}

	ShowTokunoImageTileButtonGump( player, "Choose your greater reward.", buttonData );
}

function ShowTokunoPigmentRewardGump( player )
{
	var pigmentList = tokunoTreasuresPigmentRewardsByEra[tokunoTreasuresRewardEra];
	if( pigmentList == null || pigmentList.length == 0 )
		return;

	var buttonData = [];
	var pigmentIndex;

	for( pigmentIndex = 0; pigmentIndex < pigmentList.length; pigmentIndex++ )
	{
		var sectionID = pigmentList[pigmentIndex];
		var sectionInfo = GetTokunoSectionInfo( sectionID );

		buttonData[buttonData.length] = {
			buttonID: 3000 + pigmentIndex,
			itemID: sectionInfo.itemID,
			hue: sectionInfo.hue,
			label: sectionInfo.name
		};
	}

	ShowTokunoImageTileButtonGump( player, "Choose your pigment color.", buttonData );
}

function ShowTokunoImageTileButtonGump( player, headerText, buttonData )
{
	if( player.socket == null )
		return;

	var gump = new Gump;
	var columns = 2;
	var rows = 5;
	var itemWidth = 250;
	var itemHeight = 64;
	var gumpWidth = columns * itemWidth;
	var gumpContentHeight = rows * itemHeight;
	var windowWidth = gumpWidth + 20;
	var windowHeight = gumpContentHeight + 84;
	var itemsPerPage = columns * rows;

	gump.AddPage( 0 );
	gump.AddBackground( 0, 0, windowWidth, windowHeight, 0x13BE );
	gump.AddTiledGump( 10, 10, gumpWidth, 20, 0x0A40 );
	gump.AddTiledGump( 10, 40, gumpWidth, gumpContentHeight + 4, 0x0A40 );
	gump.AddTiledGump( 10, gumpContentHeight + 54, gumpWidth, 20, 0x0A40 );
	gump.AddCheckerTrans( 10, 10, gumpWidth, gumpContentHeight + 64 );
	gump.AddButton( 10, gumpContentHeight + 54, 0x0FB1, 0x0FB2, 1, 0, 0 );
	gump.AddText( 45, gumpContentHeight + 56, 1152, "CANCEL" );
	gump.AddCroppedText( 14, 12, 1152, gumpWidth, 20, headerText );

	gump.AddPage( 1 );

	var buttonIndex;
	for( buttonIndex = 0; buttonIndex < buttonData.length; buttonIndex++ )
	{
		var position = buttonIndex % itemsPerPage;
		var pageNumber = Math.floor( buttonIndex / itemsPerPage ) + 1;

		if( position == 0 && buttonIndex != 0 )
		{
			gump.AddPageButton( gumpWidth - 100, gumpContentHeight + 54, 0x0FA5, 0x0FA7, pageNumber );
			gump.AddText( gumpWidth - 60, gumpContentHeight + 56, 1152, "Next" );

			gump.AddPage( pageNumber );
			gump.AddPageButton( gumpWidth - 200, gumpContentHeight + 54, 0x0FAE, 0x0FB0, pageNumber - 1 );
			gump.AddText( gumpWidth - 160, gumpContentHeight + 56, 1152, "Back" );
		}

		var innerX = ( position % columns ) * itemWidth + 14;
		var innerY = Math.floor( position / columns ) * itemHeight + 44;
		var entryInfo = buttonData[buttonIndex];

		gump.AddButtonTileArt( innerX, innerY, 0x0918, 0x0919, 1, 0, entryInfo.buttonID, entryInfo.itemID, entryInfo.hue, 15, 10 );
		gump.AddCroppedText( innerX + 84, innerY, 1152, 160, 60, entryInfo.label );
	}

	gump.Send( player.socket );
	gump.Free();
}

function HandleTokunoTurnInButton( player, index )
{
	var collector = CalcCharFromSer( player.GetTempTag( "ToTCollectorSerial" ) );
	if( !ValidateObject( collector ) || !player.InRange( collector, 7 ))
		return;

	var item = CalcItemFromSer( player.GetTempTag( "ToTTurnInItem" + index ) );
	if( !ValidateObject( item ) || !IsTokunoRedeemableMinorArtifact( item ))
	{
		player.SysMessage( "That item is no longer available." );
		return;
	}

	if( item.container != player.pack )
	{
		player.SysMessage( "The item must be in your backpack." );
		return;
	}

	item.Delete();

	var turnedInCount = player.GetTag( "ToTItemsTurnedIn" ) + 1;
	player.SetTag( "ToTItemsTurnedIn", turnedInCount );

	if( turnedInCount >= tokunoTreasuresItemsPerReward )
	{
		collector.TextMessage( "Congratulations! You have turned in enough minor treasures to earn a greater reward." );
		ShowTokunoRewardGump( player );
	}
	else
	{
		collector.TextMessage( "You have turned in " + turnedInCount + " minor artifacts. Turn in " + tokunoTreasuresItemsPerReward + " to receive a reward." );
		var redeemableItems = FindTokunoRedeemableItems( player );
		if( redeemableItems.length > 0 )
			ShowTokunoTurnInGump( player, redeemableItems );
	}
}

function HandleTokunoRewardButton( player, index )
{
	var collector = CalcCharFromSer( player.GetTempTag( "ToTCollectorSerial" ) );
	if( !ValidateObject( collector ) || !player.InRange( collector, 7 ))
		return;

	var turnedInCount = player.GetTag( "ToTItemsTurnedIn" );
	if( turnedInCount < tokunoTreasuresItemsPerReward )
		return;

	var rewardList = tokunoTreasuresGreaterRewardsByEra[tokunoTreasuresRewardEra];
	if( rewardList == null || index < 0 || index >= rewardList.length )
		return;

	var sectionID = rewardList[index];
	if( sectionID == "tot_pigments_reward_menu" )
	{
		ShowTokunoPigmentRewardGump( player );
		return;
	}

	GiveTokunoGreaterReward( player, collector, sectionID );
}

function HandleTokunoPigmentRewardButton( player, index )
{
	var collector = CalcCharFromSer( player.GetTempTag( "ToTCollectorSerial" ) );
	if( !ValidateObject( collector ) || !player.InRange( collector, 7 ))
		return;

	var turnedInCount = player.GetTag( "ToTItemsTurnedIn" );
	if( turnedInCount < tokunoTreasuresItemsPerReward )
		return;

	var pigmentList = tokunoTreasuresPigmentRewardsByEra[tokunoTreasuresRewardEra];
	if( pigmentList == null || index < 0 || index >= pigmentList.length )
		return;

	GiveTokunoGreaterReward( player, collector, pigmentList[index] );
}

function GiveTokunoGreaterReward( player, collector, sectionID )
{
	var rewardItem = CreateDFNItem( player.socket, player, sectionID, 1, "ITEM", true );
	if( !ValidateObject( rewardItem ))
	{
		collector.TextMessage( "You do not have enough room in your backpack." );
		return;
	}

	var turnedInCount = player.GetTag( "ToTItemsTurnedIn" ) - tokunoTreasuresItemsPerReward;
	if( turnedInCount < 0 )
		turnedInCount = 0;

	player.SetTag( "ToTItemsTurnedIn", turnedInCount );
	collector.TextMessage( "You have earned the gratitude of the Empire. I have placed the " + rewardItem.name + " in your backpack." );
}

function FindTokunoRedeemableItems( player )
{
	var redeemableItems = [];
	if( !ValidateObject( player.pack ))
		return redeemableItems;

	var backpackItem;
	for( backpackItem = player.pack.FirstItem(); !player.pack.FinishedItems(); backpackItem = player.pack.NextItem() )
	{
		if( ValidateObject( backpackItem ) && IsTokunoRedeemableMinorArtifact( backpackItem ))
			redeemableItems[redeemableItems.length] = backpackItem;
	}

	return redeemableItems;
}

function IsTokunoRedeemableMinorArtifact( item )
{
	if( !ValidateObject( item ))
		return false;

	if( item.GetTag( "ToTArtifact" ) != 1 )
		return false;

	if( item.GetTag( "ToTArtifactTier" ) != "lesser" )
		return false;

	if( item.GetTag( "ToTNoTurnIn" ) == 1 )
		return false;

	return true;
}

function GetTokunoSectionInfo( sectionID )
{
	var sectionInfo = tokunoTreasuresSectionInfo[sectionID];
	if( sectionInfo != null )
		return sectionInfo;

	return { name: GetTokunoSectionDisplayName( sectionID ), itemID: 0x0EED, hue: 0 };
}

function GetTokunoSectionDisplayName( sectionID )
{
	var displayName = sectionID;
	displayName = displayName.replace( "tot_", "" );
	displayName = displayName.replace( /_/g, " " );
	return ToTitleCase( displayName );
}

function ToTitleCase( value )
{
	var parts = value.split( " " );
	var index;
	for( index = 0; index < parts.length; index++ )
	{
		if( parts[index].length > 0 )
			parts[index] = parts[index].charAt( 0 ).toUpperCase() + parts[index].substr( 1 );
	}
	return parts.join( " " );
}
