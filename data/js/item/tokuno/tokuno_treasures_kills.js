// 0 = off, 1 = ToT One, 2 = ToT Two, 3 = ToT Three
var tokunoTreasuresDropEra = 3;

// Set to false if your shard does not use map 4 for Tokuno yet.
var tokunoTreasuresRequireTokunoWorld = true;
var tokunoTreasuresTokunoWorld = 4;

var tokunoTreasuresLesserRewardsByEra = [
	[],
	[
		"tot_ancient_farmers_kasa",
		"tot_ancient_samurai_do",
		"tot_arms_of_tactical_excellence",
		"tot_black_lotus_hood",
		"tot_daimyos_helm",
		"tot_demon_forks",
		"tot_dragon_nunchaku",
		"tot_exiler",
		"tot_gloves_of_the_sun",
		"tot_hanzos_bow",
		"tot_legs_of_stability",
		"tot_peasants_bokuto",
		"tot_pilfered_dancer_fans",
		"tot_the_destroyer",
		"tot_tome_of_enlightenment",
		"tot_ancient_urn",
		"tot_honorable_swords",
		"tot_pigments_none",
		"tot_flute_of_renewal",
		"tot_chest_of_heirlooms"
	],
	[
		"tot_metal_pigments_random",
		"tot_ancient_farmers_kasa",
		"tot_ancient_samurai_do",
		"tot_arms_of_tactical_excellence",
		"tot_metal_pigments_random",
		"tot_black_lotus_hood",
		"tot_daimyos_helm",
		"tot_demon_forks",
		"tot_metal_pigments_random",
		"tot_dragon_nunchaku",
		"tot_exiler",
		"tot_gloves_of_the_sun",
		"tot_hanzos_bow",
		"tot_metal_pigments_random",
		"tot_legs_of_stability",
		"tot_peasants_bokuto",
		"tot_pilfered_dancer_fans",
		"tot_the_destroyer",
		"tot_metal_pigments_random",
		"tot_tome_of_enlightenment",
		"tot_ancient_urn",
		"tot_honorable_swords",
		"tot_metal_pigments_random",
		"tot_flute_of_renewal",
		"tot_chest_of_heirlooms"
	],
	[
		"tot_lesser_pigments_random",
		"tot_ancient_farmers_kasa",
		"tot_ancient_samurai_do",
		"tot_arms_of_tactical_excellence",
		"tot_lesser_pigments_random",
		"tot_black_lotus_hood",
		"tot_daimyos_helm",
		"tot_hanzos_bow",
		"tot_lesser_pigments_random",
		"tot_demon_forks",
		"tot_dragon_nunchaku",
		"tot_exiler",
		"tot_gloves_of_the_sun",
		"tot_lesser_pigments_random",
		"tot_legs_of_stability",
		"tot_peasants_bokuto",
		"tot_pilfered_dancer_fans",
		"tot_the_destroyer",
		"tot_lesser_pigments_random",
		"tot_tome_of_enlightenment",
		"tot_ancient_urn",
		"tot_honorable_swords",
		"tot_flute_of_renewal",
		"tot_lesser_pigments_random",
		"tot_leurocians_mempo_of_fortune",
		"tot_chest_of_heirlooms"
	]
];

function onKill( killer, killed )
{
	HandleTokunoArtifactDrop( killer, killed );
	return false;
}

function HandleTokunoArtifactDrop( killer, killed )
{
	if( tokunoTreasuresDropEra <= 0 )
		return;

	if( !ValidateObject( killer ) || !ValidateObject( killed ))
		return;

	if( killer.npc || killer.socket == null )
		return;

	if( !killed.npc )
		return;

	if( tokunoTreasuresRequireTokunoWorld )
	{
		if( killer.worldnumber != tokunoTreasuresTokunoWorld || killed.worldnumber != tokunoTreasuresTokunoWorld )
			return;
	}

	if( !killer.InRange( killed, 18 ))
		return;

	if( killed.fame <= 0 )
		return;

	if( ValidateObject( killed.owner ))
		return;

	var currentFameTotal = killer.GetTag( "ToTTotalMonsterFame" );
	var luckBonus = 1;
	if( killer.luck > 0 )
		luckBonus = 1 + ( Math.sqrt( killer.luck ) / 100 );

	currentFameTotal = currentFameTotal + Math.floor( killed.fame * luckBonus );
	killer.SetTag( "ToTTotalMonsterFame", currentFameTotal );

	var chance = 0.000863316841 * Math.pow( 10, 0.00000425531915 * currentFameTotal );
	var roll = RandomNumber( 0, 1000000 ) / 1000000;

	if( chance <= roll )
		return;

	var rewardList = tokunoTreasuresLesserRewardsByEra[tokunoTreasuresDropEra];
	if( rewardList == null || rewardList.length == 0 )
		return;

	var rewardSection = rewardList[RandomNumber( 0, rewardList.length - 1 )];
	var rewardItem = CreateDFNItem( killer.socket, killer, rewardSection, 1, "ITEM", true );

	if( ValidateObject( rewardItem ))
	{
		killer.SysMessage( "For your valor in combating the fallen beast, a special artifact has been bestowed on you." );
		killer.SetTag( "ToTTotalMonsterFame", 0 );
	}
	else
	{
		killer.SysMessage( "You found a Tokuno artifact, but it could not be created." );
	}
}
