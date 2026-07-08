// Mahjong game board for UOX3.
// Packet layout mirrors the RunUO Mahjong packet classes byte for byte through script 7603.
// SpiderMonkey 1.8.5 / ES5 safe.
// Register this as the board item script.

var mahjongMaxPlayers = 4;
var mahjongBaseScore = 30000;
var mahjongTileCount = 136;
var mahjongPacketScriptID = 1504;

var MAHJONG_DIR_UP = 0;
var MAHJONG_DIR_LEFT = 1;
var MAHJONG_DIR_DOWN = 2;
var MAHJONG_DIR_RIGHT = 3;

var MAHJONG_WIND_NORTH = 0;
var MAHJONG_WIND_EAST = 1;
var MAHJONG_WIND_SOUTH = 2;
var MAHJONG_WIND_WEST = 3;

function onUseChecked( pUser, board )
{
	return MahjongUseBoard( pUser, board );
}

function onUseUnChecked( pUser, board )
{
	return MahjongUseBoard( pUser, board );
}

function MahjongUseBoard( pUser, board )
{
	if( !ValidateObject( pUser ) || !ValidateObject( board ))
		return false;

	var pSocket = pUser.socket;
	if( pSocket == null )
		return false;

	pSocket.SysMessage( "Opening mahjong board." );

	MahjongInitBoard( board );
	MahjongCheckPlayers( board );
	MahjongJoinGame( pSocket, pUser, board );
	return false;
}

function MahjongHandlePacket( pSocket, board, subCommand )
{
	if( pSocket == null || !ValidateObject( board ))
		return false;

	var pUser = pSocket.currentChar;
	if( !ValidateObject( pUser ))
		return false;

	MahjongInitBoard( board );
	MahjongCheckPlayers( board );

	if( subCommand == 0x06 )
	{
		MahjongLeaveGame( pSocket, pUser, board );
		return false;
	}
	else if( subCommand == 0x0A )
	{
		MahjongGivePoints( pUser, board, pSocket.GetByte( 9 ), pSocket.GetDWord( 10 ) );
		return false;
	}
	else if( subCommand == 0x0B )
	{
		MahjongRollDice( board );
		return false;
	}
	else if( subCommand == 0x0C )
	{
		if( MahjongIsDealer( pUser, board ))
			MahjongResetWalls( board );
		return false;
	}
	else if( subCommand == 0x0D )
	{
		if( MahjongIsDealer( pUser, board ))
			MahjongResetScores( board );
		return false;
	}
	else if( subCommand == 0x0F )
	{
		if( MahjongIsDealer( pUser, board ))
			MahjongAssignDealer( board, pSocket.GetByte( 9 ) );
		return false;
	}
	else if( subCommand == 0x10 )
	{
		if( MahjongIsDealer( pUser, board ))
			MahjongOpenSeat( board, pSocket.GetByte( 9 ) );
		return false;
	}
	else if( subCommand == 0x11 )
	{
		if( MahjongIsDealer( pUser, board ))
			MahjongChangeOptions( board, pSocket.GetByte( 12 ) );
		return false;
	}
	else if( subCommand == 0x15 )
	{
		if( MahjongIsDealer( pUser, board ))
			MahjongMoveWallBreak( board, pSocket.GetWord( 9 ), pSocket.GetWord( 11 ) );
		return false;
	}
	else if( subCommand == 0x16 )
	{
		MahjongSetPublicHand( board, MahjongGetPlayerIndex( board, pUser ), pSocket.GetByte( 12 ) != 0 );
		return false;
	}
	else if( subCommand == 0x17 )
	{
		MahjongMoveTileFromPacket( pUser, board, pSocket );
		return false;
	}
	else if( subCommand == 0x18 )
	{
		if( MahjongIsDealer( pUser, board ))
			MahjongMoveDealerIndicator( board, pSocket.GetByte( 9 ), pSocket.GetByte( 10 ), pSocket.GetWord( 11 ), pSocket.GetWord( 13 ) );
		return false;
	}

	return false;
}

function MahjongInitBoard( board )
{
	if( board.GetTag( "mahjongReady" ) == 1 )
		return;

	board.SetTag( "mahjongReady", 1 );
	board.SetTag( "mahjongShowScores", 0 );
	board.SetTag( "mahjongSpectatorVision", 0 );
	board.SetTag( "mahjongDealer", 0 );
	board.SetTag( "mahjongDiceOne", 1 );
	board.SetTag( "mahjongDiceTwo", 1 );
	board.SetTag( "mahjongDealerX", 300 );
	board.SetTag( "mahjongDealerY", 300 );
	board.SetTag( "mahjongDealerDir", MAHJONG_DIR_UP );
	board.SetTag( "mahjongDealerWind", MAHJONG_WIND_NORTH );
	board.SetTag( "mahjongBreakX", 335 );
	board.SetTag( "mahjongBreakY", 335 );

	for( var seatIndex = 0; seatIndex < mahjongMaxPlayers; seatIndex++ )
	{
		board.SetTag( "mahjongSeat" + seatIndex, 0 );
		board.SetTag( "mahjongInGame" + seatIndex, 0 );
		board.SetTag( "mahjongPublic" + seatIndex, 0 );
		board.SetTag( "mahjongScore" + seatIndex, mahjongBaseScore );
	}

	MahjongBuildWalls( board );
}

function MahjongBuildWalls( board )
{
	var values = MahjongBuildTileValues();
	var index = 0;
	var tiles = [];

	index = MahjongAddHorizontalWall( tiles, index, values, 165, 110, 0, MAHJONG_DIR_UP );
	index = MahjongAddHorizontalWall( tiles, index, values, 165, 115, 1, MAHJONG_DIR_UP );
	index = MahjongAddVerticalWall( tiles, index, values, 530, 165, 0, MAHJONG_DIR_LEFT );
	index = MahjongAddVerticalWall( tiles, index, values, 525, 165, 1, MAHJONG_DIR_LEFT );
	index = MahjongAddHorizontalWall( tiles, index, values, 165, 530, 0, MAHJONG_DIR_DOWN );
	index = MahjongAddHorizontalWall( tiles, index, values, 165, 525, 1, MAHJONG_DIR_DOWN );
	index = MahjongAddVerticalWall( tiles, index, values, 110, 165, 0, MAHJONG_DIR_RIGHT );
	index = MahjongAddVerticalWall( tiles, index, values, 115, 165, 1, MAHJONG_DIR_RIGHT );

	board.SetTag( "mahjongTiles", tiles.join( "|" ) );
}

function MahjongBuildTileValues()
{
	var values = [];
	for( var copy = 0; copy < 4; copy++ )
	{
		for( var type = 1; type <= 34; type++ )
			values[values.length] = type;
	}

	for( var index = values.length - 1; index > 0; index-- )
	{
		var swapIndex = RandomNumber( 0, index );
		var oldValue = values[index];
		values[index] = values[swapIndex];
		values[swapIndex] = oldValue;
	}
	return values;
}

function MahjongAddHorizontalWall( tiles, index, values, x, y, stackLevel, direction )
{
	for( var offset = 0; offset < 17; offset++ )
	{
		tiles[index] = index + "," + values[index] + "," + ( x + ( offset * 20 )) + "," + y + "," + stackLevel + "," + direction + ",0";
		index++;
	}
	return index;
}

function MahjongAddVerticalWall( tiles, index, values, x, y, stackLevel, direction )
{
	for( var offset = 0; offset < 17; offset++ )
	{
		tiles[index] = index + "," + values[index] + "," + x + "," + ( y + ( offset * 20 )) + "," + stackLevel + "," + direction + ",0";
		index++;
	}
	return index;
}

function MahjongGetTiles( board )
{
	var rawTiles = String( board.GetTag( "mahjongTiles" )).split( "|" );
	var tiles = [];
	for( var index = 0; index < rawTiles.length; index++ )
	{
		var parts = rawTiles[index].split( "," );
		if( parts.length >= 7 )
		{
			tiles[tiles.length] = {
				number: Number( parts[0] ),
				value: Number( parts[1] ),
				x: Number( parts[2] ),
				y: Number( parts[3] ),
				stackLevel: Number( parts[4] ),
				direction: Number( parts[5] ),
				flipped: Number( parts[6] )
			};
		}
	}
	return tiles;
}

function MahjongSaveTiles( board, tiles )
{
	var rawTiles = [];
	for( var index = 0; index < tiles.length; index++ )
	{
		var tile = tiles[index];
		rawTiles[index] = tile.number + "," + tile.value + "," + tile.x + "," + tile.y + "," + tile.stackLevel + "," + tile.direction + "," + tile.flipped;
	}
	board.SetTag( "mahjongTiles", rawTiles.join( "|" ) );
}

function MahjongJoinGame( pSocket, pUser, board )
{
	var playerIndex = MahjongGetPlayerIndex( board, pUser );
	if( playerIndex < 0 )
		playerIndex = MahjongGetNextSeat( board );

	if( playerIndex < 0 )
	{
		pSocket.SysMessage( "This Mahjong board already has four players." );
		return;
	}

	pSocket.SysMessage( "Mahjong seat " + playerIndex + " assigned." );
	board.SetTag( "mahjongSeat" + playerIndex, pUser.serial );
	board.SetTag( "mahjongInGame" + playerIndex, 1 );

	TriggerEvent( mahjongPacketScriptID, "MahjongSendJoinPacket", pSocket, board );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendPlayersPacketToAll", board );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendGeneralPacket", pSocket, board );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendTilesPacket", pSocket, board );
}

function MahjongLeaveGame( pSocket, pUser, board )
{
	var playerIndex = MahjongGetPlayerIndex( board, pUser );
	if( playerIndex < 0 )
		return;

	board.SetTag( "mahjongInGame" + playerIndex, 0 );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendRelievePacket", pSocket, board );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendPlayersPacketToAll", board );
}

function MahjongGetPlayerIndex( board, pUser )
{
	for( var index = 0; index < mahjongMaxPlayers; index++ )
	{
		if( board.GetTag( "mahjongSeat" + index ) == pUser.serial )
			return index;
	}
	return -1;
}

function MahjongGetNextSeat( board )
{
	for( var index = 0; index < mahjongMaxPlayers; index++ )
	{
		if( board.GetTag( "mahjongSeat" + index ) == 0 )
			return index;
	}
	return -1;
}

function MahjongIsInGame( board, index )
{
	return index >= 0 && index < mahjongMaxPlayers && board.GetTag( "mahjongInGame" + index ) == 1;
}

function MahjongIsDealer( pUser, board )
{
	return MahjongGetPlayerIndex( board, pUser ) == board.GetTag( "mahjongDealer" ) && MahjongIsInGame( board, board.GetTag( "mahjongDealer" ) );
}

function MahjongCheckPlayers( board )
{
	for( var index = 0; index < mahjongMaxPlayers; index++ )
	{
		var serial = board.GetTag( "mahjongSeat" + index );
		if( serial != 0 && board.GetTag( "mahjongInGame" + index ) == 1 )
		{
			var player = CalcCharFromSer( serial );
			if( !ValidateObject( player ) || player.dead || !player.online || player.worldnumber != board.worldnumber || DistanceBetween( player, board ) > 5 )
				board.SetTag( "mahjongInGame" + index, 0 );
		}
	}
}

function MahjongMoveTileFromPacket( pUser, board, pSocket )
{
	if( !MahjongIsInGame( board, MahjongGetPlayerIndex( board, pUser )))
		return;

	var tileNumber = pSocket.GetByte( 9 );
	var newDirection = pSocket.GetByte( 11 );
	var flipped = pSocket.GetByte( 13 ) != 0 ? 1 : 0;
	var newY = pSocket.GetWord( 18 );
	var newX = pSocket.GetWord( 20 );
	var tiles = MahjongGetTiles( board );

	if( tileNumber < 0 || tileNumber >= tiles.length )
		return;

	var tile = tiles[tileNumber];
	if( !MahjongTileIsMovable( tiles, tile ))
		return;

	tile.x = newX;
	tile.y = newY;
	tile.direction = newDirection;
	tile.flipped = flipped;
	tile.stackLevel = MahjongGetStackLevel( tiles, tile, tileNumber ) + 1;

	MahjongSaveTiles( board, tiles );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendTilePacketToAll", board, tile );
}

function MahjongTileIsMovable( tiles, tile )
{
	return MahjongGetStackLevel( tiles, tile, tile.number ) <= tile.stackLevel;
}

function MahjongGetStackLevel( tiles, tile, ignoreNumber )
{
	var level = -1;
	var dim = MahjongGetDim( tile.x, tile.y, tile.direction );
	for( var index = 0; index < tiles.length; index++ )
	{
		if( index != ignoreNumber )
		{
			var checkTile = tiles[index];
			var checkDim = MahjongGetDim( checkTile.x, checkTile.y, checkTile.direction );
			if( checkTile.stackLevel > level && MahjongDimOverlaps( dim, checkDim ))
				level = checkTile.stackLevel;
		}
	}
	return level;
}

function MahjongGetDim( x, y, direction )
{
	if( direction == MAHJONG_DIR_UP || direction == MAHJONG_DIR_DOWN )
		return { x:x, y:y, width:20, height:30 };
	return { x:x, y:y, width:30, height:20 };
}

function MahjongDimOverlaps( first, second )
{
	return first.x < second.x + second.width && first.x + first.width > second.x && first.y < second.y + second.height && first.y + first.height > second.y;
}

function MahjongRollDice( board )
{
	board.SetTag( "mahjongDiceOne", RandomNumber( 1, 6 ) );
	board.SetTag( "mahjongDiceTwo", RandomNumber( 1, 6 ) );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendGeneralPacketToAll", board );
}

function MahjongResetWalls( board )
{
	MahjongBuildWalls( board );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendTilesPacketToAll", board );
}

function MahjongResetScores( board )
{
	for( var index = 0; index < mahjongMaxPlayers; index++ )
		board.SetTag( "mahjongScore" + index, mahjongBaseScore );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendPlayersPacketToAll", board );
}

function MahjongAssignDealer( board, index )
{
	if( MahjongIsInGame( board, index ))
	{
		board.SetTag( "mahjongDealer", index );
		TriggerEvent( mahjongPacketScriptID, "MahjongSendPlayersPacketToAll", board );
	}
}

function MahjongOpenSeat( board, index )
{
	if( index < 0 || index >= mahjongMaxPlayers )
		return;

	var player = CalcCharFromSer( board.GetTag( "mahjongSeat" + index ) );
	if( ValidateObject( player ) && player.socket != null )
		TriggerEvent( mahjongPacketScriptID, "MahjongSendRelievePacket", player.socket, board );

	board.SetTag( "mahjongSeat" + index, 0 );
	board.SetTag( "mahjongInGame" + index, 0 );
	board.SetTag( "mahjongPublic" + index, 0 );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendPlayersPacketToAll", board );
}

function MahjongChangeOptions( board, options )
{
	board.SetTag( "mahjongShowScores", ( options & 0x01 ) != 0 ? 1 : 0 );
	board.SetTag( "mahjongSpectatorVision", ( options & 0x02 ) != 0 ? 1 : 0 );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendGeneralPacketToAll", board );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendTilesPacketToAll", board );
}

function MahjongSetPublicHand( board, index, value )
{
	if( index < 0 )
		return;
	board.SetTag( "mahjongPublic" + index, value ? 1 : 0 );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendTilesPacketToAll", board );
}

function MahjongMoveWallBreak( board, y, x )
{
	board.SetTag( "mahjongBreakX", x );
	board.SetTag( "mahjongBreakY", y );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendGeneralPacketToAll", board );
}

function MahjongMoveDealerIndicator( board, direction, wind, y, x )
{
	board.SetTag( "mahjongDealerX", x );
	board.SetTag( "mahjongDealerY", y );
	board.SetTag( "mahjongDealerDir", direction );
	board.SetTag( "mahjongDealerWind", wind );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendGeneralPacketToAll", board );
}

function MahjongGivePoints( pUser, board, toIndex, amount )
{
	var fromIndex = MahjongGetPlayerIndex( board, pUser );
	if( fromIndex < 0 || toIndex < 0 || toIndex >= mahjongMaxPlayers || amount <= 0 )
		return;

	var fromScore = board.GetTag( "mahjongScore" + fromIndex );
	var toScore = board.GetTag( "mahjongScore" + toIndex );
	if( fromScore < amount )
		return;

	board.SetTag( "mahjongScore" + fromIndex, fromScore - amount );
	board.SetTag( "mahjongScore" + toIndex, toScore + amount );
	TriggerEvent( mahjongPacketScriptID, "MahjongSendPlayersPacketToAll", board );
}
