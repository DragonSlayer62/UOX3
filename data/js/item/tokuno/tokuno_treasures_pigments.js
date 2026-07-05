var tokunoTreasuresAllowRegularDyeableItems = false;

function onUseChecked( player, usedItem )
{
	if( !ValidateObject( player ) || !ValidateObject( usedItem ))
		return true;

	if( usedItem.GetTag( "ToTPigment" ) != 1 )
		return true;

	if( player.socket == null )
		return false;

	if( !player.InRange( usedItem, 3 ))
	{
		player.SysMessage( "That is too far away." );
		return false;
	}

	if( usedItem.usesLeft <= 0 )
	{
		usedItem.Delete();
		return false;
	}

	player.SetTempTag( "ToTPigmentSerial", usedItem.serial );
	player.socket.CustomTarget( 0, "Select the artifact or enhanced magic item to dye." );
	return false;
}

function onCallback0( socket, targetObject )
{
	var player = socket.currentChar;
	if( !ValidateObject( player ))
		return;

	var pigmentSerial = player.GetTempTag( "ToTPigmentSerial" );
	player.SetTempTag( "ToTPigmentSerial", null );

	var pigmentItem = CalcItemFromSer( pigmentSerial );
	if( !ValidateObject( pigmentItem ) || pigmentItem.GetTag( "ToTPigment" ) != 1 )
		return;

	if( !ValidateObject( targetObject ) || !targetObject.isItem )
	{
		player.SysMessage( "You can only dye artifacts and enhanced magic items with this." );
		return;
	}

	if( !player.InRange( pigmentItem, 3 ) || !player.InRange( targetObject, 3 ))
	{
		player.SysMessage( "That is too far away." );
		return;
	}

	if( targetObject.container == player || targetObject.isItemHeld )
	{
		player.SysMessage( "You cannot dye artifacts or enhanced magic items that are being worn." );
		return;
	}

	if( targetObject.isLockedDown )
	{
		player.SysMessage( "You may not dye artifacts or enhanced magic items which are locked down." );
		return;
	}

	if( targetObject.GetTag( "ToTPigment" ) == 1 )
	{
		player.SysMessage( "You cannot dye that." );
		return;
	}

	if( !IsTokunoPigmentValidTarget( targetObject ))
	{
		player.SysMessage( "You can only dye artifacts and enhanced magic items with this." );
		return;
	}

	targetObject.color = pigmentItem.color;
	targetObject.Refresh();
	player.SoundEffect( 0x23E, true );

	pigmentItem.usesLeft = pigmentItem.usesLeft - 1;
	if( pigmentItem.usesLeft <= 0 )
		pigmentItem.Delete();
}

function IsTokunoPigmentValidTarget( item )
{
	if( !ValidateObject( item ))
		return false;

	if( item.GetTag( "ToTDyeable" ) == 1 )
		return true;

	if( item.GetTag( "ToTArtifact" ) == 1 )
		return true;

	if( item.artifactRarity > 0 )
		return true;

	if( tokunoTreasuresAllowRegularDyeableItems && item.isDyeable )
		return true;

	return false;
}
