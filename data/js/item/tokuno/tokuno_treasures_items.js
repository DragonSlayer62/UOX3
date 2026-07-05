var tokunoTreasuresLesserPigmentNames = [
	"Pale Orange",
	"Fresh Rose",
	"Chaos Blue",
	"Silver",
	"Noble Gold",
	"Light Green",
	"Pale Blue",
	"Fresh Plum",
	"Deep Brown",
	"Burnt Brown"
];

var tokunoTreasuresLesserPigmentHues = [
	0x02E,
	0x4B9,
	0x005,
	0x3E9,
	0x227,
	0x1C8,
	0x24F,
	0x145,
	0x3F0,
	0x41A
];

var tokunoTreasuresAncestorNames = [
	"Akira",
	"Avaniaga",
	"Aya",
	"Chie",
	"Emiko",
	"Fumiyo",
	"Gennai",
	"Gennosuke",
	"Genjo",
	"Hamato",
	"Harumi",
	"Ikuyo",
	"Juri",
	"Kaori",
	"Kaoru",
	"Kiyomori",
	"Mayako",
	"Motoki",
	"Musashi",
	"Nami",
	"Nobukazu",
	"Roku",
	"Romi",
	"Ryo",
	"Sanzo",
	"Sakamae",
	"Satoshi",
	"Takamori",
	"Takuro",
	"Teruyo",
	"Toshiro",
	"Yago",
	"Yeijiro",
	"Yoshi",
	"Zeshin"
];

function onCreateDFN( objectMade, objectType )
{
	if( objectType != 0 || !ValidateObject( objectMade ))
		return false;

	if( objectMade.sectionID == "tot_lesser_pigments_random" )
	{
		var pigmentIndex = RandomNumber( 0, tokunoTreasuresLesserPigmentHues.length - 1 );
		objectMade.name = "Lesser Pigments of Tokuno - " + tokunoTreasuresLesserPigmentNames[pigmentIndex];
		objectMade.color = tokunoTreasuresLesserPigmentHues[pigmentIndex];
		objectMade.SetTag( "ToTPigmentHue", tokunoTreasuresLesserPigmentHues[pigmentIndex] );
		objectMade.AddScriptTrigger( 7622 );
	}
	else if( objectMade.sectionID == "tot_metal_pigments_random" )
	{
		var randomHue = RandomNumber( 0, 29 );
		if( randomHue != 0 )
			randomHue = randomHue + 0x960;

		objectMade.name = "Metal Pigments of Tokuno";
		objectMade.color = randomHue;
		objectMade.SetTag( "ToTPigmentHue", randomHue );
		objectMade.AddScriptTrigger( 7622 );
	}
	else if( objectMade.sectionID == "tot_ancient_urn" )
	{
		objectMade.name = "Ancient Urn of " + tokunoTreasuresAncestorNames[RandomNumber( 0, tokunoTreasuresAncestorNames.length - 1 )];
	}
	else if( objectMade.sectionID == "tot_honorable_swords" )
	{
		objectMade.name = "Honorable Swords of " + tokunoTreasuresAncestorNames[RandomNumber( 0, tokunoTreasuresAncestorNames.length - 1 )];
	}

	return false;
}
